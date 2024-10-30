import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary'; // Import ErrorBoundary

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ErrorBoundary>
                    <App />
                </ErrorBoundary>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
