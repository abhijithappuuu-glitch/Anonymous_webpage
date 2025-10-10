import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Event from './models/Event.js';

dotenv.config();

const sampleEvents = [
  {
    title: 'Club Launch Event',
    date: new Date('2024-01-15'),
    category: 'Conference',
    summary: 'Official launch of Anonymous Cybersecurity Club',
    description: 'Join us for the grand opening of our cybersecurity club. Meet fellow hackers, learn about our mission, and participate in our first CTF challenge.',
    images: [
      { url: 'https://via.placeholder.com/800x600/0a0e27/00d9ff?text=Launch+Event', caption: 'Club members at launch' }
    ],
    tags: ['launch', 'networking', 'ctf'],
    status: 'past'
  },
  {
    title: 'Web Security Workshop',
    date: new Date('2024-02-20'),
    category: 'Workshop',
    summary: 'Learn about OWASP Top 10 vulnerabilities',
    description: 'Deep dive into web application security. Topics include SQL injection, XSS, CSRF, and more. Hands-on labs included.',
    images: [
      { url: 'https://via.placeholder.com/800x600/0a0e27/00ff41?text=Web+Security', caption: 'Workshop in progress' }
    ],
    tags: ['web', 'owasp', 'security'],
    status: 'past'
  },
  {
    title: 'Annual Hackathon 2024',
    date: new Date('2024-06-15'),
    category: 'Hackathon',
    summary: '24-hour cybersecurity hackathon with prizes',
    description: 'Compete in our annual hackathon! Solve challenges, build security tools, and win amazing prizes. Open to all skill levels.',
    images: [
      { url: 'https://via.placeholder.com/800x600/0a0e27/bd00ff?text=Hackathon', caption: 'Hackathon participants' }
    ],
    tags: ['hackathon', 'competition', 'prizes'],
    status: 'upcoming'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@anonymous.club',
      password: 'admin123',
      role: 'admin'
    });
    console.log('👤 Created admin user');

    // Create sample user
    await User.create({
      username: 'hacker',
      email: 'hacker@anonymous.club',
      password: 'hacker123',
      role: 'user'
    });
    console.log('👤 Created sample user');

    // Create events
    await Event.insertMany(sampleEvents);
    console.log('📅 Created sample events');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('Admin - Email: admin@anonymous.club, Password: admin123');
    console.log('User  - Email: hacker@anonymous.club, Password: hacker123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
