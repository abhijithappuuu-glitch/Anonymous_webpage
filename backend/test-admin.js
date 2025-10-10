import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function testAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@anonymous.club' });
    if (!adminUser) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('✅ Admin user found:');
    console.log('- Email:', adminUser.email);
    console.log('- Username:', adminUser.username);
    console.log('- Role:', adminUser.role);

    // Test password
    const isValidPassword = await bcrypt.compare('admin123', adminUser.password);
    console.log('- Password test:', isValidPassword ? '✅ Valid' : '❌ Invalid');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testAdminUser();