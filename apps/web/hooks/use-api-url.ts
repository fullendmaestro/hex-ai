"use client";

import { parseAsString, useQueryState } from "nuqs";

export function useApiUrl() {
  const [apiUrl] = useQueryState("apiUrl", parseAsString);
  const [port] = useQueryState("port", parseAsString);

  const finalApiUrl = apiUrl
    ? apiUrl
    : port
      ? `http://localhost:${port}`
      : "http://localhost:8042";

  return finalApiUrl;
}
