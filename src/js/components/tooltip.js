import Tooltip from "bootstrap/js/dist/tooltip.js";

import isTouchDevice from '../_utilities.js'

const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
const DATA_ATTRIBUTE_PATTERN = /^data-[\w-]*$/i;
const allowlist = {
  "*": ["class", "dir", "id", "lang", "role", ARIA_ATTRIBUTE_PATTERN, DATA_ATTRIBUTE_PATTERN],
  a: ["target", "href", "title", "rel"],
  button: ["type"],
  area: [],
  b: [],
  br: [],
  col: [],
  code: [],
  div: [],
  em: [],
  hr: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  i: [],
  img: ["src", "srcset", "alt", "title", "width", "height"],
  li: [],
  ol: [],
  p: [],
  pre: [],
  s: [],
  small: [],
  span: [],
  sub: [],
  sup: [],
  strong: [],
  u: [],
  ul: [],
  input: ["type", "value"],
  label: ["for"]
};

function initializeTooltip(el, isTouch) {
  let dataset = {};
  const typeMap = {
    allowList: "object",
    animation: "boolean",
    boundary: "(string|element)",
    container: "(string|element|boolean)",
    customClass: "(string|function)",
    delay: "(number|object)",
    fallbackPlacements: "array",
    html: "boolean",
    offset: "(array|string|function)",
    placement: "(string|function)",
    popperConfig: "(null|object|function)",
    sanitize: "boolean",
    sanitizeFn: "(null|function)",
    selector: "(string|boolean)",
    template: "string",
    title: "(string|element|function)",
    trigger: "string"
  };

  for (let attr of el.attributes) {
    if (attr.name.startsWith("data-bs-")) {
      let key = attr.name.replace("data-bs-", "").replace(/-./g, x => x[1].toUpperCase());
      if (typeMap[key]) {
        let value = attr.value;
        switch (typeMap[key]) {
          case "boolean":
            dataset[key] = value === "true";
            break;
          case "number":
            dataset[key] = Number(value);
            break;
          case "object":
          case "array":
            try {
              dataset[key] = JSON.parse(value);
            } catch {
              console.error(`Invalid JSON for ${key}: ${value}`);
            }
            break;
          case "(string|element)":
          case "(string|element|boolean)":
          case "(string|function)":
          case "(number|object)":
            if (!isNaN(value)) {
              dataset[key] = Number(value);
            } else if (value.startsWith("{") || value.startsWith("[")) {
              try {
                dataset[key] = JSON.parse(value);
              } catch {
                console.error(`Invalid JSON for ${key}: ${value}`);
              }
            } else {
              dataset[key] = value;
            }
            break;
          case "(array|string|function)":
            if (value.startsWith("[")) {
              try {
                dataset[key] = JSON.parse(value);
              } catch {
                console.error(`Invalid JSON for ${key}: ${value}`);
              }
            } else {
              dataset[key] = value;
            }
            break;
          case "(null|object|function)":
          case "(null|function)":
            if (value === "null") {
              dataset[key] = null;
            } else if (value.startsWith("{")) {
              try {
                dataset[key] = JSON.parse(value);
              } catch {
                console.error(`Invalid JSON for ${key}: ${value}`);
              }
            } else {
              dataset[key] = value;
            }
            break;
          case "(string|boolean)":
            if (value === "true" || value === "false") {
              dataset[key] = value === "true";
            } else {
              dataset[key] = value;
            }
            break;
          default:
            dataset[key] = value;
        }
      }
    }
  }

  const tooltip = new Tooltip(el, {
    ...dataset,
    html: true,
    allowList: allowlist,
    template: `
      <div class="tooltip ${isTouch && !el.hasAttribute("data-custom-mobile") ? "d-none" : ""}" role="tooltip">
          <div class="tooltip-arrow"></div>
          <div class="tooltip-inner"></div>
      </div>
    `,
    title: function (element) {
      return element.title;
    },
    placement: function () {
      const tooltipPlacement = tooltip._element.dataset.customPlacement;

      if (tooltipPlacement === "bottom-start" || tooltipPlacement === "bottom-end") {
        return "bottom";
      } else {
        return tooltip._element.dataset.bsPlacement ? tooltip._element.dataset.bsPlacement : "top";
      }
    },
    offset: ({ placement, reference, popper }) => {
      const tooltipPlacement = el.dataset.customPlacement;
      const actualPlacement = placement;

      if (actualPlacement === "right" || actualPlacement === "left") {
        return [0, 16];
      } else if (tooltipPlacement === "bottom-start" || tooltipPlacement === "top-start" ||
        actualPlacement === "top-start" || actualPlacement === "bottom-start") {
        return [popper.width * .5 - 32, reference.height * .5];
      } else if (tooltipPlacement === "bottom-end" || tooltipPlacement === "top-end" ||
        actualPlacement === "top-end" || actualPlacement === "bottom-end") {
        return [popper.width * -.5 + 32, reference.height * .5];
      } else {
        return el.dataset.BsOffset ? el.dataset.BsOffset.split(",").map(Number) : [0, 16];
      }
    },
  });

  const hideTooltipHandler = (event) => {
    if (!tooltip || !tooltip._isShown) return;
    const tip = tooltip.tip;
    if (!tip) return;
    if (!el.contains(event.target) && !tip.contains(event.target)) {
      tooltip.hide();
    }
  };

  const clickHandler = (event) => {
    if (!tooltip || !tooltip._element) {
      document.removeEventListener("click", clickHandler);
      return;
    }

    const tooltipTarget = tooltip._element.contains(event.target);

    if (tooltipTarget && tooltip._element.hasAttribute("data-custom-dispose")) {
      tooltip.dispose();
      document.removeEventListener("click", clickHandler);
    }
  };

  document.addEventListener("click", clickHandler);

  el.addEventListener("shown.bs.tooltip", () => {
    const triggers = el.getAttribute("data-bs-trigger");
    if (triggers && triggers.split(" ").includes("click")) {
      document.addEventListener("click", hideTooltipHandler);
    }
  });

  el.addEventListener("hidden.bs.tooltip", () => {
    document.removeEventListener("click", hideTooltipHandler);
  });
}

function initializeTooltips() {
  const isTouch = isTouchDevice();

  document.querySelectorAll("[title]:not([data-bs-original-title])")
    .forEach(el => {
      initializeTooltip(el, isTouch);
    });

  document.addEventListener("mouseover", function (event) {
    const target = event.target.closest("[title]:not([data-bs-original-title])");
    if (target) {
      initializeTooltip(target, isTouch);
      target.dispatchEvent(new Event("mouseover"));
    }
  });
}

/**
 * Reinitializes the tooltips on the page.
 *
 * This function destroys all existing tooltips and then initializes new tooltips.
 *
 * @return {void}
 */
function reinitializeTooltips() {
  // Destroy existing tooltips
  document.querySelectorAll("[data-bs-original-title]").forEach(el => {
    const tooltip = Tooltip.getInstance(el);
    el.setAttribute("title", el.dataset.bsOriginalTitle);
    el.removeAttribute("data-bs-original-title");
    if (tooltip) {
      tooltip.dispose();
    }
  });

  document.querySelectorAll(".tooltip").forEach(el => {
    el.remove();
  });

  // Initialize tooltips again
  initializeTooltips();
}

reinitializeTooltips();
