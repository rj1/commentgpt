import express from "express";
import bodyParser from "body-parser";
import { parseSubs } from "./youtube.js";
import { generateComment } from "./openai.js";

const app = express();
const port = 3000;

app.disable("x-powered-by");
app.use(bodyParser.json());

// allow cors for dev
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", (req, res) => {
  res.send("welcome to commentgpt");
});

app.post("/comment/:id", async (req, res) => {
  function validateId(id) {
    return id.length === 11;
  }
  if (!validateId(req.params.id)) {
    return res.status(400).json({ error: "invalid video id" });
  }

  function validateSentiment(sentiment) {
    const validSentiments = [
      "positive",
      "negative",
      "encouraging",
      "chaotic",
      "neutral",
      "surprised",
      "amused",
      "confused",
      "sympathetic",
      "excited",
      "optimistic",
      "proud",
      "disappointed",
      "frustrated",
      "hopeful",
      "sad",
    ];

    if (validSentiments.includes(sentiment)) {
      return sentiment;
    }

    return false;
  }

  if (!validateSentiment(req.body.sentiment)) {
    return res.status(400).json({ error: "invalid sentiment" });
  }

  const sentiment = req.body.sentiment;

  let subs = await parseSubs(req.params.id);

  if (!subs) {
    return res.status(400).json({ error: "we can't generate a comment for this video, sorry" });
  }

  let comment = await generateComment(subs, sentiment);

  let response = {
    id: req.params.id,
    sentiment: sentiment,
    comment: comment,
  };

  res.send(response);
});

app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`);
});
