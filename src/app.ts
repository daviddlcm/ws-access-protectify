//Libraries
import express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

//Proyect imports
// import { socketioAuthMiddleware } from './middleware/middleware';
import { WebSocketService } from './services/send.data.service';
import routes from './routes/data.routes'

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.use('/', routes);
// io.use(socketioAuthMiddleware);
const websocketHandler = new WebSocketService(io);
const PORT = 4001;
server.listen(PORT, () => {
  console.log(`Servidor WebSocket escuchando en el puerto ${PORT}`);
});