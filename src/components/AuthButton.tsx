
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const AuthButton: React.FC = () => {
  const { user, signInWithGoogle, signOut, loading } = useAuth();
  const { profile } = useProfile();

  if (loading) {
    return <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>;
  }

  if (user) {
    const displayName = profile?.display_name || user.user_metadata?.full_name || user.email;
    const avatarUrl = user.user_metadata?.avatar_url;
    
    return (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl} alt={displayName || 'User'} />
          <AvatarFallback>
            {displayName?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <span className="text-white text-sm">{displayName}</span>
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
