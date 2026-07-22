// Rundown → PDF exporter for the Travel Planner result screen.
//
// Renders the generated itinerary ("rundown") into a downloadable PDF whose
// layout mirrors the on-screen design: the Minangkabau heritage maroon accent,
// a trip-summary header, one table per day (Waktu / Aktivitas / Lokasi /
// Catatan), and the AI advisor note. Uses jsPDF + autotable so the output is
// real vector text (crisp, selectable, multi-page) rather than a screenshot.

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── Shared shapes (kept structurally compatible with TravelPlannerPage) ──
export interface RundownActivity {
  waktu: string;
  aktivitas: string;
  lokasi: string;
  deskripsi: string;
}

export interface RundownDay {
  dayNumber: number;
  title: string;
  fokus: string;
  activities: RundownActivity[];
}

export interface RundownTripInfo {
  destination: string;
  companions: string;
  duration: string;
  judul: string;
  ringkasan: string;
  estimasi: string;
  tips: string;
}

// Heritage palette pulled from the design tokens used on-screen.
// Heritage palette pulled from the design tokens used on-screen.
const MAROON: [number, number, number] = [95, 23, 18]; // #5F1712
const GOLD: [number, number, number] = [249, 206, 101]; // #F9CE65
const GOLD_BORDER: [number, number, number] = [230, 208, 151]; // #E6D097
const HEADER_GREY: [number, number, number] = [244, 243, 240]; // #F4F3F0
const TABLE_HEAD: [number, number, number] = [239, 238, 235]; // #EFEEEB
const INK: [number, number, number] = [26, 28, 26]; // #1A1C1A
const MUTE: [number, number, number] = [85, 66, 64]; // #554240
const ROW_ALT: [number, number, number] = [250, 249, 246]; // #FAF9F6

/**
 * Build and trigger download of the rundown PDF.
 * Returns the generated filename so callers can surface it if they wish.
 */
