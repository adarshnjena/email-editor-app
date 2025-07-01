import React, { ReactNode } from 'react';
import { ErrorBoundary } from '../components';
import { AppContextProvider } from '../context/AppContext';
import { SettingsProvider } from '../context/SettingsContext';

interface AppProviderProps {
    children: ReactNode;
    settings?: any;
}

export function AppProvider({ children, settings }: AppProviderProps) {
    const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
        // Log error to external service in production
        console.error('Application Error:', error, errorInfo);
        
        // Here you could send to error tracking service like Sentry
        // logErrorToService(error, errorInfo);
    };

    return (
        <ErrorBoundary 
            onError={handleError}
            fallback={
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <h1 style={{ color: '#d32f2f', marginBottom: '16px' }}>
                        Email Editor Error
                    </h1>
                    <p style={{ color: '#666', marginBottom: '24px' }}>
                        The email editor encountered an unexpected error. Please refresh the page to continue.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            }
        >
            <SettingsProvider settings={settings}>
                <AppContextProvider>
                    {children}
                </AppContextProvider>
            </SettingsProvider>
        </ErrorBoundary>
    );
} 