import { useState, useRef, useEffect, useCallback, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { askTravelPlanner, type AiChatMessage } from '../lib/aiClient';
import { downloadRundownPdf } from '../lib/rundownPdf';

// SVG Asset Imports
import linkSvg from '../assets/link.svg';
import kalendSvg from '../assets/kalend.svg';
import voicSvg from '../assets/voic.svg';
import lokSvg from '../assets/lok.svg';
import pesaSvg from '../assets/pesa.svg';
import orngSvg from '../assets/orng.svg';
import kalendarSvg from '../assets/kalendar.svg';
import luvSvg from '../assets/luv.svg';
import aiSvg from '../assets/ai.svg';
import alSvg from '../assets/al.svg';
import campSvg from '../assets/camp.svg';
import pdfSvg from '../assets/pdf.svg';

// Custom PNG Asset Imports
import flagPng from '../assets/flag.webp';
import sawahPng from '../assets/sawah.webp';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  isItinerary?: boolean;
}

interface ItineraryActivity {
  waktu: string;
  aktivitas: string;
  lokasi: string;
  deskripsi: string;
}

interface ItineraryDay {
  dayNumber: number;
  title: string;
  fokus: string;
  activities: ItineraryActivity[];
}

interface TripInfo {
  destination: string;   // step 1 answer
  origin: string;        // step 2 answer
  companions: string;    // step 3 answer
  duration: string;      // step 4 answer
  interests: string;     // step 5 answer
  judul: string;         // JUDUL_PERJALANAN from AI
  ringkasan: string;     // RINGKASAN_AI from AI
  estimasi: string;      // ESTIMASI_BIAYA from AI
  tips: string;          // TIPS_TRANSPORTASI from AI
}

interface AiItinerarySummary {
  title: string;
  totalDays: number;
  travelerCount: number;
  budget: string;
  destination: string;
}

interface AiItineraryJson {
  summary: AiItinerarySummary;
  days: Array<{
    day: number;
    title: string;
    category: string;
    activities: Array<{
      time: string;
      activity: string;
      location: string;
      description: string;
    }>;
  }>;
}


const WELCOME = 'Selamat datang di Bukittinggi Heritage. Saya akan membantu menyusun perjalanan yang sesuai dengan minat, waktu, dan gaya liburan Anda.\n\nUntuk memulai, destinasi mana yang ingin Anda jelajahi? Atau biarkan saya memberikan rekomendasi terbaik.';

interface ChipConfig {
  text: string;
  borderColor: string;
  textColor: string;
}

