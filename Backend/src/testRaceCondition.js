const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { bookSeat } = require('./service/bookSeat'); 

dotenv.config();

let isConnected = false; 

async function connectDB() {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
        isConnected = true;
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
}

const testRaceCondition = async () => {
    await connectDB();

    console.log("Starting race condition test...");

    const movieName = "Dragon";
    const seatCategory = "premium";
    const row = "rowB";
    const seatNumber = 5;

    console.log("Booking Seat Params:", { movieName, seatCategory, row, seatNumber });

    try {
        
        const user1 = bookSeat(movieName, seatCategory, row, seatNumber, "Janani");
        const user2 = bookSeat(movieName, seatCategory, row, seatNumber, "Akbar");

        const results = await Promise.allSettled([user1, user2]);

        console.log("Race condition test results:");
        results.forEach((result, index) => {
            if (result.status === "fulfilled") {
                console.log(`User ${index + 1} booked successfully:`, result.value);
            } else {
                console.log(`User ${index + 1} failed:`, result.reason.message);
            }
        });
    } catch (error) {
        console.error("Race condition detected:", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
    }
};

testRaceCondition();
