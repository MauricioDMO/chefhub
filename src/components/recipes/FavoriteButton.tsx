'use client';

import { useState, useEffect, useCallback } from 'react';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  recipeId: number;
  initialIsFavorite?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function FavoriteButton({ 
  recipeId, 
  initialIsFavorite = false, 
  className = '',
  size = 'md',
  showText = false
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/favorites/check?recipeId=${recipeId}`);
      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }, [recipeId]);

  // Check favorite status on mount if not explicitly set
  useEffect(() => {
    if (initialIsFavorite === undefined) {
      checkFavoriteStatus();
    } else {
      setIsFavorite(initialIsFavorite);
    }  }, [recipeId, initialIsFavorite, checkFavoriteStatus]);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);

    try {
      if (isFavorite) {
        // Remover de favoritos
        const response = await fetch(`/api/favorites?recipeId=${recipeId}`, {
          method: 'DELETE',
        });

        if (response.status === 401) {
          router.push('/sign-in');
          return;
        }

        if (response.ok) {
          setIsFavorite(false);
        } else {
          const error = await response.json();
          console.error('Error removing from favorites:', error.error);
        }
      } else {
        // Agregar a favoritos
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ recipeId }),
        });

        if (response.status === 401) {
          router.push('/sign-in');
          return;
        }        if (response.ok) {
          setIsFavorite(true);
        } else if (response.status === 409) {
          // Recipe is already in favorites
          setIsFavorite(true);
        } else {
          const error = await response.json();
          console.error('Error adding to favorites:', error.error);
        }
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`
        inline-flex items-center gap-2 
        ${isFavorite 
          ? 'text-red-600 hover:text-red-700' 
          : 'text-gray-400 hover:text-red-600'
        } 
        transition-colors duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title={isFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
    >
      {isFavorite ? (
        <IconHeartFilled className={sizeClasses[size]} />
      ) : (
        <IconHeart className={sizeClasses[size]} />
      )}
      {showText && (
        <span className="text-sm">
          {isFavorite ? 'En Favoritos' : 'Agregar a Favoritos'}
        </span>
      )}
    </button>
  );
}
