import { Linking } from 'react-native';
import { supabase } from '@/data/supabase';

export const setupDeepLinking = () => {
  // Handle initial URL if app was opened from a deep link
  Linking.getInitialURL().then((url) => {
    if (url) handleDeepLink(url);
  });

  // Handle deep links when app is already open
  const subscription = Linking.addEventListener('url', (event) => {
    handleDeepLink(event.url);
  });

  return () => {
    subscription.remove();
  };
};

const handleDeepLink = async (url: string) => {
  if (!url) return;

  // Check if this is a Supabase auth callback
  if (url.includes('personalfinancetracker://auth')) {
    try {
      // Extract the token and type from the URL
      const urlParams = new URL(url);
      const token_hash = urlParams.searchParams.get('token_hash');
      const type = urlParams.searchParams.get('type');
      
      if (token_hash && type === 'email') {
        // Verify the email with Supabase
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'email',
        });
        
        if (error) {
          console.error('Error verifying email:', error);
        } else {
          console.log('Email verified successfully!');
          // The auth state will automatically update via the listener
        }
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
    }
  }
};