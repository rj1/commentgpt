const API_ENDPOINT = "http://localhost:3000/comment/";

const sentiments = [
  { name: "positive", emoji: "😎" },
  { name: "negative", emoji: "😠" },
  { name: "encouraging", emoji: "🙏" },
  { name: "chaotic", emoji: "🫠" },
  { name: "neutral", emoji: "😐" },
  { name: "surprised", emoji: "😲" },
  { name: "amused", emoji: "😆" },
  { name: "confused", emoji: "🤔" },
  { name: "sympathetic", emoji: "😢" },
  { name: "excited", emoji: "🤩" },
  { name: "optimistic", emoji: "😊" },
  { name: "proud", emoji: "🤗" },
  { name: "disappointed", emoji: "😔" },
  { name: "frustrated", emoji: "😤" },
  { name: "hopeful", emoji: "🤞" },
  { name: "sad", emoji: "😢" },
];

const sentimentSection = document.getElementById("sentiments");
const sentimentButtons = document.querySelectorAll(".sentiment");
const comment = document.getElementById("comment");
const videoUrl = document.getElementById("video");

const toggleButtons = (disabled) => {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.disabled = disabled;
    button.style.pointerEvents = disabled ? "none" : "auto";
    button.style.transition = disabled
      ? "all 1s ease"
      : "transform 0.15s ease-in-out";
    button.style.backgroundColor = disabled ? "grey" : "";
  });
};

const validateYoutubeUrl = (url) => {
  if (url != undefined || url != "") {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    }
  }
  return false;
};

const typewriter = async (string) => {
  toggleButtons(true);
  comment.innerHTML = "";
  for (let i = 0; i < string.length; i++) {
    comment.innerHTML += string.charAt(i);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  toggleButtons(false);
};

const app = () => {
  sentiments.forEach((sentiment) => {
    const { name, emoji } = sentiment;
    const button = document.createElement("button");
    button.setAttribute("name", name);
    button.classList.add("sentiment");
    button.classList.add(name);
    button.innerHTML = `<h2> #${name} ${emoji}</h2>`;
    sentimentSection.appendChild(button);
    button.addEventListener("click", async () => {
      comment.innerHTML = `<span style="color:white"><img width="32" height="32" src="/spinner.svg" /></span>`;
      toggleButtons(true);
      const videoId = validateYoutubeUrl(videoUrl.value);
      if (!videoId) {
        comment.innerHTML = `<span style="color:red">error: invalid youtube url</span>`;
        return;
      }
      try {
        const requestData = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sentiment: name,
          }),
        };
        const response = await fetch(`${API_ENDPOINT}${videoId}`, requestData);
        const data = await response.json();
        await typewriter(data.comment);
      } catch (error) {
        comment.innerHTML = `<span style="color:red">error</span>`;
        toggleButtons(false);
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  app();
});
