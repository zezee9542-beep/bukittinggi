// Recipe data for the Game Flip ("Memori Kuliner Minang") reward gacha.
//
// After the player wins the memory-match game and taps "Klaim Resep", a gacha
// reel spins horizontally and lands on one of these recipes at random. Each
// recipe mirrors the structure of the Figma reward page (hero image + meta,
// grouped ingredients, numbered cooking instructions, heritage note).
//
// Dish images are reused from the existing Kuliner assets (111–888) so the
// gacha rewards line up with the dishes shown on the Kuliner page.

import img111 from '../assets/111.png';
import img222 from '../assets/222.png';
import img333 from '../assets/333.png';
import img444 from '../assets/444.png';
import img555 from '../assets/555.png';
import img666 from '../assets/666.png';
import img777 from '../assets/777.png';
import img888 from '../assets/888.png';

export interface IngredientGroup {
  /** Group label shown in caps, e.g. "THE MAIN PROTEIN". */
  group: string;
  items: Array<{ name: string; amount: string }>;
}

export interface CookingStep {
  title: string;
  detail: string;
}

export interface Recipe {
  id: string;
  title: string;
  image: string;
  origin: string;        // location line beside the "HERITAGE RECIPE" chip
  tagline: string;       // short hero subtitle
  prepTime: string;
  difficulty: string;
  servings: string;
  ingredients: IngredientGroup[];
  steps: CookingStep[];
  heritageNote: string;  // quote text (without surrounding quotes)
  custodian: string;     // name credited under the heritage note
}

