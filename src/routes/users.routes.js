import { fetchAllUsers, fetchUserById, updateUserById, deleteUserById } from '#controllers/users.controller.js';
import { authenticate, requireAdmin } from '#middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticate, requireAdmin, fetchAllUsers);

// Get user by ID (authenticated users)
router.get('/:id', authenticate, fetchUserById);

// Update user (authenticated users - own profile or admin)
router.put('/:id', authenticate, updateUserById);

// Delete user (authenticated users - own profile or admin)
router.delete('/:id', authenticate, deleteUserById);

export default router
 