import { APP_NAME } from "../config";

function SetupNotice() {
  return (
    <main className="auth">
      <section className="auth-intro">
        <span className="brand brand-large">
          <i className="bi bi-check2-square" aria-hidden="true"></i>
          {APP_NAME}
        </span>
        <h1>Connect Firebase to turn on accounts.</h1>
        <p>
          The app is built, but it needs a free Firebase project to store each
          person's account and tasks.
        </p>
      </section>

      <div className="auth-main">
      <section className="auth-card">
        <h2>Setup steps</h2>
        <ol className="steps">
          <li>
            Create a project at the Firebase console. Add a Web app and copy its
            config values.
          </li>
          <li>
            Turn on Email/Password and Google under Authentication &gt; Sign-in
            method.
          </li>
          <li>Create a Firestore database, then paste the rules from firestore.rules.</li>
          <li>
            Copy .env.example to .env, fill in the values, and restart{" "}
            <code>npm run dev</code>.
          </li>
        </ol>
        <p className="hint">The README walks through each step in detail.</p>
      </section>
      </div>
    </main>
  );
}

export default SetupNotice;
