const express = require('express');
const router = express.Router();
const { body } = require("express-validator")
const captainController = require('../controllers/captain.controller');
const authMiddleWare = require('../middlewares/auth.middleware');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body ('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({min: 6 }).withMessage('Password must be atleast 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be atleast 3 character long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters'),
    body('vehicle.capacity').isInt({min: 1}).withMessage('Capacity must be atleast 1'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid vehicle type'),
],
    captainController.registerCaptain
)


router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be atleast 6 characters long')
],
captainController.loginCaptain
)

router.get('/profile', authMiddleWare.authCaptain, captainController.getCaptainProfile)

router.get('/logout', authMiddleWare.authCaptain, captainController.logoutCaptain)
module.exports = router;