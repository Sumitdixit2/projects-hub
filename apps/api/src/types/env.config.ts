import { StringValue } from "ms";

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const ACCESS_TOKEN_SECRET = getEnv("ACCESS_TOKEN_SECRET");
export const REFRESH_TOKEN_SECRET = getEnv("REFRESH_TOKEN_SECRET");

export const ACCESS_TOKEN_EXPIRY: StringValue = getEnv("ACCESS_TOKEN_EXPIRY") as StringValue;
export const REFRESH_TOKEN_EXPIRY: StringValue = getEnv("REFRESH_TOKEN_EXPIRY") as StringValue;

