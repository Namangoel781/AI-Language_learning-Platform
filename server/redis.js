const { createClient } = require("redis");

const client = createClient({
  password: "dEGsxZYnAxSsfHxr1fqwAu0BVinfqFG9",
  socket: {
    host: "redis-11475.c56.east-us.azure.redns.redis-cloud.com",
    port: 11475,
  },
});

client.on("connect", () => {
  console.log("Connected to Redis successfully");
});

// Log on error
client.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Connect to Redis
client.connect();

module.exports = client;
