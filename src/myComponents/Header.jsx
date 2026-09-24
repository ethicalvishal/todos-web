function Header() {
  return (
    <nav className="navbar bg-body-tertiary shadow-sm">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#">
          <i className="bi bi-list-check me-2 text-primary"></i>
          My Tasks
        </a>
      </div>
    </nav>
  );
}

export default Header;