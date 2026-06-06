import { DEVLOG_TEMPLATES } from "~devlog-templates";

export function enhanceHomeComposer(): void {
  if (!window.location.pathname.startsWith("/home")) return;

  const composer = [...document.querySelectorAll(".feed-composer")].find((c) =>
    c.querySelector('textarea[name="post_devlog[body]"]'),
  );
  if (!composer) return;
  if (composer.getAttribute("data-su-template-injected") === "true") return;
  composer.setAttribute("data-su-template-injected", "true");

  const textarea = composer.querySelector<HTMLTextAreaElement>(
    'textarea[name="post_devlog[body]"]',
  );
  if (!textarea) return;

  const templateWrap = document.createElement("div");
  templateWrap.className = "sd-template-wrap";

  const templateLabel = document.createElement("span");
  templateLabel.className = "sd-template-label";
  templateLabel.textContent = "Template:";

  const templateSelect = document.createElement("select");
  templateSelect.className = "sd-template-select";

  const blankOption = document.createElement("option");
  blankOption.value = "";
  blankOption.textContent = "— pick a template —";
  templateSelect.appendChild(blankOption);

  Object.keys(DEVLOG_TEMPLATES).forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    templateSelect.appendChild(opt);
  });

  templateSelect.addEventListener("change", () => {
    const chosen = templateSelect.value;
    if (!chosen) return;
    textarea.value = DEVLOG_TEMPLATES[chosen];
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.focus();
    templateSelect.value = "";
  });

  templateWrap.appendChild(templateLabel);
  templateWrap.appendChild(templateSelect);

  const toolbar = composer.querySelector(".feed-composer__toolbar");
toolbar?.parentNode?.insertBefore(templateWrap, toolbar);
}
