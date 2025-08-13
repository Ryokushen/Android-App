# Personal Finance Tracker

This is a React Native application for personal finance management, built with a Supabase backend.

## Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

### 1. Supabase Setup

This project requires a Supabase backend.

1.  Sign up for a Supabase account at [supabase.com](https://supabase.com).
2.  Create a new project.
3.  In the Supabase project dashboard, go to `Settings` > `API`.
4.  Copy the `Project URL` and `anon` `public` key.
5.  Create a `.env` file in the root of the `PersonalFinanceTracker` directory.
6.  Add the following to your `.env` file:

    ```
    SUPABASE_URL=YOUR_SUPABASE_URL
    SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

7.  Navigate to the `supabase/migrations` directory and run the SQL scripts to set up your database schema.

### 2. Install Dependencies

```sh
# Using npm
npm install

# OR using Yarn
yarn
```

### 3. Start Metro

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

### 4. Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

#### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

#### iOS

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.
