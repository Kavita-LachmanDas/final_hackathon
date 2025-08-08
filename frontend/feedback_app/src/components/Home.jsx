// import { useEffect, useState } from "react";
// import axios from "axios";
// import { getToken, getUser } from "../utils/auth"; // getUser se user data mil jayega

// export default function HijabList() {
//   const [styles, setStyles] = useState([]);
//   const [reviewText, setReviewText] = useState({});
//   const [reviewRating, setReviewRating] = useState({});

//   // Track which review is in edit mode: { [reviewId]: true/false }
//   const [editingReview, setEditingReview] = useState({});

//   const currentUser = getUser(); // logged in user info

//   useEffect(() => {
//     fetchStyles();
//   }, []);

//   const fetchStyles = () => {
//     axios
//       .get("http://localhost:7000/api/auth/hijabstyles", {
//         headers: { Authorization: `Bearer ${getToken()}` },
//       })
//       .then((res) => {
//         setStyles(res.data);
//       })
//       .catch((err) => {
//         console.error("❌ Error fetching styles:", err);
//       });
//   };

//   // Submit new review
//   const handleReviewSubmit = async (styleId) => {
//     try {
//       const text = reviewText[styleId] || "";
//       const rating = reviewRating[styleId];

//       if (!rating) {
//         alert("Please select a rating");
//         return;
//       }

//       await axios.post(
//         `http://localhost:7000/api/auth/hijabstyles/${styleId}/review`,
//         { text, rating },
//         { headers: { Authorization: `Bearer ${getToken()}` } }
//       );

//       setReviewText((prev) => ({ ...prev, [styleId]: "" }));
//       setReviewRating((prev) => ({ ...prev, [styleId]: undefined }));

//       fetchStyles();
//     } catch (error) {
//       console.error("❌ Error submitting review:", error);
//     }
//   };

//   // Start editing a review: initialize edit states
//   const startEditing = (review) => {
//     setEditingReview((prev) => ({ ...prev, [review._id]: true }));
//     setReviewText((prev) => ({ ...prev, [review._id]: review.text }));
//     setReviewRating((prev) => ({ ...prev, [review._id]: review.rating }));
//   };

//   // Cancel editing
//   const cancelEditing = (reviewId) => {
//     setEditingReview((prev) => ({ ...prev, [reviewId]: false }));
//     setReviewText((prev) => ({ ...prev, [reviewId]: "" }));
//     setReviewRating((prev) => ({ ...prev, [reviewId]: undefined }));
//   };

//   // Submit edit review
//   const submitEdit = async (styleId, reviewId) => {
//     try {
//       const text = reviewText[reviewId] || "";
//       const rating = reviewRating[reviewId];

//       if (!rating) {
//         alert("Please select a rating");
//         return;
//       }

//       await axios.patch(
//         `http://localhost:7000/api/auth/hijabstyles/${styleId}/review/${reviewId}`,
//         { text, rating },
//         { headers: { Authorization: `Bearer ${getToken()}` } }
//       );

//       setEditingReview((prev) => ({ ...prev, [reviewId]: false }));
//       fetchStyles();
//     } catch (error) {
//       console.error("❌ Error editing review:", error);
//     }
//   };

//   // Delete review
//   const deleteReview = async (styleId, reviewId) => {
//     if (!window.confirm("Are you sure you want to delete this review?")) return;

//     try {
//       await axios.delete(
//         `http://localhost:7000/api/auth/hijabstyles/${styleId}/review/${reviewId}`,
//         { headers: { Authorization: `Bearer ${getToken()}` } }
//       );
//       fetchStyles();
//     } catch (error) {
//       console.error("❌ Error deleting review:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Hijab Styles</h2>
//       {styles.map((style) => (
//         <div
//           key={style._id}
//           style={{ border: "1px solid #ccc", margin: "1rem", padding: "1rem" }}
//         >
//           <h3>{style.name}</h3>
//           <p>{style.description}</p>
//           <img src={style.image} alt={style.name} width="200" />
//           <p>Average Rating: {style.averageRating.toFixed(1)}</p>

//           <div style={{ marginTop: "1rem" }}>
//             <h4>Leave a Review</h4>
//             <textarea
//               placeholder="Write your review here..."
//               value={reviewText[style._id] || ""}
//               onChange={(e) =>
//                 setReviewText((prev) => ({ ...prev, [style._id]: e.target.value }))
//               }
//               rows={3}
//               style={{ width: "100%" }}
//             />
//             <div>
//               <label>Rating: </label>
//               {[1, 2, 3, 4, 5].map((num) => (
//                 <label key={num} style={{ marginRight: "0.5rem" }}>
//                   <input
//                     type="radio"
//                     name={`rating-${style._id}`}
//                     value={num}
//                     checked={reviewRating[style._id] === num}
//                     onChange={() =>
//                       setReviewRating((prev) => ({ ...prev, [style._id]: num }))
//                     }
//                   />
//                   {num}
//                 </label>
//               ))}
//             </div>
//             <button onClick={() => handleReviewSubmit(style._id)}>Submit Review</button>
//           </div>

