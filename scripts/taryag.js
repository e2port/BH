// Define a simple set of question-answer pairs
const responses = {
  "hello": "Hi there! How can I help you?",
  "how are you": "How you doing?",
  "yo": "whats up",
  "1": "Is the loneliest number",
  "2": "So much better than one",
  "3": "Booyah Kasha",
  "4": "Oy",
  "shabbat": "What's the best thing about Shabbat? No ringtone interruptions during your nap!",
  "latkes": "Why are latkes so good at basketball? Because they always make great turnovers!",
  "challah": "Why did the challah go to therapy? It needed help with its inner kneads!",
  "matzah": "Why is matzah plain? It's afraid of committing a flavor sin!",
  "sukkah": "How do you throw a space-themed Sukkot party? You planet!",
  "hanukkah": "What’s the best exercise during Hanukkah? Walking off the latkes from house to house!",
  "kippah": "Why did the kippah never get lost? Because it always kept its head!",
  "kosher": "Why was the smartphone kosher? It had a kosher app!",
  "hamentashen": "Why do hamentashen always lose at poker? They always fold!",
  "mezuzah": "Why did the mezuzah go on Shark Tank? To stick with a great deal!",
  "mensch": "What do you call a potato that acts like a decent human being? A mensch-tato!",
  "shofar": "Why do we blow the shofar? To traffic-jam all evil intentions!",
  "simchat torah": "What dance do you do on Simchat Torah? The scroll and shuffle!",
  "purim": "Why do we raise noise on Purim? To get our point across in stereo!",
  "dreidel": "Why did the dreidel apply for a job? It wanted to make a good spin-pression!",
  "passover": "What do you call someone who derives pleasure from the bread of affliction? A matzah-chist!",
  "yom kippur": "What’s the hardest part about fasting on Yom Kippur? Keeping your composure when dreaming of bagels!",
  "gelt": "Why is Hanukkah gelt like a good joke? It makes cents!"
  "help": "Hashem please send help"
};

const defaultResponse = "What what what, say that again?";

// Grab elements from the DOM
const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Function to add a message to the chatbox
function addMessage(message, sender) {
  const messageElem = document.createElement("div");
  messageElem.className = sender === "user" ? "userMessage" : "botMessage";
  messageElem.textContent = message;
  chatbox.appendChild(messageElem);
  // Keep chatbox scrolled to the bottom
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Main function to handle user input
function handleInput() {
  const text = userInput.value.trim().toLowerCase();
  if (text.length === 0) return;
  
  // Display user message
  addMessage(text, "user");
  
  // Check if user input matches a known question
  let reply = defaultResponse;
  if (responses[text]) {
    reply = responses[text];
  }
  
  // Display bot response
  addMessage(reply, "bot");
  
  // Clear the input
  userInput.value = "";
}

// Event listeners
sendBtn.addEventListener("click", handleInput);
userInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    handleInput();
  }
});
