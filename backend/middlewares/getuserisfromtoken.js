import jwt_decode from "jwt-decode";

export function getUserIdFromToken() {
  const token = getToken(); // your existing token getter
  if (!token) return null;

  try {
    const decoded = jwt_decode(token);
    return decoded.id;  // matches decoded.id in your backend
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
}
