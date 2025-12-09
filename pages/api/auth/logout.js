// pages/api/auth/logout.js
export default function handler(req, res) {
  // Clear cookies by setting expiration in the past
  res.setHeader("Set-Cookie", [
    `token=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`,
    `role=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`,
    `username=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
  ]);
  return res.status(200).json({ success: true });
}
