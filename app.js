import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './src/routes/index.routes.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    optionsSuccessStatus: 200,
    credentials: true,
}
app.use('*', cors(corsOptions));

app.use(router);

const port = process.env.PORT || 4344;
app.listen(port, () => console.log(`Server running on port ${port}`));
