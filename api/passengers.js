import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await sql`SELECT * FROM passengers`;
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "POST") {
    const { name, age, type, date, fromCity, toCity, phone, airlines, comments } = req.body;

    console.log("Received data:", req.body); // Add this line for debugging

    if (!name || !age || !type || !date || !fromCity || !toCity || !phone || !airlines) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    try {
      const result = await sql`
        INSERT INTO passengers (name, age, type, date, "fromCity", "toCity", phone, airlines, comments)
        VALUES (${name}, ${age}, ${type}, ${date}, ${fromCity}, ${toCity}, ${phone}, ${airlines}, ${comments})
        RETURNING *
      `;
      console.log("Inserted data:", result.rows[0]); // Add this line for debugging
      res.status(201).json({ id: result.rows[0].id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
