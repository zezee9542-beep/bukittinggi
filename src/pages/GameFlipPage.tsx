// GameFlipPage — "Memori Kuliner Minang"
//
// A four-state culinary memory game that mirrors the Figma "GAME FLIP - KULINER"
// flow:
//   1. playing  — 4×4 grid (8 pairs of Minang dishes), 70s timer, score & progress
//   2. won      — "Selamat!" victory screen with score + stats and "Klaim Resep"
//   3. spinning — horizontal gacha reel that scrolls sideways and lands on a dish
//   4. reward   — full recipe page (hero, ingredients, steps, heritage note)
//
// Matching pairs by image (Gambar ↔ Gambar). Rewards are drawn at random from
// the 8 recipes in ../lib/gameRecipes.

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RECIPES, pickRandomRecipe, type Recipe } from '../lib/gameRecipes';

// Dish images (reused from the Kuliner assets)
import img111 from '../assets/111.png';
import img222 from '../assets/222.png';
import img333 from '../assets/333.png';
import img444 from '../assets/444.png';
import img555 from '../assets/555.png';
import img666 from '../assets/666.png';
import img777 from '../assets/777.png';
import img888 from '../assets/888.png';
import cardImg from '../assets/card.png';

const MAROON = '#5F1712';
const GOLD = '#E9C46A';

const DISHES = [
  { id: 'd1', name: 'Katupek Kapau', image: img111 },
  { id: 'd2', name: 'Itiak Lado Mudo', image: img222 },
  { id: 'd3', name: 'Gulai Tambusu', image: img333 },
  { id: 'd4', name: 'Gulai Cancang', image: img444 },
  { id: 'd5', name: 'Dendeng Batokok', image: img555 },
  { id: 'd6', name: 'Gulai Tunjang', image: img666 },
  { id: 'd7', name: 'Ayam Pop', image: img777 },
  { id: 'd8', name: 'Gulai Kapau', image: img888 },
];

const GAME_SECONDS = 70;
const TOTAL_PAIRS = DISHES.length; // 8

interface Card {
  key: string;      // unique per card
  dishId: string;   // shared by the matching pair
  name: string;
  image: string;
}

type Phase = 'playing' | 'won' | 'spinning' | 'reward';

// Fisher–Yates shuffle (returns a new array).
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): Card[] {
  const doubled: Card[] = DISHES.flatMap((d) => [
    { key: `${d.id}-a`, dishId: d.id, name: d.name, image: d.image },
    { key: `${d.id}-b`, dishId: d.id, name: d.name, image: d.image },
  ]);
  return shuffle(doubled);
}

