import { useTranslation } from "react-i18next";

const Guidelines = () => {
  const { t } = useTranslation();
  const tips = t("guidelines.tips", { returnObjects: true }) as string[];

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">📘 {t("guidelines.title")}</h1>
      <ul className="list-disc ml-6 space-y-2">
        {tips.map((tip, idx) => (
          <li key={idx} dangerouslySetInnerHTML={{ __html: tip }} />
        ))}
      </ul>
    </div>
  );
};

export default Guidelines;
