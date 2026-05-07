import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { client } from "../config/client";


export const loginIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
		sendCommand: (...args: string[]) => client.sendCommand(args),
    prefix:'rl:',
	}),
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: Math.ceil(((req as any).rateLimit.resetTime - Date.now()) / 1000)    });
  },
});

export const signupIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
		sendCommand: (...args: string[]) => client.sendCommand(args),
    prefix:'signrl:',
	}),
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: Math.ceil(((req as any).rateLimit.resetTime - Date.now()) / 1000)    });
  },
});


export const otpIpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
		sendCommand: (...args: string[]) => client.sendCommand(args),
    prefix:'rl:',
	}),
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: Math.ceil(((req as any).rateLimit.resetTime - Date.now()) / 1000)    });
  },
});

export const resetPassIpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
		sendCommand: (...args: string[]) => client.sendCommand(args),
    prefix:'rl:',
	}),
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: Math.ceil(((req as any).rateLimit.resetTime - Date.now()) / 1000)    });
  },
});

