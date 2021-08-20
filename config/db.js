const mongoose = require('mongoose');

// Connect to MongoDB 
const connectDB = async() => {
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,   
        useCreateIndex: true,
        useFindAndModify: true
    });
    console.log("MongoDB is connected.")
}

module.exports = connectDB;