//           <div style={{ marginTop: "1rem" }}>
//             <h4>Reviews</h4>
//             {style.reviews.length === 0 && <p>No reviews yet.</p>}
//             {style.reviews.map((review) => {
//               const isOwner = review.user._id === currentUser?._id;

//               return (
//                 <div
//                   key={review._id}
//                   style={{ borderTop: "1px solid #ddd", paddingTop: "0.5rem" }}
//                 >
//                   <p>
//                     <b>User:</b>{" "}
//                     {typeof review.user === "string"
//                       ? review.user
//                       : review.user.name || "Anonymous"}
//                   </p>
//                   {editingReview[review._id] ? (
//                     <>
//                       <textarea
//                         rows={3}
//                         value={reviewText[review._id] || ""}
//                         onChange={(e) =>
//                           setReviewText((prev) => ({ ...prev, [review._id]: e.target.value }))
//                         }
//                         style={{ width: "100%" }}
//                       />
//                       <div>
//                         <label>Edit Rating: </label>
//                         {[1, 2, 3, 4, 5].map((num) => (
//                           <label key={num} style={{ marginRight: "0.5rem" }}>
//                             <input
//                               type="radio"
//                               name={`edit-rating-${review._id}`}
//                               value={num}
//                               checked={reviewRating[review._id] === num}
//                               onChange={() =>
//                                 setReviewRating((prev) => ({ ...prev, [review._id]: num }))
//                               }
//                             />
//                             {num}
//                           </label>
//                         ))}
//                       </div>
//                       <button onClick={() => submitEdit(style._id, review._id)}>Save</button>
//                       <button onClick={() => cancelEditing(review._id)}>Cancel</button>
//                     </>
//                   ) : (
//                     <>
//                       <p>
//                         <b>Rating:</b> {review.rating}
//                       </p>
//                       <p>{review.text}</p>
//                       {isOwner && (
//                         <>
//                           <button onClick={() => startEditing(review)}>Edit</button>
//                           <button onClick={() => deleteReview(style._id, review._id)}>
//                             Delete
//                           </button>
//                         </>
//                       )}
//                     </>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }





// /////////////////////////////////////////////////////
// import { useEffect, useState } from "react";
// import { Star, Edit3, Trash2, Send, X, Check, Menu, User, LogOut, MessageCircle, Plus, ChevronDown, ChevronUp, Eye, Camera, Mail, Phone, Edit, Save, AlertCircle } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { getToken, getUser } from "../utils/auth";

// // Enhanced Professional Navbar Component
// function Navbar() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const userName = localStorage.getItem("userName");
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userName");
//     navigate("/login");
//   };

//   return (
//     <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-purple-100 sticky top-0 z-50">
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <Link 
//             to="/" 
//             className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
//           >
//             Hijab Gallery
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center gap-6">
//             {token ? (
//               <div className="flex items-center gap-4">
//                 <Link 
//                   to="/profile"
//                   className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full hover:from-purple-100 hover:to-pink-100 transition-all duration-300 group"
//                 >
//                   <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
//                     <User className="w-4 h-4 text-white" />
//                   </div>
//                   <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
//                     Hi, {userName || "User"}
//                   </span>
//                 </Link>
//                 <button 
//                   onClick={logout}
//                   className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <div className="flex items-center gap-3">
//                 <Link 
//                   to="/login"
//                   className="px-4 py-2 border-2 border-purple-200 text-purple-600 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 font-medium"
//                 >
//                   Login
//                 </Link>
//                 <Link 
//                   to="/signup"
//                   className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-medium"
//                 >
//                   Signup
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button 
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
//           >
//             <Menu className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="md:hidden mt-4 pb-4 border-t border-purple-100 pt-4 animate-slide-down">
//             {token ? (
//               <div className="space-y-3">
//                 <Link 
//                   to="/profile"
//                   className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-all duration-300"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
//                     <User className="w-4 h-4 text-white" />
//                   </div>
//                   <span className="text-sm font-medium text-gray-700">
//                     Hi, {userName || "User"}
//                   </span>
//                 </Link>
//                 <button 
//                   onClick={logout}
//                   className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 <Link 
//                   to="/login"
//                   className="block w-full text-center px-4 py-2 border-2 border-purple-200 text-purple-600 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 font-medium"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Login
//                 </Link>
//                 <Link 
//                   to="/signup"
//                   className="block w-full text-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Signup
//                 </Link>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

// // Professional User Profile Component
// export function Profile() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//     contact: "",
//     image: [],
//   });
//   const [imageFile, setImageFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       setIsLoading(true);
//       try {
//         const token = getToken();
//         const res = await axios.get("http://localhost:7000/api/auth/profile", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUser(res.data.user);
//       } catch (err) {
//         console.error("Failed to fetch profile", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUser({ ...user, [name]: value });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setImageFile(file);
    
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setPreviewUrl(url);
//     }
//   };

