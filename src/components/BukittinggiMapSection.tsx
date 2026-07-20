import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface RegionData {
  id: 'mandiangin' | 'guguk-panjang' | 'aur-birugo';
  name: string;
  description: string;
  luas: string;
  kelurahan: number;
  porsi: string;
  dPath: string;
}

const REGIONS: Record<string, RegionData> = {
  mandiangin: {
    id: 'mandiangin',
    name: 'Kecamatan Mandiangin Koto Selayan',
    description:
      'Kecamatan terluas di Bukittinggi. Wilayah ini dikenal sebagai kawasan panorama alam, perbukitan hijau, dan gerbang menuju pesona Ngarai Sianok.',
    luas: '12,16 km²',
    kelurahan: 9,
    porsi: '48,16%',
    dPath:
      'M35.2915 16.4927L26.7915 8.49268L27.7915 0.992676L50.7915 8.49268L83.7915 26.9927L114.292 34.9927L118.792 44.9927H124.792L139.792 62.4927L151.292 74.4927L159.792 77.4927L167.292 83.9927L176.792 85.4927L180.292 89.4927L193.292 82.4927H208.292L217.292 89.4927L237.792 94.9927L247.792 93.4927L250.792 76.4927L259.292 76.9927L264.792 82.4927L274.292 83.9927L304.792 116.493H319.292L325.292 119.993L348.292 108.993L357.792 96.4927L370.792 91.4927H379.292L384.792 93.9927L388.292 92.9927L408.292 101.993L431.292 117.993L436.292 120.493L441.792 127.493L444.292 134.493L442.792 155.493L446.792 166.993L448.792 176.993L455.792 177.993L463.292 183.493L469.292 184.493L477.292 195.993L480.792 216.993L479.292 236.993L471.292 238.493L464.792 246.493L465.292 258.493L460.292 265.493L432.292 296.993L422.792 298.493L414.292 296.993L408.292 293.493H377.792L356.292 278.493L327.792 245.993L324.292 232.493L313.792 227.993L300.792 233.493L293.292 228.993L284.792 226.493L260.292 223.993L252.292 228.993H244.292L230.042 213.993L218.292 212.993L206.792 206.493L196.792 204.493L186.792 191.993L173.792 184.493L151.792 181.993L137.292 174.493L122.792 163.993L104.292 162.493L85.2915 163.993L70.7915 172.993L65.7915 170.993L56.2915 154.493L44.7915 143.993L42.7915 127.993L31.7915 122.493L31.2915 116.993L26.2915 114.993L23.2915 108.493L22.2915 98.9927L11.2915 94.3677L8.7915 89.9927L12.2915 82.9927L13.7915 76.4927L12.2915 70.9927L2.7915 69.9927L0.791504 64.9927L3.7915 54.4927L7.7915 47.4927L17.7915 40.9927L20.2915 34.9927L35.2915 25.9927V16.4927Z',
  },
  'guguk-panjang': {
    id: 'guguk-panjang',
    name: 'Kecamatan Guguk Panjang',
    description:
      'Pusat sejarah dan aktivitas Kota Bukittinggi. Menjadi rumah bagi berbagai tempat ikonik seperti Jam Gadang, Fort de Kock, dan Lobang Jepang.',
    luas: '6,83 km²',
    kelurahan: 7,
    porsi: '27,07%',
    dPath:
      'M190.292 277.493L182.792 267.993L173.792 262.493L167.292 258.493L160.792 252.993L152.792 248.493L147.292 250.493L140.292 249.493L135.292 242.993L128.792 242.493L124.292 238.493L122.792 233.993L114.292 229.493L107.292 225.993L101.792 217.993L98.2915 207.493L87.7915 200.993L80.2915 206.993L73.7915 201.993L68.7915 193.993L70.2915 187.993L68.7915 181.493L65.7915 175.993V170.993L70.7915 172.993L85.2915 163.993L104.292 162.493L122.792 163.993L137.291 174.493L151.791 181.993L173.791 184.493L186.791 191.993L196.792 204.493L206.792 206.493L218.292 212.993L230.042 213.993L244.292 228.993H252.292L260.292 223.993L284.792 226.493L293.292 228.993L300.792 233.493L313.792 227.993L324.292 232.493L327.792 245.993L356.292 278.493L377.792 293.493H404.292L405.792 295.493L407.792 297.493L410.792 301.493L413.792 306.993L419.292 318.993V324.993L416.792 330.993L413.292 360.493L409.792 361.993L401.792 362.993L396.792 360.493L380.792 350.993L372.792 346.993L366.292 345.993H359.792L350.792 345.493L346.792 342.993L339.292 341.493L330.292 338.493L326.292 332.993L324.792 325.493L320.292 322.493L312.792 325.493L298.792 333.454L295.292 334.493L291.792 331.493L290.792 326.993L287.792 326.493L282.292 328.493L272.791 333.454L268.292 332.993L266.292 326.993L263.292 320.493L262.791 311.493L255.792 304.493L242.291 301.993L233.291 311.493L223.792 313.993L216.792 316.493L207.792 314.493L202.792 309.993L202.292 298.993L197.292 291.993L190.292 277.493Z',
  },
  'aur-birugo': {
    id: 'aur-birugo',
    name: 'Kecamatan Aur Birugo Tigo Baleh',
    description:
      'Kecamatan terkecil di Bukittinggi. Dikenal sebagai pusat kehidupan masyarakat, perdagangan lokal.',
    luas: '6,25 km²',
    kelurahan: 8,
    porsi: '24,77%',
    dPath:
      'M263.292 320.493L262.791 311.493L255.792 304.493L242.291 301.993L233.291 311.493L223.792 313.993L216.792 316.493L222.292 320.993L225.792 320.493L229.792 322.993L236.792 328.493L237.792 332.493V341.993L239.292 343.493L240.292 348.493L242.291 350.993L243.792 358.993L246.292 366.493L247.292 371.493L249.792 372.493L263.792 383.993L266.292 391.993L271.792 393.493L276.292 403.993L285.292 410.493L292.792 411.493H314.792L329.792 413.993H341.792L345.292 418.493L348.792 416.493L360.292 419.493L363.542 424.993L374.292 433.993L381.792 434.993L387.292 432.493L396.292 431.993L408.792 440.493L418.792 442.493L425.292 437.993L427.792 436.993L431.792 432.493L434.292 431.493L435.792 428.993L446.292 419.493L453.792 413.993H462.792L472.792 411.493L480.792 405.993L499.792 401.993L510.792 399.493L521.292 393.493L529.292 392.993L544.792 386.493L546.292 383.493L544.292 376.993L536.792 365.993L530.792 349.993L529.292 342.493L522.792 337.493L521.292 332.493L511.792 323.993L509.792 316.493L502.792 303.493L497.292 293.993L495.792 285.993L490.792 272.993L485.792 256.493L481.292 247.993L479.292 236.993L471.292 238.493L464.792 246.493L465.292 258.493L460.292 265.493L432.292 296.993L422.792 298.493L414.292 296.993L408.292 293.493H404.292L405.042 294.493L405.792 295.493L407.792 297.493L410.792 301.493L413.792 306.993L419.292 318.993V324.993L416.792 330.993L413.292 360.493L409.792 361.993L401.792 362.993L396.792 360.493L380.792 350.993L372.792 346.993L366.292 345.993H359.792L350.792 345.493L346.792 342.993L339.292 341.493L330.292 338.493L326.292 332.993L324.792 325.493L320.292 322.493L312.792 325.493L298.792 333.454L295.292 334.493L291.792 331.493L290.792 326.993L287.792 326.493L282.292 328.493L272.791 333.454L268.292 332.993L266.292 326.993L263.292 320.493Z',
  },
};

