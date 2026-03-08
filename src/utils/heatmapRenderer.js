export function renderHeatmap(canvas, shots, color = 'red') {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  if (shots.length === 0) return;

  const radius = Math.max(w, h) * 0.08;

  // Draw each shot as a radial gradient blob
  shots.forEach((shot) => {
    const x = shot.x * w;
    const y = shot.y * h;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    if (color === 'blue') {
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  });
}
