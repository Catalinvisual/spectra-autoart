// Generator imagine ceramic coating premium
const canvas = document.createElement('canvas');
canvas.width = 1920;
canvas.height = 1080;
const ctx = canvas.getContext('2d');

// Background gradient premium
const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
bgGradient.addColorStop(0, '#0a0a0a');
bgGradient.addColorStop(0.3, '#1a1a2e');
bgGradient.addColorStop(0.7, '#16213e');
bgGradient.addColorStop(1, '#0f3460');
ctx.fillStyle = bgGradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Efecte de suprafață ceramică
for (let i = 0; i < 15; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 300 + 200;
    
    const radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    radialGradient.addColorStop(0, 'rgba(0, 229, 255, 0.3)');
    radialGradient.addColorStop(0.5, 'rgba(0, 153, 204, 0.2)');
    radialGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = radialGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

// Linii de reflexie cinematice
for (let i = 0; i < 12; i++) {
    const y = (canvas.height / 12) * i + Math.random() * 80;
    const lineGradient = ctx.createLinearGradient(0, y, canvas.width, y);
    lineGradient.addColorStop(0, 'transparent');
    lineGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
    lineGradient.addColorStop(0.7, 'rgba(0, 229, 255, 0.8)');
    lineGradient.addColorStop(1, 'transparent');
    
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = Math.random() * 4 + 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
}

// Efect de strălucire premium
const shineGradient = ctx.createRadialGradient(
    canvas.width * 0.7,
    canvas.height * 0.3,
    0,
    canvas.width * 0.7,
    canvas.height * 0.3,
    400
);
shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
shineGradient.addColorStop(0.5, 'rgba(0, 229, 255, 0.2)');
shineGradient.addColorStop(1, 'transparent');

ctx.fillStyle = shineGradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Text premium
ctx.font = 'bold 72px Arial';
ctx.fillStyle = 'white';
ctx.textAlign = 'center';
ctx.shadowColor = 'rgba(0, 229, 255, 0.8)';
ctx.shadowBlur = 30;
ctx.fillText('Premium Ceramic Coating', canvas.width / 2, canvas.height * 0.42);

ctx.font = '36px Arial';
ctx.fillStyle = '#00e5ff';
ctx.shadowBlur = 15;
ctx.fillText('Crystal Clear Protection', canvas.width / 2, canvas.height * 0.52);

// Export ca imagine
const link = document.createElement('a');
link.download = 'ceramic-coating-hero.jpg';
link.href = canvas.toDataURL('image/jpeg', 0.95);
document.body.appendChild(link);
link.click();
document.body.removeChild(link);