//   const handleUpdate = async () => {
//     setIsUpdating(true);
//     const formData = new FormData();
//     formData.append("name", user.name);
//     formData.append("email", user.email);
//     formData.append("contact", user.contact);
//     if (imageFile) formData.append("image", imageFile);

//     try {
//       const token = getToken();
//       const res = await axios.put("http://localhost:7000/api/auth/profile", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setUser(res.data.user);
//       setImageFile(null);
//       setPreviewUrl(null);
      
//       // Success notification could be added here
//       alert("Profile updated successfully!");
//     } catch (err) {
//       console.error("Error updating profile", err);
//       alert("Failed to update profile. Please try again.");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       const token = getToken();
//       const res = await axios.delete("http://localhost:7000/api/auth/profile", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       alert(res.data.message);
//       localStorage.removeItem("token");
//       localStorage.removeItem("userName");
//       navigate("/login");
//     } catch (err) {
//       console.error("Error deleting profile", err);
//       alert("Failed to delete profile. Please try again.");
//     }
//   };

//   if (isLoading) {
//     return (
//       <>
//         <Navbar />
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
//           <div className="flex flex-col items-center">
//             <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
//             <p className="mt-4 text-lg text-purple-600 font-medium">Loading profile...</p>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8">
//         <div className="container mx-auto px-4">
//           <div className="max-w-2xl mx-auto">
//             {/* Header */}
//             <div className="text-center mb-8 animate-fade-in">
//               <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
//                 My Profile
//               </h1>
//               <p className="text-gray-600">Manage your account settings and preferences</p>
//             </div>

//             {/* Profile Card */}
//             <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up">
//               {/* Cover Section */}
//               <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600 relative">
//                 <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
//                   <div className="relative">
//                     <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
//                       {previewUrl ? (
//                         <img
//                           src={previewUrl}
//                           alt="Profile Preview"
//                           className="w-full h-full object-cover"
//                         />
//                       ) : user.image?.[0]?.url ? (
//                         <img
//                           src={user.image[0].url}
//                           alt="Profile"
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
//                           <User className="w-12 h-12 text-white" />
//                         </div>
//                       )}
//                     </div>
                    
//                     {/* Camera Button */}
//                     <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 cursor-pointer transition-all duration-200 transform hover:scale-110 shadow-lg">
//                       <Camera className="w-4 h-4" />
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="hidden"
//                       />
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {/* Profile Form */}
//               <div className="pt-20 p-8">
//                 <div className="space-y-6">
//                   {/* Name Field */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <User className="w-4 h-4 text-purple-600" />
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={user.name}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
//                       placeholder="Enter your full name"
//                     />
//                   </div>

//                   {/* Email Field */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <Mail className="w-4 h-4 text-purple-600" />
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={user.email}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
//                       placeholder="Enter your email address"
//                     />
//                   </div>

//                   {/* Contact Field */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <Phone className="w-4 h-4 text-purple-600" />
//                       Contact Number
//                     </label>
//                     <input
//                       type="text"
//                       name="contact"
//                       value={user.contact}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
//                       placeholder="Enter your contact number"
//                     />
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-col sm:flex-row gap-4 pt-6">
//                     <button
//                       onClick={handleUpdate}
//                       disabled={isUpdating}
//                       className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                     >
//                       {isUpdating ? (
//                         <>
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           Updating...
//                         </>
//                       ) : (
//                         <>
//                           <Save className="w-4 h-4" />
//                           Update Profile
//                         </>
//                       )}
//                     </button>

//                     <button
//                       onClick={() => setShowDeleteConfirm(true)}
//                       className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                       Delete Account
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="mt-8 text-center">
//               <Link
//                 to="/"
//                 className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
//               >
//                 <ChevronDown className="w-4 h-4 transform rotate-90" />
//                 Back to Gallery
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Delete Confirmation Modal */}
//         {showDeleteConfirm && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-slide-up shadow-2xl">
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <AlertCircle className="w-8 h-8 text-red-600" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account</h3>
//                 <p className="text-gray-600 mb-6">
//                   Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
//                 </p>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => setShowDeleteConfirm(false)}
//                     className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => {
//                       handleDelete();
//                       setShowDeleteConfirm(false);
//                     }}
//                     className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// // Main HijabList Component
// export default function HijabList() {
//   const [styles, setStyles] = useState([]);
//   const [reviewText, setReviewText] = useState({});
//   const [reviewRating, setReviewRating] = useState({});
//   const [editingReview, setEditingReview] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [hoveredRating, setHoveredRating] = useState({});
//   const [showReviews, setShowReviews] = useState({});
//   const [showAddReview, setShowAddReview] = useState({});

