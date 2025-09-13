/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_DEBUG: string
  readonly VITE_USE_MOCK_DATA: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
