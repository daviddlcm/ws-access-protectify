"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Libraries
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
//Proyect imports
// import { socketioAuthMiddleware } from './middleware/middleware';
const send_data_service_1 = require("./services/send.data.service");
const data_routes_1 = __importDefault(require("./routes/data.routes"));
const app = (0, express_1.default)();
app.disable('x-powered-by');
app.use((0, cors_1.default)());
const server = http.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.use('/', data_routes_1.default);
// io.use(socketioAuthMiddleware);
const websocketHandler = new send_data_service_1.WebSocketService(io);
const PORT = 4001;
server.listen(PORT, () => {
    console.log(`Servidor WebSocket escuchando en el puerto ${PORT}`);
});
