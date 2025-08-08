import mongoose from "mongoose";
import dotenv from "dotenv";
import HijabStyle from "./model/HijabStyle.js"; // model ka exact path check kar lena

dotenv.config();

const styles = [
  {
    name: "Turban Style",
    description: "A modern turban-style hijab perfect for casual and formal wear.",
    image: "https://res.cloudinary.com/demo/image/upload/turban.jpg"
  },
  {
    name: "Shayla Wrap",
    description: "A long, rectangular hijab wrapped loosely around the head and shoulders.",
    image: "https://res.cloudinary.com/demo/image/upload/shayla.jpg"
  },
  {
    name: "Khimar",
    description: "A cape-like hijab covering chest and shoulders, ideal for modest wear.",
    image: "https://res.cloudinary.com/demo/image/upload/khimar.jpg"
  },
  {
    name: "Square Scarf",
    description: "A classic square hijab folded into a triangle and pinned under the chin.",
    image: "https://res.cloudinary.com/demo/image/upload/square.jpg"
  },
  {
    name: "Sport Hijab",
    description: "Lightweight, breathable hijab designed for sports and active wear.",
    image: "https://res.cloudinary.com/demo/image/upload/sport.jpg"
  },
  {
    name: "Layered Hijab",
    description: "Stylish layered look for extra volume and elegance.",
    image: "https://res.cloudinary.com/demo/image/upload/layered.jpg"
  },
  {
    name: "Pashmina Wrap",
    description: "Soft pashmina fabric for a luxurious and comfortable style.",
    image: "https://res.cloudinary.com/demo/image/upload/pashmina.jpg"
  },
  {
    name: "Chiffon Hijab",
    description: "Lightweight chiffon hijab for formal events and special occasions.",
    image: "https://res.cloudinary.com/demo/image/upload/chiffon.jpg"
  },
  {
    name: "Crinkle Hijab",
    description: "Textured crinkle fabric that doesn’t require ironing, great for everyday wear.",
    image: "https://res.cloudinary.com/demo/image/upload/crinkle.jpg"
  },
  {
    name: "Underscarf with Hijab",
    description: "Underscarf worn with a lightweight hijab for secure and stylish coverage.",
    image: "https://res.cloudinary.com/demo/image/upload/underscarf.jpg"
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await HijabStyle.deleteMany();
    await HijabStyle.insertMany(styles);

    console.log("✅ HijabStyle collection seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
