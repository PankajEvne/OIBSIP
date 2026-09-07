import express from 'express';
import Notification from '../models/Notification.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/clear', protect, adminOnly, async (req, res) => {
  try {
    await Notification.deleteMany();
    res.json({ success: true, message: "Notifications cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
