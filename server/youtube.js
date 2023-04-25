import youtubeDl from "youtube-dl-exec";
import fs from "fs";
import { parseStringPromise } from "xml2js";

export async function getVideoSubs(videoID) {
  return await youtubeDl(`https://www.youtube.com/watch?v=${videoID}`, {
    skipDownload: true,
    writeAutoSub: true,
    subFormat: "ttml",
    subLang: "en",
    output: "./subs/%(id)s.%(ext)s",
  });
}

export async function parseSubs(videoID) {
  try {
    const files = await fs.readdirSync("./subs/");
    let xml = "";
    if (!files.includes(`${videoID}.en.ttml`)) {
      await getVideoSubs(videoID);
      xml = await fs.readFileSync(`./subs/${videoID}.en.ttml`, "utf8");
    } else {
      xml = await fs.readFileSync(`./subs/${videoID}.en.ttml`, "utf8");
    }
    const json = await parseStringPromise(xml);
    const text = json?.tt?.body?.[0]?.div?.[0]?.p;
    const output = text?.map((p) => p._);
    return output.join(" ");
  } catch (e) {
    return null;
  }
}
