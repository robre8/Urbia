import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from '@/features/home/pages/HomePage';
import Menu from '@/components/layout/Menu';
import NewReportForm from '@/features/NewReportForm/NewReportForm';
import CleanReportForm from '@/features/reports/form/CleanReportForm';

export default function AppRoutes() {
  return (
    <BrowserRouter>
    <div className='absolute z-[9999]'>
      <Menu />
      {/* <NewReportForm /> */}
      <CleanReportForm />

    </div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        {/* Otras rutas si las hay */}
      </Routes>
    </BrowserRouter>
  );
}
