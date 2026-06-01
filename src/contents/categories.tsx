export function enhanceCategories() {
  if (!window.location.pathname.startsWith("/shop")) return;

  if (document.getElementById("stardance-categories-style")) return;

  const style = document.createElement("style");
  style.id = "stardance-categories-style";

  style.textContent = `
    .shop-hub__main {
      margin-bottom: 2rem !important;
    }

    .shop-hub__category-grid {
      display: grid !important;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.5rem !important;
      padding-top: 1rem !important;
      margin-top: 1rem !important;
    }

    .shop-hub__category-tile {
      list-style: none;
    }

    .shop-hub__category-link {
      position: relative;
      display: flex !important;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      min-height: 240px;

      padding: 1.75rem;

      border-radius: 24px !important;

      background:
        linear-gradient(
          180deg,
          rgba(255,255,255,0.05),
          rgba(255,255,255,0.02)
        ) !important;

      border: 1px solid rgba(255,255,255,0.08);

      backdrop-filter: blur(10px);

      overflow: hidden;
      text-decoration: none !important;

      transition:
        transform .25s ease,
        border-color .25s ease,
        box-shadow .25s ease;
    }

    .shop-hub__category-thumb {
    box-shadow: none !important;
    }

    .shop-hub__category-link:hover {
      transform: translateY(-6px);

      border-color: rgba(255,255,255,.2);

      box-shadow:
        0 15px 40px rgba(0,0,0,.25);
    }


    .shop-hub__category-link::before {
      content: "";

      position: absolute;
      inset: 0;

      background:
        radial-gradient(
          circle at top,
          rgba(255,255,255,.08),
          transparent 60%
        );

      pointer-events: none;
    }

    .shop-hub__category-name {
      margin: 0 !important;

      font-size: 1.35rem !important;
      font-weight: 800 !important;
      letter-spacing: -.03em;

      color: white !important;
      text-align: center;

      text-shadow:
        0 2px 12px rgba(0,0,0,.35);
    }

    @media (max-width: 1400px) {
       .shop-hub__category-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }

    @media (max-width: 1000px) {
        .shop-hub__category-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 640px) {
        .shop-hub__category-grid {
            grid-template-columns: 1fr;
            gap: 1rem !important;
        }
    }


    @media (max-width: 700px) {
      .shop-hub__category-grid {
        grid-template-columns: 1fr;
        gap: 1rem !important;
      }

      .shop-hub__category-link {
        min-height: 200px;
        padding: 1.25rem;
      }

      .shop-hub__category-art {
        height: 95px;
      }

      .shop-hub__category-name {
        font-size: 1.15rem !important;
      }
    }
  `;

  document.head.appendChild(style);
}
