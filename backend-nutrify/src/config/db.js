import mongoose from "mongoose";
import seedDatabase from "./seed.js";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;


  if (mongoose.connections && mongoose.connections[0] && mongoose.connections[0].readyState) {
    isConnected = true;
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
