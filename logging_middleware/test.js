const Log = require("./logger");

async function testLogs() {

    await Log(
        "backend",
        "info",
        "service",
        "Notification service initialized"
    );

    await Log(
        "backend",
        "warn",
        "db",
        "Database response time is high"
    );

    await Log(
        "backend",
        "error",
        "handler",
        "Received string, expected bool"
    );

    await Log(
        "backend",
        "fatal",
        "db",
        "Critical database connection failure"
    );
}

testLogs();