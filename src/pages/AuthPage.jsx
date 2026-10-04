import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { friendlyAuthError } from "../auth/authErrors";
import { APP_NAME } from "../config";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AuthPage() {
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const isSignUp = mode === "signup";

  function switchMode(next) {
    setMode(next);
    setError("");
    setInfo("");
    setFieldErrors({});
  }

  function clearField(field) {
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setError("");
  }

  async function attempt(action) {
    setBusy(true);
    setError("");
    setInfo("");

    try {
      await action();
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  function validate() {
    const problems = {};

    if (isSignUp && name.trim() === "") {
      problems.name = "Enter your name.";
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      problems.email = "Enter a valid email, like name@example.com.";
    }
    if (password === "") {
      problems.password = "Enter your password.";
    } else if (isSignUp && password.length < 6) {
      problems.password = "Use at least 6 characters.";
    }

    setFieldErrors(problems);
    return Object.keys(problems).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    attempt(() =>
      isSignUp ? signUp(name, email.trim(), password) : signIn(email.trim(), password),
    );
  }

  function handleReset() {
    if (!EMAIL_PATTERN.test(email.trim())) {
      setFieldErrors({ email: "Enter your email here, then select Forgot password." });
      return;
    }

    attempt(async () => {
      await resetPassword(email.trim());
      setInfo(`Reset link sent to ${email.trim()}. Check your inbox and spam folder.`);
    });
  }

  return (
    <main className="auth">
      <section className="auth-intro">
        <span className="brand brand-large">
          <i className="bi bi-check2-square" aria-hidden="true"></i>
          {APP_NAME}
        </span>

        <h1>Plan your day. Finish what matters.</h1>
        <p>
          Create a free account to keep your tasks online. Every person gets
          their own private list, saved to their account and ready on any
          device.
        </p>

        <ul className="perks">
          <li>
            <i className="bi bi-calendar-check" aria-hidden="true"></i>
            Tasks sorted by due date: overdue, today, tomorrow, later
          </li>
          <li>
            <i className="bi bi-lock" aria-hidden="true"></i>
            Private to your account. Nobody else can see your list
          </li>
          <li>
            <i className="bi bi-arrow-repeat" aria-hidden="true"></i>
            Changes sync instantly between your phone and computer
          </li>
        </ul>

        <div className="preview" aria-hidden="true">
          <div className="preview-row">
            <span className="preview-box"></span>
            <span className="preview-title">Send project update</span>
            <span className="chip chip-due-overdue">1 day overdue</span>
          </div>
          <div className="preview-row">
            <span className="preview-box"></span>
            <span className="preview-title">Book dentist appointment</span>
            <span className="chip chip-due-today">Today</span>
          </div>
          <div className="preview-row is-done">
            <span className="preview-box is-on">
              <i className="bi bi-check-lg"></i>
            </span>
            <span className="preview-title">Buy groceries</span>
          </div>
        </div>
      </section>

      <div className="auth-main">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="tabs" role="group" aria-label="Choose sign in or create account">
          <button
            type="button"
            className={!isSignUp ? "tab is-active" : "tab"}
            aria-pressed={!isSignUp}
            onClick={() => switchMode("signin")}
          >
            Sign in
          </button>
          <button
            type="button"
            className={isSignUp ? "tab is-active" : "tab"}
            aria-pressed={isSignUp}
            onClick={() => switchMode("signup")}
          >
            Create account
          </button>
        </div>

        <h2 id="auth-title">{isSignUp ? "Create your account" : "Welcome back"}</h2>
        <p className="auth-sub">
          {isSignUp
            ? "It takes less than a minute."
            : "Sign in to see your tasks."}
        </p>

        <button
          type="button"
          className="btn btn-google"
          disabled={busy}
          onClick={() => attempt(signInWithGoogle)}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z"/>
            <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z"/>
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.9 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <p className="divider">
          <span>or use your email</span>
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {isSignUp && (
            <div className="field">
              <label htmlFor="auth-name">Your name</label>
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                value={name}
                aria-invalid={fieldErrors.name ? "true" : "false"}
                aria-describedby={fieldErrors.name ? "auth-name-error" : undefined}
                onChange={(event) => {
                  setName(event.target.value);
                  clearField("name");
                }}
              />
              {fieldErrors.name && (
                <p id="auth-name-error" className="field-error">
                  {fieldErrors.name}
                </p>
              )}
            </div>
          )}

          <div className="field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              aria-invalid={fieldErrors.email ? "true" : "false"}
              aria-describedby={fieldErrors.email ? "auth-email-error" : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                clearField("email");
              }}
            />
            {fieldErrors.email && (
              <p id="auth-email-error" className="field-error">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="field">
            <div className="field-head">
              <label htmlFor="auth-password">Password</label>
              {!isSignUp && (
                <button
                  type="button"
                  className="link-btn"
                  onClick={handleReset}
                  disabled={busy}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="password-wrap">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                value={password}
                aria-invalid={fieldErrors.password ? "true" : "false"}
                aria-describedby={
                  fieldErrors.password ? "auth-password-error" : "auth-password-hint"
                }
                onChange={(event) => {
                  setPassword(event.target.value);
                  clearField("password");
                }}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((shown) => !shown)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                <i
                  className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}
                  aria-hidden="true"
                ></i>
              </button>
            </div>
            {fieldErrors.password ? (
              <p id="auth-password-error" className="field-error">
                {fieldErrors.password}
              </p>
            ) : (
              isSignUp && (
                <p id="auth-password-hint" className="hint">
                  Use at least 6 characters.
                </p>
              )
            )}
          </div>

          {error && (
            <p className="banner banner-error" role="alert">
              {error}
            </p>
          )}
          {info && (
            <p className="banner banner-ok" role="status">
              {info}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="switch-text">
          {isSignUp ? "Already have an account?" : "New to Taskbook?"}{" "}
          <button
            type="button"
            className="link-btn link-inline"
            onClick={() => switchMode(isSignUp ? "signin" : "signup")}
          >
            {isSignUp ? "Sign in" : "Create an account"}
          </button>
        </p>
      </section>
      </div>
    </main>
  );
}

export default AuthPage;
