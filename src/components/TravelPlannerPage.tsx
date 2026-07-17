import { useState, useRef, useEffect, useCallback } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { askTravelPlanner, type AiChatMessage } from '../lib/aiClient';

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

// Custom PNG Asset Imports
import flagPng from '../assets/flag.png';
import sawahPng from '../assets/sawah.png';


interface Message {
  sender: 'bot' | 'user';
  text: string;
  isItinerary?: boolean;
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

  // Scroll to bottom of chat when new message is added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, isGenerating]);

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
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

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
  }, [currentStep, isGenerating, aiHistory]);

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
      setChatLog(prev => [...prev, { sender: 'bot', text: reply, isItinerary: true }]);
      setAiHistory(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setChatLog(prev => [
        ...prev,
        { sender: 'bot', text: 'Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi dalam beberapa saat.', isItinerary: false },
      ]);
    } finally {
      setIsGenerating(false);
    }
  }, [currentStep, isGenerating, aiHistory]);


  return (
    <main
      ref={revealRef}
      className={`min-h-screen bg-[#FAF8F7] flex flex-col lg:flex-row pt-[76px] transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* ── Left Column (50% Split) ── */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 md:p-8 lg:p-10 justify-between border-b lg:border-b-0 lg:border-r border-[#D6B8B3]/30 h-[650px] lg:h-[calc(100vh-120px)] lg:min-h-[680px] min-h-0">
        
        {/* Welcome Card & Conversation scrollable container */}
        <div className="flex-1 flex flex-col min-h-0">
          
          {/* Conversation Area (Scrollable messages) */}
          <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-4 min-h-0">
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
      <div className="w-full lg:w-1/2 bg-[#F3DDDB] p-6 md:p-8 lg:p-12 flex flex-col justify-between h-[650px] lg:h-[calc(100vh-120px)] lg:min-h-[680px] min-h-0">
        
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
      {isDatePickerOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[900px] max-h-[92vh] overflow-y-auto p-8 relative flex flex-col font-manrope">
            {/* Top-right close button */}
            <button 
              onClick={() => setIsDatePickerOpen(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-[52px] h-[52px] rounded-full bg-[#6B2D22] flex items-center justify-center flex-shrink-0">
                <img src={kalendSvg} alt="" className="w-6 h-6 invert brightness-0" style={{ filter: 'brightness(0) invert(1)' }} />
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
              {/* Background image sawah.png absolute right, covering half, beautifully faded */}
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
      )}
    </main>
  );
}
