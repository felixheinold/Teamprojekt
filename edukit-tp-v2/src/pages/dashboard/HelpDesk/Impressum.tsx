import { useTranslation } from "react-i18next";

const Impressum = () => {
  const { t } = useTranslation();

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">📄 {t("impressum.title")}</h1>
      <p dangerouslySetInnerHTML={{ __html: t("impressum.address") }} />
      <p className="mt-4">{t("impressum.email")}</p>
      <p>{t("impressum.note")}</p>
    </div>
  );
};

export default Impressum;
