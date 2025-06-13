
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const AuthButton: React.FC = () => {
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  if (loading) {
    return <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
          <AvatarFallback>
            {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>
        <Button onClick={signOut} variant="outline" size="sm">
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={signInWithGoogle} className="bg-blue-600 hover:bg-blue-700">
      Sign In with Google
    </Button>
  );
};

export default AuthButton;
