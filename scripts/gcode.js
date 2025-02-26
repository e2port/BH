// Global variables and settings
const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");
const gridSpacing = 20;         // Grid spacing in pixels
const animationDuration = 500;  // Duration for move animations (ms)
const origin = { x: canvas.width / 2, y: canvas.height / 2 }; // Center of canvas
let currentPosition = { ...origin };
let segments = [];      // Stores completed movement segments
let commandCount = 0;   // Counts commands executed before auto-reset
let isAnimating = false;
let absoluteMode = true;  // Default: absolute mode

// Draw grid with center as origin
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw light grid lines
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;
  
  // Vertical grid lines
  for (let x = origin.x; x <= canvas.width; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let x = origin.x; x >= 0; x -= gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  // Horizontal grid lines
  for (let y = origin.y; y <= canvas.height; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  for (let y = origin.y; y >= 0; y -= gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  
  // Draw darker axis lines through the center
  ctx.strokeStyle = "#aaa";
  ctx.lineWidth = 2;
  // Vertical axis
  ctx.beginPath();
  ctx.moveTo(origin.x, 0);
  ctx.lineTo(origin.x, canvas.height);
  ctx.stroke();
  // Horizontal axis
  ctx.beginPath();
  ctx.moveTo(0, origin.y);
  ctx.lineTo(canvas.width, origin.y);
  ctx.stroke();
}

// Redraw grid, previous segments, and current marker.
function redraw() {
  drawGrid();
  
  // Draw stored segments
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  segments.forEach(segment => {
    ctx.beginPath();
    ctx.moveTo(segment.start.x, segment.start.y);
    ctx.lineTo(segment.end.x, segment.end.y);
    ctx.stroke();
  });
  
  // Draw current position marker
  drawMarker(currentPosition);
}

// Draw a red marker at a given position.
function drawMarker(pos) {
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
}

// Enhanced parser for a single G-code command string.
// Supports G0/G1 for linear moves, G2/G3 for arcs, and G90/G91 for mode switches.
// Coordinates are interpreted based on the current mode:
//   - Absolute mode: X/Y values are offsets from the origin.
//   - Relative mode: X/Y values are relative to the current position.
// For arc commands (G2/G3), I and J specify offsets from the start position to the arc center.
function parseGcodeCommand(cmdString) {
  let trimmed = cmdString.split(';')[0].trim(); // Remove comments
  if (trimmed === "") return null;
  let parts = trimmed.split(/\s+/);
  let command = parts[0].toUpperCase();

  // Mode commands: G90 and G91
  if (command === "G90") {
    absoluteMode = true;
    return { type: "MODE", mode: "absolute" };
  }
  if (command === "G91") {
    absoluteMode = false;
    return { type: "MODE", mode: "relative" };
  }

  // Linear move commands: G0 and G1
  if (command === "G0" || command === "G1") {
    let newX = absoluteMode ? origin.x : currentPosition.x;
    let newY = absoluteMode ? origin.y : currentPosition.y;
    let feed = null;
    for (let i = 1; i < parts.length; i++) {
      let letter = parts[i].charAt(0).toUpperCase();
      let value = parseFloat(parts[i].substring(1));
      if (letter === "X") {
        newX = (absoluteMode ? origin.x : currentPosition.x) + value;
      } else if (letter === "Y") {
        newY = (absoluteMode ? origin.y : currentPosition.y) - value;
      } else if (letter === "F") {
        feed = value; // Feed rate (not used in simulation)
      }
    }
    return { type: command, x: newX, y: newY, feed: feed };
  }

  // Arc move commands: G2 and G3
  if (command === "G2" || command === "G3") {
    let newX = absoluteMode ? origin.x : currentPosition.x;
    let newY = absoluteMode ? origin.y : currentPosition.y;
    let I = 0, J = 0;
    let feed = null;
    for (let i = 1; i < parts.length; i++) {
      let letter = parts[i].charAt(0).toUpperCase();
      let value = parseFloat(parts[i].substring(1));
      if (letter === "X") {
        newX = (absoluteMode ? origin.x : currentPosition.x) + value;
      } else if (letter === "Y") {
        newY = (absoluteMode ? origin.y : currentPosition.y) - value;
      } else if (letter === "I") {
        I = value;
      } else if (letter === "J") {
        J = value;
      } else if (letter === "F") {
        feed = value;
      }
    }
    // For arcs, I and J are always incremental offsets from the start.
    let center = { x: currentPosition.x + I, y: currentPosition.y - J };
    return { type: command, x: newX, y: newY, center: center, feed: feed };
  }

  // Unknown or unsupported command.
  return null;
}

// Animate a linear move from start to end over the specified duration.
function animateLine(start, end, duration, callback) {
  let startTime = null;
  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    let elapsed = timestamp - startTime;
    let progress = Math.min(elapsed / duration, 1);
    
    let currentX = start.x + (end.x - start.x) * progress;
    let currentY = start.y + (end.y - start.y) * progress;
    
    redraw();
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();
    drawMarker({ x: currentX, y: currentY });
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      callback();
    }
  }
  requestAnimationFrame(animate);
}

