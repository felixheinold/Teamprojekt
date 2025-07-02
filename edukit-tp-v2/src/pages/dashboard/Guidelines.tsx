import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Guidelines = () => {
  const { t } = useTranslation();
const tips = t("guidelines.tips", { returnObjects: true }) as string[];

  return (
    <div className="container py-4" style={{ maxWidth: "800px" }}>
      <motion.h1
        className="fw-bold text-center mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📘 {t("guidelines.title")}
      </motion.h1>

      <motion.p
        className="lead text-center mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {t("guidelines.subtitle")}
      </motion.p>

      <ul className="list-group mb-4">
        {Array.isArray(tips) &&
          tips.map((tip, idx) => (
            <li key={idx} className="list-group-item">
              <span dangerouslySetInnerHTML={{ __html: tip }} />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Guidelines;
