import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL
});


client.on('error',err => console.log('Redis client error',err));

client.connect();

export {client};
