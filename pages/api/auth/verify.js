// pages/api/auth/verify.js
export default function handler(req, res) {
  // Read cookies (Next.js pages/api: cookies available on req.headers.cookie)
  const cookieHeader = req.headers.cookie || "";
  // quick parse helper (very small)
  const parseCookies = (str = "") =>
    Object.fromEntries(str.split(";").map(s => {
      const idx = s.indexOf("=");
      if (idx === -1) return ["", ""];
      const k = s.slice(0, idx).trim();
      const v = s.slice(idx + 1).trim();
      return [k, decodeURIComponent(v)];
    }).filter(([k]) => k));

  const cookies = parseCookies(cookieHeader);
  const token = cookies.token || null;
  const role = cookies.role || null;
  const username = cookies.username || null;

  if (!token) {
    return res.status(200).json({ authenticated: false });
  }

  return res.status(200).json({
    authenticated: true,
    user: { role, name: username }
  });
}
