import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from '@/features/home/pages/HomePage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        {/* Otras rutas si las hay */}
      </Routes>
    </BrowserRouter>
  );
}
