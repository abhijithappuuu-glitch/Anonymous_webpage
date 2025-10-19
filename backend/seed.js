import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Event from './models/Event.js';

dotenv.config();

const sampleEvents = [
  {
    title: 'Club Foundation',
    date: new Date('2024-01-15'),
    category: 'Other',
    summary: 'Anonymous Cybersecurity Club officially founded',
    description: 'Anonymous Cybersecurity Club was officially founded by Abhijith and Bhuvan with a mission to create a community of ethical hackers and security researchers. Our vision is to provide hands-on learning experiences and promote responsible security research.',
    images: [],
    tags: ['foundation', 'milestone', 'history'],
    status: 'past'
  },
  {
    title: 'First CTF Workshop',
    date: new Date('2024-02-20'),
    category: 'Workshop',
    summary: 'Introduction to Capture The Flag challenges',
    description: 'Our first workshop focused on CTF fundamentals. Students learned about different challenge categories including cryptography, web exploitation, reverse engineering, and forensics. Over 40 students participated and solved their first challenges.',
    images: [],
    tags: ['ctf', 'workshop', 'beginners'],
    status: 'past'
  },
  {
    title: 'Core Team Formation',
    date: new Date('2024-03-10'),
    category: 'Other',
    summary: 'Satvik and Tejaswini joined as core members',
    description: 'Expanded our core team with Satvik bringing expertise in network security and Tejaswini specializing in web application security. This marked a significant milestone in growing our club leadership.',
    images: [],
    tags: ['team', 'milestone', 'growth'],
    status: 'past'
  },
  {
    title: 'OWASP Top 10 Workshop',
    date: new Date('2024-04-15'),
    category: 'Workshop',
    summary: 'Deep dive into web application vulnerabilities',
    description: 'Comprehensive workshop covering OWASP Top 10 vulnerabilities including SQL injection, XSS, CSRF, broken authentication, and security misconfigurations. Students practiced exploitation techniques in a controlled lab environment.',
    images: [],
    tags: ['owasp', 'web-security', 'workshop'],
    status: 'past'
  },
  {
    title: 'First Security Audit Project',
    date: new Date('2024-04-25'),
    category: 'Other',
    summary: 'Successfully completed professional security audit',
    description: 'Our team successfully completed our first professional security audit for a local startup. Identified multiple critical vulnerabilities and provided comprehensive remediation recommendations. This marked our entry into real-world security consulting.',
    images: [],
    tags: ['audit', 'project', 'professional'],
    status: 'past'
  },
  {
    title: 'National CTF Competition',
    date: new Date('2024-06-15'),
    category: 'Conference',
    summary: 'Secured top 10 position in National Cybersecurity Championship',
    description: 'Team Anonymous represented our college at the National Cybersecurity Championship. Competed against 100+ teams from across India and secured a top 10 position. Solved challenges in cryptography, binary exploitation, and web security.',
    images: [],
    tags: ['ctf', 'competition', 'achievement'],
    status: 'past'
  },
  {
    title: 'Vulnerability Disclosure Program Launch',
    date: new Date('2024-08-30'),
    category: 'Other',
    summary: 'Launched responsible vulnerability disclosure program',
    description: 'Initiated our responsible vulnerability disclosure program to identify and report security vulnerabilities in popular websites and applications. Adopted industry-standard disclosure practices and ethical guidelines.',
    images: [],
    tags: ['vulnerability', 'disclosure', 'responsible'],
    status: 'past'
  },
  {
    title: 'Official Website Launch',
    date: new Date('2024-10-09'),
    category: 'Other',
    summary: 'Website and admin portal launched',
    description: 'Launched our official website with comprehensive features including event management, member profiles, gallery, and admin dashboard. Built with modern technologies: React, Node.js, MongoDB, and deployed on Vercel and Render.',
    images: [],
    tags: ['website', 'milestone', 'technology'],
    status: 'past'
  },
  {
    title: 'Advanced Penetration Testing Workshop',
    date: new Date('2025-11-15'),
    category: 'Workshop',
    summary: 'Advanced pentesting techniques and tools',
    description: 'Advanced workshop covering penetration testing methodologies, exploitation techniques, post-exploitation, and report writing. Topics include: reconnaissance, scanning, exploitation with Metasploit, privilege escalation, and maintaining access. Prerequisites: Basic Linux and networking knowledge.',
    images: [],
    tags: ['pentesting', 'advanced', 'workshop'],
    status: 'upcoming'
  },
  {
    title: 'Annual Hackathon 2025',
    date: new Date('2025-12-15'),
    category: 'Hackathon',
    summary: '24-hour cybersecurity hackathon with prizes worth ₹50,000',
    description: 'Join us for our biggest event of the year! 24-hour hackathon featuring challenges in web security, cryptography, reverse engineering, forensics, and network security. Prizes: 1st Place - ₹25,000, 2nd Place - ₹15,000, 3rd Place - ₹10,000. Open to all college students. Form teams of 2-4 members.',
    images: [],
    tags: ['hackathon', 'competition', 'prizes', 'annual'],
    status: 'upcoming'
  },
  {
    title: 'Bug Bounty Basics Webinar',
    date: new Date('2026-01-20'),
    category: 'Webinar',
    summary: 'Getting started with bug bounty programs',
    description: 'Online webinar on bug bounty hunting. Learn how to find vulnerabilities, write quality reports, and earn rewards through platforms like HackerOne and Bugcrowd. Guest speaker: Professional bug bounty hunter with $100K+ earnings. Free for all members.',
    images: [],
    tags: ['bug-bounty', 'webinar', 'career'],
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
      email: 'anonymous.sdmcet@gmail.com',
      password: 'SecureAdmin2024!',
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
    console.log('Admin - Email: anonymous.sdmcet@gmail.com, Password: SecureAdmin2024!');
    console.log('User  - Email: hacker@anonymous.club, Password: hacker123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
