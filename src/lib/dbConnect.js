import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:PPtKyLIFz3ijxzmu@cluster.vgf7t.mongodb.net/Signup'

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable not setup.');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        const opts = { bufferCommands: false };
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;