// Animate an arc move. The arc is drawn from start, around center with the given radius,
// from startAngle to endAngle. The anticlockwise flag determines sweep direction.
function animateArc(start, center, radius, startAngle, endAngle, anticlockwise, duration, callback) {
  let startTime = null;
  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    let elapsed = timestamp - startTime;
    let progress = Math.min(elapsed / duration, 1);
    
    // Compute total angular distance and current angle
    let totalAngle;
    if (!anticlockwise) {
      totalAngle = startAngle - endAngle;
      if (totalAngle < 0) totalAngle += 2 * Math.PI;
      let currentAngle = startAngle - totalAngle * progress;
      redraw();
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, startAngle, currentAngle, true);
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.stroke();
      let currentX = center.x + radius * Math.cos(currentAngle);
      let currentY = center.y + radius * Math.sin(currentAngle);
      drawMarker({ x: currentX, y: currentY });
    } else {
      totalAngle = endAngle - startAngle;
      if (totalAngle < 0) totalAngle += 2 * Math.PI;
      let currentAngle = startAngle + totalAngle * progress;
      redraw();
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, startAngle, currentAngle, false);
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.stroke();
      let currentX = center.x + radius * Math.cos(currentAngle);
      let currentY = center.y + radius * Math.sin(currentAngle);
      drawMarker({ x: currentX, y: currentY });
    }
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      callback();
    }
  }
  requestAnimationFrame(animate);
}

// Reset simulation: clear segments and return to origin.
function resetSimulation() {
  segments = [];
  commandCount = 0;
  currentPosition = { ...origin };
  redraw();
}

// Process an array of G-code commands sequentially.
function runCommandsSequentially(commands, index = 0) {
  if (index >= commands.length) {
    document.getElementById("submitBtn").disabled = false;
    isAnimating = false;
    return;
  }
  
  let commandObj = parseGcodeCommand(commands[index]);
  if (commandObj === null) {
    alert("Invalid command: " + commands[index]);
    runCommandsSequentially(commands, index + 1);
    return;
  }
  
  // Handle mode commands immediately.
  if (commandObj.type === "MODE") {
    console.log("Switched to " + commandObj.mode + " mode.");
    runCommandsSequentially(commands, index + 1);
    return;
  }
  
  // For linear moves (G0/G1)
  if (commandObj.type === "G0" || commandObj.type === "G1") {
    let start = { ...currentPosition };
    let end = { x: commandObj.x, y: commandObj.y };
    animateLine(start, end, animationDuration, () => {
      segments.push({ start: start, end: end });
      currentPosition = { ...end };
      commandCount++;
      redraw();
      // Reset simulation after every 3 moves.
      if (commandCount >= 3) {
        setTimeout(() => {
          resetSimulation();
          runCommandsSequentially(commands, index + 1);
        }, 500);
      } else {
        runCommandsSequentially(commands, index + 1);
      }
    });
    return;
  }
  
  // For arc moves (G2/G3)
  if (commandObj.type === "G2" || commandObj.type === "G3") {
    let start = { ...currentPosition };
    let center = commandObj.center;
    let radius = Math.sqrt(Math.pow(start.x - center.x, 2) + Math.pow(start.y - center.y, 2));
    let startAngle = Math.atan2(start.y - center.y, start.x - center.x);
    let endAngle = Math.atan2(commandObj.y - center.y, commandObj.x - center.x);
    let anticlockwise = (commandObj.type === "G3");
    
    animateArc(start, center, radius, startAngle, endAngle, anticlockwise, animationDuration, () => {
      segments.push({ start: start, end: { x: commandObj.x, y: commandObj.y } });
      currentPosition = { x: commandObj.x, y: commandObj.y };
      commandCount++;
      redraw();
      if (commandCount >= 8) {
        setTimeout(() => {
          resetSimulation();
          runCommandsSequentially(commands, index + 1);
        }, 500);
      } else {
        runCommandsSequentially(commands, index + 1);
      }
    });
    return;
  }
  
  // Unknown command type
  runCommandsSequentially(commands, index + 1);
}

// Split input text into individual commands and process sequentially.
function runGcodeCommand(input) {
  let commands = input.split("\n").map(line => line.trim()).filter(line => line.length > 0);
  if (commands.length === 0) return;
  document.getElementById("submitBtn").disabled = true;
  isAnimating = true;
  runCommandsSequentially(commands);
}

// Event listener for running commands.
document.getElementById("submitBtn").addEventListener("click", function() {
  if (!isAnimating) {
    const input = document.getElementById("gcodeInput").value;
    runGcodeCommand(input);
    document.getElementById("gcodeInput").value = "";
  }
});

// Help modal functionality.
document.getElementById("helpBtn").addEventListener("click", function() {
  document.getElementById("helpModal").style.display = "flex";
});
document.getElementById("closeHelpBtn").addEventListener("click", function() {
  document.getElementById("helpModal").style.display = "none";
});

// Initial drawing of grid and origin marker.
redraw();
