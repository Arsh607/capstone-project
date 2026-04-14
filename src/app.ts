import dotenv from 'dotenv';
dotenv.config();
import express, {Express,Request, Response} from 'express';
import { HTTP_STATUS } from './constants/httpsConstants';
import productRouter from './api/v1/routes/productRoutes';
import supplierRouter from './api/v1/routes/supplierRoutes';
import authRouter from './api/v1/routes/authRoutes';
import transactionRouter from './api/v1/routes/transactionRoutes';
import adminRouter from './api/v1/routes/adminRoutes';
import userRouter from './api/v1/routes/userRoutes';
import morgan from 'morgan';
import { errorHandler } from './api/v1/middleware/errorHandler';
import setupSwagger from './config/swagger';
import { apiLimiter, authLimiter } from './api/v1/middleware/rateLimiter';
const app: Express = express();

app.use(express.json());
app.use(morgan('combined'));
app.use("/api/v1", apiLimiter)
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
app.use("/api/v1", authLimiter)
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/users', userRouter);
setupSwagger(app)
app.use(errorHandler);

export default app;