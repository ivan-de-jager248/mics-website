/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly CONTACT_FORMSUBMIT_DEFAULT_ID: string;
  readonly CONTACT_FORMSUBMIT_QUOTE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}