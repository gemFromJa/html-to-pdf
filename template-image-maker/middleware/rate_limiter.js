const { subHours } = require("date-fns");
const redis = require("redis");

const redisClient = redis.createClient();
const WINDOW_SIZE_IN_HOURS = 24 * 7; // how long will the window be? 1 week
const MAX_WINDOW_REQUEST_COUNT = 100; // 100 requests in a week gets you limited
const WINDOW_LOG_INTERVAL_IN_HOURS = 1; // how often do we log

const rateLimiter = async (req, res, next) => {
	try {
		if (!redisClient) {
			throw new Error("Redis Client does not exist!");
		}

		await redisClient.connect();

		let record = await redisClient.get(req.ip);

		const timeRequested = new Date();

		if (record === null) {
			let newRecord = [];
			let requestLog = {
				requestTimeStamp: timeRequested.getTime(),
				requestCount: 1,
			};

			newRecord.push(requestLog);
			await redisClient.set(
				req.ip,
				JSON.stringify(newRecord)
			);

			return next();
		}

		// see the number of requests user made in the last window
		let data = JSON.parse(record);
		let windowStartTime = subHours(
			timeRequested,
			WINDOW_SIZE_IN_HOURS
		).getTime(); // an hour ago
		let requestsInWindow = data.filter(
			(entry) => entry.requestTimeStamp > windowStartTime
		);

		// is this needed/ isn't the length the same since all value 1?
		let totalWindowRequestCount = requestsInWindow.reduce(
			(total, currentEntry) =>
				currentEntry.requestCount + total,
			0
		);

		// if the total requests is greater than allowed, throw a fit
		if (totalWindowRequestCount >= MAX_WINDOW_REQUEST_COUNT) {
			return res.status(429).send({
				success: false,
				error_message: `you have exceeded the maximum ${MAX_WINDOW_REQUEST_COUNT} request allowed in ${WINDOW_LOG_INTERVAL_IN_HOURS} hour`,
			});
		} else {
			// log new entry
			let lastRequestLog = data[data.length - 1];
			let potentialWindowStartTime = subHours(
				timeRequested,
				WINDOW_LOG_INTERVAL_IN_HOURS
			).getTime();

			// if still in interval increment counter
			if (
				lastRequestLog.requestTimeStamp >
				potentialWindowStartTime
			) {
				lastRequestLog.requestCount++;
				data[data.length - 1] = lastRequestLog;
			} else {
				// create new log since interval elapsed
				data.push({
					requestTimeStamp:
						timeRequested.getTime(),
					requestCount: 1,
				});
			}

			await redisClient.set(req.ip, JSON.stringify(data));
			return next();
		}
	} catch (error) {
		next(error);
	} finally {
		if (redisClient) redisClient.disconnect();
	}
};

module.exports = {
	rateLimiter,
};
