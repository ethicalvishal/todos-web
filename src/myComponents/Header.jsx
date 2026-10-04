import { APP_NAME } from "../config";

function initialsOf(user) {
  const source = user.displayName || user.email || "?";
  return source.trim().charAt(0).toUpperCase();
}

function Header({ user, onSignOut }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="/">
          <i className="bi bi-check2-square" aria-hidden="true"></i>
          {APP_NAME}
        </a>

        {user && (
          <div className="topbar-user">
            <span className="avatar" aria-hidden="true">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" referrerPolicy="no-referrer" />
              ) : (
                initialsOf(user)
              )}
            </span>
            <span className="topbar-name">{user.displayName || user.email}</span>
            <button type="button" className="btn btn-quiet" onClick={onSignOut}>
              <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
