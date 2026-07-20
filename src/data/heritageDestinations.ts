import rectangle1 from '../assets/Rectangle 1432.png';
import rectangle2 from '../assets/Rectangle 1432 (1).png';
import rectangle3 from '../assets/Rectangle 1432 (2).png';
import rectangle4 from '../assets/Rectangle 1432 (3).png';
import rectangle5 from '../assets/Rectangle 1432 (4).png';
import rectangle6 from '../assets/Rectangle 1432 (5).png';
import rectangle7 from '../assets/Rectangle 1432 (6).png';
import rectangle8 from '../assets/Rectangle 1432 (7).png';
import rectangle9 from '../assets/Rectangle 1432 (8).png';

export interface HeritageDestination {
  id: string;
  title: string;
  description: string;
  image: string;
  position: [number, number];
  streetViewPosition?: [number, number];
  mapsUrl?: string; // Link rujukan langsung ke Google Maps 360 atau lokasi eksternal
  streetViewPanoId?: string;
  streetViewHeading?: number;
  streetViewPitch?: number;
}

// Data destinasi warisan budaya yang diperbarui dengan titik koordinat Street View 360 derajat yang presisi
export const HERITAGE_DESTINATIONS: HeritageDestination[] = [
  {
    id: 'jam-gadang',
    title: 'Jam Gadang',
    description: 'Ikon Kota Bukittinggi yang menjadi simbol sejarah, budaya, dan kebanggaan masyarakat Minangkabau.',
    image: rectangle1,
    position: [-0.305041, 100.369463],
    streetViewPosition: [-0.3054218, 100.3696331],
    mapsUrl: 'https://maps.app.goo.gl/e7hTGm2U2BVyQXGv7',
    streetViewPanoId: 'CIHM0ogKEICAgICcsN2V6wE',
    streetViewHeading: 20.39,
    streetViewPitch: 18.69
  },
  {
    id: 'pagaruyung',
    title: 'Istano Basa Pagaruyung',
    description: 'Istana megah bersudut rumah gadang yang menjadi simbol kejayaan Kerajaan Minangkabau.',
    image: rectangle2,
    position: [-0.471206, 100.641617],
    streetViewPosition: [-0.4712964, 100.6214049],
    mapsUrl: 'https://maps.app.goo.gl/473EiuXLP3sS2ypd6',
    streetViewPanoId: 'CIHM0ogKEICAgICyy4GpNg',
    streetViewHeading: 374.46,
    streetViewPitch: 19.1
  },
  {
    id: 'fort-de-kock',
    title: 'Benteng Fort De Kock',
    description: 'Benteng bersejarah peninggalan Belanda yang menjadi saksi Perang Padri.',
    image: rectangle3,
    position: [-0.300645, 100.370211],
    streetViewPosition: [-0.3004114, 100.3678332],
    mapsUrl: 'https://maps.app.goo.gl/vceoTpv8jYkW1ZZR9',
    streetViewPanoId: 'AF1QipOgD4Lv02F4ULnaO_Vkd1WV7z1RH6nhKdo1DuVX',
    streetViewHeading: 310,
    streetViewPitch: 11.4
  },
  {
    id: 'museum-adat',
    title: 'Museum Adat Baajuang',
    description: 'Museum budaya yang mengabadikan kekayaan tradisi Minangkabau dan benda bersejarah.',
    image: rectangle4,
    position: [-0.302521, 100.368812],
    streetViewPosition: [-0.3008345, 100.369646],
    mapsUrl: 'https://maps.app.goo.gl/9gPPuf6LaRCn2XYq8',
    streetViewPanoId: 'AF1QipPd0TWex2ZCPkKg2VPDrf0rNvNJHmDhuEpk7Y7f',
    streetViewHeading: 267.9,
    streetViewPitch: -1.43
  },
  {
    id: 'lubang-jepang',
    title: 'Lubang Jepang',
    description: 'Terowongan bersejarah peninggalan Jepang yang menyimpan kisah perjuangan masa lalu.',
    image: rectangle5,
    position: [-0.308253, 100.364402],
    streetViewPosition: [-0.3077167, 100.366119],
    mapsUrl: 'https://maps.app.goo.gl/1GGWimpwYo34zQHMA',
    streetViewPanoId: 'AF1QipNrFDXs9kn-F_ZYljI6zlnmbbhyhWrUxdLKUM_U',
    streetViewHeading: 160.87,
    streetViewPitch: 25.17
  },
  {
    id: 'panorama',
    title: 'Panorama Bukittinggi',
    description: 'Lembah curam yang dikelilingi tebing tinggi dengan pemandangan alam memukau.',
    image: rectangle6,
    position: [-0.307921, 100.363124],
    streetViewPosition: [-0.3081456, 100.3653875],
    mapsUrl: 'https://maps.app.goo.gl/WRnS32qRLxKqZoSS7',
    streetViewPanoId: 'CIHM0ogKEICAgIC4v46A_QE',
    streetViewHeading: 134.14,
    streetViewPitch: -0.36
  },
  {
    id: 'bung-hatta',
    title: 'Rumah Bung Hatta',
    description: 'Rumah masa kecil Sang Proklamator Bung Hatta yang dilestarikan menjadi museum sejarah.',
    image: rectangle7,
    position: [-0.302604, 100.373902],
    streetViewPosition: [-0.3009827, 100.3731573],
    mapsUrl: 'https://maps.app.goo.gl/RMXPUMDXPC6YQiK27',
    streetViewPanoId: 'R3kD_rNstBllmdhOJTqQ-A',
    streetViewHeading: 312.82,
    streetViewPitch: 4.14
  },
  {
    id: 'harau',
    title: 'Lembah Harau',
    description: 'Lembah alami dengan tebing granit menjulang dan panorama air terjun menakjubkan.',
    image: rectangle8,
    position: [-0.108512, 100.672931],
    streetViewPosition: [-0.1012055, 100.6662002],
    mapsUrl: 'https://maps.app.goo.gl/UGC8Wukupu4wD24k7',
    streetViewPanoId: 'eOoOkOZ8yuUEcvBkEU4YCA',
    streetViewHeading: 218.78,
    streetViewPitch: -4.17
  },
  {
    id: 'masjid-raya',
    title: 'Masjid Raya Bukittinggi',
    description: 'Masjid bersejarah di pusat Bukittinggi dengan arsitektur atap bertingkat khas Minangkabau.',
    image: rectangle9,
    position: [-0.305218, 100.371253],
    streetViewPosition: [-0.3031207, 100.3699022],
    mapsUrl: 'https://maps.app.goo.gl/ATr8Sv97a8NW1x5a6',
    streetViewPanoId: 'z-aqqxXVBHqyl3UdvQgolw',
    streetViewHeading: 305.22,
    streetViewPitch: -4.27
  }
];
