import express from "express";
import cors from "cors";
import pg from "pg";

import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const db = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});
db.connect();

const loveLanguageSongs = {
  "Words of Affirmation": {
    song: "Perfect - Ed Sheeran",
    link: "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
    gif: "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif", 
    message: "You love sweet words and appreciation! 💕",
  },
  "Acts of Service": {
    song: "Count On Me - Bruno Mars",
    link: "https://www.youtube.com/watch?v=yJYXItns2ik",
    gif: "https://media.giphy.com/media/l4FGI8GoTL7N4DsyI/giphy.gif",
    message: "Actions speak louder than words for you! 💖",
  },
  "Receiving Gifts": {
    song: "Just The Way You Are - Bruno Mars",
    link: "https://www.youtube.com/watch?v=LjhCEhWiKXk",
    gif: "https://media.giphy.com/media/JltOMwYmi0VrO/giphy.gif",
    message: "You love meaningful surprises! 🎁✨",
  },
  "Quality Time": {
    song: "Lucky - Jason Mraz & Colbie Caillat",
    link: "https://www.youtube.com/watch?v=acvIVA9-FMQ",
    gif: "https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif", 
    message: "Spending time together is your love language! ⏳❤️",
  },
  "Physical Touch": {
    song: "Thinking Out Loud - Ed Sheeran",
    link: "https://www.youtube.com/watch?v=lp-EO5I60KA",
    gif: "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
    message: "Hugs and cuddles make you feel loved! 🤗💕",
  },
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/analyze", async (req, res) => {
  try {
    const { answers, name } = req.body;
    const counts = {};

    answers.forEach((answer) => {
      counts[answer] = (counts[answer] || 0) + 1;
    });

    const detectedLoveLanguage = Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );

    const recommend = loveLanguageSongs[detectedLoveLanguage];

   
    await db.query(
      "INSERT INTO lover (name, answers, loveLanguage) VALUES ($1, $2, $3)",
      [name, JSON.stringify(answers), detectedLoveLanguage]
    );

    res.json({
      result: detectedLoveLanguage,
      gif: recommend.gif,
      song: recommend.song,
      msg: recommend.message,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/names", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM lover");
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    res.json({ success: true, data: result.rows });
    console.log("Fetched Data:", result.rows);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.listen(3001, () => console.log("Server ready on port 3000."));
