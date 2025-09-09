import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import QRScannerPage from './pages/QRScannerPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Student Routes */}
        <Route 
          path="/qr-scanner" 
          element={
            <ProtectedRoute requiredRoles={['STUDENT']}>
              <QRScannerPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Placeholder routes - will be implemented in the next phase */}
        <Route path="/departments" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Departments - Coming Soon</h2></div>} />
        <Route path="/courses" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Courses - Coming Soon</h2></div>} />
        <Route path="/users" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Users - Coming Soon</h2></div>} />
        <Route path="/timetable" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Timetable - Coming Soon</h2></div>} />
        <Route path="/sessions" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sessions - Coming Soon</h2></div>} />
        <Route path="/attendance" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance - Coming Soon</h2></div>} />
        <Route path="/analytics" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics - Coming Soon</h2></div>} />
        <Route path="/profile" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile - Coming Soon</h2></div>} />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;