export function TravelPlannerPage() {
  const { ref: revealRef, isVisible } = useScrollReveal<HTMLElement>();

  // Interactive state
  const [currentStep, setCurrentStep] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatLog, setChatLog] = useState<Message[]>([
    { sender: 'bot', text: WELCOME },
  ]);
  // Parallel AI conversation history (role/content format for the API)
  const [aiHistory, setAiHistory] = useState<AiChatMessage[]>([
    { role: 'assistant', content: WELCOME },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);

  // ── Date Picker Modal States ──
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date(2025, 4, 15)); // 15 Mei 2025
  const [returnDate, setReturnDate] = useState<Date | null>(new Date(2025, 4, 22)); // 22 Mei 2025
  const [displayMonth, setDisplayMonth] = useState<number>(4); // Mei
  const [displayYear, setDisplayYear] = useState<number>(2025);

  // ── Result Screen & Parser States ──
    const [showResultScreen, setShowResultScreen] = useState<boolean>(false);
    const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
  const [tripInfo, setTripInfo] = useState<TripInfo>({
    destination: 'Bukittinggi',
    origin: '-',
    companions: '2 Orang',
    duration: '-',
    interests: '-',
    judul: 'Perjalanan Bukittinggi',
    ringkasan: '',
    estimasi: '',
    tips: '',
  });
  // stepAnswers[i] = what the user said at step i (0-indexed)
  const [stepAnswers, setStepAnswers] = useState<string[]>([]);
  // Track the number of days the user requested for the itinerary
  const [requestedDays, setRequestedDays] = useState<number>(3);

  const isInitialMount = useRef(true);
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll inner chat container when chatLog changes (no page jumping)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (chatMessagesContainerRef.current) {
      chatMessagesContainerRef.current.scrollTo({
        top: chatMessagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatLog, isGenerating]);

  // Lock body scroll when DatePicker is open
  useEffect(() => {
    if (isDatePickerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDatePickerOpen]);

  // ── Custom Predefined Fallback & Parsers ──

  /**
   * Extract companion count & label from step 3 answer (e.g. "Bersama Pasangan", "Solo Traveler", "Liburan Keluarga 4 orang")
   */
  const parseCompanions = useCallback((raw: string): string => {
    const lower = raw.toLowerCase();
    if (lower.includes('solo') || lower.includes('sendiri')) return '1 Orang';
    if (lower.includes('pasangan') || lower.includes('couple') || lower.includes('berdua')) return '2 Orang';
    if (lower.includes('keluarga') || lower.includes('family')) {
      const numMatch = raw.match(/(\d+)/);
      return numMatch ? `${numMatch[1]} Orang` : '4 Orang';
    }
    if (lower.includes('teman') || lower.includes('rombongan') || lower.includes('group')) {
      const numMatch = raw.match(/(\d+)/);
      return numMatch ? `${numMatch[1]} Orang` : '4 Orang';
    }
    const numMatch = raw.match(/(\d+)/);
    return numMatch ? `${numMatch[1]} Orang` : '2 Orang';
  }, []);

  /**
   * Extract duration (number of days) from step 4 answer
   */
  const parseDuration = useCallback((raw: string): number => {
    const lower = raw.toLowerCase();
    // "3 hari", "5 days", "3-day"
    const dayMatch = raw.match(/(\d+)\s*(?:hari|day)/);
    if (dayMatch) return parseInt(dayMatch[1]);
    // weekend = 2 days typically
    if (lower.includes('weekend') || lower.includes('akhir pekan')) return 2;
    // "sepekan" / "seminggu"
    if (lower.includes('seminggu') || lower.includes('sepekan')) return 7;
    return 3; // default
  }, []);

  const getDefaultItinerary = useCallback((days: number = 3): ItineraryDay[] => {
    const baseDays = [
      {
        title: "Kedatangan & Jelajahi Warisan Budaya", fokus: "WARISAN SEJARAH", activities: [
          { waktu: "08:00 - 10:00", aktivitas: "Kedatangan & Check-in", lokasi: "Bandara BIM", deskripsi: "Tiba di Bandara Internasional Minangkabau dan perjalanan menuju Bukittinggi sekitar 2 jam." },
          { waktu: "10:30 - 12:30", aktivitas: "Kunjungi Jam Gadang", lokasi: "Jam Gadang", deskripsi: "Mengunjungi ikon Kota Bukittinggi dan menikmati suasana di sekitar alun-alun kota." },
          { waktu: "13:00 - 15:00", aktivitas: "Makan Siang Khas Minang", lokasi: "Restoran Nasi Kapau", deskripsi: "Nikmati nasi kapau otentik dengan berbagai pilihan lauk pauk khas Minangkabau." },
          { waktu: "15:30 - 17:30", aktivitas: "Jelajah Pasar Atas", lokasi: "Pasar Atas Bukittinggi", deskripsi: "Berbelanja oleh-oleh, kerajinan tangan, dan mencicipi jajanan khas Sumatera Barat." },
          { waktu: "19:00 - 21:00", aktivitas: "Makan Malam Kuliner Malam", lokasi: "Kawasan Kuliner Malam", deskripsi: "Mencicipi kuliner malam khas Bukittinggi seperti tahu pong dan sate Padang." },
        ]
      },
      {
        title: "Keindahan Alam & Jejak Kerajaan", fokus: "PETUALANGAN ALAM", activities: [
          { waktu: "08:00 - 10:00", aktivitas: "Panorama Ngarai Sianok", lokasi: "Ngarai Sianok", deskripsi: "Menikmati panorama alam yang menakjubkan serta udara segar khas dataran tinggi." },
          { waktu: "10:30 - 12:30", aktivitas: "Tur Lobang Jepang", lokasi: "Lobang Jepang", deskripsi: "Tur sejarah ke terowongan peninggalan Perang Dunia II di kawasan Ngarai Sianok." },
          { waktu: "13:00 - 15:00", aktivitas: "Makan Siang Pinggir Jurang", lokasi: "Restoran View Ngarai", deskripsi: "Makan siang sambil menikmati pemandangan ngarai yang spektakuler." },
          { waktu: "15:30 - 17:30", aktivitas: "Kunjungi Istano Basa Pagaruyung", lokasi: "Istano Basa Pagaruyung", deskripsi: "Mengunjungi replika megah istana kerajaan Minangkabau dan berfoto dengan pakaian adat." },
          { waktu: "19:00 - 21:00", aktivitas: "Makan Malam Tradisional", lokasi: "Restoran Lokal Batusangkar", deskripsi: "Nikmati makan malam dengan masakan Minang otentik khas daerah Batusangkar." },
        ]
      },
      {
        title: "Wisata Kuliner & Kepulangan", fokus: "KULINER & BELANJA", activities: [
          { waktu: "08:00 - 10:00", aktivitas: "Sarapan Pagi di Pasar", lokasi: "Pasar Bawah Bukittinggi", deskripsi: "Sarapan dengan berbagai makanan khas seperti lontong sayur dan bubur kampiun." },
          { waktu: "10:30 - 12:30", aktivitas: "Belanja Oleh-oleh Sanjai", lokasi: "Toko Sanjai Nijai", deskripsi: "Membeli keripik sanjai dan berbagai oleh-oleh khas Sumatera Barat untuk dibawa pulang." },
          { waktu: "13:00 - 15:00", aktivitas: "Makan Siang Terakhir", lokasi: "Restoran Natrabu", deskripsi: "Menikmati makan siang terakhir dengan hidangan khas Minangkabau yang lezat." },
          { waktu: "15:30 - 17:00", aktivitas: "Perjalanan ke Bandara", lokasi: "Bandara BIM", deskripsi: "Perjalanan menuju bandara disarankan 2-3 jam sebelum jadwal penerbangan." },
          { waktu: "17:00 - 19:00", aktivitas: "Check-in & Kepulangan", lokasi: "Bandara BIM", deskripsi: "Proses check-in dan menunggu penerbangan pulang ke kota asal." },
        ]
      },
      {
        title: "Eksplorasi Budaya Lokal", fokus: "BUDAYA & KERAJAAN", activities: [
          { waktu: "08:00 - 10:00", aktivitas: "Kunjungi Museum Adat", lokasi: "Museum Rumah Kelahiran Bung Hatta", deskripsi: "Melihat rumah masa kecil pahlawan nasional dan mengenal sejarah perjuangan." },
          { waktu: "10:30 - 12:30", aktivitas: "Mencicipi Kopi Lokal", lokasi: "Kedai Kopi Khas", deskripsi: "Menikmati kopi khas Sumatera Barat dengan suasana yang nyaman." },
          { waktu: "13:00 - 15:00", aktivitas: "Menonton Tari Piring", lokasi: "Desa Wisata Budaya", deskripsi: "Menyaksikan tari piring, tari tradisional Minangkabau yang penuh semangat." },
          { waktu: "15:30 - 17:30", aktivitas: "Belanja Kerajinan", lokasi: "Sentra Kerajinan Tangan", deskripsi: "Membeli kerajinan tangan seperti songket dan perak khas Bukittinggi." },
          { waktu: "19:00 - 21:00", aktivitas: "Makan Malam Bersama", lokasi: "Rumah Makan Adat", deskripsi: "Menikmati hidangan bersama dengan konsep makan bersama (padusan)." },
        ]
      },
      {
        title: "Relaksasi & Persiapan Pulang", fokus: "RELAKSASI & KESENANGAN", activities: [
          { waktu: "08:00 - 10:00", aktivitas: "Pemandangan Sunrise", lokasi: "Puncak Lawang", deskripsi: "Menikmati pemandangan sunrise yang indah dari puncak lawang." },
          { waktu: "10:30 - 12:30", aktivitas: "Bersantai di Taman", lokasi: "Taman Margasatwa & Budaya Kinantan", deskripsi: "Bersantai dan melihat hewan-hewan di taman." },
          { waktu: "13:00 - 15:00", aktivitas: "Makan Siang Ringkas", lokasi: "Warung Nasi Padang", deskripsi: "Menikmati hidangan ringkas namun lezat di warung lokal." },
          { waktu: "15:30 - 17:30", aktivitas: "Packing & Persiapan", lokasi: "Hotel", deskripsi: "Packing barang dan persiapan untuk kepulangan." },
          { waktu: "19:00 - 21:00", aktivitas: "Makan Malam Perpisahan", lokasi: "Restoran Favorit", deskripsi: "Menikmati makan malam terakhir di restoran favorit Anda." },
        ]
      }
    ];

    const result: ItineraryDay[] = [];
    for (let i = 0; i < days; i++) {
      const base = baseDays[i % baseDays.length];
      result.push({
        dayNumber: i + 1,
        title: base.title,
        fokus: base.fokus,
        activities: base.activities.map(act => ({...act}))
      });
    }
    return result;
  }, []);

  /**
   * Parses the combined chat + JSON format from the AI.
   * Falls back to default itinerary if parsing fails.
   */
  const parseItineraryText = useCallback((text: string): { days: ItineraryDay[]; meta: Partial<TripInfo> } => {
    console.log('🔍 PARSING TEXT:', text); // Debug log
    const meta: Partial<TripInfo> = {};
    let parsedDays: ItineraryDay[];

    try {
      // First, split text into chat and JSON parts (JSON starts with '{')
      const splitIndex = text.indexOf('{');
      if (splitIndex === -1) throw new Error('No JSON found');

      // Extract JSON
      const jsonStr = text.substring(splitIndex).trim();
      console.log('🔍 Extracted JSON:', jsonStr);

      // Parse the new JSON format
      const itinerary = JSON.parse(jsonStr) as AiItineraryJson;
      console.log('✅ Parsed AI Itinerary:', itinerary);

      // Map to our internal types from the new structure
      meta.judul = itinerary.summary.title;
      meta.estimasi = itinerary.summary.budget;
      // If we want to use travelerCount, we could, but let's keep meta as is for now

      parsedDays = itinerary.days.map(day => ({
        dayNumber: day.day,
        title: day.title,
        fokus: day.category.toUpperCase(),
        activities: day.activities.map(act => ({
          waktu: act.time,
          aktivitas: act.activity,
          lokasi: act.location,
          deskripsi: act.description
        }))
      }));

      console.log('✅ Mapped days:', parsedDays);
    } catch (err) {
      console.error('❌ Failed to parse JSON, using default itinerary:', err);
      parsedDays = getDefaultItinerary(requestedDays);
    }

    // Ensure we have at least some activities
    if (parsedDays.length === 0) {
      parsedDays = getDefaultItinerary(requestedDays);
    }

    return { days: parsedDays, meta };
  }, [getDefaultItinerary, requestedDays]);



  // ── Date Picker Helper Functions ──

  const getMonthName = (monthIdx: number) => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return months[monthIdx];
  };

  const getCalendarDays = (month: number, year: number) => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: { date: Date; isCurrentMonth: boolean }[] = [];

    // Prev month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, daysInPrevMonth - i);
      cells.push({ date: prevDate, isCurrentMonth: false });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      cells.push({ date: currentDate, isCurrentMonth: true });
    }

    // Next month padding to fill 42 cells (6 rows * 7 columns)
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      cells.push({ date: nextDate, isCurrentMonth: false });
    }

    return cells;
  };

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const isBetweenDates = (date: Date) => {
    if (!departureDate || !returnDate) return false;
    return date.getTime() > departureDate.getTime() && date.getTime() < returnDate.getTime();
  };

  const formatDateShort = (date: Date | null) => {
    if (!date) return '';
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const prevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(y => y - 1);
    } else {
      setDisplayMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(y => y + 1);
    } else {
      setDisplayMonth(m => m + 1);
    }
  };

  // ── Icon Handlers ──────────────────────────────────────────────────────────

  // 1. Attachment: open file picker, append filename to chat input
  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const friendly = `[File: ${file.name}]`;
    setChatInput(prev => prev ? `${prev} ${friendly}` : friendly);
    // reset so the same file can be re-selected later
    e.target.value = '';
  };

  // 2. Calendar: Open custom modal instead of native date picker
  const handleCalendar = () => {
    setIsDatePickerOpen(true);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!raw) return;
    const d = new Date(raw);
    const formatted = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    setChatInput(prev => prev ? `${prev} ${formatted}` : formatted);
  };


  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // 3. Voice: Web Speech API — toggle listening, transcript → chat input
  const handleVoice = () => {
    interface SpeechRecognitionCtor {
      new(): SpeechRecognition;
    }
    interface WindowWithSpeech {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    }
    const w = window as unknown as WindowWithSpeech;
    const SpeechRecognitionAPI = w.SpeechRecognition ?? w.webkitSpeechRecognition;


    if (!SpeechRecognitionAPI) {
      alert('Browser Anda tidak mendukung voice recognition. Coba Chrome atau Edge.');
      return;
    }
    if (isListening) return; // already running

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  };


  // Step information
  const timelineSteps = [
    {
      label: 'TUJUAN WISATA',
      icon: lokSvg,
      description: 'Belum tahu mau ke mana? Biarkan AI memberikan rekomendasi terbaik.',
    },
    {
      label: 'ASAL PERJALANAN',
      icon: pesaSvg,
      description: 'Dari kota mana Anda memulai perjalanan?',
    },
    {
      label: 'TEMAN PERJALANAN',
      icon: orngSvg,
      description: 'Siapa yang akan menemani perjalanan Anda?',
    },
    {
      label: 'WAKTU KUNJUNGAN',
      icon: kalendarSvg,
      description: 'Kapan Anda berencana berkunjung?',
    },
    {
      label: 'MINAT PERJALANAN',
      icon: luvSvg,
      description: 'Pengalaman seperti apa yang Anda cari?',
    },
  ];


  // Chip configurations matching the color aesthetic
  const chipSets: ChipConfig[][] = [
    [
      { text: 'Rencanakan perjalanan 3 hari di Bukittinggi', borderColor: 'border-[#8B2E2E]', textColor: 'text-[#8B2E2E]' },
      { text: 'Istano Basa Pagaruyung', borderColor: 'border-[#2E504A]', textColor: 'text-[#2E504A]' },
      { text: 'Lembah Harau', borderColor: 'border-[#8B2E2E]', textColor: 'text-[#8B2E2E]' },
      { text: 'Wisata keluarga dengan budget Rp1 juta', borderColor: 'border-[#8A783B]', textColor: 'text-[#8A783B]' },
    ],
    [
      { text: 'Jakarta', borderColor: 'border-[#8B2E2E]', textColor: 'text-[#8B2E2E]' },
      { text: 'Padang', borderColor: 'border-[#2E504A]', textColor: 'text-[#2E504A]' },
      { text: 'Pekanbaru', borderColor: 'border-[#8B2E2E]', textColor: 'text-[#8B2E2E]' },
      { text: 'Medan', borderColor: 'border-[#8A783B]', textColor: 'text-[#8A783B]' },
    ],
    [
      { text: 'Solo Traveler', borderColor: 'border-[#8B2E2E]', textColor: 'text-[#8B2E2E]' },
      { text: 'Bersama Pasangan', borderColor: 'border-[#2E504A]', textColor: 'text-[#2E504A]' },
      { text: 'Liburan Keluarga', borderColor: 'border-[#8B2E2E]', textColor: 'text-[#8B2E2E]' },
      { text: 'Rombongan Teman', borderColor: 'border-[#8A783B]', textColor: 'text-[#8A783B]' },
    ],
    [
      { text: 'Rencana 3 Hari di Akhir Pekan', borderColor: 'border-[#8B2E2E]', textColor: 'text-[#8B2E2E]' },
      { text: 'Liburan Panjang (5 Hari)', borderColor: 'border-[#2E504A]', textColor: 'text-[#2E504A]' },
      { text: 'Hanya 1 Hari Full Trip', borderColor: 'border-[#8B2E2E]', textColor: 'text-[#8B2E2E]' },
      { text: 'Bulan Depan', borderColor: 'border-[#8A783B]', textColor: 'text-[#8A783B]' },
    ],
    [
      { text: 'Sejarah & Budaya Lokal', borderColor: 'border-[#8B2E2E]', textColor: 'text-[#8B2E2E]' },
      { text: 'Kuliner Tradisional & Kopi', borderColor: 'border-[#2E504A]', textColor: 'text-[#2E504A]' },
      { text: 'Spot Foto Estetik & Instagramable', borderColor: 'border-[#8B2E2E]', textColor: 'text-[#8B2E2E]' },
      { text: 'Belanja Kerajinan & Sanjai', borderColor: 'border-[#8A783B]', textColor: 'text-[#8A783B]' },
    ],
  ];

  // Send one step answer → call Gemini → update chat
  const handleNextStep = useCallback(async (answerText: string) => {
    if (currentStep >= 5 || isGenerating) return;

    const userMsg: Message = { sender: 'user', text: answerText };
    const newHistory: AiChatMessage[] = [...aiHistory, { role: 'user', content: answerText }];

    setChatLog(prev => [...prev, userMsg]);
    setAiHistory(newHistory);
    setIsGenerating(true);

    // Capture user answer per step to populate result screen dynamically
    const newAnswers = [...stepAnswers];
    newAnswers[currentStep] = answerText;
    setStepAnswers(newAnswers);

    // Map step answer to TripInfo fields
    setTripInfo(prev => {
      const updated = { ...prev };
      if (currentStep === 0) updated.destination = answerText.substring(0, 60);
      if (currentStep === 1) updated.origin = answerText.substring(0, 40);
      if (currentStep === 2) updated.companions = parseCompanions(answerText);
      if (currentStep === 3) {
        const days = parseDuration(answerText);
        setRequestedDays(days);
        const nights = Math.max(days - 1, 0);
        updated.duration = `${days} Hari ${nights} Malam`;
      }
      if (currentStep === 4) updated.interests = answerText.substring(0, 60);
      return updated;
    });

    try {
      const reply = await askTravelPlanner(newHistory);
      const botMsg: Message = { sender: 'bot', text: reply };
      setChatLog(prev => [...prev, botMsg]);
      setAiHistory(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      // Graceful fallback messages per step
      const fallbacks = [
        'Pilihan yang bagus! Langkah 2: Dari kota mana Anda akan memulai perjalanan? Ini membantu saya memperkirakan waktu dan rute kedatangan terbaik.',
        'Baik. Langkah 3: Siapa saja yang akan menemani perjalanan Anda? (Solo, Pasangan, Keluarga, atau Teman)',
        'Dicatat! Langkah 4: Kapan Anda berencana berkunjung dan berapa lama durasinya?',
        'Luar biasa! Langkah 5 (terakhir): Minat khusus apa yang paling ingin Anda kejar di Bukittinggi? (Sejarah, Kuliner, Spot Foto, atau Belanja)',
        'Semua data terkumpul! Klik tombol "Buat Rencana Perjalanan" untuk menghasilkan itinerary personal Anda.',
      ];
      const fallback = fallbacks[currentStep] ?? 'Baik, lanjutkan ke langkah berikutnya.';
      setChatLog(prev => [...prev, { sender: 'bot', text: fallback }]);
      setAiHistory(prev => [...prev, { role: 'assistant', content: fallback }]);
    } finally {
      setCurrentStep(s => Math.min(s + 1, 5));
      setIsGenerating(false);
    }
  }, [currentStep, isGenerating, aiHistory, stepAnswers, parseCompanions, parseDuration]);

  const handleSend = () => {
    if (!chatInput.trim() || isGenerating) return;
    const input = chatInput;
    setChatInput('');
    void handleNextStep(input);
  };

  // Generate full itinerary using the real Gemini API
  const generateItinerary = useCallback(async () => {
    if (currentStep < 5 || isGenerating) return;
    setIsGenerating(true);

    try {
      const reply = await askTravelPlanner(aiHistory, true);
      console.log('🤖 RAW AI ITINERARY RESPONSE:', reply); // Debug log

      // Extract chat part (before the '{')
      const splitIndex = reply.indexOf('{');
      const chatPart = splitIndex === -1 ? reply : reply.substring(0, splitIndex).trim();

      setChatLog(prev => [...prev, { sender: 'bot', text: chatPart, isItinerary: true }]);
      setAiHistory(prev => [...prev, { role: 'assistant', content: reply }]);

      const { days, meta } = parseItineraryText(reply);
      console.log('📅 PARSED DAYS:', days); // Debug log
      console.log('📋 PARSED META:', meta); // Debug log
      setItineraryDays(days);

      // Merge AI-extracted metadata into tripInfo
      setTripInfo(prev => ({
        ...prev,
        judul: meta.judul || prev.judul,
        ringkasan: meta.ringkasan || prev.ringkasan,
        estimasi: meta.estimasi || prev.estimasi,
        tips: meta.tips || prev.tips,
        // Derive duration from actual parsed days if not set
        duration: prev.duration !== '-' ? prev.duration : `${days.length} Hari ${Math.max(days.length - 1, 0)} Malam`,
      }));

      setCurrentPage(1);
      setShowResultScreen(true);
    } catch {
      // Graceful fallback to default mock itinerary so the visual design displays instantly
      const fallbackData = getDefaultItinerary(requestedDays);
      setItineraryDays(fallbackData);
      setTripInfo(prev => ({
        ...prev,
        judul: prev.judul,
        ringkasan: 'Rencana perjalanan ini dirancang khusus untuk menghadirkan pengalaman terbaik di Bukittinggi. Nikmati setiap momen dengan penuh antusias!',
        duration: prev.duration !== '-' ? prev.duration : `${fallbackData.length} Hari ${Math.max(fallbackData.length - 1, 0)} Malam`,
      }));
      setCurrentPage(1);
      setShowResultScreen(true);
    } finally {
      setIsGenerating(false);
    }
  }, [currentStep, isGenerating, aiHistory, parseItineraryText, requestedDays, getDefaultItinerary]);

  if (showResultScreen) {
    const usePagination = itineraryDays.length > 7;
    const daysPerPage = 7;
    const totalPages = usePagination ? Math.ceil(itineraryDays.length / daysPerPage) : 1;
    const visibleDays = usePagination
      ? itineraryDays.slice((currentPage - 1) * daysPerPage, currentPage * daysPerPage)
      : itineraryDays;

    // Use ringkasan from AI output; fallback to a generic message
    const displayAdvice = tripInfo.ringkasan ||
      `Rencana perjalanan ke ${tripInfo.destination} telah disiapkan secara khusus berdasarkan preferensi Anda. Pastikan membawa sepatu yang nyaman dan menikmati setiap momen bersama ${tripInfo.companions}.`;

    // Extract day count and night count from duration string, or derive from days array
    const dayCountMatch = tripInfo.duration.match(/(\d+)\s*Hari/);
    const nightCountMatch = tripInfo.duration.match(/(\d+)\s*Malam/);
    const displayDays = dayCountMatch ? dayCountMatch[1] : String(itineraryDays.length);
    const displayNights = nightCountMatch ? nightCountMatch[1] : String(Math.max(itineraryDays.length - 1, 0));

    const handleDownloadPdf = () => {
      if (itineraryDays.length === 0) return;
      try {
        downloadRundownPdf(
          {
            destination: tripInfo.destination,
            companions: tripInfo.companions,
            duration: tripInfo.duration,
            judul: tripInfo.judul,
            ringkasan: tripInfo.ringkasan || displayAdvice,
            estimasi: tripInfo.estimasi,
            tips: tripInfo.tips,
          },
          itineraryDays,
        );
      } catch (err) {
        console.error('Gagal membuat PDF rundown:', err);
        alert('Maaf, terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
      }
    };

    return (
      <main className="min-h-screen bg-[#FAF8F7] pt-[96px] pb-16 px-4 md:px-8 lg:px-12 flex flex-col gap-6 overflow-visible">
        {/* Back Button */}
        <div className="max-w-[1440px] mx-auto w-full flex-shrink-0 flex items-center justify-between">
          <button
            onClick={() => setShowResultScreen(false)}
            className="flex items-center gap-2 text-[#5F1712] hover:text-[#4E130E] font-manrope font-semibold text-[13px] transition-all cursor-pointer bg-white px-4 py-2 rounded-xl border border-[#F3DDDB]/50 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            <span>Kembali ke Perencanaan</span>
          </button>
        </div>

        {/* 2-Column Responsive Split */}
        <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row gap-8 items-start animate-fade-in overflow-visible">
          
          {/* ── Left Column (Itinerary Cards) ── */}
          <div className="w-full lg:w-[32%] flex flex-col gap-6 flex-shrink-0 static lg:sticky top-auto lg:top-24 self-start z-10">
            
            {/* Top Card */}
            <div className="bg-white border border-[#F3DDDB]/30 rounded-[24px] p-6 flex flex-col gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-noto font-bold text-[#1A1C1A] text-[20px] leading-tight">
                    {tripInfo.judul}
                  </h2>
                  <p className="font-manrope font-normal text-[#554240] text-[13px] mt-1.5 leading-snug">
                    Rekomendasi Perjalanan Khusus dari AI
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#FAF6F4] flex items-center justify-center flex-shrink-0 border border-[#F3DDDB]/30">
                  <img src={campSvg} alt="" className="w-6 h-6 object-contain" />
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Duration */}
                <div className="bg-[#FAF9F6] rounded-[18px] p-4 flex flex-col items-center text-center justify-center border border-neutral-100">
                  <img src={kalendarSvg} alt="" className="w-5 h-5 mb-2 object-contain" />
                  <span className="font-manrope font-semibold text-[#1A1C1A] text-[14px]">
                    {displayDays} Hari
                  </span>
                  <span className="font-manrope font-medium text-[#554240] text-[12px] mt-0.5">
                    {displayNights} Malam
                  </span>
                </div>

                {/* Travelers count */}
                <div className="bg-[#FAF9F6] rounded-[18px] p-4 flex flex-col items-center text-center justify-center border border-neutral-100">
                  <img src={orngSvg} alt="" className="w-5 h-5 mb-2 object-contain" />
                  <span className="font-manrope font-semibold text-[#1A1C1A] text-[14px]">
                    {tripInfo.companions}
                  </span>
                  <span className="font-manrope font-medium text-[#554240] text-[12px] mt-0.5">
                    Wisatawan
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDownloadPdf}
                  className="w-full h-12 bg-[#5F1712] hover:bg-[#4E130E] text-white flex items-center justify-center gap-2 rounded-xl font-manrope text-[13.5px] font-medium transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
                >
                  <img src={pdfSvg} alt="" className="w-4 h-4 object-contain invert brightness-0" style={{ filter: 'brightness(0) invert(1)' }} />
                  <span>Unduh Rundown (PDF)</span>
                </button>

              </div>

            </div>

            {/* Bottom Card (AI Advisor) */}
            <div className="bg-white border border-[#F3DDDB]/30 rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                <img src={alSvg} alt="" className="w-4.5 h-4.5 object-contain" />
                <span className="font-manrope font-semibold text-[#5F1712] text-[13px] tracking-wider uppercase">
                  AI Konsultan Perjalanan
                </span>
              </div>
              <p className="font-manrope font-normal text-[#1A1C1A] text-[13.5px] leading-relaxed italic text-neutral-600">
                "{displayAdvice}"
              </p>
              {tripInfo.estimasi && (
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                  <span className="font-manrope font-semibold text-[#554240] text-[11px] tracking-wider uppercase">Estimasi Biaya:</span>
                  <span className="font-manrope font-medium text-[#1A1C1A] text-[12px]">{tripInfo.estimasi}</span>
                </div>
              )}
              {tripInfo.tips && (
                <div className="flex items-center gap-2">
                  <span className="font-manrope font-semibold text-[#554240] text-[11px] tracking-wider uppercase">Tips:</span>
                  <span className="font-manrope font-medium text-[#1A1C1A] text-[12px]">{tripInfo.tips}</span>
                </div>
              )}
            </div>

          </div>

          {/* ── Right Column (Day Rundown Timeline) ── */}
          <div className="w-full lg:w-[68%] flex flex-col gap-6">
            
            {visibleDays.map((day) => (
              <div 
                key={day.dayNumber}
                className="bg-white border border-[#F3DDDB]/30 rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex flex-col"
              >
                {/* Header */}
                <div className="bg-[#F4F3F0] px-4 sm:px-6 py-4 flex items-center justify-between border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#5F1712] text-white font-bold flex items-center justify-center text-[12.5px]">
                      {day.dayNumber}
                    </div>
                    <h3 className="font-noto font-bold text-[#5F1712] text-[15px] sm:text-[16px] md:text-[17px]">
                      Hari {day.dayNumber}: {day.title}
                    </h3>
                  </div>
                  <span className="font-manrope font-semibold text-[#8D726D] text-[10px] tracking-widest uppercase">
                    {day.fokus}
                  </span>
                </div>

                {/* Table Header Row (Desktop only) */}
                <div className="hidden sm:grid grid-cols-12 bg-[#EFEEEB] px-6 py-3.5 text-[11px] font-manrope font-semibold text-[#554240] tracking-wider uppercase border-b border-neutral-150/40">
                  <div className="col-span-2">Waktu</div>
                  <div className="col-span-3">Aktivitas</div>
                  <div className="col-span-3">Lokasi</div>
                  <div className="col-span-4">Catatan & Deskripsi</div>
                </div>

                {/* Table Body Rows (Responsive Desktop & Mobile) */}
                <div className="flex flex-col">
                  {day.activities.map((act, actIdx) => (
                    <Fragment key={actIdx}>
                      {/* Desktop Row View */}
                      <div 
                        className="hidden sm:grid grid-cols-12 px-6 py-4.5 border-b border-neutral-100/60 last:border-b-0 hover:bg-neutral-50/50 transition-colors items-start"
                      >
                        <div className="col-span-2 font-manrope font-medium text-[#554240] text-[13px]">
                          {act.waktu}
                        </div>
                        <div className="col-span-3 font-manrope font-bold text-[#5F1712] text-[13.5px] leading-snug pr-3">
                          {act.aktivitas}
                        </div>
                        <div className="col-span-3 font-manrope font-medium text-[#554240] text-[13px] pr-3">
                          {act.lokasi}
                        </div>
                        <div className="col-span-4 font-manrope font-medium text-[#554240] text-[13px] leading-relaxed">
                          {act.deskripsi}
                        </div>
                      </div>

                      {/* Mobile Card Row View */}
                      <div className="sm:hidden p-4 border-b border-neutral-100/80 last:border-b-0 flex flex-col gap-2 bg-white">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 font-manrope font-semibold text-[11.5px] text-[#5F1712] bg-[#FAF3F2] px-2.5 py-1 rounded-full border border-[#F3DDDB]/60">
                            ⏱️ {act.waktu}
                          </span>
                          <span className="inline-flex items-center gap-1 font-manrope font-medium text-[11.5px] text-[#554240] bg-neutral-100 px-2.5 py-1 rounded-full">
                            📍 {act.lokasi}
                          </span>
                        </div>
                        <h4 className="font-manrope font-bold text-[#5F1712] text-[13.5px] leading-snug">
                          {act.aktivitas}
                        </h4>
                        <p className="font-manrope font-normal text-[#554240] text-[12px] leading-relaxed">
                          {act.deskripsi}
                        </p>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4 mb-8">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed font-manrope font-medium text-[13px] text-[#554240] cursor-pointer transition-colors"
                >
                  Sebelumnya
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-manrope font-bold text-[13px] cursor-pointer transition-all ${
                      currentPage === i + 1
                        ? 'bg-[#5F1712] text-white shadow-md'
                        : 'border border-neutral-200 hover:bg-neutral-50 text-[#554240]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed font-manrope font-medium text-[13px] text-[#554240] cursor-pointer transition-colors"
                >
                  Berikutnya
                </button>
              </div>
            )}

          </div>

        </div>
      </main>
    );
  }

  return (
    <main
      ref={revealRef}
      className={`min-h-screen bg-[#FAF8F7] flex flex-col lg:flex-row pt-[76px] overflow-x-hidden transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >

      {/* ── Left Column (50% Split) ── */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 md:p-8 lg:p-10 justify-between border-b lg:border-b-0 lg:border-r border-[#D6B8B3]/30 h-[calc(100vh-76px)] lg:min-h-[680px] min-h-0">
        
        {/* Welcome Card & Conversation scrollable container */}
        <div className="flex-1 flex flex-col min-h-0">
          
          {/* Conversation Area (Scrollable messages) */}
          <div ref={chatMessagesContainerRef} className="flex-1 overflow-y-auto mb-4 pr-2 space-y-4 min-h-0">
            {chatLog.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'user' ? (
                  <div className="max-w-[85%] rounded-2xl px-5 py-3.5 text-[13.5px] leading-[1.65] font-poppins bg-[#6B2D22] text-white rounded-br-none shadow-sm">
                    {msg.text}
                  </div>
                ) : (
                  <div className="flex flex-col items-start gap-1 w-full">
                    {/* Bot Message Bubble (replaces static welcome card style if it is first message) */}
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-[13.5px] leading-[1.65] font-poppins ${
                        msg.isItinerary
                          ? 'bg-white text-[#4A2C27] border border-[#D6B8B3]/50 shadow-md p-6 rounded-bl-none whitespace-pre-line prose max-w-[90%]'
                          : idx === 0
                          ? 'bg-[#F5F5F5] text-[#4A2C27] border border-neutral-200/40 shadow-[0_4px_24px_rgba(0,0,0,0.02)] rounded-[18px]'
                          : 'bg-white text-[#4A2C27] border border-neutral-100 shadow-[0_2px_12px_rgba(0,0,0,0.015)] rounded-bl-none'
                      }`}
                    >
                      {idx === 0 ? (
                        <div>
                          <h1 className="font-poppins font-bold text-[#6B2D22] text-xl mb-3 leading-snug">
                            Mari Rencanakan Perjalanan Anda
                          </h1>
                          {msg.text.replace('Mari Rencanakan Perjalanan Anda\n\n', '').split('\n\n').map((para, pIdx) => (
                            <p key={pIdx} className={pIdx > 0 ? 'mt-3' : ''}>
                              {para}
                            </p>
                          ))}
                        </div>
                      ) : msg.isItinerary ? (
                        <div className="space-y-2 itinerary-markdown">
                          {msg.text.split('\n').map((line, lIdx) => {
                            if (line.startsWith('###')) {
                              return <h3 key={lIdx} className="font-bold text-lg text-[#6B2D22] mt-2 mb-2">{line.replace('###', '')}</h3>;
                            }
                            if (line.startsWith('**')) {
                              const clean = line.replace(/\*\*/g, '');
                              return <p key={lIdx} className="font-semibold text-[#4A2C27] mt-3 mb-1">{clean}</p>;
                            }
                            if (line.startsWith('*')) {
                              return <li key={lIdx} className="ml-4 list-disc text-neutral-600 my-0.5">{line.substring(1).trim()}</li>;
                            }
                            return <p key={lIdx} className="my-1 text-neutral-600">{line}</p>;
                          })}
                        </div>
                      ) : (
                        msg.text.split('\n\n').map((para, pIdx) => (
                          <p key={pIdx} className={pIdx > 0 ? 'mt-2' : ''}>
                            {para}
                          </p>
                        ))
                      )}
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={() => { void navigator.clipboard.writeText(msg.text); }}
                      className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 ml-1 self-start cursor-pointer"
                      title="Copy text"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.25m10.5 8.25V4.875C15.75 4.17 15.18 3.6 14.475 3.6H5.25m10.5 8.25H12m3 0a2.25 2.25 0 0 0-2.25-2.25H5.25M15.75 15.75a2.25 2.25 0 0 1-2.25 2.25H5.25" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-white text-[#4A2C27] border border-neutral-100 rounded-2xl rounded-bl-none px-5 py-3.5 text-[13.5px] flex items-center gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
                  <span className="font-poppins text-neutral-500">AI sedang menyusun itinerary</span>
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#6B2D22] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#6B2D22] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#6B2D22] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

        </div>

        {/* Suggestion Chips, Input and Disclaimer container (Fixed at bottom) */}
        <div className="space-y-4 w-full mt-2 flex-shrink-0">
          
          {/* Suggestion Chips */}
          {currentStep < 5 && (
            <div className="flex flex-wrap gap-2 max-w-[520px]">
              {chipSets[currentStep]?.map((chip) => (
                <button
                  key={chip.text}
                  onClick={() => { void handleNextStep(chip.text); }}
                  className={`bg-white hover:bg-[#F3DDDB]/10 active:scale-95 border rounded-full px-4 py-2 text-[12px] md:text-[13px] font-medium font-poppins transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 cursor-pointer ${chip.borderColor} ${chip.textColor}`}
                >
                  {chip.text}
                </button>
              ))}
            </div>
          )}

          {/* AI Chat Input Box */}
          <div className="bg-[#EAE8E6] rounded-[16px] p-4 max-w-[520px] w-full flex flex-col justify-between h-[120px] focus-within:shadow-[0_0_12px_rgba(214,184,179,0.15)] transition-all duration-300">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ceritakan perjalanan impian Anda..."
              disabled={currentStep >= 5}
              className="bg-transparent border-none outline-none font-poppins text-[13.5px] text-[#4A2C27] placeholder-neutral-400 w-full px-1"
            />
            
            <div className="flex items-center justify-between">
              {/* Bottom Left Icons */}
              <div className="flex items-center gap-2.5 pl-1">
                {/* Attachment */}
                <button
                  onClick={handleAttachment}
                  className="hover:opacity-75 transition-opacity duration-200 cursor-pointer"
                  title="Lampirkan file"
                >
                  <img src={linkSvg} alt="Attachment" className="w-[22px] h-[22px]" />
                </button>

                {/* Calendar date picker */}
                <button
                  onClick={handleCalendar}
                  className="hover:opacity-75 transition-opacity duration-200 cursor-pointer"
                  title="Pilih tanggal"
                >
                  <img src={kalendSvg} alt="Calendar" className="w-[22px] h-[22px]" />
                </button>

                {/* Voice input */}
                <button
                  onClick={handleVoice}
                  className={`transition-all duration-200 cursor-pointer ${
                    isListening
                      ? 'opacity-100 scale-110 drop-shadow-[0_0_6px_rgba(107,45,34,0.6)] animate-pulse'
                      : 'hover:opacity-75'
                  }`}
                  title={isListening ? 'Sedang mendengarkan...' : 'Input suara'}
                >
                  <img src={voicSvg} alt="Voice" className="w-[22px] h-[22px]" />
                </button>
              </div>

              {/* Bottom Right Send Button */}
              <button
                onClick={handleSend}
                disabled={currentStep >= 5}
                className="w-9 h-9 bg-[#5E1D1D] hover:bg-[#6B2D22] text-white flex items-center justify-center rounded-[10px] shadow-md transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                </svg>
              </button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Hidden date input */}
            <input
              ref={dateInputRef}
              type="date"
              className="hidden"
              onChange={handleDateChange}
            />

          </div>

          {/* Disclaimer */}
          <div className="text-center max-w-[520px]">
            <p className="font-poppins text-neutral-400 text-[11px]">
              AI-assisted travel service. Check important info.
            </p>
          </div>
        </div>

      </div>

      {/* ── Right Column (50% Split) ── */}
      <div className="w-full lg:w-1/2 bg-[#F3DDDB] p-6 md:p-8 lg:p-12 flex flex-col justify-between h-[calc(100vh-76px)] lg:min-h-[680px]">
        
        {/* Progress Header */}
        <div className="flex items-center gap-5 mb-6 flex-shrink-0">
          {/* Progress Circular Wheel */}
          <div className="w-[72px] h-[72px] rounded-full border-[5px] border-[#6B2D22] flex items-center justify-center bg-transparent flex-shrink-0">
            <span className="font-poppins font-bold text-[22px] text-[#6B2D22]">
              {currentStep}/5
            </span>
          </div>

          <div className="flex-1">
            <span className="font-manrope font-semibold text-[11px] tracking-[0.2em] text-[#88726F] uppercase block mb-1">
              Rencana Perjalanan
            </span>
            <h2 className="font-cormorant font-bold text-[#1A1C1A] text-xl md:text-2xl leading-tight">
              Rancang Petualangan Anda di Bukittinggi
            </h2>
            <span className="font-manrope font-normal text-[#554240] text-[12px] block mt-1">
              {currentStep} dari 5 langkah selesai
            </span>
          </div>
        </div>


        {/* Vertical Timeline */}
        <div className="relative flex-1 pl-4 mb-6 space-y-6 overflow-y-auto min-h-0">
          {timelineSteps.map((step, idx) => {
            const isActive = currentStep === idx;
            const isCompleted = currentStep > idx;

            return (
              <div 
                key={step.label} 
                className="relative z-10 flex items-start gap-5 transition-opacity duration-300"
                style={{ opacity: isCompleted || isActive ? 1 : 0.45 }}
              >
                {/* Node circle with dynamic line segments */}
                <div className="flex flex-col items-center flex-shrink-0 relative">
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-500 bg-white flex-shrink-0 z-10 ${
                      isCompleted 
                        ? 'border-[#6B2D22] text-[#6B2D22] shadow-sm'
                        : isActive 
                        ? 'border-[#6B2D22] text-[#6B2D22] shadow-[0_0_12px_rgba(107,45,34,0.15)] font-bold'
                        : 'border-[#E9D2CF]'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${isCompleted || isActive ? 'bg-[#6B2D22]' : 'bg-transparent'}`} />
                  </div>
                  {idx < timelineSteps.length - 1 && (
                    <div 
                      className={`w-[1.5px] absolute top-7 bottom-[-32px] transition-all duration-500 ${
                        currentStep >= idx + 1 ? 'bg-[#88726F]' : 'bg-transparent'
                      }`}
                      style={{ zIndex: 0 }}
                    />
                  )}
                </div>

                {/* Step Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <img src={step.icon} alt="" className="w-3.5 h-3.5 object-contain" />
                    <span className="font-manrope font-semibold text-[11px] md:text-[12px] tracking-wider text-[#88726F]">
                      {step.label}
                    </span>
                  </div>
                  <p className="font-manrope font-normal text-[13.5px] text-[#1A1C1A] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary CTA Card */}
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-[#F3DDDB]/50 p-6 flex-shrink-0">
          <button
            onClick={() => { void generateItinerary(); }}
            disabled={currentStep < 5}
            className={`w-full h-[60px] rounded-[14px] flex items-center justify-center gap-2.5 text-white font-poppins font-bold text-[17px] shadow-sm transform transition-all duration-300 cursor-pointer ${
              currentStep >= 5
                ? 'bg-[#6B2D22] hover:bg-[#5E1D1D] hover:scale-[1.02] shadow-[0_6px_20px_rgba(107,45,34,0.25)]'
                : 'bg-[#B8A6A2] hover:scale-[1.01]'
            }`}
          >
            <img src={aiSvg} alt="AI Icon" className="w-5 h-5 object-contain" />
            <span>Buat Rencana Perjalanan</span>
          </button>
          
          <p className="font-manrope text-center text-neutral-400 text-[11px] leading-relaxed mt-3.5 px-4">
            AI Bukittinggi Heritage akan menyusun itinerary yang sesuai dengan minat, waktu, dan kebutuhan perjalanan Anda.
          </p>
        </div>

      </div>

      {/* ── Custom Date Picker Modal Popup ── */}
      {isDatePickerOpen && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[900px] max-h-[90vh] flex flex-col relative font-manrope overflow-hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 sm:px-8 py-5 border-b border-neutral-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-[48px] h-[48px] rounded-full bg-[#6B2D22] flex items-center justify-center flex-shrink-0">
                  <img src={kalendSvg} alt="" className="w-5 h-5 invert brightness-0" style={{ filter: 'brightness(0) invert(1)' }} />
                </div>
                <div>
                  <h2 className="font-cormorant font-bold text-[#1A1C1A] text-[22px] leading-tight">
                    Pilih Tanggal Perjalanan
                  </h2>
                  <p className="text-neutral-500 text-[13px] mt-0.5">
                    Pilih tanggal berangkat dan tanggal pergi untuk perjalananmu
                  </p>
                </div>
              </div>

              {/* Close button */}
              <button 
                onClick={() => setIsDatePickerOpen(false)}
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Modal Content (Scrollbar hidden) */}
            <div className="flex-1 overflow-y-auto hide-scrollbar scrollbar-none p-6 sm:p-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

            {/* Side-by-Side Calendars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              
              {/* 1. Left Card: Tanggal Berangkat */}
              <div className="border border-[#F3DDDB]/50 rounded-[20px] p-6 bg-white shadow-sm flex flex-col">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <img src={pesaSvg} alt="" className="w-4 h-4 object-contain" />
                  <span className="text-[#6B2D22] font-semibold text-[13px] tracking-wide uppercase">
                    Tanggal Berangkat
                  </span>
                </div>

                {/* Calendar Controls */}
                <div className="flex items-center justify-between mb-4 px-2">
                  <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-neutral-100 cursor-pointer">
                    <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <span className="font-bold text-[14px] text-[#1A1C1A]">
                    {getMonthName(displayMonth)} {displayYear}
                  </span>
                  <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-neutral-100 cursor-pointer">
                    <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 text-center text-[11px] font-medium text-neutral-400 mb-3">
                  <div>Sen</div>
                  <div>Sel</div>
                  <div>Rab</div>
                  <div>Kam</div>
                  <div>Jum</div>
                  <div>Sab</div>
                  <div>Min</div>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-y-1.5 text-center text-[12.5px]">
                  {getCalendarDays(displayMonth, displayYear).map((cell, cIdx) => {
                    const isSelected = isSameDay(cell.date, departureDate);
                    const isInRange = isBetweenDates(cell.date);
                    const isReturning = isSameDay(cell.date, returnDate);

                    let cellClass = "w-9 h-9 mx-auto flex items-center justify-center rounded-full transition-all cursor-pointer ";
                    if (isSelected || isReturning) {
                      cellClass += "bg-[#6B2D22] text-white font-bold";
                    } else if (isInRange) {
                      cellClass += "bg-[#F3DDDB] text-[#6B2D22] rounded-none";
                    } else if (!cell.isCurrentMonth) {
                      cellClass += "text-neutral-300";
                    } else {
                      cellClass += "text-neutral-700 hover:bg-neutral-100";
                    }

                    return (
                      <div key={`left-${cIdx}`} className="relative py-0.5">
                        <div 
                          onClick={() => {
                            setDepartureDate(cell.date);
                            if (returnDate && cell.date.getTime() >= returnDate.getTime()) {
                              setReturnDate(new Date(cell.date.getTime() + 24 * 60 * 60 * 1000));
                            }
                          }}
                          className={cellClass}
                        >
                          {cell.date.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Right Card: Tanggal Pulang */}
              <div className="border border-[#F3DDDB]/50 rounded-[20px] p-6 bg-white shadow-sm flex flex-col">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <img src={flagPng} alt="" className="w-4 h-4 object-contain" />
                  <span className="text-[#6B2D22] font-semibold text-[13px] tracking-wide uppercase">
                    Tanggal Pulang
                  </span>
                </div>

                {/* Calendar Controls */}
                <div className="flex items-center justify-between mb-4 px-2">
                  <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-neutral-100 cursor-pointer">
                    <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <span className="font-bold text-[14px] text-[#1A1C1A]">
                    {getMonthName(displayMonth)} {displayYear}
                  </span>
                  <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-neutral-100 cursor-pointer">
                    <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 text-center text-[11px] font-medium text-neutral-400 mb-3">
                  <div>Sen</div>
                  <div>Sel</div>
                  <div>Rab</div>
                  <div>Kam</div>
                  <div>Jum</div>
                  <div>Sab</div>
                  <div>Min</div>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-y-1.5 text-center text-[12.5px]">
                  {getCalendarDays(displayMonth, displayYear).map((cell, cIdx) => {
                    const isSelected = isSameDay(cell.date, departureDate);
                    const isInRange = isBetweenDates(cell.date);
                    const isReturning = isSameDay(cell.date, returnDate);

                    let cellClass = "w-9 h-9 mx-auto flex items-center justify-center rounded-full transition-all cursor-pointer ";
                    if (isSelected || isReturning) {
                      cellClass += "bg-[#6B2D22] text-white font-bold";
                    } else if (isInRange) {
                      cellClass += "bg-[#F3DDDB] text-[#6B2D22] rounded-none";
                    } else if (!cell.isCurrentMonth) {
                      cellClass += "text-neutral-300";
                    } else {
                      cellClass += "text-neutral-700 hover:bg-neutral-100";
                    }

                    return (
                      <div key={`right-${cIdx}`} className="relative py-0.5">
                        <div 
                          onClick={() => {
                            if (departureDate && cell.date.getTime() < departureDate.getTime()) {
                              setDepartureDate(cell.date);
                              setReturnDate(null);
                            } else {
                              setReturnDate(cell.date);
                            }
                          }}
                          className={cellClass}
                        >
                          {cell.date.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bottom summary card: Ringkasan Perjalanan */}
            <div className="relative bg-[#FAF5F2] border border-[#F3DDDB]/50 rounded-[20px] p-5 flex items-center justify-between overflow-hidden mb-8 min-h-[100px]">
              {/* Background image sawah.webp absolute right, covering half, beautifully faded */}
              <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none select-none">
                <img src={sawahPng} alt="" className="h-full w-full object-cover object-right" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#FAF5F2] via-[#FAF5F2]/80 to-transparent" />
              </div>

              <div className="relative z-10 flex items-center gap-4">
                <div className="w-[48px] h-[48px] rounded-full bg-[#8D726D] flex items-center justify-center flex-shrink-0 text-white">
                  {/* Suitcase SVG */}
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5h-16.5A2.25 2.25 0 0 0 1.5 9.75v8.25A2.25 2.25 0 0 0 3.75 20.25h16.5A2.25 2.25 0 0 0 22.5 18V9.75A2.25 2.25 0 0 0 20.25 7.5Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V4.5a2.25 2.25 0 0 1 2.25-2.25h3a2.25 2.25 0 0 1 2.25 2.25V7.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.25v4.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[15px] text-[#1A1C1A]">Ringkasan Perjalanan</h3>
                  <p className="text-[#6B2D22] font-semibold text-[13px] mt-0.5">
                    {departureDate && returnDate 
                      ? `${Math.ceil(Math.abs(returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} hari perjalanan`
                      : 'Pilih tanggal perjalanan'
                    }
                  </p>
                  <p className="text-neutral-500 text-[12px] mt-0.5">
                    {departureDate && returnDate 
                      ? `${formatDateShort(departureDate)} - ${formatDateShort(returnDate)}`
                      : 'Silakan klik tanggal keberangkatan dan pulang pada kalender di atas'
                    }
                  </p>
                </div>
              </div>

              {/* Right indicator badge */}
              {departureDate && returnDate && (
                <div className="relative z-10 mr-4 bg-[#6B2D22] text-white font-semibold text-[13px] px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm">
                  <img src={kalendSvg} alt="" className="w-3.5 h-3.5 invert brightness-0" style={{ filter: 'brightness(0) invert(1)' }} />
                  <span>{Math.ceil(Math.abs(returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} Hari</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-neutral-100 pt-6">
              <div className="flex items-center gap-2 text-neutral-500 text-[12px]">
                <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 1 1 1.063 1.06l-.041.02-.04-.02a.75.75 0 0 1 1.063-1.06l.04.02zm0 4.5.041-.02a.75.75 0 1 1 1.063 1.06l-.041.02-.04-.02a.75.75 0 0 1 1.063-1.06l.04.02zM12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z" />
                </svg>
                <span>Kamu bisa mengubah tanggal nanti</span>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsDatePickerOpen(false)}
                  className="px-6 py-2.5 border border-neutral-200 hover:bg-neutral-50 text-[#1A1C1A] text-[14px] font-medium rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  onClick={() => {
                    if (departureDate && returnDate) {
                      const diff = Math.ceil(Math.abs(returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                      const msgText = `Rencana perjalanan ${diff} hari dari tanggal ${departureDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} hingga ${returnDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
                      void handleNextStep(msgText);
                    }
                    setIsDatePickerOpen(false);
                  }}
                  disabled={!departureDate || !returnDate}
                  className="px-6 py-2.5 bg-[#6B2D22] hover:bg-[#5E1D1D] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-medium rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Konfirmasi Tanggal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    , document.body)}
    </main>
  );
}

export default TravelPlannerPage;
