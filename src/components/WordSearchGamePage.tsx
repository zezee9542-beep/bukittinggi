import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TARGET_WORDS = [
  'JAMGADANG',
  'LOBANGJEPANG',
  'SIANOK',
  'HARAU',
  'FORTDEKOCK',
  'BUNGHATTA',
  'PAGARUYUNG'
];

const GRID_SIZE = 14;

interface Point {
  r: number;
  c: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// TOKEN WARNA — Sesuai tema Bukittinggi Heritage
// ─────────────────────────────────────────────────────────────────────────────
const MAROON = '#6E1F1F';
const GOLD = '#F9CE65';
const CREAM = '#F1E9E9';

/**
 * Helper to check if two points are identical.
 */
const isSamePoint = (p1: Point, p2: Point) => p1.r === p2.r && p1.c === p2.c;

/**
 * Component Utama Word Search Game
 */
export function WordSearchGamePage() {
  const navigate = useNavigate();
  const [grid, setGrid] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  
  // Selection state
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState<Point | null>(null);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);

  // Found paths per word, to permanently highlight them
  const [foundPaths, setFoundPaths] = useState<{word: string, path: Point[]}[]>([]);

  // Timer & Scoring state
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3 minutes
  const [score, setScore] = useState<number>(0);

  const gridRef = useRef<HTMLDivElement>(null);

  const isVictory = foundWords.length === TARGET_WORDS.length;
  const isTimeOver = timeLeft === 0 && !isVictory;
  const showModal = isVictory || isTimeOver;

  // 1. Grid Generation
  const generateGrid = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    
    // Restrict to standard forward directions only
    const directions = [
      { dr: 0, dc: 1 },   // Horizontal Forward (Left to Right)
      { dr: 1, dc: 0 },   // Vertical Forward (Top to Bottom)
      { dr: 1, dc: 1 },   // Diagonal Down-Right (Top-Left to Bottom-Right)
    ];

    // Sort words by length descending to place larger words first
    const sortedWords = [...TARGET_WORDS].sort((a, b) => b.length - a.length);

