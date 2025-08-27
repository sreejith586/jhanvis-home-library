const express = require("express");
const axios = require("axios");
const { google } = require("googleapis");
const { onRequest } = require("firebase-functions/v2/https");

const SHEET_ID = "1agbGWFVoz8_zrOi-3DnTZAd6uShJK7u4q3Xs6UTPn8Y";
const RANGE = "Sheet1!A2:K";
const RATE_LIMIT_MS = 500; // ⏱️ Delay between requests to avoid quota issues

const app = express();
app.use(express.json());

// 🔍 Health check
app.get("/", (req, res) => {
  res.status(200).send("Health check OK");
});

// 📚 Manual enrichment route
app.post("/manual", async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).send("Missing title or author");
    }

    const { coverUrl, genres } = await fetchBookData(title, author);
    res.status(200).send({ title, author, coverUrl, genres });
  } catch (error) {
    console.error("Error enriching manual input:", error.message);
    res.status(500).send("Something went wrong.");
  }
});

// 🧠 Smart enrichment with rate limiting + status tracking
app.post("/enrichAllBooks", async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });

    const sheetData = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    const rows = sheetData.data.values;
    const updatedRows = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const title = row[1];
      const author = row[3];
      const status = row[8] || "Pending";

      if (status === "Enriched" || !title || !author || row.length < 4) continue;

      try {
        const { coverUrl, genres } = await fetchBookData(title, author);
        const cover = coverUrl || "No cover found";
        const genreText = genres.slice(0, 2).join(", ");
        const newStatus = coverUrl.includes("Error") ? "Error" : "Enriched";

        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `Sheet1!G${i + 2}:I${i + 2}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[cover, genreText, newStatus]],
          },
        });

        console.log(`✅ Row ${i + 2} enriched:`, { title, author, status: newStatus });
        updatedRows.push({ title, author, status: newStatus });
      } catch (rowError) {
        console.error(`❌ Failed to enrich row ${i + 2}:`, rowError.message);
      }

      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS)); // ⏳ Rate limit
    }

    res.status(200).send({
      message: "Enrichment complete",
      updated: updatedRows.length,
      details: updatedRows,
    });
  } catch (error) {
    console.error("🔥 Error enriching sheet:", error.message);
    res.status(500).send("Failed to enrich sheet");
  }
});

// 🔧 Helper: Fetch cover + genres
async function fetchBookData(title, author) {
  try {
    const query = `${title} ${author}`;
    const searchRes = await axios.get(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
    );
    const book = searchRes.data.docs[0];

    const coverUrl = book?.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      : "No cover found";

    let genres = ["Unknown genre"];
    if (book?.key) {
      const workRes = await axios.get(`https://openlibrary.org${book.key}.json`);
      const rawSubjects = workRes.data.subjects || [];

      genres = rawSubjects
        .filter(sub =>
          sub.length < 30 &&
          !sub.includes("(") &&
          !sub.match(/^[A-Z][a-z]+\s\([^)]+\)$/)
        )
        .slice(0, 3);
    }

    return { coverUrl, genres };
  } catch (err) {
    console.error(`Error fetching data for "${title}" by "${author}":`, err.message);
    return { coverUrl: "Error fetching cover", genres: ["Error fetching genre"] };
  }
}

exports.enrichBookData = onRequest({ timeoutSeconds: 300 }, app);