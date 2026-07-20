import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import L, { type Marker as LeafletMarker } from 'leaflet';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  HERITAGE_DESTINATIONS,
  type HeritageDestination,
} from '../data/heritageDestinations';

const MAP_BOUNDS: L.LatLngBoundsExpression = [
  [-0.72, 100.2],
  [0.02, 100.78],
];
const DESTINATION_BOUNDS = L.latLngBounds(HERITAGE_DESTINATIONS.map((site) => site.position));

// Bundled asset URLs keep Leaflet's default marker working after a production build.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

interface MapControllerProps {
  site: HeritageDestination;
  marker: LeafletMarker | null;
}

function MapController({ site, marker }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    map.flyTo(site.position, 16, { duration: 1.5, animate: true });
    marker?.openPopup();
  }, [map, marker, site]);

  return null;
}

function MapToolbar() {
  const map = useMap();

  return (
    <div className="absolute right-6 top-6 z-[400] flex flex-col gap-2">
      <button
        type="button"
        onClick={() => map.zoomIn()}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ebe3e1] bg-white text-xl font-bold text-[#6e1f1f] shadow-md transition hover:bg-[#faf4f2] focus:outline-none focus:ring-2 focus:ring-[#d4a853]"
        aria-label="Perbesar peta"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ebe3e1] bg-white text-xl font-bold text-[#6e1f1f] shadow-md transition hover:bg-[#faf4f2] focus:outline-none focus:ring-2 focus:ring-[#d4a853]"
        aria-label="Perkecil peta"
      >
        −
      </button>
      <button
        type="button"
        onClick={() => map.fitBounds(DESTINATION_BOUNDS, { padding: [45, 45], animate: true })}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ebe3e1] bg-white text-[10px] font-semibold text-[#6e1f1f] shadow-md transition hover:bg-[#faf4f2] focus:outline-none focus:ring-2 focus:ring-[#d4a853]"
        aria-label="Tampilkan seluruh destinasi"
      >
        RESET
      </button>
    </div>
  );
}

interface StreetViewPortalProps {
  site: HeritageDestination;
  onClose: () => void;
}

function StreetViewPortal({ site, onClose }: StreetViewPortalProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // 1. Validasi koordinat secara ketat untuk mencegah nilai undefined atau NaN
  let lat = 0;
  let lng = 0;
  if (site.streetViewPosition && site.streetViewPosition.length === 2) {
    lat = site.streetViewPosition[0];
    lng = site.streetViewPosition[1];
  } else if (site.position && site.position.length === 2) {
    lat = site.position[0];
    lng = site.position[1];
  }

  const isValidCoordinate = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

  // 2. Konstruksi URL Street View yang valid
  // Menggunakan www.google.com mencegah masalah redirect iframe yang me-reset parameter ke peta dunia 2D (0,0).
  // Parameter cbll (koordinat panorama) dan output=svembed diperlukan untuk mode Street View.
  // Jika koordinat tidak valid, fallback ke mode peta (output=embed) di pusat kota dengan zoom yang sesuai.
  const streetViewUrl = isValidCoordinate
    ? `https://www.google.com/maps?q=${lat},${lng}&layer=c&cbll=${lat},${lng}&cbp=12,0,0,0,0&output=svembed`
    : `https://www.google.com/maps?q=-0.305041,100.369463&z=15&output=embed`;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => setIsLoaded(false), [site.id]);

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex flex-col bg-[#120b0a]"
      role="dialog"
      aria-modal="true"
      aria-label={`Street View 360 derajat ${site.title}`}
    >
      <header className="relative z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-[#1d1010]/95 px-4 py-3 text-white backdrop-blur md:px-6">
        <div className="min-w-0 flex-1">
          <p className="font-manrope text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d4a853]">Street View 360°</p>
          <h2 className="truncate font-poppins text-sm font-medium md:text-base">{site.title}</h2>
        </div>
        <div className="flex shrink-0 gap-2">
          {/* Tautan rujukan eksternal ke Google Maps berdasarkan URL presisi dari dataset */}
          {site.mapsUrl && (
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-white/20 bg-white/10 px-3 py-2 font-poppins text-xs font-medium transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#d4a853] sm:block"
              aria-label={`Buka ${site.title} di Google Maps`}
            >
              Buka di Maps ↗
            </a>
          )}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 bg-[#6e1f1f] px-4 py-2 font-poppins text-xs font-medium text-white transition hover:bg-[#511717] focus:outline-none focus:ring-2 focus:ring-[#d4a853]"
            aria-label="Tutup Street View"
          >
            Tutup <span aria-hidden="true" className="ml-1">×</span>
          </button>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <img
          src={site.image}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-xl"
          onError={(event) => { event.currentTarget.style.display = 'none'; }}
        />
        {!isLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#120b0a]/70 text-center text-white">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/25 border-t-[#d4a853]" aria-hidden="true" />
            <p className="mt-4 font-poppins text-sm">Memuat panorama 360°…</p>
            <p className="mt-1 max-w-sm px-6 font-poppins text-xs text-white/60">Menyiapkan tampilan di sekitar {site.title}</p>
          </div>
        )}
        <iframe
          src={streetViewUrl}
          className="relative z-[1] h-full w-full border-0"
          allowFullScreen
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
          title={`Street View ${site.title}`}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </div>,
    document.body,
  );
}

