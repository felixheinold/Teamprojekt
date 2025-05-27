import { Link, Outlet } from "react-router-dom";

const Layout = () => (
  <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">EduKIT</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Register</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/modules">Module</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/chapters/1">Kapitel</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/minigames/1/1">Minigames</Link></li>
          </ul>
        </div>
      </div>
    </nav>

    <main className="container my-4">
      <Outlet />
    </main>
  </>
);

export default Layout;
