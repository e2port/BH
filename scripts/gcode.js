// gcode.js

// Set initial position at the center or a specific starting point
let currentPosition = { x: 50, y: 50 };

const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");

// Draw the initial point
function drawInitialPosition() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(currentPosition.x, currentPosition.y, 3, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
}
drawInitialPosition();

document.getElementById("submitBtn").addEventListener("click", function() {
  const command = document.getElementById("gcodeInput").value;
  runGcodeCommand(command);
});

function runGcodeCommand(cmd) {
  const parsed = parseGcode(cmd);
  if(parsed) {
    updateSimulation(parsed);
  } else {
    alert("Invalid G-code command!");
  }
}

function parseGcode(cmd) {
  // Trim and split the command into parts (e.g., "G1 X50 Y100")
  const parts = cmd.trim().split(" ");
  const commandType = parts[0].toUpperCase();

  // We are only handling movement commands (G0 or G1) in this simple example
  if (commandType === "G0" || commandType === "G1") {
    let x = currentPosition.x;
    let y = currentPosition.y;
    parts.forEach(part => {
      // Extract coordinate values if provided
      if (part.startsWith("X")) {
        x = parseFloat(part.substring(1));
      }
      if (part.startsWith("Y")) {
        y = parseFloat(part.substring(1));
      }
    });
    return { type: commandType, x, y };
  }
  // Return null for unsupported commands
  return null;
}

function updateSimulation(cmd) {
  // Draw a line from the current position to the new target position
  ctx.beginPath();
  ctx.moveTo(currentPosition.x, currentPosition.y);
  ctx.lineTo(cmd.x, cmd.y);
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Update current position
  currentPosition = { x: cmd.x, y: cmd.y };

  // Optionally draw a marker at the new position
  ctx.beginPath();
  ctx.arc(currentPosition.x, currentPosition.y, 3, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
}
