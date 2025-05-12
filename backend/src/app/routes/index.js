import { ttsRoute } from './ttsRoute.js';
import { ttsVer2Route } from './ttsVer2Route.js';
import { scriptRoute } from './scriptRoute.js';
import { imageRoute } from './imageRoute.js';
import { imageVer2Route } from './imageVer2Route.js';
import { handleVideoRoute } from './handleVideoRoute.js';

function route(app) {
    app.use('/create-video', handleVideoRoute);
    app.use('/image', imageRoute);
    app.use('/image-v2', imageVer2Route);
    app.use('/tts', ttsRoute);
    app.use('/tts-v2', ttsVer2Route);
    app.use('/script', scriptRoute);
    app.get("/ping", (req, res) => {
        res.send("pong");
    });
}

// Thay vì module.exports, sử dụng export
export default route; 
