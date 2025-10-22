import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import {router} from './routes/index.route';
import  cookieParser  from 'cookie-parser';
// 1 :43 :50


dotenv.config();
const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use('/api/v1', router);


app.listen(3001, () => {
    console.log('http-backend listening on port 3001');
})