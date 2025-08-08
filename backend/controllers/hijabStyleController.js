import hijaab from "../model/HijabStyle.js";

import streamifier from "streamifier";
import cloudinary from "../utils/cloudinary.js";

export const createHijabStyle = async (req, res) => {
  try {
    console.log("📥 Incoming Body:", req.body);
    console.log("📸 Incoming File:", req.file);

    const { name, description } = req.body;

    if (!req.file) {
      console.log("❌ No file received!");
      return res.status(400).json({ message: "Image is required" });
    }

    // Cloudinary upload from buffer
    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "hijabStyles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const uploadResult = await uploadFromBuffer();
    console.log("✅ Cloudinary Upload URL:", uploadResult.secure_url);

    const newStyle = new hijaab({
      name,
      description,
      image: uploadResult.secure_url,
    });

    await newStyle.save();
    console.log("✅ New hijab style saved:", newStyle);

    res.status(201).json(newStyle);
  } catch (error) {
    console.error("❌ Error in createHijabStyle:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getHijabStyles = async (req, res) => {
  try {
    console.log("📩 GET /hijabstyles request received");

    const styles = await hijaab.find().sort({ createdAt: -1 }) .populate({
        path: "reviews.user",
        select: "name",
         model: "user"
      });;

    console.log(`✅ Found ${styles.length} hijab styles`);
    console.log("📦 Data:", styles);

    res.status(200).json(styles);
  } catch (error) {
    console.error("❌ Error in getHijabStyles:", error);
    res.status(500).json({ message: error.message });
  }
};




// POST /api/hijabstyles/:id/review
// POST /api/hijabstyles/:id/review
export const addReviewToHijabStyle = async (req, res) => {
  try {
    const hijabId = req.params.id;
    // User ID should come from authenticated user, not from request body
    const userId = req.user._id;  // middlewareToProtect se aaya hoga
    const { text, rating } = req.body;

    if (!userId || !rating) {
      return res.status(400).json({ message: "User ID and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const hijab = await hijaab.findById(hijabId);
    if (!hijab) {
      return res.status(404).json({ message: "Hijab style not found" });
    }

    // Push new review
    hijab.reviews.push({
      user: userId,
      text: text || "",
      rating,
    });

    // Recalculate average rating
    const totalRating = hijab.reviews.reduce((acc, review) => acc + review.rating, 0);
    hijab.averageRating = totalRating / hijab.reviews.length;

    await hijab.save();

    res.status(201).json({
      message: "Review added successfully",
      hijab,
    });
  } catch (error) {
    console.error("❌ Error in addReviewToHijabStyle:", error);
    res.status(500).json({ message: error.message });
  }
};



export const editReview = async (req, res) => {
  try {
    const { hijabId, reviewId } = req.params;
    const userId = req.user._id;  // logged in user id from middleware
    const { text, rating } = req.body;

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const hijab = await hijaab.findById(hijabId);
    if (!hijab) {
      return res.status(404).json({ message: "Hijab style not found" });
    }

    // Find review by id
    const review = hijab.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check ownership
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this review" });
    }

    // Update fields
    if (text !== undefined) review.text = text;
    if (rating !== undefined) review.rating = rating;

    // Recalculate average rating
    const totalRating = hijab.reviews.reduce((acc, r) => acc + r.rating, 0);
    hijab.averageRating = totalRating / hijab.reviews.length;

    await hijab.save();

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error("❌ Error in editReview:", error);
    res.status(500).json({ message: error.message });
  }
};


// DELETE /api/hijabstyles/:hijabId/review/:reviewId
export const deleteReview = async (req, res) => {
  try {
    const { styleId, reviewId } = req.params;
    const userId = req.user._id; // authenticated user

    const hijab = await hijaab.findById(styleId);
    if (!hijab) return res.status(404).json({ message: "Hijab style not found" });

    const review = hijab.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    // Remove the review manually by filtering
    hijab.reviews = hijab.reviews.filter(
      (r) => r._id.toString() !== reviewId.toString()
    );

    // Recalculate average rating
    const totalRating = hijab.reviews.reduce((acc, r) => acc + r.rating, 0);
    hijab.averageRating = hijab.reviews.length ? totalRating / hijab.reviews.length : 0;

    await hijab.save();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("❌ Error in deleteReview:", error);
    res.status(500).json({ message: error.message });
  }
};
