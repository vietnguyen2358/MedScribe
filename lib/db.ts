import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medicalapp';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global interface for mongoose cache
 */
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => mongoose.connection);
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase; 