/** @jsxImportSource react */
import * as React from "react";
import { hydrateRoot } from "react-dom/client";
import type { UiLibrary } from "../lib/promptOptions";
import { ProductExample } from "./product";

hydrateRoot(document.getElementById("demo-root")!, <ProductExample library={document.body.dataset.previewLibrary as UiLibrary} />);
