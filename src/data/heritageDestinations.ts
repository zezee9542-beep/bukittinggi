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
}

export const HERITAGE_DESTINATIONS: HeritageDestination[] = [
  { id: 'jam-gadang', title: 'Jam Gadang', description: 'Ikon Kota Bukittinggi yang menjadi simbol sejarah, budaya, dan kebanggaan masyarakat Minangkabau.', image: rectangle1, position: [-0.305041, 100.369463], streetViewPosition: [-0.3052003, 100.3698508] },
  { id: 'pagaruyung', title: 'Istano Basa Pagaruyung', description: 'Istana megah bersudut rumah gadang yang menjadi simbol kejayaan Kerajaan Minangkabau.', image: rectangle2, position: [-0.471206, 100.641617] },
  { id: 'fort-de-kock', title: 'Benteng Fort De Kock', description: 'Benteng bersejarah peninggalan Belanda yang menjadi saksi Perang Padri.', image: rectangle3, position: [-0.300645, 100.370211] },
  { id: 'museum-adat', title: 'Museum Adat Baajuang', description: 'Museum budaya yang mengabadikan kekayaan tradisi Minangkabau dan benda bersejarah.', image: rectangle4, position: [-0.302521, 100.368812] },
  { id: 'lubang-jepang', title: 'Lubang Jepang', description: 'Terowongan bersejarah peninggalan Jepang yang menyimpan kisah perjuangan masa lalu.', image: rectangle5, position: [-0.308253, 100.364402] },
  { id: 'panorama', title: 'Panorama Bukittinggi', description: 'Lembah curam yang dikelilingi tebing tinggi dengan pemandangan alam memukau.', image: rectangle6, position: [-0.307921, 100.363124] },
  { id: 'bung-hatta', title: 'Rumah Bung Hatta', description: 'Rumah masa kecil Sang Proklamator Bung Hatta yang dilestarikan menjadi museum sejarah.', image: rectangle7, position: [-0.302604, 100.373902] },
  { id: 'harau', title: 'Lembah Harau', description: 'Lembah alami dengan tebing granit menjulang dan panorama air terjun menakjubkan.', image: rectangle8, position: [-0.108512, 100.672931] },
  { id: 'masjid-raya', title: 'Masjid Raya Bukittinggi', description: 'Masjid bersejarah di pusat Bukittinggi dengan arsitektur atap bertingkat khas Minangkabau.', image: rectangle9, position: [-0.305218, 100.371253] },
];
