import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { client } from "../config/client";


export const loginIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => client.sendCommand(args),
    prefix: 'login_rl:',
  }),
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many login attempts. Please try again later.",
      retryAfter: Math.ceil(((req as any).rateLimit.resetTime - Date.now()) / 1000)
    });
  },
});

export const signupIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => client.sendCommand(args),
    prefix: 'signup_rl:',
  }),
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many signup attempts. Please try again later.",
      retryAfter: Math.ceil(((req as any).rateLimit.resetTime - Date.now()) / 1000)
    });
  },
});

export const getAgencyIpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => client.sendCommand(args),
    prefix: 'getagency_rl:',
  }),
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many get requests on this api. Please try again later.",
      retryAfter: Math.ceil(((req as any).rateLimit.resetTime - Date.now()) / 1000)
    });
  },
});


export const otpIpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => client.sendCommand(args),
    prefix: 'otp_rl:',
  }),
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many otp attempts. Please try again later.",
      retryAfter: Math.ceil(((req as any).rateLimit.resetTime - Date.now()) / 1000)
    });
  },
});

export const resetPassIpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => client.sendCommand(args),
    prefix: 'passreset_rl:',
  }),
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many attempts to reset password, try again later.",
      retryAfter: Math.ceil(((req as any).rateLimit.resetTime - Date.now()) / 1000)
    });
  },
});

