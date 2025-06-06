import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { isUserChef, getUserChefInfo } from '@/app/server/users';
import { cache } from 'react';

/**
 * Get current session and chef status (cached)
 */
export const getSessionWithChefStatus = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user?.id) {
    return {
      session: null,
      isChef: false,
      chefInfo: null
    };
  }

  const [isChef, chefInfo] = await Promise.all([
    isUserChef(session.user.id),
    getUserChefInfo(session.user.id)
  ]);

  return {
    session,
    isChef,
    chefInfo
  };
});

/**
 * Get only chef status for current user (cached)
 */
export const getCurrentUserChefStatus = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user?.id) {
    return false;
  }

  return await isUserChef(session.user.id);
});
