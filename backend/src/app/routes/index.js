const ttsRoute = require('./ttsRoute');

function route(app) {
    app.use('/tts', ttsRoute);

}

module.exports = route;