    sortedWords.forEach((word) => {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 200;

      while (!placed && attempts < maxAttempts) {
        attempts++;
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const r = Math.floor(Math.random() * GRID_SIZE);
        const c = Math.floor(Math.random() * GRID_SIZE);

        const endR = r + (word.length - 1) * dir.dr;
        const endC = c + (word.length - 1) * dir.dc;

        if (endR >= 0 && endR < GRID_SIZE && endC >= 0 && endC < GRID_SIZE) {
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            const currentR = r + i * dir.dr;
            const currentC = c + i * dir.dc;
            const cell = newGrid[currentR][currentC];
            if (cell !== '' && cell !== word[i]) {
              canPlace = false;
              break;
            }
          }

          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              newGrid[r + i * dir.dr][c + i * dir.dc] = word[i];
            }
            placed = true;
          }
        }
      }
      
      if (!placed) {
        console.warn(`Could not place word: ${word}`);
      }
    });

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // Fill the remaining empty cells with random letters
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c] === '') {
          newGrid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }
    setGrid(newGrid);
  };

  useEffect(() => {
    generateGrid();
  }, []);

  // Timer Effect
  useEffect(() => {
    if (isVictory || isTimeOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isVictory, isTimeOver]);

  // 2. Game Logic: Calculate path between two cells
  const calculatePath = (start: Point, end: Point): Point[] => {
    const dr = end.r - start.r;
    const dc = end.c - start.c;
    const steps = Math.max(Math.abs(dr), Math.abs(dc));

    if (steps === 0) return [start];

    // Restrict to horizontal, vertical, and exact diagonal
    if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) {
      return [];
    }

    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepC = dc === 0 ? 0 : dc / Math.abs(dc);

    const path: Point[] = [];
    for (let i = 0; i <= steps; i++) {
      path.push({ r: start.r + i * stepR, c: start.c + i * stepC });
    }
    return path;
  };

  // Mouse / Touch handlers for Grid
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, r: number, c: number) => {
    e.preventDefault();
    setIsSelecting(true);
    setStartCell({ r, c });
    setCurrentPath([{ r, c }]);
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>, r: number, c: number) => {
    e.preventDefault();
    if (!isSelecting || !startCell) return;
    const path = calculatePath(startCell, { r, c });
    if (path.length > 0) setCurrentPath(path);
  };

  const handlePointerUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);

    // Validate the highlighted path
    if (currentPath.length > 1) {
      const selectedWord = currentPath.map((p) => grid[p.r][p.c]).join('');
      const reversedWord = selectedWord.split('').reverse().join('');

      const matched = TARGET_WORDS.find((w) => w === selectedWord || w === reversedWord);
      if (matched && !foundWords.includes(matched)) {
        const isLastWord = foundWords.length === TARGET_WORDS.length - 1;
        setFoundWords((prev) => [...prev, matched]);
        setFoundPaths((prev) => [...prev, { word: matched, path: currentPath }]);
        
        if (isLastWord) {
          setScore(s => s + 100 + 500 + timeLeft * 10);
        } else {
          setScore(s => s + 100);
        }
      }
    }
    setCurrentPath([]);
    setStartCell(null);
  };

  // Global touch move handling for dragging over elements
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isSelecting || !startCell) return;
    
    // Prevent scrolling while selecting words
    if (e.cancelable) e.preventDefault();

    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element) {
      const r = element.getAttribute('data-r');
      const c = element.getAttribute('data-c');
      if (r !== null && c !== null) {
        const row = parseInt(r, 10);
        const col = parseInt(c, 10);
        const path = calculatePath(startCell, { r: row, c: col });
        if (path.length > 0) setCurrentPath(path);
      }
    }
  };

  // Check if a specific cell should be highlighted
  const isCellInCurrentPath = (r: number, c: number) => {
    return currentPath.some((p) => isSamePoint(p, { r, c }));
  };

  const isCellInFoundPaths = (r: number, c: number) => {
    return foundPaths.some((fp) => fp.path.some((p) => isSamePoint(p, { r, c })));
  };

  // Reset Game
  const resetGame = () => {
    setFoundWords([]);
    setFoundPaths([]);
    setCurrentPath([]);
    setStartCell(null);
    setIsSelecting(false);
    setTimeLeft(180);
    setScore(0);
    generateGrid();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col font-poppins relative selection:bg-transparent"
      style={{ backgroundColor: '#faf8f7' }}
      onPointerUp={handlePointerUp}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <header className="w-full flex items-center justify-between px-6 py-4 relative z-10" style={{ backgroundColor: MAROON }}>
        <button
          onClick={() => navigate('/game')}
          className="text-white flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="font-medium hidden sm:inline">Keluar</span>
        </button>
        
        <div className="flex flex-col items-center">
          <h1 className="text-white font-medium text-base sm:text-lg tracking-wide hidden sm:block">CARI KATA WISATA</h1>
          <div className="text-white font-bold text-xl font-mono tracking-widest bg-black/20 px-3 py-1 rounded-lg mt-1 sm:mt-0">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="text-white font-semibold flex flex-col items-end">
          <div className="text-sm opacity-90">Poin: <span className="font-bold text-lg">{score}</span></div>
          <div className="text-xs sm:text-sm">{foundWords.length} / {TARGET_WORDS.length} Kata</div>
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row items-center justify-center p-4 gap-8">
        
        {/* ── Game Grid ───────────────────────────────────────────── */}
        <div className="relative bg-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 select-none" style={{ borderColor: `${DARK}20` }}>
          <div
            ref={gridRef}
            className="grid gap-1 sm:gap-1.5 touch-none select-none"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
            onTouchMove={handleTouchMove}
            onDragStart={(e) => e.preventDefault()}
          >
            {grid.map((row, r) =>
              row.map((letter, c) => {
                const inCurrent = isCellInCurrentPath(r, c);
                const inFound = isCellInFoundPaths(r, c);

                let bgColor = '#f3f4f6'; // default gray-100
                let color = '#374151'; // gray-700
                let scale = 'scale-100';

                if (inCurrent) {
                  bgColor = GOLD;
                  color = MAROON;
                  scale = 'scale-110';
                } else if (inFound) {
                  bgColor = MAROON;
                  color = 'white';
                }

                return (
                  <div
                    key={`${r}-${c}`}
                    data-r={r}
                    data-c={c}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    onPointerDown={(e) => handlePointerDown(e, r, c)}
                    onPointerEnter={(e) => handlePointerEnter(e, r, c)}
                    className={`
                      w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-11 lg:h-11
                      flex items-center justify-center rounded-lg font-bold text-base sm:text-lg md:text-xl
                      cursor-pointer select-none transition-all duration-150 ease-out
                      ${scale}
                    `}
                    style={{
                      backgroundColor: bgColor,
                      color: color,
                      boxShadow: inCurrent || inFound ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                    }}
                  >
                    {letter}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Wordlist Panel ───────────────────────────────────────────── */}
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-6 border-2" style={{ borderColor: CREAM }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: MAROON }}>Daftar Destinasi</h2>
          <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-3">
            {TARGET_WORDS.map((word) => {
              const isFound = foundWords.includes(word);
              return (
                <div
                  key={word}
                  className={`
                    px-4 py-2 rounded-full font-medium text-sm sm:text-base transition-all duration-300
                    ${isFound ? 'line-through opacity-60' : 'opacity-100'}
                  `}
                  style={{
                    backgroundColor: isFound ? CREAM : `${GOLD}40`,
                    color: isFound ? '#666' : MAROON,
                    border: `1px solid ${isFound ? 'transparent' : GOLD}`
                  }}
                >
                  {word}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ── Result Modal ───────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: isVictory ? CREAM : '#ffebee' }}>
              <span className="text-4xl">{isVictory ? '🏆' : '⏳'}</span>
            </div>
            <h2 className="text-3xl font-bold mb-3" style={{ color: MAROON }}>
              {isVictory ? 'Selamat! Kamu Menang!' : 'Waktu Habis!'}
            </h2>
            <p className="text-gray-600 mb-6 font-medium">
              {isVictory 
                ? 'Kamu berhasil menemukan semua destinasi wisata di Bukittinggi!' 
                : 'Sayang sekali, waktu kamu sudah habis.'}
            </p>
            
            <div className="bg-gray-50 rounded-2xl p-4 mb-8 border-2 border-gray-100">
              <div className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">Total Skor</div>
              <div className="text-4xl font-black text-gray-800">{score}</div>
              {isVictory && (
                <div className="text-xs text-green-600 font-semibold mt-2">
                  +500 Bonus Menang & +{timeLeft * 10} Sisa Waktu
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={resetGame}
                className="w-full py-4 rounded-xl font-bold text-white transition-transform active:scale-95 shadow-lg"
                style={{ backgroundColor: MAROON }}
              >
                Main Lagi
              </button>
              <button
                onClick={() => navigate('/game')}
                className="w-full py-4 rounded-xl font-bold transition-transform active:scale-95 border-2"
                style={{ borderColor: MAROON, color: MAROON }}
              >
                Kembali ke Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Ensure DARK token exists if used from GameMenuPage, otherwise define it.
const DARK = '#444651';
