import { createTokenBucketLimiter } from "../utils/tokenBucketCreator";

export const readApiRateLimiter = createTokenBucketLimiter( // rate limiter for cheap read operations like getActivity , getProject etc.
  {
    capacity: 60,
    refillRate: 21 / 60,
    prefix: "read_rl:",
    message: "Too many requests try again later.",
    type: "read"
  }
);

export const writeApiRateLimiter = createTokenBucketLimiter({ // rate limiter for medium cost write operations like create project , change project status etc.
  capacity: 20,
  refillRate: 7 / 60,
  prefix: "write_rl:",
  message: "Too many requests try again later.",
  type: "write",
});

export const sensitiveApiRateLimiter = createTokenBucketLimiter({ // rate limiter for dangerous api requests like delete client 
  capacity: 5,
  refillRate: 1 / 60,
  prefix: "vul_rl:",
  message: "Too many requests try again later.",
  type: "vul",
})
