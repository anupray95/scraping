const http = require("http");

const host = 'localhost';
const port = 5000;

const {getTimeStories} = require("./controller")

const requestListener =  (req, res) => {
    res.setHeader("Content-Type", "application/json");
    switch (req.url) {
        case "/getTimeStories":
            res.writeHead(200);
            getTimeStories(res);
            break;
        default:
            res.writeHead(200);
            res.end(`{"message": "This is a Default response"}`);
    }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});