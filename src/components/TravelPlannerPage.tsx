import { useState, useRef, useEffect, useCallback } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { askTravelPlanner, type AiChatMessage } from '../lib/aiClient';

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

  // Scroll to bottom of chat when new message is added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, isGenerating]);

  // Step information
  const timelineSteps = [
    {
      label: 'TUJUAN WISATA',
      iconText: '📍',
      description: 'Belum tahu mau ke mana? Biarkan AI memberikan rekomendasi terbaik.',
    },
    {
      label: 'ASAL PERJALANAN',
      iconText: '✈️',
      description: 'Dari kota mana Anda memulai perjalanan?',
    },
    {
      label: 'TEMAN PERJALANAN',
      iconText: '👥',
      description: 'Siapa yang akan menemani perjalanan Anda?',
    },
    {
      label: 'WAKTU KUNJUNGAN',
      iconText: '📅',
      description: 'Kapan Anda berencana berkunjung?',
    },
    {
      label: 'MINAT PERJALANAN',
      iconText: '♡',
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
              <div className="flex items-center gap-3 text-neutral-400 pl-1">
                <button className="hover:text-[#6B2D22] transition-colors duration-200 cursor-pointer" title="Attachment">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739 11.16 20.1a5.002 5.002 0 0 1-7.072-7.073l7.918-7.917a4 4 0 0 1 5.657 5.656L9.82 18.662a2 2 0 1 1-2.829-2.829l6.938-6.937M18.375 12.739c.646-.646 1.01-1.526 1.01-2.443s-.364-1.797-1.01-2.443a3.456 3.456 0 0 0-4.89 0L5.56 15.772" />
                  </svg>
                </button>
                <button className="hover:text-[#6B2D22] transition-colors duration-200 cursor-pointer" title="Calendar">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                </button>
                <button className="hover:text-[#6B2D22] transition-colors duration-200 cursor-pointer" title="Voice Input">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                  </svg>
                </button>
              </div>

              {/* Bottom Right Send Button */}
              <button
                onClick={handleSend}
                disabled={currentStep >= 5}
                className="w-10 h-10 bg-[#5E1D1D] hover:bg-[#6B2D22] text-white flex items-center justify-center rounded-[12px] shadow-md transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                </svg>
              </button>
            </div>
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
            <span className="font-poppins font-bold text-[22px] text-[#4A2C27]">
              {currentStep}/5
            </span>
          </div>

          <div className="flex-1">
            <span className="font-poppins text-[10px] font-bold tracking-[0.2em] text-[#6B2D22] uppercase block mb-1">
              Rencana Perjalanan
            </span>
            <h2 className="font-cormorant font-bold text-[#4A2C27] text-xl md:text-2xl leading-tight">
              Rancang Petualangan Anda di Bukittinggi
            </h2>
            <span className="font-poppins text-neutral-500 text-[12px] block mt-1">
              {currentStep} dari 5 langkah selesai
            </span>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="relative flex-1 pl-4 mb-6 space-y-6 overflow-y-auto min-h-0">
          {/* Connecting Vertical Line */}
          <div 
            className="absolute left-[27px] top-[12px] bottom-[12px] w-[1.5px] bg-[#E9D2CF]" 
            style={{ zIndex: 0 }}
          />

          {timelineSteps.map((step, idx) => {
            const isActive = currentStep === idx;
            const isCompleted = currentStep > idx;

            return (
              <div 
                key={step.label} 
                className="relative z-10 flex items-start gap-5 transition-opacity duration-300"
                style={{ opacity: isCompleted || isActive ? 1 : 0.45 }}
              >
                {/* Node circle */}
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-500 bg-white flex-shrink-0 ${
                    isCompleted 
                      ? 'border-[#6B2D22] text-[#6B2D22] shadow-sm'
                      : isActive 
                      ? 'border-[#6B2D22] text-[#6B2D22] shadow-[0_0_12px_rgba(107,45,34,0.15)] font-bold'
                      : 'border-[#E9D2CF]'
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${isCompleted || isActive ? 'bg-[#6B2D22]' : 'bg-transparent'}`} />
                </div>

                {/* Step Details */}
                <div className="flex-1">
                  <h3 className="font-poppins font-semibold text-[11px] md:text-[12px] tracking-wider text-[#6B2D22] flex items-center gap-1.5">
                    <span>{step.iconText}</span>
                    <span>{step.label}</span>
                  </h3>
                  <p className="font-poppins text-[13px] text-[#4A2C27] mt-0.5 leading-relaxed">
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
            className={`w-full h-[60px] rounded-[14px] flex items-center justify-center gap-2 text-white font-poppins font-bold text-[17px] shadow-sm transform transition-all duration-300 cursor-pointer ${
              currentStep >= 5
                ? 'bg-[#6B2D22] hover:bg-[#5E1D1D] hover:scale-[1.02] shadow-[0_6px_20px_rgba(107,45,34,0.25)]'
                : 'bg-[#B8A6A2] hover:scale-[1.01]'
            }`}
          >
            <span className="text-xl">✦</span>
            <span>Buat Rencana Perjalanan</span>
          </button>
          
          <p className="font-poppins text-center text-neutral-400 text-[11px] leading-relaxed mt-3.5 px-4">
            AI Bukittinggi Heritage akan menyusun itinerary yang sesuai dengan minat, waktu, dan kebutuhan perjalanan Anda.
          </p>
        </div>

      </div>
    </main>
  );
}
