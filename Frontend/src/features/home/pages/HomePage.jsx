// features/home/pages/HomePage.jsx
import{ useEffect } from 'react';
import useReportsStore from '../../../lib/store/useReportsStore';
import MapView from '@/components/mapview/MapView';

function HomePage() {
  const { reports, fetchReports } = useReportsStore();

  useEffect(() => {
    // Al montar el componente, buscamos los reports
    if (reports.length === 0) {
      fetchReports();
    }
  }, [fetchReports]);

  return (
    <div className='h-screen w-full'>
      <MapView reports={reports} />
    </div>
  );
}

export default HomePage;
