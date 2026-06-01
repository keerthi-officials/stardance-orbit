export function enhanceSidebar() {
  const injectStyles = () => {
    if (document.getElementById("stardance-sidebar-style")) return;

    const style = document.createElement("style");

    style.id = "stardance-sidebar-style";

    style.textContent = `
      .sidebar {
        position: relative !important;
        z-index: 99999 !important;
      }

      .sidebar__logo,
      .sidebar__nav,
      .sidebar__user,
      .sidebar__user-card {
        position: relative !important;
        z-index: 99999 !important;
      }

      #settings-modal {
        z-index: 100000 !important;
      }

      .sidebar__user-card {
        display:flex !important;
        align-items:center !important;
        justify-content:space-between !important;
        gap:12px !important;
      }

      .sidebar__user-meta {
        flex:1 1 auto !important;
        min-width:0 !important;
      }

      .sidebar__user-meta-handle {
        display:block !important;
        overflow:hidden !important;
        text-overflow:ellipsis !important;
        white-space:nowrap !important;
      }

      .sidebar__user-actions {
        display:flex !important;
        align-items:center !important;
        gap:8px !important;
        flex-shrink:0 !important;
      }

      .sidebar__user-settings,
      .sidebar__user-logout {
        flex-shrink:0 !important;
      }

      @media (max-width: 1200px) {
        .sidebar__user-meta-handle {
          max-width:120px;
        }
      }

      @media (max-width: 1024px) {
        .sidebar__user-card {
          flex-direction:column !important;
          align-items:center !important;
          gap:10px !important;
        }

        .sidebar__user-meta {
          text-align:center !important;
          width:100% !important;
        }

        .sidebar__user-actions {
          justify-content:center !important;
          width:100% !important;
        }

        .sidebar__user-meta-handle {
          max-width:100% !important;
        }
      }

      @media (max-height: 850px) {
        .sidebar__logo-img {
          max-height:70px !important;
          width:auto !important;
        }

        .sidebar__nav-link {
          padding-block:8px !important;
        }
      }

      @media (max-height: 750px) {
        .sidebar__logo-img {
          max-height:56px !important;
        }

        .sidebar__nav-link {
          padding-block:6px !important;
        }

        .sidebar__nav-label {
          font-size:.9rem !important;
        }

        .sidebar__user {
          padding-top:8px !important;
        }
      }

      @media (max-height: 680px) {
        .sidebar__logo-img {
          max-height:48px !important;
        }

        .sidebar__nav-link {
          padding-block:4px !important;
        }

        .sidebar__nav-label {
          font-size:.85rem !important;
        }

        .sidebar__user-balance {
          font-size:.85rem !important;
        }

        .sidebar__user-meta-handle {
          font-size:.8rem !important;
        }
      }
    `;

    document.head.appendChild(style);
  };

  injectStyles();

  document.addEventListener("turbo:load", injectStyles);
}

import { useEffect } from "react";

export default function Overlay() {
  useEffect(() => {
   
  }, []);

  return null;
}