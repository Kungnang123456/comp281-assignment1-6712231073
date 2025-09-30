window.onload = function () {
  const canvas = document.getElementById("sceneCanvas");
  const ctx = canvas.getContext("2d");

  let cloudX = 60;        // ตำแหน่งเมฆ
  let direction = 1;      // ทิศทางเมฆ
  let waveOffset = 0;     // ตัวเลื่อนคลื่นน้ำ

  //  กำหนดต้นไม้หลายต้น (x, y, size)
  const trees = [
    { x: 100, y: 370, size: 1.0 },
    { x: 180, y: 380, size: 0.8 },
    { x: 260, y: 360, size: 1.2 },
    { x: 350, y: 390, size: 0.9 },
    { x: 450, y: 370, size: 1.1 },
    { x: 650, y: 380, size: 1.0 },
  ];

  function drawScene() {
   
    ctx.clearRect(0, 0, canvas.width, canvas.height);

   
    const skyGradient = ctx.createLinearGradient(0, 0, 0, 250);
    skyGradient.addColorStop(0, "#87ceeb");
    skyGradient.addColorStop(1, "#b3e5fc");
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, 250);


    drawMountain(ctx, 100, 250, 400, 100, "#4caf50");
    drawMountain(ctx, 400, 250, 600, 130, "#66bb6a");


  drawSun(ctx, 700, 80, 40, waveOffset);

  // กลับตำแหน่งเมฆให้ไปทางขวา
  drawCloud(ctx, canvas.width - cloudX, 80);
  drawCloud(ctx, canvas.width - (cloudX + 150), 60);
  drawCloud(ctx, canvas.width - (cloudX + 300), 100);

    const fieldGradient = ctx.createLinearGradient(0, 250, 0, 500);
    fieldGradient.addColorStop(0, "#66bb6a");
    fieldGradient.addColorStop(1, "#43a047");
    ctx.fillStyle = fieldGradient;
    ctx.fillRect(0, 250, canvas.width, 250);

    
  drawRiver(ctx);
    // วาดต้นไม้ที่ไม่อยู่ใกล้น้ำ (x < 330 หรือ x > 470)
    trees.filter(t => t.x < 330 || t.x > 470)
      .forEach(t => drawTree(ctx, t.x, t.y, 40 * t.size, 80 * t.size));

    
    drawHouse(ctx, 550, 350);

    
  drawBird(ctx, 200, 40, waveOffset);
  drawBird(ctx, 250, 60, waveOffset + 1);
  drawBird(ctx, 300, 30, waveOffset + 2);

    cloudX += 0.5 * direction;
    if (cloudX > 650 || cloudX < 20) direction *= -1;
    waveOffset += 0.05;

    requestAnimationFrame(drawScene);
  }

  drawScene();
};


function drawMountain(ctx, x1, y1, x2, peakY, color) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  // ใช้ quadraticCurveTo เพื่อให้ยอดภูเขาโค้งมน ไม่แหลม
  const peakX = (x1 + x2) / 2;
  ctx.quadraticCurveTo(peakX, peakY - 40, peakX, peakY); // โค้งขึ้นไปใกล้ยอด
  ctx.quadraticCurveTo(peakX, peakY - 40, x2, y1); // โค้งลงอีกฝั่ง
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawSun(ctx, x, y, radius) {
  // waveOffset เป็นออร่าขยับ
  let offset = arguments[3] || 0;
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    // รัศมีออร่าขยับแบบคลื่น
    let dynamicRadius = radius + i * 18 + Math.sin(offset + i) * 8;
    ctx.arc(x, y, dynamicRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 223, 0, ${0.15/i})`;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.strokeStyle = "orange";
  ctx.lineWidth = 4;
  ctx.stroke();
}


function drawCloud(ctx, x, y) {
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.arc(x + 25, y + 5, 25, 0, Math.PI * 2);
  ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
  ctx.fill();
}

function drawRiver(ctx) {
  // แม่น้ำเป็นเส้นตรงแบบเดิม ไม่มีอนิเมชั่น
  ctx.beginPath();
  ctx.moveTo(300, 500);
  ctx.lineTo(400, 250);
  ctx.lineTo(500, 250);
  ctx.lineTo(400, 500);
  ctx.closePath();
  let riverGradient1 = ctx.createLinearGradient(300, 500, 500, 250);
  riverGradient1.addColorStop(0, "#81d4fa");
  riverGradient1.addColorStop(1, "#0288d1");
  ctx.fillStyle = riverGradient1;
  ctx.fill();
}


function drawTree(ctx, x, y, width, height) {

  ctx.fillStyle = "#8d6e63";
  ctx.fillRect(x + width / 2 - 10, y, 20, height / 2);

  ctx.beginPath();
  ctx.arc(x + width / 2, y, width / 1.2, 0, Math.PI * 2);
  ctx.fillStyle = "#2e7d32";
  ctx.fill();
}


function drawHouse(ctx, x, y) {
  ctx.fillStyle = "#8d6e63";
  ctx.fillRect(x, y, 100, 80);

  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.lineTo(x + 50, y - 50);
  ctx.lineTo(x + 110, y);
  ctx.closePath();
  ctx.fillStyle = "#6d4c41";
  ctx.fill();
  ctx.fillStyle = "#3e2723";
  ctx.fillRect(x + 40, y + 40, 20, 40);
}
function drawBird(ctx, x, y) {
  // เพิ่ม animation ปีกนกขยับ
  wingOffset = typeof wingOffset !== 'undefined' ? wingOffset : 0;
  let wingY = Math.sin(wingOffset * 2) * 10;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + 10, y - 10 + wingY, x + 20, y);
  ctx.quadraticCurveTo(x + 30, y - 10 + wingY, x + 40, y);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
}
