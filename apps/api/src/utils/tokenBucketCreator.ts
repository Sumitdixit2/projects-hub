import { client } from "../config/client";
import { tocketBucketType } from "../types/tockenBucket.type";
import asyncHandler from "./asyncHandler";

export const createTokenBucketLimiter = ({capacity,refillRate,prefix,message,type} : tocketBucketType) => {
  const TokenBucketLimiter = asyncHandler(async(req,res,next) => {
    
    const user = (req as any).user;
    const id = user.id;

    const key = `${prefix}:${id}`;

    const bucketData = await client.get(key);
    const now = Date.now() / 1000;

    let tokens = capacity;
    let lastRefill = now;

    if(bucketData) {
      const data = JSON.parse(bucketData);
      
      tokens = data.tokens;
      lastRefill = data.lastRefill;
    }

    const elapsed = now - lastRefill;

    const refill = elapsed * refillRate;
    lastRefill = Date.now() / 1000;

    tokens = Math.min(capacity , tokens + refill);

        if(tokens < 1) {
      return res.status(429).json({
        message ,
      });
    }

    tokens -= 1;

    await client.set(key, JSON.stringify({tokens,lastRefill}),{EX: 60 * 60});
    next();
  });

  return TokenBucketLimiter;
}

