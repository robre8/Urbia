import { useUserAuth } from '@/lib/store/useUserAuth';
import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Settings, LifeBuoy, Megaphone, LogOut, User } from 'lucide-react';

export default function UserMenu() {
  const { user, logout } = useUserAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Detectar pantalla móvil para abrir el menú hacia arriba
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!user) return null;

  return (
    <div className="relative z-[9999]" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full overflow-hidden flex shadow-xl items-center justify-center bg-white border border-gray-300"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {isOpen && (
        <Card
          className={`absolute ${
            isMobile ? 'bottom-full mb-2' : 'top-full mt-2'
          } right-0 w-64 p-4 bg-white rounded-xl shadow-lg border overflow-hidden`}
        >
          {/* Sección de usuario */}
          <div className="border-b pb-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.nombre || 'Usuario'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <p className="font-bold text-gray-900">{user.name}</p>
              <p className="text-[10px] text-gray-500">{user.email || 'Sin correo'}</p>
            </div>
          </div>

          {/* Opciones del menú */}
          <div className="flex flex-col mt-2">
            <Link
              to="/settings"
              className="flex items-center gap-3 w-full py-2 text-left hover:bg-gray-100 rounded-md px-4"
            >
              <Settings className="w-5 h-5 text-gray-600" />
              <span>Ajustes</span>
            </Link>
            <Link
              to="/help"
              className="flex items-center gap-3 w-full py-2 text-left hover:bg-gray-100 rounded-md px-4"
            >
              <LifeBuoy className="w-5 h-5 text-gray-600" />
              <span>Ayuda</span>
            </Link>
            <Link
              to="/news"
              className="flex items-center gap-3 w-full py-2 text-left hover:bg-gray-100 rounded-md px-4"
            >
              <Megaphone className="w-5 h-5 text-gray-600" />
              <span>Novedades</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full py-2 text-left text-red-600 hover:bg-gray-100 rounded-md px-4"
            >
              <LogOut className="w-5 h-5 text-red-600" />
              <span>Salir</span>
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
