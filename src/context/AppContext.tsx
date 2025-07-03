import React, { createContext, useState, ReactNode, useCallback, useMemo } from 'react';

interface EditorState {
  json?: string;
  version?: string;
}

interface AppContextType {
  editorState: EditorState | null;
  setEditorState: (state: EditorState | null) => void;
  version: string;
  setVersion: (version: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

declare global {
  interface Window {
    __editorState?: any;
    __version?: string;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Safe window access with fallbacks
const getInitialEditorState = (): EditorState | null => {
  try {
    return window.__editorState || null;
  } catch {
    return null;
  }
};

const getInitialVersion = (): string => {
  try {
    return window.__version || '';
  } catch {
    return '';
  }
};

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [editorState, setEditorState] = useState<EditorState | null>(getInitialEditorState);
  const [version, setVersion] = useState<string>(getInitialVersion);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo<AppContextType>(
    () => ({
      editorState,
      setEditorState,
      version,
      setVersion,
      isLoading,
      setIsLoading,
      error,
      setError,
      clearError,
    }),
    [editorState, version, isLoading, error, clearError]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

const AppContextConsumer = AppContext.Consumer;

// Add custom hook following LeadSend standards
export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
};

export { AppContext, AppContextProvider, AppContextConsumer };
