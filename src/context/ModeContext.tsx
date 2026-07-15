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

  const [musicPlaying, setMusicPlayingState] = useState(true);

  const [audio] = useState(() => {
    const a = new Audio('/musik.mp3');
    a.loop = true;
    a.volume = 0.7;
    return a;
  });

  // Sync audio playback with musicPlaying state changes (toggle & autoplay gesture fallback)
  useEffect(() => {
    let playGestureRegistered = false;

    const playOnGesture = () => {
      audio.play().catch(() => {});
      cleanup();
    };

    const cleanup = () => {
      if (playGestureRegistered) {
        document.removeEventListener('click', playOnGesture);
        document.removeEventListener('touchstart', playOnGesture);
        document.removeEventListener('keydown', playOnGesture);
        playGestureRegistered = false;
      }
    };

    if (musicPlaying) {
      audio.play().catch(() => {
        // Autoplay blocked — wait for first user gesture then play
        if (!playGestureRegistered) {
          document.addEventListener('click', playOnGesture, { once: true });
          document.addEventListener('touchstart', playOnGesture, { once: true });
          document.addEventListener('keydown', playOnGesture, { once: true });
          playGestureRegistered = true;
        }
      });
    } else {
      audio.pause();
      cleanup();
    }

    return () => {
      cleanup();
    };
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
