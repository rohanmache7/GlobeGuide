import { Redis } from '@upstash/redis';
require('dotenv').config();


const redisUrl = process.env.REDIS_URL || "";
const redisToken = process.env.REDIS_TOKEN || "";

const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

(async () => {
  try {
    await redis.set("test", "Hello Redis");
    const value = await redis.get("test");
    console.log("✅ Redis Test:", value);
  } catch (err) {
    console.error("❌ Redis Error:", err);
  }
})();

export default redis;
