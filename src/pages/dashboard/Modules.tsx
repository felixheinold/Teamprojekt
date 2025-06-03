import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const modules = [
  { title: "Produktion und Logistik", icon: "📦" },
  { title: "Finanzierung und Rechnungswesen", icon: "💰" },
  { title: "Management und Marketing", icon: "📊" },
  { title: "Integrierte Produktionsplanung", icon: "🏭" },
  { title: "Volkswirtschaftslehre 2", icon: "📉" },
  { title: "Volkswirtschaftslehre 1", icon: "📈" },
];

const Modules = () => {
  return (
    <div
      className="container pt-2 d-flex flex-column align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <h1 className="text-center fw-bold display-4 mb-5">
        📚 Wähle ein Modul aus
      </h1>

      <div className="d-flex flex-column align-items-center gap-3 w-100">
        {modules.map((modul, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="w-100"
            style={{ maxWidth: "600px" }}
          >
            <Link
              to="/chapters/:id"
              className="btn btn-success btn-lg shadow w-100 text-start d-flex align-items-center gap-3"
            >
              <span style={{ fontSize: "1.5rem" }}>{modul.icon}</span>
              <span>{modul.title}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Modules;
