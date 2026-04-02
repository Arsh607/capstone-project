import express, {Express,Request, Response} from 'express';
import { HTTP_STATUS } from './constants/httpsConstants';

const app: Express = express();

app.get('api/v1/health', (req: Request, res: Response) => {
    res.status(HTTP_STATUS.OK).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    })
});

export default app;