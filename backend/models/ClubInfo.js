import mongoose from 'mongoose';

const clubInfoSchema = new mongoose.Schema({
  // About section content
  mission: {
    type: String,
    default: 'To advance cybersecurity through ethical hacking, defense research, and collaborative learning. We empower the next generation of security professionals through hands-on experience and community.'
  },
  vision: {
    type: String,
    default: 'Creating a safer digital world through education, research, and ethical hacking practices.'
  },
  founded: {
    type: String,
    default: '2024'
  },
  location: {
    type: String,
    default: 'Tech University Campus'
  },
  
  // Statistics
  totalMembers: {
    type: String,
    default: '150+'
  },
  ctfChallenges: {
    type: String,
    default: '50+'
  },
  nationalRanking: {
    type: String,
    default: '#3'
  },
  vulnerabilitiesDisclosed: {
    type: String,
    default: '25+'
  },
  workshopsConducted: {
    type: String,
    default: '40+'
  },
  industryPartners: {
    type: String,
    default: '15+'
  },
  
  // Contact information
  email: {
    type: String,
    default: 'contact@anonclub.org'
  },
  discord: {
    type: String,
    default: '#discord'
  },
  github: {
    type: String,
    default: '#github'
  },
  campusLocation: {
    type: String,
    default: 'Tech University Campus'
  },
  
  // Social media links
  socialLinks: {
    twitter: { type: String, default: '#' },
    linkedin: { type: String, default: '#' },
    youtube: { type: String, default: '#' },
    instagram: { type: String, default: '#' }
  },
  
  // Footer content
  footerDescription: {
    type: String,
    default: 'Advancing cybersecurity through ethical hacking, collaborative research, and hands-on learning experiences.'
  },
  
  // Legacy field for backward compatibility
  members: { type: String, default: '' }
}, {
  timestamps: true
});

export default mongoose.model('ClubInfo', clubInfoSchema);