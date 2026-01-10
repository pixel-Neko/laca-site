const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const dotenv = require("dotenv");
const { sendEmail } = require("../sendEmail");

dotenv.config();

const connection = new IORedis( process.env.REDIS_URL || {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    maxRetriesPerRequest: null,
});

const QUEUE_NAME = 'verification-email';

const worker = new Worker(QUEUE_NAME, async (job) => {
    const { token } = job.data;
    if(!token) throw new Error(`Missing token in job data`);
    await sendEmail(token);
}, { connection });

worker.on('completed', job => console.log(`Job ${job.id} completed`));
worker.on('failed', (job, err) => console.log(`Job ${job.id} failed`));
worker.on('error', err => console.log(`Woker error: ${err}`));

const shutdown = async() => {
    console.log(`Shutting down worker....`);
    try { await worker.close(); } catch (e) { console.error(`Error closing worker: ${e}`); }
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log(`Worker started for queue ${QUEUE_NAME}`);