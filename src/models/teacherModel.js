import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  teacher_name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true,
  },
  isactive: {
    type: Number,
    default: 1,
  },
});

export default mongoose.model("teachers", teacherSchema);
