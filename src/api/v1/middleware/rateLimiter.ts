import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // max requests per IP
  message: {
    message: "Too many requests, please try again later",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,  // Disable X-RateLimit headers
});

export const authLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 5, // only 5 attempts
  message: {
    message: "Too many login attempts, try again later",
  },
});