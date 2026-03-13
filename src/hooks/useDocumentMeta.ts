import { useEffect } from "react";
interface DocumentMetaOptions {
  title?: string;
  favicon?: string;
}

export function useDocumentMeta({ title, favicon }: DocumentMetaOptions) {
  // Set title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  // Set favicon
  useEffect(() => {
    if (!favicon) return;

    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.href = favicon;
  }, [favicon]);
}
