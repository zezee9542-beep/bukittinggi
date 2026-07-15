import * as React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import chtPng from '../assets/cht.png';
import enterPng from '../assets/enter.png';

// Inject float keyframe once
const FLOAT_STYLE = `
@keyframes rancakbotFloat {
  0%   { transform: translateY(0px) rotate(-1deg); }
  30%  { transform: translateY(-10px) rotate(0.5deg); }
  60%  { transform: translateY(-6px) rotate(-0.5deg); }
  100% { transform: translateY(0px) rotate(-1deg); }
}
.rancakbot-float {
  animation: rancakbotFloat 3.6s ease-in-out infinite;
  transform-origin: bottom center;
}
`;

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          'auto-rotate'?: boolean;
          'camera-controls'?: boolean;
          'disable-zoom'?: boolean;
          'shadow-intensity'?: string;
          'environment-image'?: string;
          'auto-rotate-delay'?: string;
          'interaction-prompt'?: string;
          loading?: string;
          reveal?: string;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
}

const PRESET_QAS = [
  {
    q: 'Sejarah Jam Gadang?',
    a: 'Jam Gadang dibangun pada tahun 1926 oleh arsitek Yazid Rajo Mangkuto sebagai hadiah dari Ratu Belanda kepada secretaris kota Rookmaaker. Keunikan Jam Gadang terletak pada angka romawi IIII (bukan IV) dan mesin jam legendaris Vortmann — satu lagi ada di Big Ben London.',
  },
  {
    q: 'Kuliner wajib Bukittinggi?',
    a: 'Kuliner wajib Bukittinggi antara lain Nasi Kapau, Itiak Lado Mudo (bebek sambal hijau pedas gurih), Ampiang Dadiah (susu kerbau fermentasi dengan emping beras dan gula merah), dan kerupuk Sanjai yang renyah.',
  },
  {
    q: 'Rekomendasi destinasi alam?',
    a: 'Destinasi alam terpopuler meliputi Ngarai Sianok yang megah, Lobang Jepang (terowongan pertahanan bersejarah), Janjang Koto Gadang (mirip Tembok Besar Cina), dan Danau Maninjau yang memukau.',
  },
  {
    q: 'Mengapa Parijs van Sumatra?',
    a: 'Bukittinggi dijuluki "Parijs Van Sumatra" karena keindahan alamnya yang memesona, udaranya sejuk dikelilingi pegunungan Marapi dan Singgalang, serta perannya sebagai pusat perdagangan dan kebudayaan penting di Pulau Sumatera.',
  },
];

// ── Constants ─────────────────────────────────────────────────────────────
const CHAR_W = 115;    // character container width
const CHAR_H = 125;    // character container height
const WRAP_W = 360;    // outer closed-state wrapper width

// Head top-left position within the WRAP_W container:
//   character left edge = WRAP_W - CHAR_W = 245px
//   head left offset within character ≈ 30px → 275px from wrapper-left
//   head top offset within character ≈ 10px → 10px from wrapper-top
// Bubble bottom-right corner should be here + small gap (3px up, 5px left):
//   right = WRAP_W - 275 + 5 = 90px from wrapper-right
//   bottom = CHAR_H - 10 + 3 = 118px from wrapper-bottom
const BUBBLE_RIGHT  = WRAP_W - (WRAP_W - CHAR_W + 30) + 5;   // ≈ 90
const BUBBLE_BOTTOM = CHAR_H - 10 + 3;                        // ≈ 118

