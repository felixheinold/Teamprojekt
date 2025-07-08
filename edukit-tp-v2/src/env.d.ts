/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Weitere ENV-Variablen hier definieren, falls du welche hast
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
