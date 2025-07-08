import { useTranslation } from "react-i18next";
import HelpDeskLayout from "./HelpDeskLayout";

const Guidelines = () => {
  const { t } = useTranslation();
  const tips = t("guidelines.tips", { returnObjects: true }) as string[];

  return (
    <HelpDeskLayout icon="📘" title={t("guidelines.title")}>
      <ul className="list-disc ml-6 space-y-2">
        {tips.map((tip, idx) => (
          <li key={idx} dangerouslySetInnerHTML={{ __html: tip }} />
        ))}
      </ul>
    </HelpDeskLayout>
  );
};

export default Guidelines;
