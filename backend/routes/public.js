import express from 'express';
import ClubInfo from '../models/ClubInfo.js';
import TeamMember from '../models/TeamMember.js';
import TimelineEvent from '../models/TimelineEvent.js';
import GalleryImage from '../models/GalleryImage.js';

const router = express.Router();

// Public route to get club information
router.get('/club-info', async (req, res) => {
  try {
    let clubInfo = await ClubInfo.findOne();
    if (!clubInfo) {
      // Return default values if no club info exists
      clubInfo = new ClubInfo();
    }
    res.json(clubInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching club info', error: error.message });
  }
});

// Public route to get team members
router.get('/team-members', async (req, res) => {
  try {
    const members = await TeamMember.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team members', error: error.message });
  }
});

// Public route to get timeline events
router.get('/timeline', async (req, res) => {
  try {
    const events = await TimelineEvent.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timeline events', error: error.message });
  }
});

// Public route to get gallery images
router.get('/gallery', async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ uploadedAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery images', error: error.message });
  }
});

export default router;