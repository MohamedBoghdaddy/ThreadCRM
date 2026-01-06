import mongoose from 'mongoose';

/**
 * Connects to MongoDB using the MONGO_URI environment variable.  If the
 * connection fails, the process exits with status code 1.  In development
 * a successful connection will log the host to the console.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  }
};

export default connectDB;