function DestinationImage({ site, className = '' }: { site: HeritageDestination; className?: string }) {
  return (
    <img
      src={site.image}
      alt=""
      className={`h-16 w-20 shrink-0 rounded-lg object-cover ${className}`}
      onError={(event) => {
        event.currentTarget.style.display = 'none';
      }}
    />
  );
}

export function PetaPage() {
  const [activeSite, setActiveSite] = useState(HERITAGE_DESTINATIONS[0]);
  const [streetViewTarget, setStreetViewTarget] = useState<HeritageDestination | null>(null);
  const markersRef = useRef<Record<string, LeafletMarker | null>>({});
  const [activeMarker, setActiveMarker] = useState<LeafletMarker | null>(null);

  const selectSite = (site: HeritageDestination) => {
    setActiveSite(site);
    setActiveMarker(markersRef.current[site.id] ?? null);
  };

  return (
    <main className="flex min-h-screen flex-col overflow-hidden bg-[#faf8f7] pt-[76px] lg:flex-row">
      <aside className="z-10 flex w-full shrink-0 flex-col overflow-hidden border-b border-[#d6b8b3]/30 bg-white shadow-lg lg:h-[calc(100vh-76px)] lg:w-[360px] lg:border-r lg:border-b-0 xl:w-[380px]">
        <div className="border-b border-[#faf4f2] p-5 pb-4">
          <h1 className="font-poppins text-[22px] font-semibold leading-tight tracking-tight text-black sm:text-[25px]">Peta & Pariwisata</h1>
          <p className="mt-1.5 font-poppins text-[13px] leading-relaxed text-[#444651]">Temukan berbagai destinasi wisata Bukittinggi melalui peta interaktif.</p>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 py-4 lg:block lg:flex-1 lg:space-y-4 lg:overflow-y-auto">
              {HERITAGE_DESTINATIONS.map((site) => {
                const isActive = activeSite.id === site.id;
                return (
                  <button
                    key={site.id}
                    type="button"
                    onClick={() => selectSite(site)}
                    className={`flex min-w-[278px] gap-3.5 rounded-[16px] border bg-white p-3 text-left transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4a853] lg:w-full lg:min-w-0 lg:p-3.5 ${isActive ? 'border-[#6e1f1f] shadow-[0_8px_24px_rgba(110,31,31,0.08)]' : 'border-[#eae2e0] shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:border-[#d2c3c0] hover:shadow-[0_6px_18px_rgba(0,0,0,0.07)]'}`}
                    aria-pressed={isActive}
                  >
                    <DestinationImage site={site} className="h-[85px] w-[85px] rounded-[14px] border border-neutral-100 sm:h-[92px] sm:w-[92px]" />
                    <span className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                      <span>
                        <span className="block truncate font-poppins text-[14.5px] font-medium leading-snug tracking-tight text-black sm:text-[15px]">{site.title}</span>
                        <span className="mt-1 block line-clamp-2 font-poppins text-[11.5px] leading-relaxed text-[#444651]">{site.description}</span>
                      </span>
                      <span className="mt-2 inline-flex w-fit rounded-full bg-[#f7e0e0] px-2.5 py-0.5 font-manrope text-[9.5px] tracking-wider text-[#6e1f1f]">DESTINASI</span>
                    </span>
                  </button>
                );
              })}
        </div>
      </aside>

      <section className="relative h-[520px] flex-1 overflow-hidden bg-[#faf8f5] lg:h-[calc(100vh-76px)]" aria-label="Peta destinasi budaya">
        <MapContainer
          center={activeSite.position}
          zoom={11}
          minZoom={9}
          maxZoom={18}
          maxBounds={MAP_BOUNDS}
          maxBoundsViscosity={1}
          zoomControl={false}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          {HERITAGE_DESTINATIONS.map((site) => (
            <Marker key={site.id} position={site.position} ref={(marker) => { markersRef.current[site.id] = marker; }} eventHandlers={{ click: () => selectSite(site) }}>
              <Popup>
                <div className="min-w-[190px] font-poppins">
                  <strong className="block text-sm text-[#6e1f1f]">{site.title}</strong>
                  <p className="my-2 text-xs leading-relaxed text-[#514946]">{site.description}</p>
                  <button type="button" onClick={() => setStreetViewTarget(site)} className="rounded-md bg-[#6e1f1f] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#511717] focus:outline-none focus:ring-2 focus:ring-[#d4a853]">Lihat 360°</button>
                </div>
              </Popup>
            </Marker>
          ))}
          <MapController site={activeSite} marker={activeMarker} />
          <MapToolbar />
        </MapContainer>
        <button
          type="button"
          onClick={() => setStreetViewTarget(activeSite)}
          className="group absolute bottom-6 right-6 z-[400] w-[215px] overflow-hidden rounded-[18px] border border-white/10 bg-[#6e1f1f] text-left shadow-2xl transition hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-[#d4a853]"
          aria-label={`Lihat Street View ${activeSite.title}`}
        >
          <DestinationImage site={activeSite} className="h-[88px] w-full rounded-none transition duration-700 group-hover:scale-110" />
          <span className="flex h-[42px] items-center justify-center gap-2 px-3 font-poppins text-[12.5px] font-medium text-white">
            <span aria-hidden="true">◎</span> Lihat Street View
          </span>
        </button>
      </section>

      {streetViewTarget && (
        <StreetViewPortal site={streetViewTarget} onClose={() => setStreetViewTarget(null)} />
      )}
    </main>
  );
}
