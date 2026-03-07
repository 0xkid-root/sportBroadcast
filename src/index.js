import express from 'express'
const app = express();
import {matchRouter} from "./routes/matches.js"



const port = 8000;
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('hello from express server!');
})

app.use('/matches',matchRouter)


app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})