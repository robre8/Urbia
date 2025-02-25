import { useUserAuth } from '@/lib/store/useUserAuth';
import { Button } from '@/components/ui/button';

export default function UserLogin() {
  const { user, login } = useUserAuth();

  if (user) return null;

  return (
    <Button onClick={login} className="bg-[#9bee5e] text-black w-[162px] h-[48px] rounded-full z-[9999]">
      Iniciar sesión
    </Button>
  );
}
