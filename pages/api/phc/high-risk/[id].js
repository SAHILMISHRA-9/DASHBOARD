import db from "../../../../utils/db";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const [rows] = await db.query(
      `SELECT * FROM health_records WHERE id = ?`,
      [id]
    );

    res.json({ success: true, record: rows[0] });
  } catch (e) {
    res.status(500).json({ success: false });
  }
}
