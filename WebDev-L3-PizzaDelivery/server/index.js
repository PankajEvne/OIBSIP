import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'



const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('Pizza Delivery API Running');
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Sever is running on port ${PORT}`);
})