export const BukittinggiMapSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });
  const [activeRegionKey, setActiveRegionKey] = useState<string | null>(null);
  const [hoveredRegionKey, setHoveredRegionKey] = useState<string | null>(null);

  // Region currently displayed in the text area (hovered takes priority over selected)
  const currentKey = hoveredRegionKey || activeRegionKey;
  const currentRegion = currentKey ? REGIONS[currentKey] : null;

  return (
    <section
      ref={ref}
      className="w-full relative z-30 py-20 sm:py-28 lg:py-36 px-4 sm:px-8 md:px-12 flex justify-center border-none outline-none overflow-hidden"
      style={{ backgroundColor: '#6E1F1F' }}
    >
      <div
        className={`w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-16 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {/* ── Left Content Area ── */}
        <div className="flex-1 flex flex-col items-start text-left max-w-[580px]">
          {/* Top Pill: Wilayah Administratif (#F9CE65) */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 shadow-sm select-none"
            style={{ backgroundColor: '#F9CE65' }}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#531717"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
            <span
              className="font-poppins font-medium text-[13px] sm:text-[14px] tracking-tight"
              style={{ color: '#531717' }}
            >
              Wilayah Administratif
            </span>
          </div>

          {/* Dynamic Content: Default vs Region Selected */}
          {currentRegion ? (
            <div className="animate-fade-in">
              {/* Region Title */}
              <h2 className="font-poppins font-semibold text-[32px] sm:text-[40px] lg:text-[46px] text-white leading-tight mb-4">
                {currentRegion.name}
              </h2>

              {/* Region Description */}
              <p className="font-poppins font-normal text-[15px] sm:text-[16.5px] text-white/85 leading-[1.7] mb-8">
                {currentRegion.description}
              </p>

              {/* Region Stats Bar */}
              <div className="flex flex-wrap items-center gap-5 sm:gap-7 pt-2">
                {/* Stat 1: Luas */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#F9CE65]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-poppins font-medium text-[14px] sm:text-[15px] text-white">
                    Luas : {currentRegion.luas}
                  </span>
                </div>

                {/* Stat 2: Kelurahan */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#F9CE65]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="font-poppins font-medium text-[14px] sm:text-[15px] text-white">
                    Kelurahan : {currentRegion.kelurahan}
                  </span>
                </div>

                {/* Stat 3: Porsi Wilayah */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#F9CE65]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <span className="font-poppins font-medium text-[14px] sm:text-[15px] text-white">
                    Porsi Wilayah Kota : {currentRegion.porsi}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              {/* Default Headline */}
              <h2 className="font-poppins font-semibold text-[36px] sm:text-[46px] lg:text-[52px] text-white leading-tight mb-4">
                Tiga Kecamatan Wilayah Bukittinggi
              </h2>

              {/* Default Subtitle */}
              <p className="font-poppins font-normal text-[16px] sm:text-[18px] text-white/75">
                Arahkan kursor pada wilayah
              </p>
            </div>
          )}
        </div>

        {/* ── Right Area: Interactive SVG Map (Group 15.svg) ── */}
        <div className="relative flex-1 flex items-center justify-center max-w-[550px] w-full">
          <svg
            viewBox="0 0 548 444"
            className="w-full h-auto drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)] overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {Object.entries(REGIONS).map(([key, region]) => {
              const isSelected = activeRegionKey === key;
              const isHovered = hoveredRegionKey === key;
              const isActive = isSelected || isHovered;

              return (
                <path
                  key={key}
                  d={region.dPath}
                  onClick={() => setActiveRegionKey(isSelected ? null : key)}
                  onMouseEnter={() => setHoveredRegionKey(key)}
                  onMouseLeave={() => setHoveredRegionKey(null)}
                  className="cursor-pointer transition-all duration-300 ease-out"
                  style={{
                    fill: isActive ? '#F9CE65' : '#4A1515',
                    stroke: isActive ? '#FFDF9D' : '#EBC162',
                    strokeOpacity: isActive ? 1 : 0.4,
                    strokeWidth: isActive ? 2.5 : 1.5,
                    filter: isActive ? 'drop-shadow(0px 0px 22px rgba(249, 206, 101, 0.85))' : 'none',
                    transform: isActive ? 'scale(1.015)' : 'scale(1)',
                    transformOrigin: 'center center',
                  }}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
};

export default BukittinggiMapSection;
