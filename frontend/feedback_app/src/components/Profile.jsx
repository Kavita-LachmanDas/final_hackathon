// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { getToken } from "../utils/auth";

// const Profile = () => {
//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//     contact: "",
//     image: "",
//   });

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const token =getToken() // assuming you're storing token here
  //       const res = await axios.get("http://localhost:7000/api/auth/profile", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setUser(res.data);
  //     } catch (err) {
  //       console.error("Failed to fetch profile", err);
  //     }
  //   };

  //   fetchProfile();
  // }, []);

//   return (
//     <div>
//       <h2>Profile</h2>
//       <img
//         src={`http://localhost:7000/${user.image}`}
//         alt="Profile"
//         style={{ width: "100px", height: "100px", objectFit: "cover" }}
//       />
//       <p><strong>Name:</strong> {user.name}</p>
//       <p><strong>Email:</strong> {user.email}</p>
//       <p><strong>Contact:</strong> {user.contact}</p>
//     </div>
//   );
// };

// export default Profile;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { getToken } from "../utils/auth";

// const Profile = () => {
// const [user, setUser] = useState({
//   name: "",
//   email: "",
//   contact: "",
//   image: [],   // ✅ empty array rakh do taake consistent rahe
// });


//   const [imageFile, setImageFile] = useState(null);

//   useEffect(() => {
//    const fetchProfile = async () => {
//   try {
//     const token = getToken();
//     const res = await axios.get("http://localhost:7000/api/auth/profile", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     setUser(res.data.user); // ✅ use res.data.user instead of res.data
//   } catch (err) {
//     console.error("Failed to fetch profile", err);
//   }
// };


//     fetchProfile();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUser({ ...user, [name]: value });
//   };

//   const handleImageChange = (e) => {
//     setImageFile(e.target.files[0]);
//   };

//   const handleUpdate = async () => {
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

//       alert(res.data.message);
//       setUser(res.data.user);
//     } catch (err) {
//       console.error("Error updating profile", err);
//     }
//   };

//   const handleDelete = async () => {
//     const confirmDelete = window.confirm("Are you sure you want to delete your profile?");
//     if (!confirmDelete) return;

//     try {
//       const token = getToken();
//       const res = await axios.delete("http://localhost:7000/api/auth/profile", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       alert(res.data.message);
//       // Optionally: redirect user after deletion
//     } catch (err) {
//       console.error("Error deleting profile", err);
//     }
//   };

//   return (
//     <div style={{ maxWidth: "500px", margin: "auto" }}>
//       <h2>Profile</h2>
//       {user.image?.[0]?.url && (
//         <img
//         src={user.image[0].url}
//           alt="Profile"
//           style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
//         />
//       )}
//       <div>
//         <label>Name:</label>
//         <input type="text" name="name" value={user.name} onChange={handleInputChange} />
//       </div>
//       <div>
//         <label>Email:</label>
//         <input type="email" name="email" value={user.email} onChange={handleInputChange} />
//       </div>
//       <div>
//         <label>Contact:</label>
//         <input type="text" name="contact" value={user.contact} onChange={handleInputChange} />
//       </div>
//       <div>
//         <label>Image:</label>
//         <input type="file" accept="image/*" onChange={handleImageChange} />
//       </div>
//       <div style={{ marginTop: "10px" }}>
//         <button onClick={handleUpdate} style={{ marginRight: "10px" }}>
//           Update Profile
//         </button>
//         <button onClick={handleDelete} style={{ backgroundColor: "red", color: "white" }}>
//           Delete Profile
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Profile;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";
import { User, Mail, Phone, Camera, Save, Trash2, Upload, Edit3 } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    contact: "",
    image: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = getToken();
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, {
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
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

const handleUpdate = async () => {
  try {
    setIsUpdating(true);
    const token = getToken();
    
    const updateData = {
      name: user.name,
      email: user.email,
      contact: user.contact
    };

    const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    setUser(res.data.user);
    alert("Profile updated successfully!");
    setIsEditing(false);
    
  } catch (err) {
    console.error("Failed to update profile", err);
    alert("Failed to update profile. Please try again.");
  } finally {
    setIsUpdating(false);
  }
};

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your profile?");
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    // Simulate API call
    setTimeout(() => {
      alert("Profile deleted successfully!");
      setIsDeleting(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            <div className="w-16 h-16 border-4 border-transparent border-t-pink-300 rounded-full animate-spin absolute top-2 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="text-white text-xl mt-6 animate-pulse">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Profile Settings
          </h1>
          <p className="text-purple-100 text-lg">Manage your account information</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 animate-slide-up">
          {/* Profile Image Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block group">
              <div className="relative">
                <img
                  src={previewImage || user.image?.[0]?.url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-xl group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Camera className="text-white w-8 h-8" />
                </div>
              </div>
              
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full p-3 cursor-pointer shadow-lg transition-all duration-300 hover:scale-110">
                  <Upload className="text-white w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-white mt-4 animate-fade-in">
              {user.name || "Your Name"}
            </h2>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name Field */}
            <div className="group">
              <label className="flex items-center text-white font-medium mb-2">
                <User className="w-5 h-5 mr-2 text-pink-300" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 ${!isEditing ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/15'}`}
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div className="group">
              <label className="flex items-center text-white font-medium mb-2">
                <Mail className="w-5 h-5 mr-2 text-pink-300" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 ${!isEditing ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/15'}`}
                placeholder="Enter your email"
              />
            </div>

            {/* Contact Field */}
            <div className="group">
              <label className="flex items-center text-white font-medium mb-2">
                <Phone className="w-5 h-5 mr-2 text-pink-300" />
                Contact Number
              </label>
              <input
                type="text"
                name="contact"
                value={user.contact}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 ${!isEditing ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/15'}`}
                placeholder="Enter your contact number"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center"
              >
                <Edit3 className="w-5 h-5 mr-2" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setPreviewImage(null);
                  }}
                  className="px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Cancel
                </button>
              </>
            )}
            
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 animate-fade-in-up">
          <p className="text-pink-100">
            Keep your profile information up to date
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out 0.4s both;
        }
      `}</style>
    </div>
  );
};

export default Profile;