//   const currentUser = getUser();

//   useEffect(() => {
//     fetchStyles();
//   }, []);

//   const fetchStyles = async () => {
//     setIsLoading(true);
//     try {
//       const res = await axios.get("http://localhost:7000/api/auth/hijabstyles", {
//         headers: { Authorization: `Bearer ${getToken()}` },
//       });
//       setStyles(res.data);
//     } catch (err) {
//       console.error("❌ Error fetching styles:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleReviews = (styleId) => {
//     setShowReviews(prev => ({
//       ...prev,
//       [styleId]: !prev[styleId]
//     }));
//   };

//   const toggleAddReview = (styleId) => {
//     setShowAddReview(prev => ({
//       ...prev,
//       [styleId]: !prev[styleId]
//     }));
//   };

//   const handleReviewSubmit = async (styleId) => {
//     try {
//       const text = reviewText[styleId] || "";
//       const rating = reviewRating[styleId];

//       if (!rating) {
//         alert("Please select a rating");
//         return;
//       }

//       await axios.post(
//         `http://localhost:7000/api/auth/hijabstyles/${styleId}/review`,
//         { text, rating },
//         { headers: { Authorization: `Bearer ${getToken()}` } }
//       );

//       setReviewText((prev) => ({ ...prev, [styleId]: "" }));
//       setReviewRating((prev) => ({ ...prev, [styleId]: undefined }));
//       setShowAddReview((prev) => ({ ...prev, [styleId]: false }));

//       fetchStyles();
//     } catch (error) {
//       console.error("❌ Error submitting review:", error);
//     }
//   };

//   const startEditing = (review) => {
//     setEditingReview((prev) => ({ ...prev, [review._id]: true }));
//     setReviewText((prev) => ({ ...prev, [review._id]: review.text }));
//     setReviewRating((prev) => ({ ...prev, [review._id]: review.rating }));
//   };

//   const cancelEditing = (reviewId) => {
//     setEditingReview((prev) => ({ ...prev, [reviewId]: false }));
//     setReviewText((prev) => ({ ...prev, [reviewId]: "" }));
//     setReviewRating((prev) => ({ ...prev, [reviewId]: undefined }));
//   };

//   const submitEdit = async (styleId, reviewId) => {
//     try {
//       const text = reviewText[reviewId] || "";
//       const rating = reviewRating[reviewId];

//       if (!rating) {
//         alert("Please select a rating");
//         return;
//       }

//       await axios.patch(
//         `http://localhost:7000/api/auth/hijabstyles/${styleId}/review/${reviewId}`,
//         { text, rating },
//         { headers: { Authorization: `Bearer ${getToken()}` } }
//       );

//       setEditingReview((prev) => ({ ...prev, [reviewId]: false }));
//       fetchStyles();
//     } catch (error) {
//       console.error("❌ Error editing review:", error);
//     }
//   };

//   const deleteReview = async (styleId, reviewId) => {
//     if (!window.confirm("Are you sure you want to delete this review?")) return;

//     try {
//       await axios.delete(
//         `http://localhost:7000/api/auth/hijabstyles/${styleId}/review/${reviewId}`,
//         { headers: { Authorization: `Bearer ${getToken()}` } }
//       );
//       fetchStyles();
//     } catch (error) {
//       console.error("❌ Error deleting review:", error);
//     }
//   };

//   const StarRating = ({ rating, onRatingChange, isInteractive = false, styleId, isHovered = false }) => {
//     return (
//       <div className="flex items-center gap-1">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Star
//             key={star}
//             className={`w-5 h-5 cursor-pointer transition-all duration-200 transform hover:scale-110 ${
//               star <= (hoveredRating[styleId] || rating)
//                 ? "text-yellow-400 fill-yellow-400"
//                 : "text-gray-300"
//             }`}
//             onClick={() => isInteractive && onRatingChange?.(star)}
//             onMouseEnter={() => isInteractive && setHoveredRating(prev => ({ ...prev, [styleId]: star }))}
//             onMouseLeave={() => isInteractive && setHoveredRating(prev => ({ ...prev, [styleId]: 0 }))}
//           />
//         ))}
//         {!isInteractive && <span className="ml-2 text-sm text-gray-600">({rating})</span>}
//       </div>
//     );
//   };

