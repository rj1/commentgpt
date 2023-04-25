import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_NAME,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function generateComment(subText, sentiment) {
  // cut off the text at 1024 tokens, 1 token is ~4 characters
  if (subText.length > 4096) {
    subText = subText.substring(0, 4096);
  }

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are an assistant that generates ${sentiment} comments on YouTube videos, based on the content of the subtitles. I'll send you the subtitle text, and you write a short, ${sentiment} comment. Please don't encapsulate the comment in quotes. Only include the comment that would fit into the youtube comment section.`,
      },
      { role: "user", content: subText },
    ],
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });

  let comment = response.data.choices[0].message.content;
  comment = comment.replace(/"/g, "");

  return comment;
}
