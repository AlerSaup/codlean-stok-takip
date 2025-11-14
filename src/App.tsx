import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DepoYonetimi from './pages/DepoYonetimi';
import DepoDetay from './pages/DepoDetay';
import StokListesi from './pages/StokListesi';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { Toaster } from './components/ui/toaster';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/depo-yonetimi" replace /> : <Login />} 
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="depo-yonetimi" element={<DepoYonetimi />} />
          <Route path="depo-detay/:id" element={<DepoDetay />} />
          <Route path="stok-listesi" element={<StokListesi />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
