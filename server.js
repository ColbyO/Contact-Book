require('dotenv').config({path: "./config.env"});
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db')

// ConnectDB
connectDB();

const app = express();

app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use('/api/auth', require('./routes/auth'));
app.use('/api/private', require('./routes/private'));

const PORT = process.env.PORT || 5000

const server = app.listen(PORT,()=> {
    console.log(`Running on port ${PORT}`)
})

process.on("uncaughtException", (err, promise)=> {
    console.log(`Logged Error: ${err}`)
    server.close(()=> process.exit(1))
})