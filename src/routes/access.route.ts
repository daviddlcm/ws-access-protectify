import express from 'express';
import { saveAccess } from '../controllers/save.access.controller';

import { Server } from 'socket.io';

const router = express.Router();

export default (io: Server) => {
    router.post('/save', saveAccess(io));

    return router;
}