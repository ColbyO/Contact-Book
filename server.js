require('dotenv').config({path: "./config.env"});
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db')

// ConnectDB
connectDB();

// middle ware
const app = express();

app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use('/api/auth', require('./routes/auth'));
app.use('/api/private', require('./routes/private'));

// port
const PORT = process.env.PORT || 5000

// start server
const server = app.listen(PORT,()=> {
    console.log(`Running on port ${PORT}`)
})
// error handler
process.on("uncaughtException", (err, promise)=> {
    console.log(`Logged Error: ${err}`)
    server.close(()=> process.exit(1))
})