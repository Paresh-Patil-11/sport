import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import Appointment from "../models/Appointment.js"

const router = express.Router()

// Book appointment
router.post("/", authMiddleware, async (req, res) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      user: req.userId
    })
    await appointment.save()
    res.status(201).json(appointment)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get user appointments
router.get("/my-appointments", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.userId })
    res.json(appointments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router