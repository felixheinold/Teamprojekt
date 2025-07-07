import { useTranslation } from "react-i18next";

const FAQ = () => {
  const { t } = useTranslation();
  const faqs = t("faq.items", { returnObjects: true }) as { question: string; answer: string }[];

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">❓ {t("faq.title")}</h1>
      <div className="space-y-4">
        {faqs.map((item, idx) => (
          <details key={idx} className="border rounded-lg p-4">
            <summary className="font-medium cursor-pointer">{item.question}</summary>
            <p className="mt-2 text-gray-700">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
