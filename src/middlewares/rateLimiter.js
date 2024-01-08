const rateLimit = require('express-rate-limit');
const httpStatus = require('http-status');

const limiter = rateLimit({
	windowMs: 3600000, // 1 hour
	max: 30, // Limit each IP to 60 requests per `window` (here, per 1 hour)
	standardHeaders: true,
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
	keyGenerator: (req, res) => {
		const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for']
		return ip;
	},
	message: (req, res) => {
		res.status(httpStatus.TOO_MANY_REQUESTS).json({
			success: false,
			code: httpStatus.TOO_MANY_REQUESTS,
			message: "you are spamming, please try again in 1 hour"
		});
	}
})

module.exports = limiter;
