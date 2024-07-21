import express from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import accessRoutes from './routes/access.route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require("cors")

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingInterval:1000,
  pingTimeout:2000,
});

app.use(cors());

app.use(bodyParser.json());

app.use('/access', accessRoutes(io));

app.disable('x-powered-by');

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`User ${socket.id} joined room: ${userId}`);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});