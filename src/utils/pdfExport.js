import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export async function exportToPdf(elementId, filename) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // Use landscape if content is wider than tall
  const orientation = imgWidth > imgHeight ? 'l' : 'p';
  const pdf = new jsPDF(orientation, 'px', [imgWidth, imgHeight]);
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(filename);
}
