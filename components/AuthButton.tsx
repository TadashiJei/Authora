// components/AuthButton.tsx
'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

import { useUser } from '@civic/auth-web3/react';

export default function AuthButton() {
  // const router = useRouter(); // No longer needed for basic login/logout
  const { user, isLoading, signIn, signOut, authStatus, error } = useUser();

  // You can use authStatus for more granular loading/error states if needed
  // console.log('Civic Auth Status:', authStatus);
  // if (error) console.error('Civic Auth Error:', error);

  const handleLogin = async () => {
    try {
      await signIn();
      // router.push('/dashboard'); // Optionally redirect after login
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // router.push('/'); // Optionally redirect after logout
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  if (isLoading) {
    return <Button variant="outline" disabled>Loading...</Button>;
  }

  if (user) {
    return (
      <Button onClick={handleLogout} variant="outline">
        Logout
      </Button>
    );
  }

  return (
    <Button onClick={handleLogin}>
      Login with Civic
    </Button>
  );
}
