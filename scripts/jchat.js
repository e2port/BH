// Define a simple set of question-answer pairs
const responses = {
  "hello": "Hi there! How can I help you?",
  "how are you": "How you doing?",
  "yo": "whats up",
  "1": "Is the loneliest number",
  "2": "So much better than one",
  "3": "Booyah Kasha",
  "4": "Oy",
  "help": "I can only answer a few questions. Try saying hello, or ask how I am."
};

const defaultResponse = "I'm sorry, I don't understand that.";

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
