import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App";

// react-snap prerenders each route to static HTML at build time. When that
// markup is present we hydrate it (preserving SEO content for crawlers);
// otherwise (dev, or a route that wasn't prerendered) we mount fresh.
const container = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
