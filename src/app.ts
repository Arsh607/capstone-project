import dotenv from 'dotenv';
dotenv.config();
import express, {Express,Request, Response} from 'express';
import { HTTP_STATUS } from './constants/httpsConstants';
import productRouter from './api/v1/routes/productRoutes';
import supplierRouter from './api/v1/routes/supplierRoutes';
import transactionRouter from './api/v1/routes/transactionRoutes';
import morgan from 'morgan';

const app: Express = express();

app.use(express.json());
app.use(morgan('combined'));
app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(HTTP_STATUS.OK).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    })
});
app.use('/api/v1/products', productRouter);
app.use('/api/v1/suppliers', supplierRouter);
app.use('/api/v1/transactions', transactionRouter);

export default app;