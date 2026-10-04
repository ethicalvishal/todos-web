# Taskbook

A multi-user todo app. Anyone can create an account (email/password or Google) and keep a private task list that syncs across devices.

Built with React + Vite, Firebase Authentication and Cloud Firestore.

## Features

- Sign up, sign in, Google sign-in, password reset
- Each user's tasks are stored separately and protected by Firestore rules
- Add, edit, complete and delete tasks, with priority and due date (quick Today / Tomorrow / Next week buttons or a date picker)
- Tasks are grouped by date: Overdue, Today, Tomorrow, This week, Later, No due date, Completed
- Summary cards for overdue, due today and completed, plus a progress bar
- Filter (All / Pending / Done), search, clear completed
- Live sync: change a task on one device and it updates on the others
- One-time import of tasks saved by the old localStorage version
- Light and dark mode follow the system setting

## Setup

1. **Create a Firebase project** at https://console.firebase.google.com
2. **Add a Web app** (the `</>` icon) and copy the config values.
3. **Authentication > Sign-in method**: enable *Email/Password* and *Google*.
4. **Firestore Database > Create database** (production mode), then open the *Rules* tab and paste the contents of `firestore.rules`. Select *Publish*.
5. Copy `.env.example` to `.env` and paste your values.
6. Install and run:

```bash
npm install
npm run dev
```

## Deploy (Vercel / Render)

1. Push the project to GitHub. `.env` is git-ignored, so your keys stay out of the repo.
2. In Vercel (or Render), add the same six `VITE_FIREBASE_*` variables under Environment Variables.
3. Build command: `npm run build`. Output directory: `dist`.
4. In Firebase, go to **Authentication > Settings > Authorized domains** and add your live domain (for example `your-app.vercel.app`). Google sign-in will not work on the live site until you do.

The Firebase web config is not a secret. Your data is protected by the Firestore rules, not by hiding the keys.

## Structure

```
src/
  auth/        AuthProvider, useAuth, friendly error messages
  hooks/       useTodos: live Firestore subscription and write actions
  pages/       AuthPage, SetupNotice
  myComponents/ Header, Todos, Todo, Composer, ProgressStrip, Footer
  firebase.js  Firebase init (reads .env)
```

Data model: `users/{uid}/todos/{todoId}` with `title`, `completed`, `priority`, `dueDate`, `createdAt`, `completedAt`.
