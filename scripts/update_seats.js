const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Subject = require("../models/subject");
const { connectToMongoDB } = require("../connection");

dotenv.config({ path: '../.env' }); // Adjust path if running from scripts/ dir, but I'll run from root

async function updateSeats() {
    try {
        // Load env vars - simpler if I assume running from root
        require("dotenv").config();

        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI is missing from .env");
            process.exit(1);
        }

        console.log("Connecting to DB...");
        await connectToMongoDB(process.env.MONGO_URI);
        console.log("Connected.");

        const result = await Subject.updateMany(
            {}, // Filter: all documents
            { $set: { maxSeats: 90 } } // Update operation
        );

        console.log(`Updated ${result.modifiedCount} subjects to have maxSeats: 90`);
        console.log("Matched count:", result.matchedCount);

    } catch (error) {
        console.error("Error updating seats:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

updateSeats();
