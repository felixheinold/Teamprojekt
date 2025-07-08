import { useTranslation } from "react-i18next";
import HelpDeskLayout from "./HelpDeskLayout";

const DataPrivacy = () => {
  const { t } = useTranslation();

  return (
    <HelpDeskLayout icon="🔒" title={t("privacy.title")}>
      <p>{t("privacy.paragraph1")}</p>
      <p>{t("privacy.paragraph2")}</p>
    </HelpDeskLayout>
  );
};

export default DataPrivacy;
