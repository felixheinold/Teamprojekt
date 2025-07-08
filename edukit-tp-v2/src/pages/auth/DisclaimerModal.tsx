import { useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  onAccept: () => void;
};

const DisclaimerModal = ({ onAccept }: Props) => {
  const [accepted, setAccepted] = useState(false);
  const { t } = useTranslation();

  // Sicherstellen, dass wir ein Array bekommen
  const list: string[] = t("disclaimer.termsList", {
    returnObjects: true,
    defaultValue: [],
  }) as string[];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">📜 {t("disclaimer.termsTitle")}</h2>

        <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
          {list.map((item, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </div>

        <div className="mt-6">
          <label className="flex items-start space-x-2 text-sm">
            <input
              type="checkbox"
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
              className="mt-1"
            />
            <span>{t("disclaimer.acceptLabel")}</span>
          </label>
        </div>

        <button
          disabled={!accepted}
          onClick={() => {
            localStorage.setItem("disclaimerAccepted", "true");
            onAccept();
          }}
          className={`mt-4 px-5 py-2 rounded font-semibold text-white transition ${
            accepted ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {t("disclaimer.continueButton")}
        </button>
      </div>
    </div>
  );
};

export default DisclaimerModal;