export function downloadRundownPdf(
  tripInfo: RundownTripInfo,
  days: RundownDay[],
): string {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // ── Executive Heritage Header Band ──
  const headerHeight = 110;
  doc.setFillColor(...MAROON);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');

  // Bottom Gold Accent Line across header
  doc.setFillColor(...GOLD);
  doc.rect(0, headerHeight - 3.5, pageWidth, 3.5, 'F');

  // Top Heritage Brand Tag
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...GOLD);
  doc.text('BUKITTINGGI CULTURAL HERITAGE HUB · AI TRAVEL PLANNER', margin, 28);

  // Main Trip Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  const title = tripInfo.judul || 'Rencana Perjalanan Bukittinggi';
  const titleLines = doc.splitTextToSize(title, contentWidth - 40);
  doc.text(titleLines, margin, 54);

  // Subtitle with Gold Star
  const titleOffset = titleLines.length > 1 ? 74 : 64;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(252, 239, 203);
  doc.text('✦ Rekomendasi Perjalanan Khusus & Itinerary Warisan Budaya Minangkabau', margin, titleOffset + 18);

  // ── Trip Summary Cards ──
  const summaryY = headerHeight + 20;
  const stats: Array<[string, string]> = [
    ['TUJUAN', tripInfo.destination || 'Bukittinggi'],
    ['DURASI', tripInfo.duration || `${days.length} Hari`],
    ['WISATAWAN', tripInfo.companions || 'Wisatawan'],
    ['ESTIMASI BIAYA', tripInfo.estimasi || 'Sesuai Budget'],
  ];
  const chipW = contentWidth / stats.length;
  stats.forEach(([label, value], i) => {
    const x = margin + i * chipW;
    // Card background
    doc.setFillColor(...ROW_ALT);
    doc.setDrawColor(...GOLD_BORDER);
    doc.setLineWidth(0.8);
    doc.roundedRect(x + 2, summaryY, chipW - 8, 52, 6, 6, 'FD');
    
    // Label Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...MAROON);
    doc.text(label, x + 12, summaryY + 18);
    
    // Value Content
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...INK);
    const valueLines = doc.splitTextToSize(value, chipW - 20);
    doc.text(valueLines, x + 12, summaryY + 34);
  });

  // ── AI Advisor Summary Note ──
  let cursorY = summaryY + 74;
  const advice = tripInfo.ringkasan?.trim();
  if (advice) {
    doc.setFillColor(252, 249, 245);
    doc.setDrawColor(...GOLD_BORDER);
    doc.setLineWidth(0.8);
    const noteLines = doc.splitTextToSize(`"${advice}"`, contentWidth - 28);
    const noteH = noteLines.length * 13 + 28;
    doc.roundedRect(margin, cursorY, contentWidth, noteH, 6, 6, 'FD');
    
    // Thick Maroon Accent bar on the left edge
    doc.setFillColor(...MAROON);
    doc.rect(margin, cursorY, 4, noteH, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...MAROON);
    doc.text('✦ CATATAN KONSULTAN PERJALANAN AI', margin + 14, cursorY + 18);
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...MUTE);
    doc.text(noteLines, margin + 14, cursorY + 34);
    cursorY += noteH + 20;
  }

  // ── Per-day tables ──
  days.forEach((day) => {
    // Estimate the day-header height and page-break before it so the header
    // never gets orphaned at the very bottom of a page.
    if (cursorY + 60 > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }

    // Day header band
    doc.setFillColor(...HEADER_GREY);
    doc.roundedRect(margin, cursorY, contentWidth, 30, 4, 4, 'F');
    doc.setFillColor(...MAROON);
    doc.circle(margin + 18, cursorY + 15, 9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(String(day.dayNumber), margin + 18, cursorY + 18.5, { align: 'center' });

    doc.setTextColor(...MAROON);
    doc.setFontSize(11);
    const headTitle = `Hari ${day.dayNumber}: ${day.title}`;
    doc.text(doc.splitTextToSize(headTitle, contentWidth - 180), margin + 34, cursorY + 19);

    if (day.fokus) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize?.(8);
      doc.setFontSize(8);
      doc.setTextColor(141, 114, 109);
      doc.text(day.fokus.toUpperCase(), pageWidth - margin - 8, cursorY + 19, { align: 'right' });
    }

    cursorY += 38;

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      head: [['Waktu', 'Aktivitas', 'Lokasi', 'Catatan & Deskripsi']],
      body: day.activities.map((a) => [a.waktu, a.aktivitas, a.lokasi, a.deskripsi]),
      styles: {
        font: 'helvetica',
        fontSize: 8.5,
        cellPadding: 5,
        textColor: MUTE,
        valign: 'top',
        lineColor: [235, 231, 230],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: TABLE_HEAD,
        textColor: MUTE,
        fontStyle: 'bold',
        fontSize: 8,
      },
      alternateRowStyles: { fillColor: ROW_ALT },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 110, fontStyle: 'bold', textColor: MAROON },
        2: { cellWidth: 105 },
        3: { cellWidth: 'auto' },
      },
      didDrawPage: () => {
        // keep a consistent top margin on tables that spill to a new page
      },
    });

    // autotable stores the final Y on the doc instance
    const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY;
    cursorY = (finalY ?? cursorY) + 22;
  });

  // ── Footer / tips on the last page ──
  if (tripInfo.tips?.trim()) {
    if (cursorY + 40 > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...MAROON);
    doc.text('TIPS TRANSPORTASI', margin, cursorY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...MUTE);
    doc.text(doc.splitTextToSize(tripInfo.tips, contentWidth), margin, cursorY + 14);
  }

  // Page numbers + brand footer across all pages
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text('Bukittinggi Heritage · AI Travel Planner', margin, pageHeight - 20);
    doc.text(`Halaman ${p} / ${pageCount}`, pageWidth - margin, pageHeight - 20, { align: 'right' });
  }

  const safeTitle = (tripInfo.judul || 'Rundown-Bukittinggi')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  const filename = `Rundown-${safeTitle || 'Bukittinggi'}.pdf`;
  doc.save(filename);
  return filename;
}
