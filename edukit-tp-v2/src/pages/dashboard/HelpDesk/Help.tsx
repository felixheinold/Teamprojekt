import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Help = () => {
  const { t } = useTranslation();

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{t("help.title")}</h1>
      <ul className="space-y-4 text-lg">
        <li>
          <Link to="/dashboard/HelpDesk/FAQ">❓ {t("help.faq")}</Link>
        </li>
        <li>
          <Link to="/dashboard/HelpDesk/Guidelines">📘 {t("help.guidelines")}</Link>
        </li>
        <li>
          <Link to="/dashboard/HelpDesk/Datenschutz">🔒 {t("help.datenschutz")}</Link>
        </li>
        <li>
          <Link to="/dashboard/HelpDesk/Impressum">📄 {t("help.impressum")}</Link>
        </li>
      </ul>
    </div>
  );
};

export default Help;
