/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_VISION_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'heic2any' {
  interface Heic2anyOptions {
    blob: Blob
    toType?: string
    quality?: number
  }
  function heic2any(options: Heic2anyOptions): Promise<Blob | Blob[]>
  export default heic2any
}
