import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await query(`
          SELECT 
            request_id, 
            request_title, 
            request_type, 
            request_status,
            request_note,
            request_optional,
            request_timestamp
          FROM requests
          WHERE
            request_status = 'Complete'
          AND
            request_timestamp > NOW() - interval '14' day
          ORDER BY
            request_timestamp DESC;
        `);

    if (result && result.rows && result.rows.length === 0) {
      return res.status(200).json([]);
    }

    res.json(result.rows || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
