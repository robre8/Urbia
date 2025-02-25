import { useUserAuth } from '@/lib/store/useUserAuth';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

export default function UserMenu() {
  const { user, logout } = useUserAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative z-[9999]">
      {/* Botón con la imagen del usuario ocupando todo el círculo */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full overflow-hidden border border-gray-400"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      </button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-64 p-4 bg-white rounded-xl shadow-lg border">
          <div className="flex items-center gap-3 border-b pb-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full border border-gray-300 object-cover"
            />
            <div>
              <p className="font-bold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email || 'Sin correo'}</p>
            </div>
          </div>

          <button className="block w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md">
            Ajustes de la cuenta
          </button>
          <button className="block w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md">
            Centro de ayuda
          </button>
          <button className="block w-full px-4 py-3 text-left hover:bg-gray-100 rounded-md">
            Informar de un problema
          </button>
          <button
            onClick={logout}
            className="block w-full px-4 py-3 text-left text-red-600 hover:bg-gray-100 rounded-md"
          >
            Cerrar sesión
          </button>
        </Card>
      )}
    </div>
  );
}
