import ExcelJS from "exceljs";

export default async function handler(req, res) {
  const { type, format, phc_id } = req.query;

  // Excel Export
  if (format === "xlsx") {
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Report");

      sheet.addRow(["Report Type", "PHC ID", "Generated On"]);
      sheet.addRow([type, phc_id, new Date().toISOString()]);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${type}.xlsx`
      );

      await workbook.xlsx.write(res);
      res.end();
      return;
    } catch (err) {
      console.error("Excel Error:", err);
      return res.status(500).json({ error: "Excel generation failed" });
    }
  }

  // CSV Export
  if (format === "csv") {
    const csv = "type,phc_id\n" + `${type},${phc_id}`;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${type}.csv`
    );
    return res.status(200).send(csv);
  }

  return res.status(400).json({ error: "Invalid format" });
}
