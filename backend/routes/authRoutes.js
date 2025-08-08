import { Router } from "express";
import {  forgetPassword, login, ResetPswd, signup,  } from "../controllers/authControllers.js";
import { authorize, middlewareToProtect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerimage.js";
import { deleteProfile, getProfile, updateProfile } from "../controllers/profileController.js";
import { createFeedback, deleteFeedback, getFeedback } from "../controllers/feedbackController.js";
import { deleteUser, getAllUsers } from "../controllers/userController.js";
import { addReviewToHijabStyle, createHijabStyle, deleteReview, editReview, getHijabStyles } from "../controllers/hijabStyleController.js";

const router = Router()

router.post('/signup',signup)
router.post('/login',login)
router.post('/forget-password',forgetPassword)
router.post('/reset-password',ResetPswd)
router.get("/users", middlewareToProtect,authorize("admin") , getAllUsers)
router.delete("/users/:id", middlewareToProtect,authorize("admin") , deleteUser)
router.get('/profile',middlewareToProtect , getProfile);
router.put('/profile', middlewareToProtect, upload.single('image'), updateProfile);
router.delete("/profile", middlewareToProtect, deleteProfile);
router.post("/hijabstyles", middlewareToProtect, upload.single("image"), createHijabStyle);
router.get("/hijabstyles",middlewareToProtect, getHijabStyles);
router.post("/hijabstyles/:id/review",middlewareToProtect, addReviewToHijabStyle);
router.patch("/hijabstyles/:hijabId/review/:reviewId", middlewareToProtect, editReview);
// Example using Express router
router.delete('/hijabstyles/:styleId/review/:reviewId', middlewareToProtect, deleteReview);

// router.post("/feedback",middlewareToProtect,createFeedback)
// router.get("/feedback", middlewareToProtect,authorize("admin") , getFeedback)
// router.delete("/feedback/:id", middlewareToProtect,authorize("admin") , deleteFeedback)

export default router