export function RancakBotWidget() {
  const [wantsOpen, setWantsOpen] = useState(false);   // user intent
  const [mounted, setMounted]     = useState(false);   // modal in DOM
  const [visible, setVisible]     = useState(false);   // CSS animate-in class
  const [messages, setMessages]   = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Inject float keyframe style into DOM once
  useEffect(() => {
    if (document.getElementById('rancakbot-style')) return;
    const el = document.createElement('style');
    el.id = 'rancakbot-style';
    el.textContent = FLOAT_STYLE;
    document.head.appendChild(el);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Open: mount then animate-in on next frame
  const openModal = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setWantsOpen(true);
    setMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }, []);

  // Close: animate-out then unmount
  const closeModal = useCallback(() => {
    setWantsOpen(false);
    setVisible(false);
    closeTimerRef.current = setTimeout(() => setMounted(false), 380);
  }, []);

  const handleSend = useCallback((text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputText('');
    setIsTyping(true);
    setTimeout(() => {
      const matched = PRESET_QAS.find((item) =>
        text.toLowerCase().split(' ').some(
          (word) => word.length > 3 && item.q.toLowerCase().includes(word)
        )
      );
      let reply =
        'Maaf dunsanak, ambo alum tahu jawabannyo. Cubo tanyokan perihal sejarah Jam Gadang, kuliner khas, atau destinasi alam Bukittinggi!';
      if (matched) reply = matched.a;
      else if (text.toLowerCase().includes('halo') || text.toLowerCase().includes('hai'))
        reply = 'Halo dunsanak! Rancak bana tanyo tu. Ado nan bisa ambo bantu terkait Bukittinggi?';
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
      setIsTyping(false);
    }, 1200);
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          CLOSED STATE — bubble sits precisely above head's top-left
      ═══════════════════════════════════════════════════════════ */}
      {!wantsOpen && (
        <div
          className="fixed z-50 pointer-events-none overflow-visible"
          style={{
            bottom: '20px',
            right: '12px',
            width: `${WRAP_W}px`,
            height: `${CHAR_H}px`,
          }}
        >
          {/* 3D Character — anchored at bottom-right of wrapper, always floating */}
          <div
            className="absolute bottom-0 right-0 pointer-events-auto cursor-pointer rancakbot-float"
            style={{ width: `${CHAR_W}px`, height: `${CHAR_H}px` }}
            onClick={openModal}
          >
            <model-viewer
              src="/textured.glb"
              alt="RancakBot 3D Avatar"
              auto-rotate
              camera-controls={false}
              disable-zoom
              shadow-intensity="1"
              environment-image="neutral"
              auto-rotate-delay="0"
              interaction-prompt="none"
              loading="eager"
              style={{ width: '100%', height: '100%', background: 'transparent', outline: 'none' }}
            />
          </div>

          {/* Bubble — bottom-right corner (pointed) aligns with head top-left + small gap */}
          <div
            onClick={openModal}
            className="absolute pointer-events-auto cursor-pointer flex items-center gap-3 px-5 py-3.5 bg-[#4A0808] border-[1.5px] border-[#F9CE65] shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
            style={{
              right: `${BUBBLE_RIGHT}px`,    // positions bubble's right edge near head
              bottom: `${BUBBLE_BOTTOM}px`,  // positions bubble above head with small gap
              borderRadius: '24px 24px 0px 24px', // bottom-right is pointed → points to head
              whiteSpace: 'nowrap',
            }}
          >
            <div className="relative flex-shrink-0 w-[11px] h-[11px] rounded-full bg-[#00B242]">
              <div className="absolute inset-0 rounded-full bg-[#00B242] animate-ping opacity-70" />
            </div>
            <span className="font-poppins text-white text-[13px] font-semibold tracking-wide leading-none">
              Tanya Ambo RancakBot
            </span>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          OPEN STATE — chat modal (animated) + character side by side
      ═══════════════════════════════════════════════════════════ */}
      {mounted && (
        <div
          className="fixed z-50 flex flex-row items-end select-none pointer-events-none"
          style={{ bottom: '20px', right: '12px', gap: '10px' }}
        >
          {/* ── Chat Modal with enter/exit animation ── */}
          <div
            className="pointer-events-auto flex flex-col rounded-[24px] overflow-hidden border-[1.5px] border-[#F9CE65] shadow-[0_24px_55px_rgba(0,0,0,0.55)]"
            style={{
              background: '#3E0F0F',
              width: '360px',
              height: '510px',
              // Animation via CSS transition
              opacity: visible ? 1 : 0,
              transform: visible
                ? 'translateY(0px) scale(1)'
                : 'translateY(24px) scale(0.96)',
              transition: visible
                ? 'opacity 350ms cubic-bezier(0.16,1,0.3,1), transform 350ms cubic-bezier(0.16,1,0.3,1)'
                : 'opacity 300ms ease-in, transform 300ms ease-in',
              transformOrigin: 'bottom right',
            }}
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between bg-[#350A0A] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="relative flex items-center justify-center rounded-full w-[44px] h-[44px] border border-[#F9CE65] flex-shrink-0"
                  style={{ background: 'rgba(249,206,101,0.06)' }}
                >
                  <img
                    src={chtPng}
                    alt="Chat"
                    className="w-[20px] h-[20px] object-contain"
                    style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(4) hue-rotate(10deg)' }}
                  />
                  <div className="absolute bottom-[1px] right-[1px] w-[10px] h-[10px] rounded-full border-[1.5px] border-[#350A0A] bg-[#00B242]">
                    <div className="absolute inset-0 rounded-full bg-[#00B242] animate-ping opacity-70" />
                  </div>
                </div>
                <div>
                  <h5 className="font-cormorant font-bold text-[#F9CE65] text-[17px] leading-none tracking-wide">
                    Ambo RancakBot
                  </h5>
                  <span className="text-[9px] font-poppins text-white/60 tracking-[0.12em] uppercase mt-1 block">
                    ASISTEN ONLINE 24/7 BERBASIS AI.
                  </span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-white/60 hover:text-white/90 transition-colors cursor-pointer text-[16px] focus:outline-none flex-shrink-0"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            {/* Gold divider */}
            <div className="h-[1px] bg-[#F9CE65]/25 flex-shrink-0" />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#380C0C]">
              {/* Welcome */}
              <div
                className="max-w-[92%] px-5 py-4 text-[13px] font-poppins leading-relaxed text-white/90 bg-[#4A0E0E] border border-[#F9CE65]/20"
                style={{ borderRadius: '18px 18px 18px 0px' }}
              >
                Apo Kaba, Dunsanak? <em>(Apa kabar, saudara?)</em>. Ambo siap membantu informasi
                wisata, budaya, sejarah, dan kuliner khas Bukittinggi. Ado nan bisa ambo bantu hari
                ko? <em>(Ada yang bisa saya bantu hari ini?)</em>
              </div>

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[82%] px-4 py-2.5 text-[13px] leading-relaxed font-poppins ${
                      msg.sender === 'user'
                        ? 'bg-[#F9CE65] text-[#2A0606] font-medium'
                        : 'bg-[#4A0E0E] text-white/90 border border-[#F9CE65]/15'
                    }`}
                    style={{
                      borderRadius: msg.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div
                  className="flex items-center gap-1.5 bg-[#4A0E0E] border border-[#F9CE65]/15 px-4 py-3 w-[58px] justify-center"
                  style={{ borderRadius: '16px 16px 16px 0px' }}
                >
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Gold divider */}
            <div className="h-[1px] bg-[#F9CE65]/20 flex-shrink-0" />

            {/* Quick suggestions */}
            <div className="px-4 py-2 bg-[#320808] flex flex-wrap gap-1.5 flex-shrink-0">
              {PRESET_QAS.map((qa, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qa.q)}
                  className="text-[10px] font-poppins bg-[#4A0E0E]/40 hover:bg-[#4A0E0E] text-[#FFEAA7]/80 hover:text-[#FFEAA7] border border-[#F9CE65]/15 rounded-full px-2.5 py-1 cursor-pointer transition-all duration-150 focus:outline-none"
                >
                  {qa.q}
                </button>
              ))}
            </div>

            {/* Gold divider */}
            <div className="h-[1px] bg-[#F9CE65]/20 flex-shrink-0" />

            {/* Input bar */}
            <div className="p-4 bg-[#350A0A] flex-shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
                className="flex items-center gap-3 border-[1.5px] border-[#F9CE65] rounded-[16px] px-4 py-2.5 bg-[#3E0F0F]"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Apa yang ingin anda ketahui..."
                  className="flex-1 bg-transparent border-none text-[13px] text-white placeholder-white/40 focus:outline-none font-poppins"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 flex items-center justify-center bg-[#F9CE65] hover:bg-[#FFEAA7] rounded-[10px] w-[36px] h-[30px] transition-colors cursor-pointer focus:outline-none"
                  aria-label="Kirim"
                >
                  <img src={enterPng} alt="Send" className="w-[14px] h-[14px] object-contain" />
                </button>
              </form>
            </div>
          </div>

          {/* ── 3D Character (right, bottom-aligned, always visible and floating) ── */}
          <div
            onClick={closeModal}
            className="pointer-events-auto cursor-pointer flex-shrink-0 rancakbot-float"
            style={{ width: `${CHAR_W}px`, height: `${CHAR_H}px` }}
          >
            <model-viewer
              src="/textured.glb"
              alt="RancakBot 3D Avatar"
              auto-rotate
              camera-controls={false}
              disable-zoom
              shadow-intensity="1"
              environment-image="neutral"
              auto-rotate-delay="0"
              interaction-prompt="none"
              loading="eager"
              style={{ width: '100%', height: '100%', background: 'transparent', outline: 'none' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
