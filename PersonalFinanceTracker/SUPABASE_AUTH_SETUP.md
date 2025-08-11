# Supabase Authentication Setup for React Native

## Issue
The email confirmation link is redirecting to `localhost:3000` instead of opening your app.

## Solution Options

### Option 1: Disable Email Confirmation (Development)
This is the quickest solution for development:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/tupfmqgnirxjyhpkieka
2. Navigate to **Authentication** → **Providers** → **Email**
3. Toggle OFF "Confirm email" 
4. Save changes

Now users can sign up and immediately log in without email confirmation.

### Option 2: Configure Proper Redirect URLs (Production)

#### Step 1: Update Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/tupfmqgnirxjyhpkieka/auth/url-configuration
2. Add these URLs to "Redirect URLs":
   - `personalfinancetracker://auth` (for mobile app)
   - `http://localhost:8081` (for development)
   - Your production domain when you have one

#### Step 2: Update Email Templates
1. Go to: https://supabase.com/dashboard/project/tupfmqgnirxjyhpkieka/auth/templates
2. Edit the "Confirm signup" template
3. Change the confirmation URL from:
   ```
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
   ```
   To:
   ```
   personalfinancetracker://auth/confirm?token_hash={{ .TokenHash }}&type=email
   ```

#### Step 3: Handle Deep Links in App (Already Configured)
The Android manifest has been updated to handle `personalfinancetracker://auth` URLs.

### Option 3: Use Magic Link Instead
Update your signup to use magic links (passwordless):

```typescript
// In AuthContext.tsx
const signUpWithMagicLink = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'personalfinancetracker://auth',
    },
  });
  
  if (error) throw error;
};
```

## Testing

After making changes:
1. Rebuild your Android app: `npm run android`
2. Try signing up with a new email
3. Check that the confirmation works properly

## For Production

When deploying to production:
1. Update redirect URLs to your production domain
2. Consider using a custom domain for emails
3. Test the full flow on a real device

## Current Status
- ✅ Deep linking configured in Android manifest
- ✅ App scheme: `personalfinancetracker://auth`
- ⚠️ Need to update Supabase dashboard settings (manual step)