export function GameFlipPage() {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('playing');
  const [deck, setDeck] = useState<Card[]>(() => buildDeck());
  const [flipped, setFlipped] = useState<string[]>([]);   // card keys currently face-up (max 2)
  const [matched, setMatched] = useState<string[]>([]);   // dishIds already matched
  const [moves, setMoves] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(GAME_SECONDS);
  const [lockBoard, setLockBoard] = useState(false);

  // Reward / gacha state
  const [reward, setReward] = useState<Recipe | null>(null);
  const [reelOffset, setReelOffset] = useState(0);

  const matchedCount = matched.length;
  const timeUsed = GAME_SECONDS - secondsLeft;

  // Score: base per pair minus penalties for extra moves & time. Clamped to 0.
  const score = useMemo(() => {
    const base = matchedCount * 12;
    const movePenalty = Math.max(0, moves - TOTAL_PAIRS) * 1;
    const timePenalty = Math.floor(timeUsed / 10);
    return Math.max(0, base - movePenalty - timePenalty);
  }, [matchedCount, moves, timeUsed]);

  // ── Countdown timer (only while playing) ──
  useEffect(() => {
    if (phase !== 'playing') return;
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => {
      if (secondsLeft <= 1) {
        // time up → show victory summary with whatever was matched
        setSecondsLeft(0);
        setPhase('won');
      } else {
        setSecondsLeft((s) => s - 1);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, secondsLeft]);

  // ── Win detection ──
  useEffect(() => {
    if (phase === 'playing' && matchedCount === TOTAL_PAIRS) {
      const t = setTimeout(() => setPhase('won'), 650);
      return () => clearTimeout(t);
    }
  }, [phase, matchedCount]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [phase]);

  const handleFlip = useCallback(
    (card: Card) => {
      if (lockBoard || phase !== 'playing') return;
      if (flipped.includes(card.key)) return;
      if (matched.includes(card.dishId)) return;

      const next = [...flipped, card.key];
      setFlipped(next);

      if (next.length === 2) {
        setMoves((m) => m + 1);
        setLockBoard(true);
        const [firstKey, secondKey] = next;
        const first = deck.find((c) => c.key === firstKey)!;
        const second = deck.find((c) => c.key === secondKey)!;

        if (first.dishId === second.dishId) {
          // match
          setTimeout(() => {
            setMatched((prev) => [...prev, first.dishId]);
            setFlipped([]);
            setLockBoard(false);
          }, 520);
        } else {
          // no match — flip back
          setTimeout(() => {
            setFlipped([]);
            setLockBoard(false);
          }, 850);
        }
      }
    },
    [lockBoard, phase, flipped, matched, deck],
  );

  const resetGame = useCallback(() => {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSecondsLeft(GAME_SECONDS);
    setLockBoard(false);
    setReward(null);
    setReelOffset(0);
    setPhase('playing');
  }, []);

  // ── Gacha spin ──
  const reelRef = useRef<HTMLDivElement>(null);
  const CARD_W = 176; // px including gap — must match reel item width below

  const startSpin = useCallback(() => {
    const won = pickRandomRecipe();
    setReward(won);
    setPhase('spinning');

    // Build a long reel and land on the chosen recipe near the end.
    // The reel array is generated in render from `reward`; here we just compute
    // the final offset so the winning card rests under the center pointer.
    const LOOPS = 6;
    const winIndexInRecipes = RECIPES.findIndex((r) => r.id === won.id);
    const finalIndex = LOOPS * RECIPES.length + winIndexInRecipes;
    // Center the winning card: offset so its center aligns with viewport center.
    requestAnimationFrame(() => {
      const container = reelRef.current;
      const viewport = container?.parentElement;
      const centerShift = viewport ? viewport.clientWidth / 2 - CARD_W / 2 : 0;
      setReelOffset(finalIndex * CARD_W - centerShift);
    });
  }, []);

  // Reel items: repeat the recipe list many times for a long scroll.
  const reelItems = useMemo(() => {
    if (phase !== 'spinning' && phase !== 'reward') return [];
    const LOOPS = 7;
    const items: Recipe[] = [];
    for (let i = 0; i < LOOPS; i++) items.push(...RECIPES);
    return items;
  }, [phase]);

  // After the spin transition ends, reveal the recipe.
  const handleReelTransitionEnd = useCallback(() => {
    if (phase === 'spinning') {
      setTimeout(() => setPhase('reward'), 500);
    }
  }, [phase]);

  // ══════════════════════════════════════════════════════════════
  // RENDER: REWARD (recipe page)
  // ══════════════════════════════════════════════════════════════
  if (phase === 'reward' && reward) {
    return <RecipeReward recipe={reward} onReplay={resetGame} onExit={() => navigate('/game')} />;
  }

  // ══════════════════════════════════════════════════════════════
  // RENDER: SPINNING (gacha reel)
  // ══════════════════════════════════════════════════════════════
  if (phase === 'spinning') {
    return (
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center px-4 pt-[76px]"
        style={{ backgroundColor: MAROON }}
      >
        <h2 className="font-poppins font-bold text-white text-[26px] sm:text-[34px] mb-2 text-center">
          Gacha Resep...
        </h2>
        <p className="font-poppins text-white/70 text-[14px] mb-10 text-center">
          Hadiah resep rahasia sedang diundi untukmu
        </p>

        {/* Reel viewport */}
        <div className="relative w-full max-w-[880px] overflow-hidden rounded-[20px] border border-white/15 bg-black/20 py-6">
          {/* center pointer */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 bottom-0 z-20 -translate-x-1/2 w-[4px] rounded-full"
            style={{ backgroundColor: GOLD, boxShadow: `0 0 18px ${GOLD}` }}
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1 z-20 -translate-x-1/2 h-0 w-0"
            style={{ borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderTop: `12px solid ${GOLD}` }}
          />
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24" style={{ background: `linear-gradient(90deg, ${MAROON}, transparent)` }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24" style={{ background: `linear-gradient(270deg, ${MAROON}, transparent)` }} />

          <div
            ref={reelRef}
            className="flex items-center gap-4 pl-4"
            style={{
              transform: `translateX(-${reelOffset}px)`,
              transition: 'transform 4.2s cubic-bezier(0.12, 0.7, 0.15, 1)',
            }}
            onTransitionEnd={handleReelTransitionEnd}
          >
            {reelItems.map((r, i) => (
              <div
                key={`${r.id}-${i}`}
                className="flex-shrink-0 rounded-[16px] overflow-hidden bg-white shadow-lg"
                style={{ width: 160 }}
              >
                <div className="h-[120px] w-full overflow-hidden">
                  <img src={r.image} alt={r.title} className="h-full w-full object-cover" />
                </div>
                <div className="px-3 py-2 text-center">
                  <span className="font-poppins font-medium text-[#1A1C1A] text-[12.5px] leading-tight line-clamp-1">
                    {r.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // RENDER: WON (victory summary)
  // ══════════════════════════════════════════════════════════════
  if (phase === 'won') {
    const stats: Array<{ icon: React.ReactNode; label: string; value: string }> = [
      {
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="#3DBE6B" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ),
        label: 'Status',
        value: matchedCount === TOTAL_PAIRS ? 'Selesai' : 'Selesai',
      },
      {
        icon: (
          <svg className="w-6 h-6" fill="none" stroke={GOLD} strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
          </svg>
        ),
        label: 'Waktu',
        value: `${timeUsed} S`,
      },
      {
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="#3B82F6" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="6" y="3" width="12" height="18" rx="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9l1.5 3-1.5 3-1.5-3z" />
          </svg>
        ),
        label: 'Kartu Cocok',
        value: `${matchedCount}/${TOTAL_PAIRS}`,
      },
    ];

    return (
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center px-4 pt-[76px] pb-16"
        style={{ backgroundColor: MAROON }}
      >
        <div className="w-full max-w-[620px] flex flex-col items-center animate-fade-in">
          <h1 className="font-poppins font-bold text-white text-[44px] sm:text-[56px] leading-none mb-3 text-center">
            Selamat!
          </h1>
          <p className="font-poppins text-white/70 text-[15px] sm:text-[17px] mb-9 text-center">
            Permainan Telah Diselesaikan
          </p>

          {/* Score card */}
          <div
            className="w-full rounded-[18px] flex items-center justify-center py-6 mb-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.18)', border: `2px solid ${GOLD}` }}
          >
            <span className="font-poppins font-bold text-white text-[30px] sm:text-[36px]">
              Score : {score}
            </span>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full mb-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-[16px] flex flex-col items-center justify-center py-5 gap-2"
                style={{ backgroundColor: 'rgba(0,0,0,0.18)', border: `1.5px solid ${GOLD}` }}
              >
                {s.icon}
                <span className="font-poppins text-white/60 text-[12px] sm:text-[13px]">{s.label}</span>
                <span className="font-poppins font-bold text-white text-[16px] sm:text-[19px]">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Klaim Resep — triggers the gacha spin */}
          <button
            onClick={startSpin}
            className="w-full rounded-[16px] py-4 font-poppins font-bold text-[19px] sm:text-[21px] transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
            style={{ backgroundColor: GOLD, color: MAROON, boxShadow: '0 10px 30px rgba(233,196,106,0.25)' }}
          >
            Klaim Resep
          </button>

          <button
            onClick={() => navigate('/game')}
            className="mt-4 font-poppins text-white/60 hover:text-white text-[13px] transition-colors cursor-pointer"
          >
            Kembali ke Menu Game
          </button>
        </div>
      </main>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // RENDER: PLAYING (memory grid)
  // ══════════════════════════════════════════════════════════════
  const progressPct = (matchedCount / TOTAL_PAIRS) * 100;
  const lowTime = secondsLeft <= 10;

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center px-4 pt-[96px] pb-16"
      style={{ backgroundColor: MAROON }}
    >
      <div className="w-full max-w-[720px] flex flex-col">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="font-poppins font-bold text-white text-[22px] sm:text-[28px] leading-tight">
              Memori Kuliner Minang
            </h1>
            <p className="font-poppins text-white/60 text-[12px] sm:text-[13px] mt-0.5">
              Cocokkan seluruh pasangan gambar kuliner khas Bukittinggi
            </p>
          </div>
          <button
            onClick={() => navigate('/game')}
            className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 font-poppins font-medium text-[13px] text-white transition-all hover:bg-white/10 active:scale-95 cursor-pointer"
            style={{ border: '1px solid rgba(255,255,255,0.25)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            Keluar
          </button>
        </div>

        {/* Stats bar: timer + matched + moves */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex items-center gap-2 rounded-full px-4 py-2 font-poppins font-bold text-[15px] transition-colors"
            style={{
              backgroundColor: lowTime ? 'rgba(233,196,106,0.15)' : 'rgba(0,0,0,0.2)',
              color: lowTime ? GOLD : '#fff',
              border: `1.5px solid ${lowTime ? GOLD : 'rgba(255,255,255,0.15)'}`,
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
            </svg>
            {secondsLeft} Detik
          </div>
          <div className="font-poppins text-white/80 text-[13px]">
            Cocok: <span className="font-bold text-white">{matchedCount}/{TOTAL_PAIRS}</span>
          </div>
          <div className="font-poppins text-white/80 text-[13px]">
            Langkah: <span className="font-bold text-white">{moves}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full overflow-hidden mb-6" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, backgroundColor: GOLD }}
          />
        </div>

        {/* 4×4 Grid */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
          {deck.map((card) => {
            const isFaceUp = flipped.includes(card.key) || matched.includes(card.dishId);
            const isMatched = matched.includes(card.dishId);
            return (
              <button
                key={card.key}
                onClick={() => handleFlip(card)}
                disabled={isFaceUp || lockBoard}
                className="relative aspect-[3/4] w-full cursor-pointer disabled:cursor-default"
                style={{ perspective: '1000px' }}
                aria-label={isFaceUp ? card.name : 'Kartu tertutup'}
              >
                <div
                  className="relative w-full h-full transition-transform duration-500"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFaceUp ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Card back */}
                  <div
                    className="absolute inset-0 rounded-[12px] sm:rounded-[16px] overflow-hidden flex items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      border: `1.5px solid ${GOLD}`,
                      boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                    }}
                  >
                    <img src={cardImg} alt="" className="w-full h-full object-cover" />
                  </div>

                  {/* Card front (dish) */}
                  <div
                    className="absolute inset-0 rounded-[12px] sm:rounded-[16px] overflow-hidden bg-white flex flex-col"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      border: isMatched ? `2.5px solid ${GOLD}` : '2px solid #fff',
                      boxShadow: isMatched ? `0 0 18px ${GOLD}` : '0 6px 16px rgba(0,0,0,0.3)',
                    }}
                  >
                    <div className="flex-1 overflow-hidden">
                      <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="px-1 py-1 bg-white">
                      <span className="block text-center font-poppins font-medium text-[#1A1C1A] text-[8px] sm:text-[10px] leading-tight line-clamp-1">
                        {card.name}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Restart */}
        <button
          onClick={resetGame}
          className="mt-6 self-center font-poppins text-white/60 hover:text-white text-[13px] transition-colors cursor-pointer"
        >
          Ulangi Permainan
        </button>
      </div>
    </main>
  );
}

// ══════════════════════════════════════════════════════════════════
// Recipe reward page — mirrors the Figma "Ayam Pop" reward layout.
// ══════════════════════════════════════════════════════════════════
function RecipeReward({
  recipe,
  onReplay,
  onExit,
}: {
  recipe: Recipe;
  onReplay: () => void;
  onExit: () => void;
}) {
  return (
    <main className="min-h-screen w-full bg-[#FAF8F7] pt-[96px] pb-20 px-4 md:px-8">
      <div className="max-w-[1080px] mx-auto">
        {/* Reward banner */}
        <div className="mb-5 flex items-center justify-center">
          <span
            className="font-poppins font-medium text-[13px] px-5 py-2 rounded-full"
            style={{ backgroundColor: '#FDF0CF', color: '#C7A551' }}
          >
            🎉 Resep Berhasil Diklaim!
          </span>
        </div>

        {/* Hero */}
        <div className="relative rounded-[24px] overflow-hidden mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <img src={recipe.image} alt={recipe.title} className="w-full h-[300px] sm:h-[420px] object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.78) 100%)' }} />

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="max-w-[560px]">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="font-poppins font-semibold text-[10px] tracking-wider uppercase px-3 py-1 rounded-md text-white" style={{ backgroundColor: MAROON }}>
                  Heritage Recipe
                </span>
                <span className="font-poppins text-white/90 text-[12px] flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-6-7-11a7 7 0 1114 0c0 5-7 11-7 11z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  {recipe.origin}
                </span>
              </div>
              <h1 className="font-cormorant font-bold text-white text-[38px] sm:text-[52px] leading-none mb-2">
                {recipe.title}
              </h1>
              <p className="font-poppins text-white/85 text-[13px] sm:text-[14px] leading-relaxed">
                {recipe.tagline}
              </p>
            </div>

            {/* Meta chips */}
            <div className="flex gap-3 flex-shrink-0 rounded-[16px] px-4 py-3" style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}>
              {[
                { label: 'PREP TIME', value: recipe.prepTime },
                { label: 'DIFFICULTY', value: recipe.difficulty },
                { label: 'SERVINGS', value: recipe.servings },
              ].map((m) => (
                <div key={m.label} className="text-center px-2 min-w-[62px]">
                  <span className="block font-poppins text-white/55 text-[8.5px] tracking-wider mb-1">{m.label}</span>
                  <span className="block font-poppins font-semibold text-white text-[12px]">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Ingredients */}
          <div className="w-full lg:w-[32%] bg-[#FBF6F1] rounded-[20px] p-6 flex-shrink-0">
            <h2 className="font-cormorant font-bold text-[#1A1C1A] text-[22px] mb-5 flex items-center gap-2">
              <span>🧺</span> Ingredients
            </h2>
            <div className="flex flex-col gap-5">
              {recipe.ingredients.map((grp) => (
                <div key={grp.group}>
                  <p className="font-poppins font-semibold text-[#9A8478] text-[10px] tracking-wider uppercase mb-2 border-b border-[#E9DDD3] pb-1.5">
                    {grp.group}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {grp.items.map((it) => (
                      <li key={it.name} className="flex items-center justify-between">
                        <span className="font-poppins text-[#4A2C27] text-[13px]">{it.name}</span>
                        <span className="font-poppins font-semibold text-[13px]" style={{ color: MAROON }}>{it.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[14px] p-4 text-center" style={{ backgroundColor: '#F3E7DD' }}>
              <p className="font-poppins italic text-[#7A6055] text-[11.5px] leading-relaxed">
                "{recipe.title} paling nikmat disantap hangat bersama nasi putih pulen."
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="w-full lg:w-[68%]">
            <h2 className="font-cormorant font-bold text-[#1A1C1A] text-[22px] mb-6 flex items-center gap-2">
              <span>👨‍🍳</span> Cooking Instructions
            </h2>
            <div className="flex flex-col">
              {recipe.steps.map((step, i) => (
                <div key={i} className="flex gap-4 pb-6 relative">
                  {/* connector line */}
                  {i < recipe.steps.length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-[1.5px]" style={{ backgroundColor: '#E5D5CC' }} />
                  )}
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-poppins font-bold text-[13px] z-10"
                    style={{ border: `1.5px solid ${MAROON}`, color: MAROON, backgroundColor: '#FAF8F7' }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h3 className="font-poppins font-semibold text-[#1A1C1A] text-[16px] mb-1.5">{step.title}</h3>
                    <p className="font-poppins text-[#554240] text-[13.5px] leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Heritage note */}
            <div className="mt-4 rounded-[20px] p-6 sm:p-8" style={{ backgroundColor: '#F7E9E4' }}>
              <h3 className="font-cormorant font-bold text-[#1A1C1A] text-[20px] mb-3">Heritage Note</h3>
              <p className="font-poppins italic text-[#5A4038] text-[13.5px] leading-relaxed mb-5">
                "{recipe.heritageNote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0" style={{ backgroundColor: MAROON }}>
                  {recipe.custodian.charAt(0)}
                </div>
                <div>
                  <p className="font-poppins font-semibold text-[#1A1C1A] text-[13px] leading-tight">{recipe.custodian}</p>
                  <p className="font-poppins text-[#9A8478] text-[10px] tracking-wider uppercase">Local Culinary Custodian</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={onReplay}
            className="font-poppins font-medium text-white text-[14px] px-7 py-3 rounded-[12px] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            style={{ backgroundColor: MAROON }}
          >
            Main Lagi
          </button>
          <button
            onClick={onExit}
            className="font-poppins font-medium text-[#6E1F1F] text-[14px] px-7 py-3 rounded-[12px] border border-[#6E1F1F]/30 transition-all hover:bg-[#6E1F1F]/5 active:scale-95 cursor-pointer"
          >
            Kembali ke Kuliner
          </button>
        </div>
      </div>
    </main>
  );
}

export default GameFlipPage;
