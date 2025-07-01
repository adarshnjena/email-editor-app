import React, { createContext, useState, ReactNode } from 'react';

interface AppContextType {
    editorState: any;
    setEditorState: (state: any) => void;
    version: string;
    setVersion: (version: string) => void;
}

declare global {
    interface Window {
        __editorState?: any;
        __version?: string;
    }
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const editorStateArg = window.__editorState || {};
const versionArg = window.__version || "";

interface AppContextProviderProps {
    children: ReactNode;
}

const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {   
    const [editorState, setEditorState] = useState<any>(editorStateArg);   
    const [version, setVersion] = useState<string>(versionArg);   
    return (
      <AppContext.Provider value={{ editorState, setEditorState, version, setVersion }}>
         {children}
      </AppContext.Provider>
   );
};

const AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
export default AppContext;
