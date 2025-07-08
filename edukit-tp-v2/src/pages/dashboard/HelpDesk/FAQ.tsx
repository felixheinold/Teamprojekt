import { useTranslation } from "react-i18next";
import HelpDeskLayout from "./HelpDeskLayout";

const FAQ = () => {
  const { t } = useTranslation();
  const faqs = t("faq.items", { returnObjects: true }) as {
    question: string;
    answer: string;
  }[];

  return (
    <HelpDeskLayout icon="❓" title={t("faq.title")}>
      <div className="space-y-4">
        {faqs.map((item, idx) => (
          <details key={idx} className="border rounded-lg p-4">
            <summary className="font-medium cursor-pointer">
              {item.question}
            </summary>
            <p className="mt-2 text-gray-700">{item.answer}</p>
          </details>
        ))}
      </div>
    </HelpDeskLayout>
  );
};

export default FAQ;
