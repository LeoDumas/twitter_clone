import { useState, useEffect } from 'react';
import PocketBase, { AuthModel } from 'pocketbase';

const pb = new PocketBase("REDACTED");

export function usePocketBase() {
  const [currentUser, setCurrentUser] = useState<AuthModel | null>(pb.authStore.model);

  useEffect(() => {
    // Update currentUser when auth state changes
    const unsubscribe = pb.authStore.onChange((_token, model) => {
      setCurrentUser(model);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { pb, currentUser };
}