// pages/dashboard/HelpDesk/Imprint.tsx
import { useTranslation } from "react-i18next";
import HelpDeskLayout from "./HelpDeskLayout";

const Imprint = () => {
  const { t } = useTranslation();

  return (
    <HelpDeskLayout icon="📄" title={t("impressum.title")}>
      <div dangerouslySetInnerHTML={{ __html: t("impressum.address") }} />

      <p>
        <strong>{t("impressum.emailLabel")}</strong>: {t("impressum.email")}
      </p>

      <p>{t("impressum.note")}</p>
    </HelpDeskLayout>
  );
};

export default Imprint;