//   if (isLoading) {
//     return (
//       <>
//         <Navbar />
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
//           <div className="flex flex-col items-center">
//             <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
//             <p className="mt-4 text-lg text-purple-600 font-medium">Loading hijab styles...</p>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
//         <div className="container mx-auto px-4 py-8">
//           <div className="text-center mb-12 animate-fade-in">
//             <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
//               Hijab Styles Collection
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Discover beautiful and elegant hijab styles for every occasion
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {styles.map((style, index) => (
//               <div
//                 key={style._id}
//                 className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden animate-slide-up"
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 {/* Image Section */}
//                 <div className="relative overflow-hidden">
//                   <img
//                     src={style.image}
//                     alt={style.name}
//                     className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 </div>

//                 {/* Content Section */}
//                 <div className="p-6">
//                   <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
//                     {style.name}
//                   </h3>
//                   <p className="text-gray-600 mb-4 leading-relaxed">{style.description}</p>
                  
//                   <div className="flex items-center justify-between mb-6">
//                     <StarRating rating={style.averageRating} />
//                     <span className="text-sm text-gray-500">
//                       {style.reviews.length} review{style.reviews.length !== 1 ? 's' : ''}
//                     </span>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex items-center justify-between gap-3 mb-4">
//                     <button
//                       onClick={() => toggleReviews(style._id)}
//                       className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex-1"
//                     >
//                       <Eye className="w-4 h-4" />
//                       {showReviews[style._id] ? 'Hide Reviews' : 'View Reviews'}
//                       {showReviews[style._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//                     </button>

//                     <button
//                       onClick={() => toggleAddReview(style._id)}
//                       className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex-1"
//                     >
//                       <Plus className="w-4 h-4" />
//                       {showAddReview[style._id] ? 'Cancel' : 'Add Review'}
//                     </button>
//                   </div>

//                   {/* Add Review Form (Collapsible) */}
//                   {showAddReview[style._id] && (
//                     <div className="border border-purple-200 rounded-lg p-4 mb-4 bg-purple-50/30 animate-slide-down">
//                       <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                         <MessageCircle className="w-5 h-5 text-purple-600" />
//                         Leave a Review
//                       </h4>
                      
//                       <textarea
//                         placeholder="Share your thoughts about this style..."
//                         value={reviewText[style._id] || ""}
//                         onChange={(e) =>
//                           setReviewText((prev) => ({ ...prev, [style._id]: e.target.value }))
//                         }
//                         rows={3}
//                         className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
//                       />
                      
//                       <div className="flex items-center justify-between mt-4">
//                         <div className="flex flex-col gap-2">
//                           <span className="text-sm text-gray-600 font-medium">Rating:</span>
//                           <StarRating
//                             rating={reviewRating[style._id] || 0}
//                             onRatingChange={(rating) =>
//                               setReviewRating((prev) => ({ ...prev, [style._id]: rating }))
//                             }
//                             isInteractive={true}
//                             styleId={style._id}
//                           />
//                         </div>
                        
//                         <button
//                           onClick={() => handleReviewSubmit(style._id)}
//                           className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
//                         >
//                           <Send className="w-4 h-4" />
//                           Submit Review
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {/* Reviews Section (Collapsible) */}
//                   {showReviews[style._id] && (
//                     <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/30 animate-slide-down">
//                       <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                         <MessageCircle className="w-5 h-5 text-blue-600" />
//                         Reviews ({style.reviews.length})
//                       </h4>
                      
//                       {style.reviews.length === 0 ? (
//                         <div className="text-center py-8">
//                           <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//                           <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
//                         </div>
//                       ) : (
//                         <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
//                           {style.reviews.map((review) => {
//                             const isOwner = review.user._id === currentUser?._id;
                            
//                             return (
//                               <div
//                                 key={review._id}
//                                 className="bg-white rounded-lg p-4 transition-all duration-300 hover:bg-gray-50 shadow-sm border border-gray-100"
//                               >
//                                 <div className="flex items-start justify-between mb-2">
//                                   <div className="flex items-center gap-2">
//                                     <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
//                                       {(typeof review.user === "string" ? review.user : review.user.name || "A").charAt(0).toUpperCase()}
//                                     </div>
//                                     <span className="font-medium text-gray-700">
//                                       {typeof review.user === "string" ? review.user : review.user.name || "Anonymous"}
//                                     </span>
//                                   </div>
                                  
//                                   {isOwner && !editingReview[review._id] && (
//                                     <div className="flex gap-2">
//                                       <button
//                                         onClick={() => startEditing(review)}
//                                         className="text-gray-400 hover:text-purple-600 transition-colors duration-200 p-1"
//                                       >
//                                         <Edit3 className="w-4 h-4" />
//                                       </button>
//                                       <button
//                                         onClick={() => deleteReview(style._id, review._id)}
//                                         className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-1"
//                                       >
//                                         <Trash2 className="w-4 h-4" />
//                                       </button>
//                                     </div>
//                                   )}
//                                 </div>

//                                 {editingReview[review._id] ? (
//                                   <div className="space-y-3">
//                                     <textarea
//                                       rows={3}
//                                       value={reviewText[review._id] || ""}
//                                       onChange={(e) =>
//                                         setReviewText((prev) => ({ ...prev, [review._id]: e.target.value }))
//                                       }
//                                       className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
//                                     />
                                    
//                                     <div className="flex items-center justify-between">
//                                       <StarRating
//                                         rating={reviewRating[review._id] || 0}
//                                         onRatingChange={(rating) =>
//                                           setReviewRating((prev) => ({ ...prev, [review._id]: rating }))
//                                         }
//                                         isInteractive={true}
//                                         styleId={review._id}
//                                       />
                                      
//                                       <div className="flex gap-2">
//                                         <button
//                                           onClick={() => submitEdit(style._id, review._id)}
//                                           className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors duration-200 text-sm"
//                                         >
//                                           <Check className="w-3 h-3" />
//                                           Save
//                                         </button>
//                                         <button
//                                           onClick={() => cancelEditing(review._id)}
//                                           className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm"
//                                         >
//                                           <X className="w-3 h-3" />
//                                           Cancel
//                                         </button>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 ) : (
//                                   <div>
//                                     <StarRating rating={review.rating} />
//                                     <p className="text-gray-600 mt-2 leading-relaxed">{review.text}</p>
//                                   </div>
//                                 )}
//                               </div>
//                             );
//                           })}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <style jsx>{`
//           @keyframes fade-in {
//             from { opacity: 0; transform: translateY(20px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
          
//           @keyframes slide-up {
//             from { opacity: 0; transform: translateY(40px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
          
//           @keyframes slide-down {
//             from { opacity: 0; transform: translateY(-10px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
          
//           .animate-fade-in {
//             animation: fade-in 0.8s ease-out;
//           }
          
//           .animate-slide-up {
//             animation: slide-up 0.6s ease-out both;
//           }
          
//           .animate-slide-down {
//             animation: slide-down 0.3s ease-out;
//           }
          
//           .custom-scrollbar {
//             scrollbar-width: thin;
//             scrollbar-color: #d1d5db #f9fafb;
//           }
          
//           .custom-scrollbar::-webkit-scrollbar {
//             width: 6px;
//           }
          
//           .custom-scrollbar::-webkit-scrollbar-track {
//             background: #f9fafb;
//             border-radius: 3px;
//           }
          
//           .custom-scrollbar::-webkit-scrollbar-thumb {
//             background: #d1d5db;
//             border-radius: 3px;
//           }
          
//           .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//             background: #9ca3af;
//           }
//         `}</style>
//       </div>
//     </>
//   );
// }

import { useEffect, useState } from "react";
import { Star, Edit3, Trash2, Send, X, Check, Menu, User, LogOut, MessageCircle, Plus, ChevronDown, ChevronUp, Eye, Camera, Mail, Phone, Edit, Save, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken, getUser } from "../utils/auth";

// Enhanced Professional Navbar Component
function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/auth");
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-purple-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Hijab Gallery
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {token ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full hover:from-purple-100 hover:to-pink-100 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Hi, {userName || "User"}
                  </span>
                </Link>
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/auth"
                  className="px-4 py-2 border-2 border-purple-200 text-purple-600 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-medium"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-purple-100 pt-4 animate-slide-down">
            {token ? (
              <div className="space-y-3">
                <Link 
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                  Profile
                  </span>
                </Link>
                <button 
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link 
                  to="/auth"
                  className="block w-full text-center px-4 py-2 border-2 border-purple-200 text-purple-600 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="block w-full text-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

// Professional User Profile Component
export function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    contact: "",
    image: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:7000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("contact", user.contact);
    if (imageFile) formData.append("image", imageFile);

    try {
      const token = getToken();
      const res = await axios.put("http://localhost:7000/api/auth/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data.user);
      setImageFile(null);
      setPreviewUrl(null);
      
      // Success notification could be added here
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = getToken();
      const res = await axios.delete("http://localhost:7000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message);
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      navigate("/auth");
    } catch (err) {
      console.error("Error deleting profile", err);
      alert("Failed to delete profile. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-purple-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                My Profile
              </h1>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up">
              {/* Cover Section */}
              <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600 relative">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : user.image?.[0]?.url ? (
                        <img
                          src={user.image[0].url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                          <User className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Camera Button */}
                    <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 cursor-pointer transition-all duration-200 transform hover:scale-110 shadow-lg">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="pt-20 p-8">
                <div className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User className="w-4 h-4 text-purple-600" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail className="w-4 h-4 text-purple-600" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Contact Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Phone className="w-4 h-4 text-purple-600" />
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value={user.contact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your contact number"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isUpdating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Update Profile
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
              >
                <ChevronDown className="w-4 h-4 transform rotate-90" />
                Back to Gallery
              </Link>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-slide-up shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowDeleteConfirm(false);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Main HijabList Component
export default function HijabList() {
  const [styles, setStyles] = useState([]);
  const [reviewText, setReviewText] = useState({});
  const [reviewRating, setReviewRating] = useState({});
  const [editingReview, setEditingReview] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredRating, setHoveredRating] = useState({});
  const [showReviews, setShowReviews] = useState({});
  const [showAddReview, setShowAddReview] = useState({});

  const currentUser = getUser();

  useEffect(() => {
    fetchStyles();
  }, []);

  const fetchStyles = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:7000/api/auth/hijabstyles", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setStyles(res.data);
    } catch (err) {
      console.error("❌ Error fetching styles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReviews = (styleId) => {
    setShowReviews(prev => ({
      ...prev,
      [styleId]: !prev[styleId]
    }));
  };

  const toggleAddReview = (styleId) => {
    setShowAddReview(prev => ({
      ...prev,
      [styleId]: !prev[styleId]
    }));
  };

  const handleReviewSubmit = async (styleId) => {
    try {
      const text = reviewText[styleId] || "";
      const rating = reviewRating[styleId];

      if (!rating) {
        alert("Please select a rating");
        return;
      }

      await axios.post(
        `http://localhost:7000/api/auth/hijabstyles/${styleId}/review`,
        { text, rating },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setReviewText((prev) => ({ ...prev, [styleId]: "" }));
      setReviewRating((prev) => ({ ...prev, [styleId]: undefined }));
      setShowAddReview((prev) => ({ ...prev, [styleId]: false }));

      fetchStyles();
    } catch (error) {
      console.error("❌ Error submitting review:", error);
    }
  };

  const startEditing = (review) => {
    setEditingReview((prev) => ({ ...prev, [review._id]: true }));
    setReviewText((prev) => ({ ...prev, [review._id]: review.text }));
    setReviewRating((prev) => ({ ...prev, [review._id]: review.rating }));
  };

  const cancelEditing = (reviewId) => {
    setEditingReview((prev) => ({ ...prev, [reviewId]: false }));
    setReviewText((prev) => ({ ...prev, [reviewId]: "" }));
    setReviewRating((prev) => ({ ...prev, [reviewId]: undefined }));
  };

  const submitEdit = async (styleId, reviewId) => {
    try {
      const text = reviewText[reviewId] || "";
      const rating = reviewRating[reviewId];

      if (!rating) {
        alert("Please select a rating");
        return;
      }

      await axios.patch(
        `http://localhost:7000/api/auth/hijabstyles/${styleId}/review/${reviewId}`,
        { text, rating },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setEditingReview((prev) => ({ ...prev, [reviewId]: false }));
      fetchStyles();
    } catch (error) {
      console.error("❌ Error editing review:", error);
    }
  };

  const deleteReview = async (styleId, reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(
        `http://localhost:7000/api/auth/hijabstyles/${styleId}/review/${reviewId}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      fetchStyles();
    } catch (error) {
      console.error("❌ Error deleting review:", error);
    }
  };

  const StarRating = ({ rating, onRatingChange, isInteractive = false, styleId, isHovered = false }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 cursor-pointer transition-all duration-200 transform hover:scale-110 ${
              star <= (hoveredRating[styleId] || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => isInteractive && onRatingChange?.(star)}
            onMouseEnter={() => isInteractive && setHoveredRating(prev => ({ ...prev, [styleId]: star }))}
            onMouseLeave={() => isInteractive && setHoveredRating(prev => ({ ...prev, [styleId]: 0 }))}
          />
        ))}
        {!isInteractive && <span className="ml-2 text-sm text-gray-600">({rating})</span>}
      </div>
    );
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-purple-600 font-medium">Loading hijab styles...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
              Hijab Styles Collection
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover beautiful and elegant hijab styles for every occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {styles.map((style, index) => (
              <div
                key={style._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image Section */}
                <div className="relative overflow-hidden">
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                    {style.name}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{style.description}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <StarRating rating={style.averageRating} />
                    <span className="text-sm text-gray-500">
                      {style.reviews.length} review{style.reviews.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Professional Action Bar */}
                  <div className="bg-gray-50/80 rounded-xl p-4 mb-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleReviews(style._id)}
                          className={`group relative overflow-hidden px-4 py-2.5 rounded-lg border-2 transition-all duration-300 ${
                            showReviews[style._id] 
                              ? 'border-blue-200 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 relative z-10">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Reviews ({style.reviews.length})
                            </span>
                            {showReviews[style._id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </div>
                          <div className={`absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${showReviews[style._id] ? 'opacity-100' : ''}`}></div>
                        </button>

                        <div className="w-px h-8 bg-gray-200"></div>

                        <button
                          onClick={() => toggleAddReview(style._id)}
                          className={`group relative overflow-hidden px-4 py-2.5 rounded-lg border-2 transition-all duration-300 ${
                            showAddReview[style._id] 
                              ? 'border-purple-200 bg-purple-50 text-purple-700' 
                              : 'border-gray-200 bg-white text-gray-600 hover:border-purple-200 hover:text-purple-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 relative z-10">
                            <Edit3 className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {showAddReview[style._id] ? 'Cancel' : 'Write Review'}
                            </span>
                          </div>
                          <div className={`absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${showAddReview[style._id] ? 'opacity-100' : ''}`}></div>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{style.averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Add Review Form (Collapsible) */}
                  {showAddReview[style._id] && (
                    <div className="mb-6 animate-slide-down">
                      <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 border border-purple-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <Edit3 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-800">Write Your Review</h4>
                            <p className="text-sm text-gray-600">Share your experience with this hijab style</p>
                          </div>
                        </div>
                        
                        <div className="space-y-5">
                          {/* Rating Section */}
                          <div className="bg-white rounded-xl p-4 border border-gray-100">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Rate this style
                            </label>
                            <div className="flex items-center gap-3">
                              <StarRating
                                rating={reviewRating[style._id] || 0}
                                onRatingChange={(rating) =>
                                  setReviewRating((prev) => ({ ...prev, [style._id]: rating }))
                                }
                                isInteractive={true}
                                styleId={style._id}
                              />
                              {reviewRating[style._id] && (
                                <span className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                                  {reviewRating[style._id]} out of 5
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Text Review Section */}
                          <div className="bg-white rounded-xl p-4 border border-gray-100">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Your thoughts
                            </label>
                            <textarea
                              placeholder="What did you think about this hijab style? Share details about comfort, appearance, and overall experience..."
                              value={reviewText[style._id] || ""}
                              onChange={(e) =>
                                setReviewText((prev) => ({ ...prev, [style._id]: e.target.value }))
                              }
                              rows={4}
                              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none placeholder-gray-400 text-sm leading-relaxed"
                            />
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-400">
                                {reviewText[style._id]?.length || 0} characters
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() => toggleAddReview(style._id)}
                              className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleReviewSubmit(style._id)}
                              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium"
                            >
                              <Send className="w-4 h-4" />
                              Publish Review
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reviews Section (Collapsible) */}
                  {showReviews[style._id] && (
                    <div className="animate-slide-down">
                      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                              <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-800">Customer Reviews</h4>
                              <p className="text-sm text-gray-600">{style.reviews.length} reviews • {style.averageRating.toFixed(1)} average rating</p>
                            </div>
                          </div>
                          
                          {style.reviews.length > 0 && (
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold text-gray-800">{style.averageRating.toFixed(1)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      
                        {style.reviews.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <MessageCircle className="w-8 h-8 text-gray-400" />
                            </div>
                            <h5 className="text-lg font-semibold text-gray-800 mb-2">No reviews yet</h5>
                            <p className="text-gray-500 text-sm max-w-sm mx-auto">Be the first to share your experience with this beautiful hijab style.</p>
                          </div>
                        ) : (
                          <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                            {style.reviews.map((review, reviewIndex) => {
                              const isOwner = review.user._id === currentUser?._id;
                              
                              return (
                                <div
                                  key={review._id}
                                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                                  style={{ animationDelay: `${reviewIndex * 0.1}s` }}
                                >
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3">
                                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                        {(typeof review.user === "string" ? review.user : review.user.name || "A").charAt(0).toUpperCase()}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h6 className="font-semibold text-gray-800 text-sm">
                                            {typeof review.user === "string" ? review.user : review.user.name || "Anonymous"}
                                          </h6>
                                          {isOwner && (
                                            <span className="bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded-full font-medium">
                                              You
                                            </span>
                                          )}
                                        </div>
                                        <StarRating rating={review.rating} />
                                      </div>
                                    </div>
                                    
                                    {isOwner && !editingReview[review._id] && (
                                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                          onClick={() => startEditing(review)}
                                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                                        >
                                          <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => deleteReview(style._id, review._id)}
                                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  {editingReview[review._id] ? (
                                    <div className="space-y-4">
                                      <div className="bg-gray-50 rounded-lg p-3">
                                        <StarRating
                                          rating={reviewRating[review._id] || 0}
                                          onRatingChange={(rating) =>
                                            setReviewRating((prev) => ({ ...prev, [review._id]: rating }))
                                          }
                                          isInteractive={true}
                                          styleId={review._id}
                                        />
                                      </div>
                                      <textarea
                                        rows={3}
                                        value={reviewText[review._id] || ""}
                                        onChange={(e) =>
                                          setReviewText((prev) => ({ ...prev, [review._id]: e.target.value }))
                                        }
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none text-sm"
                                      />
                                      
                                      <div className="flex gap-2 justify-end">
                                        <button
                                          onClick={() => cancelEditing(review._id)}
                                          className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={() => submitEdit(style._id, review._id)}
                                          className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm"
                                        >
                                          <Check className="w-3 h-3" />
                                          Save Changes
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="mt-3">
                                      <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slide-down {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
          
          .animate-slide-up {
            animation: slide-up 0.6s ease-out both;
          }
          
          .animate-slide-down {
            animation: slide-down 0.3s ease-out;
          }
          
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #d1d5db #f9fafb;
          }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f9fafb;
            border-radius: 3px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 3px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
        `}</style>
      </div>
    </>
  );
}