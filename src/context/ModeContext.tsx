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
    return localStorage.getItem('app-music') === 'true';
  });

  const [audio] = useState(() => {
    const a = new Audio('/musik.mp3');
    a.loop = true;
    return a;
  });

  const [mode, setModeState] = useState<Mode>('heritage');

  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved === 'en' ? 'en' : 'id') as AppLanguage;
  });

  // Sync audio playback with musicPlaying state
  useEffect(() => {
    if (musicPlaying) {
      audio.play().catch(err => {
        console.log('Audio play failed or deferred until user interaction:', err);
      });
    } else {
      audio.pause();
    }
  }, [musicPlaying, audio]);

  // Synchronize visual mode with musicPlaying and current page route
  useEffect(() => {
    if (location.pathname === '/') {
      setModeState(musicPlaying ? 'explorer' : 'heritage');
    } else {
      setModeState('heritage');
    }
  }, [musicPlaying, location.pathname]);

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    if (location.pathname === '/') {
      setMusicPlaying(newMode === 'explorer');
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
