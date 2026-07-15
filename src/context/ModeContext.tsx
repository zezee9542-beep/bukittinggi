import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type Mode = 'heritage' | 'explorer';
export type AppLanguage = 'id' | 'en';

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  musicPlaying: boolean;
  setMusicPlaying: (play: boolean) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const [musicPlaying, setMusicPlayingState] = useState(() => {
    // Default to true (auto-play) unless user explicitly turned it off before
    const saved = localStorage.getItem('app-music');
    return saved === null ? true : saved === 'true';
  });

  const [audio] = useState(() => {
    const a = new Audio('/musik.mp3');
    a.loop = true;
    a.volume = 0.7;
    return a;
  });

  // Attempt auto-play; if blocked by browser policy, play on first user gesture
  useEffect(() => {
    if (!musicPlaying) return;

    const tryPlay = () => {
      audio.play().catch(() => {
        // Autoplay blocked — wait for first user gesture then play
        const playOnGesture = () => {
          if (musicPlaying) {
            audio.play().catch(() => {});
          }
          document.removeEventListener('click', playOnGesture);
          document.removeEventListener('touchstart', playOnGesture);
          document.removeEventListener('keydown', playOnGesture);
        };
        document.addEventListener('click', playOnGesture, { once: true });
        document.addEventListener('touchstart', playOnGesture, { once: true });
        document.addEventListener('keydown', playOnGesture, { once: true });
      });
    };

    tryPlay();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio]);

  // Sync audio playback with musicPlaying state changes (toggle)
  useEffect(() => {
    if (musicPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [musicPlaying, audio]);

  const [mode, setModeState] = useState<Mode>('heritage');

  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved === 'en' ? 'en' : 'id') as AppLanguage;
  });

  // Synchronize visual mode with musicPlaying and current page route
  useEffect(() => {
    if (location.pathname === '/') {
      setModeState(musicPlaying ? 'heritage' : 'explorer');
    } else {
      setModeState('explorer');
    }
  }, [musicPlaying, location.pathname]);

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    if (location.pathname === '/') {
      setMusicPlaying(newMode === 'heritage');
    }
  };

  const setMusicPlaying = (play: boolean) => {
    setMusicPlayingState(play);
    localStorage.setItem('app-music', String(play));
  };

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

  useEffect(() => {
    if (mode === 'explorer') {
      document.documentElement.classList.add('explorer-mode');
      document.documentElement.classList.remove('heritage-mode');
    } else {
      document.documentElement.classList.add('heritage-mode');
      document.documentElement.classList.remove('explorer-mode');
    }
  }, [mode]);

  useEffect(() => {
    document.documentElement.lang = language === 'en' ? 'en' : 'id';
    if (language === 'en') {
      document.documentElement.classList.add('lang-en');
      document.documentElement.classList.remove('lang-id');
    } else {
      document.documentElement.classList.add('lang-id');
      document.documentElement.classList.remove('lang-en');
    }
  }, [language]);

  return (
    <ModeContext.Provider value={{ mode, setMode, language, setLanguage, musicPlaying, setMusicPlaying }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
