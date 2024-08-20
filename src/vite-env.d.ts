/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RULE_ID: string
  readonly VITE_APP_SIG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
