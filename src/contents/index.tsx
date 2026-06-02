import type { PlasmoCSConfig } from "plasmo";
import { bootstrap } from "../lib/sync";
import "~style.css";
import "~project.css";

export const config: PlasmoCSConfig = {
  matches: ["https://stardance.hackclub.com/*"],
  run_at: "document_idle",
};

bootstrap();
