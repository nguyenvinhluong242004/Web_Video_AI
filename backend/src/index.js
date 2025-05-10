const path = require('path'); // Xử lý đường dẫn tệp
const express = require('express'); // Web framework cho Node.js
const morgan = require('morgan'); // Module ghi log
const session = require('express-session');
const bodyParser = require('body-parser'); // Xử lý dữ liệu từ các yêu cầu HTTP
const cors = require('cors');

// Load biến môi trường từ file .env
require('dotenv').config({ path: './src/app/config/.env' });

const app = express();
const port = process.env.PORT || 6868; // Sử dụng PORT từ .env hoặc mặc định là 8888

// Middleware log request
app.use(morgan('dev'));

app.use(cors({
  origin: [process.env.FRONTEND_URL], // Thêm các domain bạn muốn
  methods: ['GET', 'POST'], // Chỉ cho phép GET và POST
  allowedHeaders: ['Content-Type'], // Chỉ cho phép header Content-Type
}));

// Middleware session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Middleware để parse dữ liệu JSON
app.use(bodyParser.json());

const route = require('./app/routes');

app.use(morgan('combined')); // Cấu hình ghi log HTTP requests
app.use(express.json()); // Xử lý dữ liệu JSON từ yêu cầu HTTP



// Kiểm tra xem .env có được load thành công không
console.log('Environment variables loaded:');
console.log(`PORT: ${process.env.PORT}`);


// Route init
route(app);


// Lắng nghe trên cổng
app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
