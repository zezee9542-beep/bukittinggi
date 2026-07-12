import type { SiteContent, TimelineStory } from '../types';
import img1 from '../assets/1.svg';
import img2 from '../assets/2.svg';
import img3 from '../assets/3.svg';
import img4 from '../assets/4.svg';
import img5 from '../assets/5.svg';
import img6 from '../assets/6.svg';
import img7 from '../assets/7.svg';

export const siteContent: SiteContent = {
  nav: {
    brandLabel: 'Heritage',
    menuLabel: 'MENU',
  },
  hero: {
    eyebrow: 'Journey Of',
    tagline: 'WHERE HISTORY MEETS THE HIGHLANDS',
  },
  intro: {
    scriptTitle: 'Bukittinggi',
    heading: 'THE HEART OF MINANGKABAU',
    paragraphs: [
      'Jantung Ranah Minang yang berdiri anggun di pelukan perbukitan.',
      'Tempat kabut pagi menyapa lembah hijau, dan waktu seolah berjalan lebih lambat di antara warisan yang terjaga. Dari megahnya Jam Gadang hingga sunyinya Ngarai Sianok, setiap langkah adalah undangan untuk merasakan kisah yang telah hidup selama generasi.',
    ],
  },
  timeline: {
    heading: 'MENELUSURI JEJAK WAKTU',
    description:
      'Perjalanan melintasi sejarah Bukittinggi, dari tanah adat di dataran tinggi hingga menjadi jantung budaya dan pariwisata Minangkabau.',
  },
};

export const culturalStories: TimelineStory[] = [
  {
    id: 'chapter-1',
    title: 'Sebelum 1825 - Negeri di Atas Awan',
    era: 'Awal Masa',
    imagePath: img1,
    alt: 'Sawah terasering hijau dengan rumah gadang di lembah Bukittinggi',
    description:
      'Jauh sebelum dikenal sebagai kota wisata, kawasan Bukittinggi telah menjadi tempat hidup masyarakat Minangkabau yang menjunjung tinggi adat, tradisi, dan nilai kebersamaan. Dikelilingi pegunungan, lembah hijau, serta tanah yang subur, wilayah ini tumbuh sebagai pusat kehidupan masyarakat dataran tinggi Sumatera Barat.',
    width: 1512,
    height: 865,
  },
  {
    id: 'chapter-2',
    title: '1825 Awal Mula Fort de Kock',
    era: 'Abad ke-19',
    imagePath: img2,
    alt: 'Menara kayu bersejarah di atas perbukitan Minangkabau',
    description:
      'Pada masa Perang Padri, Belanda membangun Benteng Fort de Kock di Bukit Jirek sebagai pusat pertahanan militer. Keberadaan benteng ini menjadi titik awal perkembangan kawasan yang kemudian tumbuh menjadi kota Bukittinggi.',
    quote:
      '"Dari sebuah benteng di puncak bukit, lahirlah sebuah kota yang kelak memainkan peran penting dalam sejarah Indonesia."',
    width: 1512,
    height: 887,
  },
  {
    id: 'chapter-3',
    title: '1856 - 1920 Kota Perdagangan dan Pendidikan',
    era: 'Era Kolonial',
    imagePath: img3,
    alt: 'Jalan kolonial dengan arsitektur putih dan delman di Bukittinggi',
    description:
      'Memasuki akhir abad ke-19, Bukittinggi berkembang menjadi pusat perdagangan, pendidikan, dan administrasi di Sumatera Barat. Jalan raya, sekolah, dan jalur transportasi mulai dibangun, menjadikan kota ini sebagai salah satu pusat perkembangan masyarakat Minangkabau. Pada masa inilah Bukittinggi mulai dikenal sebagai kota yang terbuka terhadap kemajuan tanpa meninggalkan akar budayanya.',
    width: 1512,
    height: 840,
  },
  {
    id: 'chapter-4',
    title: '1926 Berdirinya Jam Gadang',
    era: '1926',
    imagePath: img4,
    alt: 'Lapangan Jam Gadang dengan kerumunan warga pada masa lampau',
    description:
      'Tahun 1926 menjadi tonggak penting dengan berdirinya Jam Gadang, menara jam yang kini menjadi ikon Bukittinggi. Dengan arsitektur yang unik dan sentuhan budaya Minangkabau pada bagian atapnya, Jam Gadang bukan hanya penunjuk waktu, tetapi juga saksi perjalanan sejarah kota selama hampir satu abad.',
    quote:
      '"Jam Gadang tidak hanya menghitung detik, tetapi juga menyimpan cerita dari setiap generasi yang pernah melewati kota ini."',
    width: 1512,
    height: 856,
  },
  {
    id: 'chapter-5',
    title: '1942 - 1945 Kota yang Menjaga Republik',
    era: '1945',
    imagePath: img5,
    alt: 'Pertemuan para pemimpin di ruang rapat bersejarah',
    description:
      'Pada masa pendudukan Jepang, Bukittinggi menjadi pusat militer penting di Sumatera. Di masa kemerdekaan, kota ini terpilih sebagai ibu kota Pemerintahan Darurat Republik Indonesia (PDRI). Perannya memperlihatkan ketahanan kota dan masyarakatnya saat perjuangan di daerah lain terhambat.',
    width: 1512,
    height: 887,
  },
  {
    id: 'chapter-6',
    title: '1950 - 2000 Menjaga Warisan Budaya',
    era: 'Warisan Budaya',
    imagePath: img6,
    alt: 'Penari tradisional Minangkabau di halaman rumah gadang',
    description:
      'Sebagai pusat kebudayaan, Bukittinggi terus mempertahankan kesenian dan adat tradisi Minangkabau. Nilai adat yang diwariskan dari generasi ke generasi senantiasa mewarnai dinamika kehidupan masyarakat, tercermin dari upacara adat, tari-tarian, dan arsitektur yang masih terjaga.',
    width: 1512,
    height: 887,
  },
  {
    id: 'chapter-7',
    title: 'Masa Kini - Warisan yang Tetap Hidup',
    era: 'Kontemporer',
    imagePath: img7,
    alt: 'Panorama modern Bukittinggi saat senja dengan Jam Gadang',
    description:
      'Hari ini, Bukittinggi tetap menjaga pesona sejarahnya sambil menyambut modernitas. Kota ini terus melangkah ke depan dengan fondasi nilai adat yang kokoh, menjadikannya tujuan wisata sejarah dan budaya yang tak lekang oleh waktu.',
    quote:
      '"Semangat masa lalu terus hidup dan menjiwai setiap gerak langkah kota ini menghadapi masa depan."',
    width: 1512,
    height: 851,
  },
];
