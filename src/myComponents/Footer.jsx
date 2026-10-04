import { APP_NAME } from "../config";

function Footer() {
  return (
    <footer className="footer">
      <p>
        {APP_NAME} · {new Date().getFullYear()} · Your tasks are private to your
        account.
      </p>
    </footer>
  );
}

export default Footer;
