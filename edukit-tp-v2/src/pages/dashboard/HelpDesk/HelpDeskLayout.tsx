import { ReactNode } from "react";

type HelpDeskLayoutProps = {
  icon?: string;
  title: string;
  children: ReactNode;
};

const HelpDeskLayout = ({ icon = "ℹ️", title, children }: HelpDeskLayoutProps) => {
  return (
    <main className="container max-w-3xl mx-auto py-10 px-4">
      {/* Titel mit Icon in einer Zeile + mehr Abstand */}
      <h1
        className="text-2xl font-bold flex items-center gap-3"
        style={{ marginBottom: "3.5rem" }} // ca. mb-14 (56px)
      >
        <span className="text-3xl" role="img" aria-label="icon">{icon}</span>
        {title}
      </h1>

      {/* Inhalt mit einheitlichem Abstand */}
      <div className="space-y-6">
        {children}
      </div>
    </main>
  );
};

export default HelpDeskLayout;
