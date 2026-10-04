// Turns Firebase error codes into plain sentences that say what to do next.
export function friendlyAuthError(error) {
  switch (error?.code) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "";
    case "auth/invalid-email":
      return "That email address doesn't look right. Check it and try again.";
    case "auth/missing-password":
      return "Enter your password.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Email or password is incorrect. Check both and try again.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Sign in instead.";
    case "auth/weak-password":
      return "Use a password with at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a few minutes, then try again.";
    case "auth/network-request-failed":
      return "Can't reach the server. Check your internet connection.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google window. Allow pop-ups for this site and try again.";
    case "auth/unauthorized-domain":
      return "This site's domain isn't allowed in Firebase yet. Add it under Authentication > Settings > Authorized domains.";
    case "auth/operation-not-allowed":
      return "This sign-in method isn't turned on in Firebase. Enable it under Authentication > Sign-in method.";
    default:
      return "Something went wrong. Try again in a moment.";
  }
}
