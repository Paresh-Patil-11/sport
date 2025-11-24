import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    consultantType: {
      type: String,
      enum: ["cricket", "football", "tennis", "fitness", "general"],
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      enum: [
        "09:00-10:00",
        "10:00-11:00",
        "11:00-12:00",
        "12:00-13:00",
        "14:00-15:00",
        "15:00-16:00",
        "16:00-17:00",
        "17:00-18:00",
      ],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    userDetails: {
      name: String,
      email: String,
      phone: String,
    },
    adminNotes: {
      type: String,
      maxlength: 1000,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

// Index for efficient querying
appointmentSchema.index({ user: 1, appointmentDate: 1 })
appointmentSchema.index({ status: 1 })
appointmentSchema.index({ appointmentDate: 1, timeSlot: 1 })

export default mongoose.model("Appointment", appointmentSchema)