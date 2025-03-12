import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/lib/store/useUserAuth';
import { toast } from 'sonner';

export default function OAuthCallback() {
  const { handleOAuthCallback } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const processOAuth = async () => {
      try {
        // Get the token from URL parameters
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        
        if (!token) {
          throw new Error('No token received');
        }

        // Process the OAuth callback
        await handleOAuthCallback(token);
        
        // Show success message
        toast.success('¡Inicio de sesión exitoso!');
        
        // Redirect to home page
        navigate('/');
      } catch (error) {
        console.error('Error in OAuth callback:', error);
        toast.error('Error al iniciar sesión con Google');
        navigate('/');
      }
    };

    processOAuth();
  }, [handleOAuthCallback, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Procesando inicio de sesión...</p>
      </div>
    </div>
  );
}