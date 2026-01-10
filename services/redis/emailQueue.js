const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis({
    host: '127.0.0.1',
    port: 6379,
});

const emailQueue = new Queue("verification-email", { connection });

const addEmailJob = async(email, token) => {
    await emailQueue.add("send-verify-email", 
        {
            email: email,
            token: token,
        },
        {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        });
    console.log(`${email} send to the email job to redis`);
};

module.exports = {
    addEmailJob
};
