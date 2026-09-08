import express from 'express';
import { getAllUsers, deleteUser, toggleUserRole } from '../controllers/userController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, adminOnly, getAllUsers);
router.delete('/:id', protect, adminOnly, deleteUser);
router.patch('/:id/role', protect, adminOnly, toggleUserRole);

export default router;
