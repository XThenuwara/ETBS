import Redis from "ioredis";

export const RedisSource = new Redis({
    host: process.env.REDIS_NAME || "localhost",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0,
});

export const closeRedis = async () => {
    if (RedisSource) { 
        try {
            await RedisSource.quit();
            console.log("Redis connection closed.");
        } catch (err) {
            console.error("Error closing Redis connection:", err);
        }
    }
};
