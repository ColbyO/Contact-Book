require('dotenv').config({path: "./config.env"});
const express = require('express');
const connectDB = require('./config/db')

// ConnectDB
connectDB();

const app = express();

app.use(express.json())
app.use('/api/auth', require('./routes/auth'));
app.use('/api/private', require('./routes/private'));

const PORT = process.env.PORT || 5000

const server = app.listen(PORT,()=> {
    console.log(`Running on port ${PORT}`)
})

process.on("uncaughtException", (err, promise)=> {
    console.log(`Logged Errpr: ${err}`)
    server.close(()=> process.exit(1))
})