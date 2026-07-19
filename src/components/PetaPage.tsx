import { useState, useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

// Asset imports for card thumbnails
import rectangle1 from '../assets/Rectangle 1432.png';
import rectangle2 from '../assets/Rectangle 1432 (1).png';
import rectangle3 from '../assets/Rectangle 1432 (2).png';
import rectangle4 from '../assets/Rectangle 1432 (3).png';
import rectangle5 from '../assets/Rectangle 1432 (4).png';
import rectangle6 from '../assets/Rectangle 1432 (5).png';
import rectangle7 from '../assets/Rectangle 1432 (6).png';
import rectangle8 from '../assets/Rectangle 1432 (7).png';
import rectangle9 from '../assets/Rectangle 1432 (8).png';

interface Destinasi {
  id: number;
  title: string;
  description: string;
  image: string;
  category: 'SEJARAH' | 'BUDAYA' | 'ALAM' | 'RELIGI';
  lat: number;
  lng: number;
  streetViewEmbedUrl?: string;
}

const DESTINASI_DATA: Destinasi[] = [
  {
    id: 1,
    title: 'Jam Gadang',
    description: 'Ikon Kota Bukittinggi yang menjadi simbol sejarah, budaya, dan kebanggaan masyarakat Minangkabau.',
    image: rectangle1,
    category: 'SEJARAH',
    lat: -0.305041,
    lng: 100.369463,
    streetViewEmbedUrl: 'https://maps.google.com/maps?q=&layer=c&cbll=-0.3052003,100.3698508&cbp=12,69.66,0,0,-4.55&ie=UTF8&output=embed',
  },
  {
    id: 2,
    title: 'Istano Basa Pagaruyung',
    description: 'Istana megah bersudut rumah gadang yang menjadi simbol kejayaan Kerajaan Minangkabau.',
    image: rectangle2,
    category: 'BUDAYA',
    lat: -0.471206,
    lng: 100.641617,
  },
  {
    id: 3,
    title: 'Benteng Fort De Kock',
    description: 'Benteng bersejarah peninggalan Belanda yang menjadi bukti saksi Perang Padri.',
    image: rectangle3,
    category: 'SEJARAH',
    lat: -0.300645,
    lng: 100.370211,
  },
  {
    id: 4,
    title: 'Museum Adat Baajuang',
    description: 'Museum budaya yang mengabadikan kekayaan tradisi Minangkabau dan benda bersejarah.',
    image: rectangle4,
    category: 'BUDAYA',
    lat: -0.302521,
    lng: 100.368812,
  },
  {
    id: 5,
    title: 'Lubang Jepang',
    description: 'Terowongan bersejarah peninggalan Jepang yang menyimpan kisah perjuangan masa lalu.',
    image: rectangle5,
    category: 'SEJARAH',
    lat: -0.308253,
    lng: 100.364402,
  },
  {
    id: 6,
    title: 'Panorama Bukittinggi',
    description: 'Lembah curam yang dikelilingi tebing tinggi dengan pemandangan alam memukau.',
    image: rectangle6,
    category: 'ALAM',
    lat: -0.307921,
    lng: 100.363124,
  },
  {
    id: 7,
    title: 'Rumah Bung Hatta',
    description: 'Rumah masa kecil Sang Proklamator Bung Hatta yang dilestarikan menjadi museum sejarah.',
    image: rectangle7,
    category: 'SEJARAH',
    lat: -0.302604,
    lng: 100.373902,
  },
  {
    id: 8,
    title: 'Lembah Harau',
    description: 'Lembah alami dengan tebing granit menjulang dan panorama air terjun menakjubkan.',
    image: rectangle8,
    category: 'ALAM',
    lat: -0.108512,
    lng: 100.672931,
  },
  {
    id: 9,
    title: 'Masjid Raya Bukittinggi',
    description: 'Masjid bersejarah di pusat Bukittinggi dengan arsitektur atap bertingkat khas Minangkabau.',
    image: rectangle9,
    category: 'RELIGI',
    lat: -0.305218,
    lng: 100.371253,
  },
];

const mapHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #FAF8F5; }
    
    /* Premium custom map styling showing high-detail roads and streets clearly */
    .leaflet-tile-container {
      filter: contrast(1.05) saturate(1.12) brightness(0.98);
    }
    
    /* Customized leaf popup styling */
    .leaflet-popup-content-wrapper {
      border-radius: 16px;
      font-family: 'Poppins', sans-serif;
      box-shadow: 0 8px 24px rgba(110, 31, 31, 0.12);
      border: 1.5px solid #D4A853;
      background: #FAF8F5 !important;
      padding: 4px;
    }
    .leaflet-popup-tip {
      background: #FAF8F5 !important;
      border-left: 1.5px solid #D4A853;
      border-bottom: 1.5px solid #D4A853;
    }
    .leaflet-popup-content h3 {
      margin: 4px 0 6px 0;
      color: #6E1F1F;
      font-weight: 600;
      font-size: 14px;
    }
    .leaflet-popup-content p {
      margin: 0;
      color: #444651;
      font-size: 11.5px;
      line-height: 1.45;
    }
    
    /* Highly unique traditional pin markers */
    .custom-pin {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .pin-marker {
      color: #D4A853;
      width: 28px;
      height: 36px;
      filter: drop-shadow(0 3px 6px rgba(0,0,0,0.25));
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .pin-pulse {
      position: absolute;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(110, 31, 31, 0.22);
      animation: pulsePin 1.8s infinite ease-out;
      pointer-events: none;
      display: none;
      z-index: -1;
    }
    .active-pin .pin-marker {
      color: #6E1F1F;
      transform: scale(1.22) translateY(-4px);
      filter: drop-shadow(0 6px 12px rgba(110, 31, 31, 0.38));
    }
    .active-pin .pin-pulse {
      display: block;
    }
    @keyframes pulsePin {
      0% { transform: scale(0.4); opacity: 0.8; }
      100% { transform: scale(1.3); opacity: 0; }
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const destinations = [
      { id: 1, title: 'Jam Gadang', lat: -0.305041, lng: 100.369463, desc: 'Ikon sejarah Bukittinggi.' },
      { id: 2, title: 'Istano Basa Pagaruyung', lat: -0.471206, lng: 100.641617, desc: 'Istana budaya Minangkabau.' },
      { id: 3, title: 'Benteng Fort De Kock', lat: -0.300645, lng: 100.370211, desc: 'Benteng bersejarah kolonial.' },
      { id: 4, title: 'Museum Adat Baajuang', lat: -0.302521, lng: 100.368812, desc: 'Museum budaya Minang.' },
      { id: 5, title: 'Lubang Jepang', lat: -0.308253, lng: 100.364402, desc: 'Terowongan gua peninggalan perang.' },
      { id: 6, title: 'Panorama Bukittinggi', lat: -0.307921, lng: 100.363124, desc: 'Ngarai Sianok yang memukau.' },
      { id: 7, title: 'Rumah Bung Hatta', lat: -0.302604, lng: 100.373902, desc: 'Museum sejarah Sang Proklamator.' },
      { id: 8, title: 'Lembah Harau', lat: -0.108512, lng: 100.672931, desc: 'Tebing granit & pemandangan alam.' },
      { id: 9, title: 'Masjid Raya Bukittinggi', lat: -0.305218, lng: 100.371253, desc: 'Masjid berasitektur tradisional.' }
    ];

    const map = L.map('map', { zoomControl: false }).setView([-0.305041, 100.369463], 13);

    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=smd6D2wHLLQ8DTIdGN31', {
      maxZoom: 20,
      attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap</a>',
      crossOrigin: true,
    }).addTo(map);

    const markers = {};

    destinations.forEach(dest => {
      const el = document.createElement('div');
      el.className = 'custom-pin';
      el.innerHTML = \`
        <div class="pin-pulse"></div>
        <div class="pin-marker">
          <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 0C6.268 0 0 6.268 0 14C0 24 14 36 14 36C14 36 28 24 28 14C28 6.268 21.732 0 14 0Z" fill="currentColor"/>
            <circle cx="14" cy="14" r="5.5" fill="white"/>
          </svg>
        </div>
      \`;

      const customIcon = L.divIcon({
        html: el,
        className: '',
        iconSize: [32, 36],
        iconAnchor: [16, 36]
      });

      const marker = L.marker([dest.lat, dest.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup('<h3>' + dest.title + '</h3><p>' + dest.desc + '</p>', { offset: [0, -28] });

      marker.on('click', () => {
        window.parent.postMessage({ action: 'select', id: dest.id }, '*');
        updateIcons(dest.id);
      });

      markers[dest.id] = marker;
    });

    function updateIcons(activeId) {
      Object.keys(markers).forEach(id => {
        const marker = markers[id];
        const el = marker.getElement();
        if (el) {
          const pin = el.querySelector('.custom-pin');
          if (pin) {
            if (Number(id) === activeId) {
              pin.classList.add('active-pin');
            } else {
              pin.classList.remove('active-pin');
            }
          }
        }
      });
    }

    setTimeout(() => updateIcons(1), 100);


    window.addEventListener('message', (e) => {
      const { action, id, zoomIn, zoomOut, reset } = e.data;
      
      if (action === 'focus' && markers[id]) {
        const marker = markers[id];
        updateIcons(id);
        map.setView(marker.getLatLng(), 15, { animate: true, duration: 1.2 });
        marker.openPopup();
      }
      
      if (zoomIn) {
        map.zoomIn();
      }
      if (zoomOut) {
        map.zoomOut();
      }
      if (reset) {
        const latlngs = destinations.map(d => [d.lat, d.lng]);
        map.fitBounds(L.latLngBounds(latlngs), { padding: [50, 50] });
      }
    });
  </script>
</body>
</html>
`;

interface StreetViewPageProps {
  title: string;
  category: string;
  image: string;
  lat: number;
  lng: number;
  streetViewEmbedUrl?: string;
  onClose: () => void;
}

const StreetViewPage = ({ title, category, image, lat, lng, streetViewEmbedUrl, onClose }: StreetViewPageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Google Maps Street View embed URL — official embeddable format
  const streetViewSrc = streetViewEmbedUrl || `https://maps.google.com/maps?q=&layer=c&cbll=${lat},${lng}&cbp=12,0,0,0,0&ie=UTF8&output=embed`;

  // Fallback: open Google Maps Street View in new tab
  const googleMapsUrl = streetViewEmbedUrl || `https://maps.google.com/maps?q=&layer=c&cbll=${lat},${lng}&cbp=12,0,0,0,0`;

  // ESC to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Reset loaded state and set safety timeout when destination changes
  useEffect(() => {
    setIsLoaded(false);
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1500); // 1.5s auto-reveal fallback
    return () => clearTimeout(timer);
  }, [lat, lng]);

  return (
    <div
      className="fixed inset-0 z-[60] bg-[#0A0707] flex flex-col"
      style={{ animation: 'sv-fadein 0.3s cubic-bezier(0.16,1,0.3,1) both' }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-[#0C0808]/95 backdrop-blur-xl border-b border-white/[0.07] flex-shrink-0 relative">

        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 hover:bg-white/14 border border-white/10 text-white/80 hover:text-white font-poppins text-[12px] transition-all duration-200 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
            </svg>
            Kembali
          </button>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6E1F1F]/80 border border-[#D4A853]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] animate-pulse" />
            <span className="font-manrope text-[9.5px] tracking-[0.12em] text-[#D4A853] font-semibold uppercase">Street View 360°</span>
          </div>
        </div>

        {/* Center */}
        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <div className="w-7 h-7 rounded-[7px] overflow-hidden flex-shrink-0 border border-white/15">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="block font-manrope text-[8.5px] tracking-widest text-[#D4A853] uppercase">{category}</span>
            <h2 className="font-poppins font-medium text-white text-[13px] leading-tight">{title}</h2>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 hover:bg-white/14 border border-white/10 text-white/60 hover:text-white font-poppins text-[11px] transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15,3 21,3 21,9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Buka di Google Maps
          </a>
          <button
            onClick={onClose}
            title="Tutup (Esc)"
            className="w-8 h-8 rounded-full bg-white/8 hover:bg-white/14 border border-white/10 flex items-center justify-center text-white/60 hover:text-white text-[13px] transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Panorama Area ── */}
      <div className="flex-1 relative overflow-hidden">

        {/* Loading overlay — shows until iframe fires onLoad */}
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0707] z-10 pointer-events-none">
            {/* Animated rings */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-24 h-24 rounded-full border border-[#D4A853]/8 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute w-16 h-16 rounded-full border border-[#D4A853]/14" />
              <div
                className="w-12 h-12 rounded-full"
                style={{
                  border: '2.5px solid rgba(212,168,83,0.15)',
                  borderTopColor: '#D4A853',
                  animation: 'spin 0.85s linear infinite',
                }}
              />
            </div>
            {/* Dots */}
            <div className="flex gap-2 mt-8">
              {[0, 180, 360].map((delay) => (
                <span
                  key={delay}
                  className="w-[5px] h-[5px] rounded-full bg-[#D4A853]"
                  style={{ animation: `svBounce 1.3s ${delay}ms infinite ease-in-out` }}
                />
              ))}
            </div>
            <p className="font-poppins text-white/40 text-[11.5px] tracking-wide mt-5">Memuat Street View 360°…</p>
            <p className="font-poppins text-white/20 text-[9.5px] mt-1.5">{lat.toFixed(6)}, {lng.toFixed(6)}</p>
          </div>
        )}

        {/* Google Maps Street View iframe — official embed format */}
        <iframe
          key={`sv-${lat}-${lng}`}
          src={streetViewSrc}
          title={`Street View 360° – ${title}`}
          className={`w-full h-full border-none transition-opacity duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          allow="fullscreen"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Bottom-left: coordinates */}
        <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/8 pointer-events-none">
          <span className="font-manrope text-white/45 text-[9.5px] tracking-wide">{lat.toFixed(5)}, {lng.toFixed(5)}</span>
        </div>

        {/* Bottom-right: ESC hint */}
        <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/8 pointer-events-none hidden md:block">
          <span className="font-manrope text-white/30 text-[9.5px] tracking-wide">Tekan ESC untuk keluar</span>
        </div>
      </div>

      <style>{`
        @keyframes sv-fadein { from { opacity:0; transform:scale(0.985); } to { opacity:1; transform:scale(1); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes svBounce { 0%,80%,100%{transform:translateY(0);opacity:.25} 40%{transform:translateY(-7px);opacity:1} }
      `}</style>
    </div>
  );
};






export function PetaPage() {
  const { ref: revealRef, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.02 });
  const [hoveredDestId, setHoveredDestId] = useState<number | null>(null);
  const [activeDestId, setActiveDestId] = useState<number>(1);
  const [show360Modal, setShow360Modal] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Listen to messages from the map iframe
    const handleMapMessage = (e: MessageEvent) => {
      if (e.data && e.data.action === 'select') {
        setActiveDestId(e.data.id);
      }
    };
    window.addEventListener('message', handleMapMessage);
    return () => window.removeEventListener('message', handleMapMessage);
  }, []);

  const handleCardClick = (id: number) => {
    setActiveDestId(id);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ action: 'focus', id }, '*');
    }
  };

  const activeDest = DESTINASI_DATA.find((d) => d.id === activeDestId) || DESTINASI_DATA[0];

  return (
    <main
      ref={revealRef}
      className={`min-h-screen bg-[#FAF8F7] flex flex-col lg:flex-row pt-[76px] transition-all duration-1000 overflow-hidden ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* ── LEFT PANEL: Sidebar ── */}
      <div className="w-full lg:w-[360px] xl:w-[380px] bg-white flex flex-col border-r border-[#D6B8B3]/30 h-[calc(100vh-76px)] overflow-hidden flex-shrink-0 z-10 shadow-lg">
        {/* Sidebar Header */}
        <div className="p-5 pb-4 border-b border-[#FAF4F2]">
          <h1 className="font-poppins font-semibold text-[#000000] text-[22px] sm:text-[25px] tracking-tight leading-tight">
            Peta & Pariwisata
          </h1>
          <p className="font-poppins font-normal text-[#444651] text-[13px] mt-1.5 leading-relaxed">
            Temukan berbagai destinasi wisata Bukittinggi melalui peta interaktif.
          </p>
        </div>

        {/* Scrollable Cards Container */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-peta-scrollbar">
          {DESTINASI_DATA.map((dest) => {
            const isHovered = hoveredDestId === dest.id;
            const isActive = activeDestId === dest.id;

            return (
              <div
                key={dest.id}
                onClick={() => handleCardClick(dest.id)}
                onMouseEnter={() => setHoveredDestId(dest.id)}
                onMouseLeave={() => setHoveredDestId(null)}
                className={`flex gap-3.5 p-3 sm:p-3.5 rounded-[16px] bg-white border cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'border-[#6E1F1F] shadow-[0_8px_24px_rgba(110,31,31,0.08)]'
                    : isHovered
                    ? 'border-[#D2C3C0] shadow-[0_6px_18px_rgba(0,0,0,0.07)] translate-y-[-2px]'
                    : 'border-[#EAE2E0] shadow-[0_4px_12px_rgba(0,0,0,0.04)]'
                }`}
              >
                {/* Destination Image Thumbnail */}
                <div className="w-[85px] h-[85px] sm:w-[92px] sm:h-[92px] rounded-[14px] overflow-hidden flex-shrink-0 bg-neutral-50 border border-neutral-100 shadow-sm relative">
                  <img
                    src={dest.image}
                    alt={dest.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Destination Text Details */}
                <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
                  <div>
                    <h3 className="font-poppins font-medium text-[#000000] text-[14.5px] sm:text-[15px] leading-snug tracking-tight mb-1 truncate">
                      {dest.title}
                    </h3>
                    <p className="font-poppins font-normal text-[#444651] text-[11.5px] leading-relaxed line-clamp-2">
                      {dest.description}
                    </p>
                  </div>

                  {/* Category Bubble */}
                  <div className="mt-2 flex">
                    <span
                      className="px-2.5 py-0.5 font-manrope font-normal text-[9.5px] tracking-wider text-[#6E1F1F] bg-[#F7E0E0]"
                      style={{
                        borderRadius: '50px',
                      }}
                    >
                      {dest.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT PANEL: Real Interactive OpenStreetMap ── */}
      <div className="flex-1 relative bg-[#FAF8F5] h-[calc(100vh-76px)] overflow-hidden select-none">
        
        {/* Leaflet Iframe Container */}
        <iframe
          ref={iframeRef}
          srcDoc={mapHtml}
          title="Interactive OpenStreetMap of Bukittinggi"
          className="w-full h-full border-none"
        />



        {/* Map Control Buttons (Zoom / Reset) */}
        <div className="absolute right-6 top-6 z-20 flex flex-col gap-2">
          <button
            onClick={() => iframeRef.current?.contentWindow?.postMessage({ zoomIn: true }, '*')}
            className="w-10 h-10 rounded-xl bg-white border border-[#EBE3E1] shadow-md flex items-center justify-center font-bold text-[#6E1F1F] hover:bg-[#FAF4F2] active:scale-95 transition-all cursor-pointer"
          >
            ＋
          </button>
          <button
            onClick={() => iframeRef.current?.contentWindow?.postMessage({ zoomOut: true }, '*')}
            className="w-10 h-10 rounded-xl bg-white border border-[#EBE3E1] shadow-md flex items-center justify-center font-bold text-[#6E1F1F] hover:bg-[#FAF4F2] active:scale-95 transition-all cursor-pointer"
          >
            －
          </button>
          <button
            onClick={() => iframeRef.current?.contentWindow?.postMessage({ reset: true }, '*')}
            className="w-10 h-10 rounded-xl bg-white border border-[#EBE3E1] shadow-md flex items-center justify-center text-[11px] font-medium text-[#6E1F1F] hover:bg-[#FAF4F2] active:scale-95 transition-all cursor-pointer"
          >
            RESET
          </button>
        </div>

        {/* ── Street View Card floating on the bottom-right ── */}
        {activeDest && (
          <div 
            onClick={() => setShow360Modal(true)}
            className="absolute bottom-6 right-6 z-20 w-[215px] h-[130px] rounded-[18px] overflow-hidden shadow-2xl border border-white/10 cursor-pointer group transition-all duration-300 hover:scale-[1.03]"
          >
            {/* Top: Thumbnail Image */}
            <div className="w-full h-[88px] overflow-hidden relative">
              <img 
                src={activeDest.image} 
                alt={activeDest.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              {/* Google Maps badge */}
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-white/90 flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#6E1F1F"/>
                  <circle cx="12" cy="9" r="2.5" fill="white"/>
                </svg>
                <span className="font-poppins text-[8px] font-semibold text-[#6E1F1F]">Street View</span>
              </div>
            </div>
            {/* Bottom: Deep Maroon Bar */}
            <div className="w-full h-[42px] bg-[#6E1F1F] flex items-center justify-center gap-2 px-3 select-none">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white/90 flex-shrink-0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                <path d="M2 12h20"/>
              </svg>
              <span className="font-poppins font-medium text-white text-[12.5px] tracking-tight">
                Lihat Street View
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── 360° Virtual Tour Full-Screen Overlay ── */}
      {show360Modal && activeDest && (
        <StreetViewPage
          title={activeDest.title}
          category={activeDest.category}
          image={activeDest.image}
          lat={activeDest.lat}
          lng={activeDest.lng}
          streetViewEmbedUrl={activeDest.streetViewEmbedUrl}
          onClose={() => setShow360Modal(false)}
        />
      )}

      {/* Styled custom scrollbar and keyframes for Peta page */}
      <style>{`
        .custom-peta-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-peta-scrollbar::-webkit-scrollbar-track {
          background: #FAF8F7;
        }
        .custom-peta-scrollbar::-webkit-scrollbar-thumb {
          background: #D6B8B3;
          border-radius: 4px;
        }
        .custom-peta-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6E1F1F;
        }
      `}</style>
    </main>
  );
}

