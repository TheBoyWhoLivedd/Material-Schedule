import { Link } from "react-router-dom";
import Login from "../features/auth/Login";

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1 className="text-center">
          {" "}
          Uganda Revenue Authority{" "}
          <span className="nowrap">DEEMED VAT UNIT</span>
        </h1>
      </header>
      <main className="public__main">
        {/* <p>Patriotism, Integrity, Professionalism</p>
        <address className="public__addr">
          Head Office: Plot M193/M194
          <br />
          P.O.Box 7279, Kampala Uganda
          <br />
          Nakawa Industrial Area
          <br />
          <a href="tel:+256417442097">(256) 417-442097</a>
        </address>
        <br />
        <p></p> */}
        <Login />
      </main>
      {/* <footer>
        <Link to="/login">Employee Login</Link>
      </footer> */}
    </section>
  );
  return content;
};
export default Public;
