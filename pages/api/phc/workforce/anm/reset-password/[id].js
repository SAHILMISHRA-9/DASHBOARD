import { getANM, updateANM } from "../../../../../../data/anmDb";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Generate a temporary password
  const newPassword = "ANM" + Math.floor(100000 + Math.random() * 900000);

  const updated = updateANM(Number(id), { password: newPassword });

  if (!updated) {
    return res.status(404).json({ error: "ANM not found" });
  }

  return res.status(200).json({
    message: "Password reset successfully",
    newPassword,
  });
}
