import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./DisclaimerModal.css";

type Props = {
  onAccept: () => void;
};

const DisclaimerModal = ({ onAccept }: Props) => {
  const [accepted, setAccepted] = useState(false);
  const { t } = useTranslation();

  const list: string[] = t("disclaimer.termsList", {
    returnObjects: true,
    defaultValue: [],
  }) as string[];

  return (
    <div className="disclaimer-backdrop">
      <div className="disclaimer-wrapper">
        <h2 className="disclaimer-title">📜 {t("disclaimer.termsTitle")}</h2>

        <div className="disclaimer-content">
          {list.map((item, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </div>

        <label className="disclaimer-checkbox">
          <input
            type="checkbox"
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
          />
          <span>{t("disclaimer.acceptLabel")}</span>
        </label>

        <button
          disabled={!accepted}
          onClick={() => {
            localStorage.setItem("disclaimerAccepted", "true");
            onAccept();
          }}
          className="disclaimer-button"
        >
          {t("disclaimer.continueButton")}
        </button>
      </div>
    </div>
  );
};

export default DisclaimerModal;
