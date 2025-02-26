// Global variables and settings
const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");
const gridSpacing = 20;         // Spacing for grid lines
const animationDuration = 500;  // Duration of the movement animation in ms

// The origin is the center of the canvas.
const origin = { x: canvas.width / 2, y: canvas.height / 2 };
let currentPosition = { ...origin };
let segments = [];      // Stores completed movement segments
let commandCount = 0;   // Counts commands executed
let isAnimating = false;

// Draw grid with the origin at the center
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

// Redraw the grid and any completed segments along with the current position marker.
function redraw() {
  drawGrid();
  
  // Draw each static segment
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  segments.forEach(segment => {
    ctx.beginPath();
    ctx.moveTo(segment.start.x, segment.start.y);
    ctx.lineTo(segment.end.x, segment.end.y);
    ctx.stroke();
  });
  
  // Draw a marker at the current position
  drawMarker(currentPosition);
}

// Draw a red marker (circle) at a given position.
function drawMarker(pos) {
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
}

// Enhanced G-code parser that supports G0/G1 commands with X and Y coordinates.
// Coordinates are interpreted relative to the center (origin) of the grid.
// For Y, note that positive values will move "up" (i.e. subtract from canvas Y, since canvas Y increases downward).
function parseGcode(cmd) {
  if (!cmd) return null;
  // Remove comments (anything after a ';') and trim whitespace.
  cmd = cmd.split(';')[0].trim();
  let parts = cmd.split(/\s+/);
  let commandType = parts[0].toUpperCase();
  
  if (commandType === "G0" || commandType === "G1") {
    // Use the current position as default.
    let x = currentPosition.x;
    let y = currentPosition.y;
    
    parts.slice(1).forEach(part => {
      part = part.toUpperCase();
      if (part.startsWith("X")) {
        let val = parseFloat(part.substring(1));
        if (!isNaN(val)) {
          // For simulation, treat the X value as an offset from the origin.
          x = origin.x + val;
        }
      }
      if (part.startsWith("Y")) {
        let val = parseFloat(part.substring(1));
        if (!isNaN(val)) {
          // Subtract Y value to mimic typical CNC coordinates (positive Y is up).
          y = origin.y - val;
        }
      }
    });
    return { type: commandType, x, y };
  }
  return null;
}

// Animate a line from a starting point to an end point over a set duration.
function animateLine(start, end, duration, callback) {
  let startTime = null;
  
  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    let elapsed = timestamp - startTime;
    let progress = Math.min(elapsed / duration, 1);
    
    // Calculate the current interpolated position.
    let currentX = start.x + (end.x - start.x) * progress;
    let currentY = start.y + (end.y - start.y) * progress;
    
    // Redraw grid and previous segments.
    redraw();
    
    // Draw the current animated line.
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    // Draw marker at the intermediate position.
    drawMarker({ x: currentX, y: currentY });
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      callback();
    }
  }
  requestAnimationFrame(animate);
}

// Reset simulation: clear all segments and return to the origin.
function resetSimulation() {
  segments = [];
  commandCount = 0;
  currentPosition = { ...origin };
  redraw();
}

// Execute a G-code command.
function runGcodeCommand(cmd) {
  const parsed = parseGcode(cmd);
  if (!parsed) {
    alert("Invalid G-code command!");
    return;
  }
  
  // Disable the button while animating.
  document.getElementById("submitBtn").disabled = true;
  isAnimating = true;
  
  const start = { ...currentPosition };
  const end = { x: parsed.x, y: parsed.y };
  
  animateLine(start, end, animationDuration, () => {
    // After animation, store the segment and update the current position.
    segments.push({ start: start, end: end });
    currentPosition = { ...end };
    commandCount++;
    redraw();
    
    // After every 3 commands, reset the simulation (after a short delay).
    if (commandCount >= 3) {
      setTimeout(() => {
        resetSimulation();
      }, 500);
    }
    
    document.getElementById("submitBtn").disabled = false;
    isAnimating = false;
  });
}

// Event listener for running a command.
document.getElementById("submitBtn").addEventListener("click", function() {
  if (!isAnimating) {
    const command = document.getElementById("gcodeInput").value;
    runGcodeCommand(command);
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

// Initial drawing of the grid and origin marker.
redraw();
