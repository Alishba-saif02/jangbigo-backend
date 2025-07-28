import { createClient } from 'redis';

export const redis = createClient({
    url: process.env['UPSTASH_REDIS_REST_URL'] || 'redis://localhost:6379',
});

redis.on('error', (err) => console.error('Redis Client Error', err));
(async () => {
    try {
        await redis.connect();
        console.log('✅ Redis connected');
    } catch (err) {
        console.error('❌ Redis connection failed', err);
    }
})();



