import { useUserAuth } from '@/lib/store/useUserAuth';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Settings, LifeBuoy, Megaphone, LogOut, User } from 'lucide-react';
import userIcon from '/frogIco.png'; // Imagen de la rana

export default function UserMenu() {
  const { user, logout } = useUserAuth(); 
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative z-[9999]">
      {/* Botón con imagen de usuario o rana si el menú está abierto */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full overflow-hidden border border-gray-400 flex items-center justify-center bg-gray-200"
      >
        <img
          src={isOpen ? userIcon : user.avatar || ''}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      </button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-64 p-4 bg-white rounded-xl shadow-lg border">
          {/* Foto del usuario al lado del nombre cuando el menú está abierto */}
          <div className="border-b pb-3 px-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 bg-gray-200 flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-gray-600" />
              )}
            </div>
            <div>
              <p className="font-bold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email || 'Sin correo'}</p>
            </div>
          </div>

          {/* Opciones alineadas con el nombre */}
          <div className="flex flex-col mt-2">
            <Link to="/settings" className="flex items-center gap-3 w-full py-2 text-left hover:bg-gray-100 rounded-md pl-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <span>Ajustes</span>
            </Link>

            <Link to="/help" className="flex items-center gap-3 w-full py-2 text-left hover:bg-gray-100 rounded-md pl-4">
              <LifeBuoy className="w-5 h-5 text-gray-600" />
              <span>Ayuda</span>
            </Link>

            <Link to="/news" className="flex items-center gap-3 w-full py-2 text-left hover:bg-gray-100 rounded-md pl-4">
              <Megaphone className="w-5 h-5 text-gray-600" />
              <span>Novedades</span>
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-3 w-full py-2 text-left text-red-600 hover:bg-gray-100 rounded-md pl-4"
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
