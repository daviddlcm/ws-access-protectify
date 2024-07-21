import * as express from 'express';
import { getData } from '../controllers/get.data.controller';
import { sendAccess } from '../controllers/send.data.controller';

const router = express.Router();

router.get('/access', sendAccess.handleRequest);
router.get('/getAccess', getData);

export default router;