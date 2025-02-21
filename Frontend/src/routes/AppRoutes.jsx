import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from '@/features/home/pages/HomePage';
import Menu from '@/components/layout/Menu';

export default function AppRoutes() {
  return (
    <BrowserRouter>
    <div className='absolute z-[9999]'>
      <Menu />
    </div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        {/* Otras rutas si las hay */}
      </Routes>
    </BrowserRouter>
  );
}
