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
  const [lat, lng] = site.streetViewPosition || site.position;
  const heading = site.streetViewHeading ?? 0;
  const pitch = site.streetViewPitch ?? 0;

  // Build the Google Maps Street View URL
  // For locations with a panoId (Photo Sphere), use the direct Google Maps URL
  // For regular Street View, use the classic embed format
  const streetViewUrl = site.streetViewPanoId
    ? `https://www.google.com/maps/@${lat},${lng},3a,90y,${heading}h,${90 + pitch}t/data=!3m6!1e1!3m4!1s${site.streetViewPanoId}!2e10!7i10240!8i5120`
    : `https://maps.google.com/maps?q=&layer=c&cbll=${lat},${lng}&cbp=12,${heading},,${pitch},0&ie=UTF8&output=embed`;

  // For Photo Sphere panos, we use srcDoc to bypass X-Frame-Options
  const srcDoc = site.streetViewPanoId
    ? `<!DOCTYPE html>
<html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden;background:#120b0a}
iframe{width:100%;height:100%;border:none}
</style>
</head><body>
<iframe src="${streetViewUrl}" allow="fullscreen" allowfullscreen></iframe>
<script>
window.parent.postMessage({svLoaded:true},'*');
<\/script>
</body></html>`
    : undefined;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => setIsLoaded(false), [site.id]);

  // Listen for messages from srcDoc iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.svLoaded) setIsLoaded(true);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex flex-col bg-[#120b0a]"
      role="dialog"
      aria-modal="true"
      aria-label={`Street View 360 derajat ${site.title}`}
    >
      <header className="relative z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-[#1d1010]/95 px-4 py-3 text-white backdrop-blur md:px-6">
        <div className="min-w-0">
          <p className="font-manrope text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d4a853]">Street View 360°</p>
          <h2 className="truncate font-poppins text-sm font-medium md:text-base">{site.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={streetViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-2 font-poppins text-xs font-medium transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#d4a853]"
          >
            Buka di Google Maps ↗
          </a>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 font-poppins text-xs font-medium transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#d4a853]"
            aria-label="Tutup Street View"
          >
            Tutup <span aria-hidden="true">×</span>
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
        {srcDoc ? (
          <iframe
            key={site.id}
            srcDoc={srcDoc}
            className="relative z-[1] h-full w-full border-0"
            allowFullScreen
            loading="eager"
            title={`Street View ${site.title}`}
            onLoad={() => setTimeout(() => setIsLoaded(true), 1500)}
          />
        ) : (
          <iframe
            key={site.id}
            src={streetViewUrl}
            className="relative z-[1] h-full w-full border-0"
            allowFullScreen
            loading="eager"
            title={`Street View ${site.title}`}
            onLoad={() => setIsLoaded(true)}
          />
        )}
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
      className={`object-cover shrink-0 ${className}`}
      onError={(event) => {
        event.currentTarget.style.display = 'none';
      }}
    />
  );
}

const BUBBLE_CATEGORIES = [
  'SEJARAH',
  'BUDAYA',
  'SEJARAH',
  'BUDAYA',
  'SEJARAH',
  'ALAM',
  'SEJARAH',
  'ALAM',
  'RELIGI'
];

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
      <aside className="z-10 flex w-full shrink-0 flex-col overflow-hidden border-b border-[#d6b8b3]/30 bg-white shadow-lg lg:h-[calc(100vh-76px)] lg:w-[330px] lg:border-r lg:border-b-0 xl:w-[350px]">
        <div className="border-b border-[#faf4f2] p-5 pb-4">
          <h1 className="font-poppins font-medium text-[#000000] text-[22px] leading-tight tracking-tight sm:text-[25px]">Peta & Pariwisata</h1>
          <p className="mt-1.5 font-poppins font-normal text-[#444651] text-[13px] leading-relaxed">Temukan berbagai destinasi wisata Bukittinggi melalui peta interaktif.</p>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 py-4 lg:block lg:flex-1 lg:space-y-3.5 lg:overflow-y-auto custom-peta-scrollbar">
          {HERITAGE_DESTINATIONS.map((site, index) => {
            const isActive = activeSite.id === site.id;
            const category = BUBBLE_CATEGORIES[index] || 'DESTINASI';
            return (
              <button
                key={site.id}
                type="button"
                onClick={() => selectSite(site)}
                className={`flex min-w-[278px] gap-3 rounded-[16px] border bg-white p-1 pr-3 text-left transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4a853] lg:w-full lg:min-w-0 lg:p-1.5 lg:pr-3.5 ${isActive ? 'border-[#6e1f1f] shadow-[0_8px_24px_rgba(110,31,31,0.08)]' : 'border-[#eae2e0] shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:border-[#d2c3c0] hover:shadow-[0_6px_18px_rgba(0,0,0,0.07)]'}`}
                aria-pressed={isActive}
              >
                <DestinationImage site={site} className="mt-0.5 h-[84px] w-[78px] rounded-[12px] border border-neutral-100 sm:h-[92px] sm:w-[84px]" />
                <span className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                  <span>
                    <span className="block truncate font-poppins font-medium text-[#000000] text-[13px] leading-snug tracking-tight sm:text-[13.5px]">{site.title}</span>
                    <span className="mt-0.5 block line-clamp-2 font-poppins font-normal text-[#444651] text-[9.5px] leading-relaxed sm:text-[10px]">{site.description}</span>
                  </span>
                  <span className="mt-1.5 inline-flex w-fit rounded-[50px] bg-[#F7E0E0] px-2 py-0.5 font-manrope font-normal text-[8px] tracking-wider text-[#6E1F1F] sm:text-[8.5px]">{category}</span>
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
