import express from 'express'
const router = express.Router()
import {
	authUser,
	registerUser,
	getUserProfile,
	getUserByPhoneNumber,
	updateUserProfile,
	getUsers,
	deleteUser,
	getUserById,
	updateUser,
} from '../controllers/userController.js'
import { protect, admin, phoneNumberProtect } from '../middleware/authMiddleware.js'

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.post('/login', authUser)
router
	.route('/profile')
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile)
router
	.route('/:id')
	.delete(protect, admin, deleteUser)
	.get(protect, getUserById)
	.put(protect, admin, updateUser)

router
	.route('/phone/:phoneNumber')
	.get(phoneNumberProtect, getUserByPhoneNumber);
export default router
