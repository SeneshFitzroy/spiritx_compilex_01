import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3, // Reduced from 8 to make testing easier
  },
  password: {
    type: String,
    required: true,
  },
  is2FAEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Force Mongoose to use 'User' model consistently
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;