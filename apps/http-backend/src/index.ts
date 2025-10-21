import express from 'express';
const app = express();

app.listen(3000, () => {
    console.log('http-backend listening on port 3000');
})