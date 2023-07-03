import { Redis } from "@upstash/redis";

const { REDIS_URL, REDIS_SECRET } = process.env;

export const redis = new Redis({ url: REDIS_URL!, token: REDIS_SECRET! });
