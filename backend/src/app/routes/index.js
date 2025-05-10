import { ttsRoute } from './ttsRoute.js';
import { ttsVer2Route } from './ttsVer2Route.js';
import { scriptRoute } from './scriptRoute.js';

function route(app) {
    app.use('/tts', ttsRoute);
    app.use('/tts-v2', ttsVer2Route);
    app.use('/script', scriptRoute);
    app.get("/ping", (req, res) => {
        res.send("pong");
    });
}

// Thay vì module.exports, sử dụng export
export default route; 
