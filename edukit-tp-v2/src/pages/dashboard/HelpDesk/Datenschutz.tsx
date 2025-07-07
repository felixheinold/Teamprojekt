import { useTranslation } from "react-i18next";

const Datenschutz = () => {
  const { t } = useTranslation();

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">🔒 {t("privacy.title")}</h1>
      <p>{t("privacy.paragraph1")}</p>
      <p className="mt-4">{t("privacy.paragraph2")}</p>
    </div>
  );
};

export default Datenschutz;
