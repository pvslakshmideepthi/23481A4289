const axios = require("axios");

const TOKEN = process.env.TOKEN;

async function Log({ stack, level, pkg, message }) {
    try {

        const response = await axios({
            method: "post",
            url: "http://4.224.186.213/evaluation-service/logs",

            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            },

            data: {
                stack: stack,
                level: level,
                package: pkg,
                message: message
            }
        });

        console.log(response.data);

    } catch (error) {

        console.log("Logging Failed");

        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
}

module.exports = Log;