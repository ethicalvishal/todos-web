import { useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "../firebase";
import { AuthContext } from "./AuthContext";

// Plain object so React re-renders when the profile changes.
function toPlainUser(firebaseUser) {
  if (!firebaseUser) return null;

  return {
    uid: firebaseUser.uid,
    displayName: firebaseUser.displayName,
    email: firebaseUser.email,
    photoURL: firebaseUser.photoURL,
  };
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!auth) return undefined;

    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(toPlainUser(firebaseUser));
      setLoading(false);
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isConfigured: isFirebaseConfigured,

      async signUp(name, email, password) {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(credential.user, { displayName: name.trim() });
        setUser(toPlainUser(auth.currentUser));
      },

      async signIn(email, password) {
        await signInWithEmailAndPassword(auth, email, password);
      },

      async signInWithGoogle() {
        await signInWithPopup(auth, googleProvider);
      },

      async resetPassword(email) {
        await sendPasswordResetEmail(auth, email);
      },

      async signOut() {
        await firebaseSignOut(auth);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
