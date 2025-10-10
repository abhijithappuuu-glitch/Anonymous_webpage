import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import HomeContent from '../models/HomeContent.js';
import TimelineEvent from '../models/TimelineEvent.js';
import GalleryImage from '../models/GalleryImage.js';
import ClubInfo from '../models/ClubInfo.js';
import TeamMember from '../models/TeamMember.js';
const router = express.Router();

// Storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve('./uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

async function isAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - Admin access required' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}


// Home Content CRUD
router.get('/home', isAdmin, async (req, res) => {
  const doc = await HomeContent.findOne();
  res.json(doc || { content: '' });
});

router.post('/home', isAdmin, async (req, res) => {
  let doc = await HomeContent.findOne();
  if (!doc) doc = new HomeContent();
  doc.content = req.body.content;
  doc.updatedAt = Date.now();
  await doc.save();
  res.json({ success: true });
});

// Timeline Events CRUD
router.get('/timeline', isAdmin, async (req, res) => {
  const events = await TimelineEvent.find().sort({ date: 1 });
  res.json(events);
});

router.post('/timeline', isAdmin, async (req, res) => {
  const { title, description, date } = req.body;
  const event = new TimelineEvent({ title, description, date });
  await event.save();
  res.json({ success: true, event });
});

router.put('/timeline/:id', isAdmin, async (req, res) => {
  const { title, description, date } = req.body;
  const event = await TimelineEvent.findByIdAndUpdate(req.params.id, { title, description, date }, { new: true });
  res.json({ success: true, event });
});

router.delete('/timeline/:id', isAdmin, async (req, res) => {
  await TimelineEvent.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Gallery Images CRUD
router.get('/gallery', isAdmin, async (req, res) => {
  const images = await GalleryImage.find().sort({ uploadedAt: -1 });
  res.json(images);
});

router.post('/gallery', isAdmin, upload.single('image'), async (req, res) => {
  if (req.file) {
    const imageUrl = '/uploads/' + req.file.filename;
    const img = new GalleryImage({ url: imageUrl, caption: req.body.caption || '' });
    await img.save();
    res.json({ success: true, image: img });
  } else {
    res.status(400).json({ success: false });
  }
});

router.put('/gallery/:id', isAdmin, async (req, res) => {
  const { caption } = req.body;
  const img = await GalleryImage.findByIdAndUpdate(req.params.id, { caption }, { new: true });
  res.json({ success: true, image: img });
});

router.delete('/gallery/:id', isAdmin, async (req, res) => {
  await GalleryImage.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Club Information CRUD
router.get('/club-info', isAdmin, async (req, res) => {
  try {
    let clubInfo = await ClubInfo.findOne();
    if (!clubInfo) {
      // Create default club info if none exists
      clubInfo = new ClubInfo();
      await clubInfo.save();
    }
    res.json(clubInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching club info', error: error.message });
  }
});

router.post('/club-info', isAdmin, async (req, res) => {
  try {
    let clubInfo = await ClubInfo.findOne();
    if (!clubInfo) {
      clubInfo = new ClubInfo(req.body);
    } else {
      Object.assign(clubInfo, req.body);
      clubInfo.updatedAt = Date.now();
    }
    await clubInfo.save();
    res.json({ success: true, clubInfo });
  } catch (error) {
    res.status(500).json({ message: 'Error saving club info', error: error.message });
  }
});

// Team Members CRUD
router.get('/team-members', isAdmin, async (req, res) => {
  try {
    const members = await TeamMember.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team members', error: error.message });
  }
});

router.post('/team-members', isAdmin, async (req, res) => {
  try {
    const { name, role, specialty, bio, initials, order } = req.body;
    const member = new TeamMember({ 
      name, 
      role, 
      specialty: specialty || '', 
      bio: bio || '', 
      initials, 
      order: order || 0 
    });
    await member.save();
    res.json({ success: true, member });
  } catch (error) {
    res.status(500).json({ message: 'Error creating team member', error: error.message });
  }
});

router.put('/team-members/:id', isAdmin, async (req, res) => {
  try {
    const { name, role, specialty, bio, initials, order, isActive } = req.body;
    const member = await TeamMember.findByIdAndUpdate(
      req.params.id, 
      { name, role, specialty, bio, initials, order, isActive, updatedAt: Date.now() },
      { new: true }
    );
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json({ success: true, member });
  } catch (error) {
    res.status(500).json({ message: 'Error updating team member', error: error.message });
  }
});

router.delete('/team-members/:id', isAdmin, async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting team member', error: error.message });
  }
});

// Route to reorder team members
router.put('/team-members/:id/order', isAdmin, async (req, res) => {
  try {
    const { order } = req.body;
    const member = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { order },
      { new: true }
    );
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json({ success: true, member });
  } catch (error) {
    res.status(500).json({ message: 'Error updating member order', error: error.message });
  }
});

export default router;
