const ttsRoute = require('./ttsRoute');
const scriptRoute = require('./scriptRoute');

function route(app) {
    app.use('/tts', ttsRoute);
    app.use('/script', scriptRoute);
    app.get("/ping", (req, res) => {
        res.send("pong");
    });

}

module.exports = route;