// The Itiak Lado Mudo / Ayam Pop recipe is transcribed from the Figma reward
// page; the remaining seven follow the same shape with authentic Minang detail.
export const RECIPES: Recipe[] = [
  {
    id: 'ayam-pop',
    title: 'Ayam Pop',
    image: img777,
    origin: 'Koto Gadang, Bukittinggi',
    tagline:
      'Ayam khas Minang yang direbus dalam air kelapa lalu digoreng sebentar hingga lembut, gurih, dan pucat menawan.',
    prepTime: '45 Mins',
    difficulty: 'Medium',
    servings: '4-6 People',
    ingredients: [
      {
        group: 'The Main Protein',
        items: [
          { name: 'Ayam Kampung', amount: '1 Ekor' },
          { name: 'Air Kelapa', amount: '500 ml' },
        ],
      },
      {
        group: 'Bumbu Rebusan',
        items: [
          { name: 'Bawang Putih', amount: '6 siung' },
          { name: 'Jahe (memarkan)', amount: '3 cm' },
          { name: 'Daun Salam', amount: '2 lembar' },
        ],
      },
      {
        group: 'Pelengkap',
        items: [
          { name: 'Sambal Merah', amount: 'secukupnya' },
          { name: 'Daun Singkong Rebus', amount: 'secukupnya' },
        ],
      },
    ],
    steps: [
      {
        title: 'Perebusan Air Kelapa',
        detail:
          'Rebus ayam dalam air kelapa bersama bawang putih, jahe, dan daun salam hingga daging empuk dan bumbu meresap sempurna.',
      },
      {
        title: 'Penggorengan Sebentar',
        detail:
          'Angkat ayam, tiriskan, lalu goreng sangat sebentar dalam minyak panas hingga permukaannya berwarna pucat keputihan — jangan sampai kecokelatan.',
      },
      {
        title: 'Penyajian',
        detail:
          'Sajikan hangat bersama sambal merah khas dan daun singkong rebus sebagai pelengkap tradisional.',
      },
    ],
    heritageNote:
      'Ayam Pop lahir dari Koto Gadang dan menjadi simbol kelembutan cita rasa Minang. Warnanya yang pucat justru menandakan kesabaran dalam memasak: direbus perlahan dalam air kelapa sebelum digoreng sekejap.',
    custodian: 'Nenek Rosma',
  },
  {
    id: 'itiak-lado-mudo',
    title: 'Itiak Lado Mudo',
    image: img222,
    origin: 'Ngarai Sianok, Bukittinggi',
    tagline:
      'Daging bebek asap yang dimasak perlahan dalam pasta cabai hijau aromatik — mahakarya kuliner warisan Bukittinggi.',
    prepTime: '90 Mins',
    difficulty: 'Hard',
    servings: '4-6 People',
    ingredients: [
      {
        group: 'The Main Protein',
        items: [
          { name: 'Bebek Muda (bersihkan)', amount: '1 Ekor' },
          { name: 'Air Jeruk Nipis', amount: '2 sdm' },
        ],
      },
      {
        group: 'Pasta Lado Mudo',
        items: [
          { name: 'Cabai Hijau Keriting', amount: '250 g' },
          { name: 'Bawang Merah', amount: '12 siung' },
          { name: 'Bawang Putih', amount: '6 siung' },
          { name: 'Kemiri (sangrai)', amount: '4 butir' },
        ],
      },
      {
        group: 'Aromatik',
        items: [
          { name: 'Lengkuas (memarkan)', amount: '3 cm' },
          { name: 'Serai', amount: '2 batang' },
          { name: 'Daun Kunyit', amount: '2 lembar' },
        ],
      },
    ],
    steps: [
      {
        title: 'Persiapan & Pengasapan',
        detail:
          'Bersihkan bebek dan lumuri dengan air jeruk nipis serta garam. Diamkan 15 menit, lalu asapi atau bakar sebentar di atas api hingga kulitnya keemasan dan beraroma.',
      },
      {
        title: 'Fondasi Cabai Hijau',
        detail:
          'Giling kasar cabai hijau, bawang merah, bawang putih, dan kemiri. Tumis pasta dalam minyak kelapa berlimpah hingga aroma mentah hilang dan minyak mulai pecah.',
      },
      {
        title: 'Perebusan Lambat',
        detail:
          'Masukkan lengkuas, serai, dan daun kunyit ke dalam pasta. Masukkan potongan bebek asap, aduk rata, tuang air hingga menutupi daging, lalu kecilkan api.',
      },
      {
        title: 'Mengempukkan & Finishing',
        detail:
          'Tutup dan masak perlahan 60-90 menit hingga daging sangat empuk dan kuah mengental menjadi emulsi hijau pekat. Bumbui garam laut sebelum disajikan dengan nasi hangat.',
      },
    ],
    heritageNote:
      'Itiak Lado Mudo lebih dari sekadar hidangan; ia adalah simbol kesabaran dalam budaya Minangkabau. Berasal dari kawasan Ngarai Sianok, hidangan ini dahulu disiapkan untuk tamu terhormat dan perayaan komunitas.',
    custodian: 'Nenek Rosma',
  },
  {
    id: 'katupek-kapau',
    title: 'Katupek Kapau',
    image: img111,
    origin: 'Nagari Kapau, Agam',
    tagline:
      'Ketupat dengan kuah gulai nangka, sayuran rebus, dan siraman bumbu pecel khas yang kaya rempah.',
    prepTime: '60 Mins',
    difficulty: 'Medium',
    servings: '4 People',
    ingredients: [
      {
        group: 'Isian Utama',
        items: [
          { name: 'Ketupat', amount: '4 buah' },
          { name: 'Nangka Muda', amount: '300 g' },
          { name: 'Kol & Kacang Panjang', amount: '200 g' },
        ],
      },
      {
        group: 'Kuah Gulai',
        items: [
          { name: 'Santan', amount: '500 ml' },
          { name: 'Cabai Merah', amount: '10 buah' },
          { name: 'Kunyit', amount: '2 cm' },
        ],
      },
    ],
    steps: [
      {
        title: 'Merebus Nangka',
        detail:
          'Rebus nangka muda hingga empuk, lalu masak bersama santan dan bumbu halus hingga kuah gulai mengental dan berminyak.',
      },
      {
        title: 'Menyiapkan Sayuran',
        detail:
          'Rebus kol, kacang panjang, dan bihun secara terpisah agar tetap segar dan tidak lembek.',
      },
      {
        title: 'Penyajian',
        detail:
          'Tata potongan ketupat, siram dengan gulai nangka panas, dan lengkapi dengan sayuran serta bumbu pecel khas Kapau.',
      },
    ],
    heritageNote:
      'Katupek Kapau adalah ikon sarapan Nagari Kapau. Cara penjual menyendok gulai dengan tangan menjulur tinggi telah menjadi pemandangan khas pasar tradisional Bukittinggi.',
    custodian: 'Amai Kapau',
  },
  {
    id: 'gulai-tambusu',
    title: 'Gulai Tambusu',
    image: img333,
    origin: 'Bukittinggi',
    tagline:
      'Usus sapi diisi adonan telur dan tahu, dimasak dalam kuah gulai kuning yang gurih dan lembut.',
    prepTime: '75 Mins',
    difficulty: 'Hard',
    servings: '4 People',
    ingredients: [
      {
        group: 'Isian Tambusu',
        items: [
          { name: 'Usus Sapi Besar', amount: '250 g' },
          { name: 'Telur', amount: '5 butir' },
          { name: 'Tahu Putih', amount: '3 buah' },
        ],
      },
      {
        group: 'Kuah Gulai',
        items: [
          { name: 'Santan', amount: '600 ml' },
          { name: 'Cabai Merah', amount: '8 buah' },
          { name: 'Serai & Lengkuas', amount: 'secukupnya' },
        ],
      },
    ],
    steps: [
      {
        title: 'Menyiapkan Isian',
        detail:
          'Haluskan tahu, campur dengan telur kocok dan bumbu, lalu isikan ke dalam usus sapi yang telah dibersihkan. Ikat kedua ujungnya.',
      },
      {
        title: 'Merebus Awal',
        detail:
          'Kukus atau rebus tambusu hingga isian mengeras, lalu potong-potong sesuai selera.',
      },
      {
        title: 'Memasak Gulai',
        detail:
          'Masak potongan tambusu dalam kuah gulai santan berbumbu hingga meresap dan kuah mengental sempurna.',
      },
    ],
    heritageNote:
      'Tambusu menunjukkan kecerdikan dapur Minang dalam mengolah setiap bagian bahan tanpa sisa, menyulap usus menjadi hidangan istimewa penuh cita rasa.',
    custodian: 'Uni Salamah',
  },
  {
    id: 'gulai-cancang',
    title: 'Gulai Cancang',
    image: img444,
    origin: 'Bukittinggi',
    tagline:
      'Potongan daging, tetelan, dan jeroan dimasak dalam kuah gulai kaya rempah yang pekat dan menggugah.',
    prepTime: '80 Mins',
    difficulty: 'Medium',
    servings: '5 People',
    ingredients: [
      {
        group: 'The Main Protein',
        items: [
          { name: 'Daging Sapi', amount: '400 g' },
          { name: 'Tetelan & Jeroan', amount: '200 g' },
        ],
      },
      {
        group: 'Bumbu Gulai',
        items: [
          { name: 'Santan Kental', amount: '700 ml' },
          { name: 'Cabai Merah', amount: '12 buah' },
          { name: 'Ketumbar & Jinten', amount: '2 sdt' },
        ],
      },
    ],
    steps: [
      {
        title: 'Mencincang Daging',
        detail:
          'Potong daging dan jeroan dalam ukuran kecil ("cancang"), lalu rebus sebentar untuk membersihkannya.',
      },
      {
        title: 'Menumis Bumbu',
        detail:
          'Tumis bumbu halus hingga harum, lalu masukkan daging dan aduk hingga berubah warna.',
      },
      {
        title: 'Perebusan Santan',
        detail:
          'Tuang santan dan masak dengan api sedang sambil terus diaduk hingga daging empuk dan kuah mengental.',
      },
    ],
    heritageNote:
      'Gulai Cancang kerap hadir dalam kenduri dan perhelatan adat Minangkabau, melambangkan kebersamaan dan kemurahan hati tuan rumah.',
    custodian: 'Datuak Bandaro',
  },
  {
    id: 'dendeng-batokok',
    title: 'Dendeng Batokok',
    image: img555,
    origin: 'Payakumbuh, Sumatera Barat',
    tagline:
      'Daging sapi pipih yang dipukul (batokok) lalu disiram sambal cabai hijau pedas yang menggugah selera.',
    prepTime: '50 Mins',
    difficulty: 'Medium',
    servings: '4 People',
    ingredients: [
      {
        group: 'The Main Protein',
        items: [
          { name: 'Daging Sapi Has', amount: '500 g' },
          { name: 'Air Asam Jawa', amount: '3 sdm' },
        ],
      },
      {
        group: 'Sambal Lado',
        items: [
          { name: 'Cabai Hijau/Merah', amount: '150 g' },
          { name: 'Bawang Merah', amount: '8 siung' },
          { name: 'Tomat Hijau', amount: '3 buah' },
        ],
      },
    ],
    steps: [
      {
        title: 'Merebus & Memukul',
        detail:
          'Rebus daging dengan bumbu hingga empuk, lalu pukul-pukul (batokok) hingga pipih dan seratnya merekah.',
      },
      {
        title: 'Memanggang',
        detail:
          'Panggang atau goreng daging pipih sebentar hingga kering di permukaan namun tetap juicy di dalam.',
      },
      {
        title: 'Menyiram Sambal',
        detail:
          'Tumis sambal lado kasar hingga harum, lalu siramkan di atas dendeng panas sebelum disajikan.',
      },
    ],
    heritageNote:
      'Teknik "batokok" — memukul daging dengan batu atau ulekan — adalah warisan dapur Payakumbuh yang membuat bumbu meresap hingga ke serat terdalam.',
    custodian: 'Uda Marlis',
  },
  {
    id: 'gulai-tunjang',
    title: 'Gulai Tunjang',
    image: img666,
    origin: 'Bukittinggi',
    tagline:
      'Kikil (tunjang) sapi dimasak hingga empuk kenyal dalam kuah santan rempah khas Minangkabau.',
    prepTime: '120 Mins',
    difficulty: 'Hard',
    servings: '5 People',
    ingredients: [
      {
        group: 'Bahan Utama',
        items: [
          { name: 'Tunjang / Kikil Sapi', amount: '600 g' },
          { name: 'Air Kapur Sirih', amount: '1 sdm' },
        ],
      },
      {
        group: 'Kuah Gulai',
        items: [
          { name: 'Santan Kental', amount: '800 ml' },
          { name: 'Cabai Merah', amount: '14 buah' },
          { name: 'Daun Jeruk & Kunyit', amount: 'secukupnya' },
        ],
      },
    ],
    steps: [
      {
        title: 'Membersihkan Tunjang',
        detail:
          'Rendam kikil dengan air kapur sirih, lalu rebus lama hingga benar-benar empuk dan kenyal.',
      },
      {
        title: 'Menyiapkan Bumbu',
        detail:
          'Tumis bumbu halus dengan daun jeruk dan kunyit hingga harum dan matang sempurna.',
      },
      {
        title: 'Memasak Gulai',
        detail:
          'Masukkan tunjang dan santan, masak perlahan sambil diaduk hingga kuah kental dan berminyak.',
      },
    ],
    heritageNote:
      'Kesabaran memasak tunjang berjam-jam mencerminkan filosofi Minang: hasil terbaik lahir dari proses yang tak tergesa-gesa.',
    custodian: 'Amai Ganti',
  },
  {
    id: 'gulai-kapau',
    title: 'Gulai Kapau',
    image: img888,
    origin: 'Nagari Kapau, Agam',
    tagline:
      'Gulai berkuah santan kuning khas Kapau, disajikan dengan aneka lauk tradisional yang melimpah.',
    prepTime: '70 Mins',
    difficulty: 'Medium',
    servings: '6 People',
    ingredients: [
      {
        group: 'Bahan Utama',
        items: [
          { name: 'Nangka Muda', amount: '300 g' },
          { name: 'Kol & Kacang Panjang', amount: '200 g' },
          { name: 'Rebung', amount: '100 g' },
        ],
      },
      {
        group: 'Kuah Gulai',
        items: [
          { name: 'Santan', amount: '600 ml' },
          { name: 'Kunyit & Jahe', amount: 'secukupnya' },
          { name: 'Cabai Merah', amount: '10 buah' },
        ],
      },
    ],
    steps: [
      {
        title: 'Menyiapkan Sayuran',
        detail:
          'Potong nangka, kol, kacang panjang, dan rebung, lalu rebus sebentar hingga setengah matang.',
      },
      {
        title: 'Memasak Kuah',
        detail:
          'Masak santan dengan bumbu halus khas Kapau hingga mendidih perlahan agar santan tidak pecah.',
      },
      {
        title: 'Menggabungkan',
        detail:
          'Masukkan sayuran ke dalam kuah gulai, masak hingga matang dan bumbu meresap sempurna.',
      },
    ],
    heritageNote:
      'Gulai Kapau adalah jantung dari "Nasi Kapau" yang melegenda — kekayaan lauknya mencerminkan kemurahan tradisi menjamu masyarakat Agam.',
    custodian: 'Amai Kapau',
  },
];

/** Pick a random recipe as the gacha reward. */
export function pickRandomRecipe(): Recipe {
  const idx = Math.floor(Math.random() * RECIPES.length);
  return RECIPES[idx];
}
