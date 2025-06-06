'use client'

import { useEffect, useState } from 'react';
import { authClient } from "@/lib/authClient";

export function SessionInfo() {
  const { useSession } = authClient
  const { data: session, isPending } = useSession();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section>
      {isPending && <p>Loading...</p>}
      {session && <p>Signed in as {session.user.name}</p>}

      { session && (
        <p>
        {JSON.stringify(session, null, 2)}
        </p>
      )}
    </section>
  )
}