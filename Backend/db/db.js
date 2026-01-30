const mongoose = require('mongoose');

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.log("❌ Database connection failed:", error);
    }
};

module.exports = connectToDb;
