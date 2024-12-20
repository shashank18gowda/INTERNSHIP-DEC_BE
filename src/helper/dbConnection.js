import mongoose from "mongoose";

export const connectDB = () => {
  try {
    // mongoose.connect("mongodb://127.0.0.1/my_database");

    mongoose.connect(process.env.DB_URL, { dbName: process.env.DB_NAME });
    console.log("Database connected successfuly");
  } catch (error) {
    console.log("Unable to connect to DB");
  }
};

