const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        const dbConnection = await mongoose.connect(process.env.DATABASE_URI);

        console.log(
            "Database connected successfully!",
            dbConnection.connection.host
        );
    } catch (err) {
        console.log("Database connection error: ", err);
        process.exit(1);
    }
};

module.exports = connectDB;
