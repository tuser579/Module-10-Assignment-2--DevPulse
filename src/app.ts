import express, { type Application, type Request, type Response } from 'express';
import { authRoute } from './modules/auth/auth.route.js';
import logger from './middleware/logger.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import { issueRoute } from './modules/issue/issue.route.js';

const app: Application = express();

// Use middleware for parsing JSON body
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use(logger);
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5000"
}));

// application main route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "Hello World! Welcome to University Management System" });
})

app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);

app.use(globalErrorHandler);

export default app;
