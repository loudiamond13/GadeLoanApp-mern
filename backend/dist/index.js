"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
// import debug from 'debug';
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
// import routes
const users_1 = require("./routes/users");
const auth_1 = require("./routes/auth");
const customers_1 = require("./routes/customers");
const loans_1 = require("./routes/loans");
//connection to cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLODINARY_API_SECRET,
});
//db connection
mongoose_1.default.connect(process.env.MongoDB_CONNECTION_STRING);
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/dist")));
//endpoints
app.use("/api/auth", auth_1.authenticationRoute);
// /api/users/
app.use("/api/users", users_1.UserRoutes);
app.use('/api/customers', customers_1.createCustomerRouter);
app.use('/api/loans', loans_1.loanRouter);
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../frontend/dist/index.html"));
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
