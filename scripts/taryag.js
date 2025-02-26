
// Define a simple set of question-answer pairs
const responses = {
  "hello": "Hi there! How can I help you?",
  "how are you": "How you doing?",
  "1": "To know there is a God",
  "2": "Not to entertain thoughts of other gods besides Him",
  "3": "To unify God",
  "4": "To love God",
  "5": "To fear God",
  "6": "To sanctify God's Name",
  "7": "Not to profane God's Name",
  "8": "Not to destroy objects associated with God's Name",
  "9": "To listen to the prophet speaking in His Name",
  "10": "To remember the exodus from Egypt",
  "11": "To observe the Sabbath",
  "12": "To honor the Sabbath",
  "13": "Not to leave the boundaries of your city on the Sabbath",
  "14": "To sanctify the new month",
  "15": "To slaughter the Passover offering",
  "16": "To eat the Passover offering",
  "17": "Not to eat the Passover offering raw or boiled",
  "18": "Not to leave any meat from the Passover offering over until morning",
  "19": "Not to break any bones from the Passover offering",
  "20": "Not to take the Passover offering out of the group",
  "21": "To celebrate the festival of Shavuot",
  "22": "Not to do work on the first day of Shavuot",
  "23": "To bring a new meal offering on Shavuot",
  "24": "To celebrate the festival of Sukkot for seven days",
  "25": "Not to do work on the first day of Sukkot",
  "26": "To take up a Lulav and Etrog on the first day",
  "27": "To dwell in a Sukkah for seven days",
  "28": "To celebrate the festival of Rosh Hashanah",
  "29": "Not to do work on Rosh Hashanah",
  "30": "To hear the sound of the shofar on Rosh Hashanah",
  "31": "To fast on Yom Kippur",
  "32": "Not to do work on Yom Kippur",
  "33": "To confess sins on Yom Kippur",
  "34": "To repent from sin",
  "35": "To confess sins",
  "36": "Not to eat or drink on Yom Kippur",
  "37": "To celebrate the festival of Passover",
  "38": "Not to do work on the first day of Passover",
  "39": "Not to eat leaven on Passover",
  "40": "Not to eat mixtures containing leaven on Passover",
  "41": "Not to see leaven during Passover",
  "42": "Not to find leaven in your possession during Passover",
  "43": "To destroy all leaven before Passover",
  "44": "To relate the exodus from Egypt on that night",
  "45": "To eat matzah on the first night of Passover",
  "46": "Not to eat anything after the Passover lamb",
  "47": "Not to work on the intermediate days of Passover and Sukkot when it is not necessary",
  "48": "Not to work on the seventh day of Passover",
  "49": "To count forty-nine days from the time of the cutting of the Omer",
  "50": "To bring the Two Loaves to the Temple on Shavuot",
  "51": "To offer a sacrifice of well-being and to chant the Hallel on festivals",
  "52": "To rejoice on the festivals",
  "53": "To give gifts to the poor on the festivals",
  "54": "To assemble all Israelites on the Sukkot following the seventh year",
  "55": "To appear before the Lord during the festivals",
  "56": "Not to appear before the Lord without offerings",
  "57": "To bring all free-will offerings on the first subsequent festival",
  "58": "To decree a leap year",
  "59": "Not to break vows",
  "60": "To swear by His Name truthfully",
  "61": "Not to delay fulfilling vows",
  "62": "Not to break oaths",
  "63": "Not to test the prophet unduly",
  "64": "The court must execute by the sword",
  "65": "To appoint judges",
  "66": "To fear the court",
  "67": "Not to curse judges",
  "68": "Not to curse the head of state or leader",
  "69": "Not to curse any upstanding Jew",
  "70": "To pay a worker on the day the work was done",
  "71": "Not to withhold wages overnight",
  "72": "The hired worker may eat of the unharvested crops where he works",
  "73": "The hired worker may not take more than he can eat",
  "74": "Not to muzzle an ox while it is threshing",
  "75": "To give charity",
  "76": "Not to refrain from maintaining a poor man and giving him what he needs",
  "77": "To give a Hebrew servant gifts when he goes free",
  "78": "Not to send him away empty-handed",
  "79": "To lend to the poor and destitute",
  "80": "Not to press them for repayment if you know they don't have it",
  "81": "Not to refuse a loan to a poor man when you have the means",
  "82": "To release all loans during the Shemittah year",
  "83": "To exact the debts of an alien",
  "84": "Not to exact the debts of an Israelite",
  "85": "To give tithes to the poor (Maaser Ani) every third and sixth year",
  "86": "To read the confession of tithes every fourth and seventh year",
  "87": "To rest the land during the seventh year by not doing any work which enhances growth",
  "88": "Not to work the land during the seventh year",
  "89": "Not to harvest a crop normally as if it were your own in the seventh year",
  "90": "Not to gather the grapes which grow wild in the seventh year, as if it were your own vintage",
  "91": "To leave the produce of the land in the seventh year for the poor and for animals", 
  "92": "To release all Hebrew servants in the Jubilee year", 
  "93": "Not to work the land in the Jubilee year",
  "94": "Not to reap in the Jubilee year as in other years", 
  "95": "Not to gather the fruit in the Jubilee year as in other years", 
  "96": "To count the years to the Jubilee",
  "97": "To blow the shofar on Yom Kippur of the Jubilee year",
  "98": "To sanctify the fiftieth year",
  "99": "Not to sell the land permanently",
  "100": "To redeem the land that has been sold",
  "101": "Not to sell the land in Israel indefinitely",
  "102": "To grant redemption for houses in walled cities within a year",
  "103": "To redeem a Levite’s house in a walled city",
  "104": "Not to sell the field of the Levites",
  "105": "To give the Levites cities to dwell in and their surrounding fields",
  "106": "Not to change the boundaries of the Levites’ cities",
  "107": "Not to plant diverse seeds together",
  "108": "Not to crossbreed animals of different species",
  "109": "Not to work different kinds of animals together",
  "110": "Not to wear a garment made of wool and linen mixed together (Shaatnez)",
  "111": "Not to sow grain or vegetables in a vineyard",
  "112": "Not to eat fruit from a tree during its first three years (Orlah)",
  "113": "Not to eat diverse seeds planted in a vineyard",
  "114": "To sanctify the first fruits and bring them to the Temple",
  "115": "To recite the declaration upon bringing first fruits",
  "116": "To separate tithes from agricultural produce",
  "117": "To separate the First Tithe for the Levites",
  "118": "To separate the Second Tithe and eat it in Jerusalem",
  "119": "Not to consume the Second Tithe outside of Jerusalem",
  "120": "To redeem the Second Tithe if unable to bring it to Jerusalem",
  "121": "To give the Priests their due portions (Terumah)",
  "122": "To separate the Challah portion for the Kohen",
  "123": "Not to eat the Terumah while in a state of impurity",
  "124": "Not to eat unredeemed Second Tithe grain",
  "125": "Not to eat unredeemed Firstborn animal offerings",
  "126": "To bring the Firstborn of clean animals to the Temple",
  "127": "To redeem the firstborn son",
  "128": "To redeem a firstborn donkey",
  "129": "To break the neck of a firstborn donkey if it is not redeemed",
  "130": "Not to redeem the Firstborn of clean animals",
  "131": "To bring the offerings due from cattle and sheep",
  "132": "Not to delay the bringing of vows and offerings",
  "133": "To offer all sacrifices in the Temple",
  "134": "Not to slaughter sacrifices outside the Temple courtyard", 
  "135": "Not to eat sacrifices outside the designated area", 
  "136": "To bring all offerings to the Temple from outside Israel", 
  "137": "To treat the remains of sacrificial animals properly",
  "138": "Not to eat an offering that has become impure", 
  "139": "To burn the leftovers of offerings", 
  "140": "To eat peace offerings within the prescribed time",
  "141": "Not to eat from sacrifices beyond the permitted time", 
  "142": "Not to eat sacrifices that are disqualified", 
  "143": "To burn disqualified sacrifices",
  "144": "To bring all required offerings on the festivals", 
  "145": "To bring the Chagigah offering on the festivals",
  "146": "Not to eat Chametz (leavened bread) on Pesach",
  "147": "Not to possess Chametz on Pesach", 
  "148": "To destroy all Chametz before Pesach", 
  "149": "To eat Matzah on the first night of Pesach",
  "150": "To rest on the first day of Pesach", 
  "151": "To rest on the seventh day of Pesach", 
  "152": "To count the Omer for seven weeks",
  "153": "To rest on Shavuot", 
  "154": "To rest on Rosh Hashanah",
  "155": "To hear the Shofar on Rosh Hashanah",
  "156": "To rest on Yom Kippur", 
  "157": "To fast on Yom Kippur",
  "158": "To rest on the first day of Sukkot",
  "159": "To rest on Shemini Atzeret", 
  "160": "To dwell in a Sukkah during Sukkot",
  "161": "To take the Four Species (Lulav, Etrog, Hadassim, and Aravot) on Sukkot",
  "162": "Not to work on Shabbat", 
  "163": "To rest on Shabbat", 
  "164": "Not to light a fire on Shabbat", 
  "165": "Not to carry in a public domain on Shabbat",
  "166": "To sanctify the Shabbat day", 
  "167": "To honor one's father and mother", 
  "168": "Not to curse one’s parents", 
  "169": "Not to strike one's parents",
  "170": "Not to rebel against the Sanhedrin", 
  "171": "To appoint a king",
  "172": "Not to curse the king",
  "173": "Not to curse a judge",
  "174": "Not to testify falsely", 
  "175": "Not to testify on hearsay",
  "176": "Not to take a bribe", 
  "177": "Not to pervert justice", 
  "178": "To set aside cities of refuge for accidental killers",
  "179": "Not to take ransom for a murderer", 
  "180": "Not to oppress the stranger", 
  "181": "To love the stranger", 
  "182": "Not to mistreat widows and orphans",
  "183": "Not to lend with interest to a fellow Jew", 
  "184": "To return lost objects", 
  "185": "Not to ignore a lost object", 
  "186": "Not to hate a fellow Jew in your heart",
  "187": "To rebuke a fellow Jew when necessary",
  "188": "Not to take revenge",
  "189": "Not to bear a grudge", 
  "190": "To love your fellow Jew as yourself",
  "191": "Not to mistreat a hired worker",
  "192": "To pay a hired worker on time",
  "193": "Not to withhold wages", 
  "194": "Not to cheat in measures and weights", 
  "195": "To have honest scales and measures",
  "196": "Not to move boundary markers", 
  "197": "Not to wrong one another in business",
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
