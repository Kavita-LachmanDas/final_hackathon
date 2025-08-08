import mongoose from "mongoose";

const hijabStyleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true, // URL of image
  },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      rating: { type: Number, min: 1, max: 5 },
    }
  ],
  averageRating: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

const hijaab = mongoose.model("HijabStyle", hijabStyleSchema);
export default hijaab
