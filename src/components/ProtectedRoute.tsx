import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🛡️ ProtectedRoute check - Loading:', loading, 'User:', !!user, 'IsAdmin:', isAdmin, 'RequireAdmin:', requireAdmin);
    
    if (!loading) {
      if (!user) {
        console.log('🛡️ No user, redirecting to login');
        navigate('/admin/login');
        return;
      }
      
      if (requireAdmin && !isAdmin) {
        console.log('🛡️ User not admin, redirecting to home');
        navigate('/');
        return;
      }
      
      console.log('🛡️ Access granted!');
    }
  }, [user, loading, isAdmin, requireAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-craft-gradient rounded-lg mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
};