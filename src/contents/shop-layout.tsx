export function enhanceShopLayout() {
  if (!window.location.pathname.startsWith("/shop")) return;

  function init() {
    document
      .querySelectorAll('[aria-label="Your orders"]')
      .forEach((el) => el.remove());

    const regionContainer = document.querySelector(".shop-hub__topbar-right");

    if (regionContainer && !document.getElementById("stardance-orders-btn")) {
      const btn = document.createElement("a");

      btn.id = "stardance-orders-btn";
      btn.href = "/shop/orders";
      btn.textContent = "Orders";

      regionContainer.prepend(btn);
    }

    const updatesSection = document.querySelector(
      '[aria-label="Shop updates"]',
    ) as HTMLElement | null;

    const wishlistSection = document.querySelector(
      ".discover-rail__section--wishlist",
    ) as HTMLElement | null;

    const mainSection = document.querySelector(
      ".shop-hub__main",
    ) as HTMLElement | null;

    if (updatesSection && mainSection) {
      updatesSection.remove();

      mainSection.insertAdjacentElement("afterend", updatesSection);
    }

    if (wishlistSection && updatesSection) {
      wishlistSection.remove();

      updatesSection.insertAdjacentElement("afterend", wishlistSection);
    }

    if (!document.getElementById("stardance-layout-style")) {
      const style = document.createElement("style");

      style.id = "stardance-layout-style";

      style.textContent = `
      .shop-hub {
      padding: 1.5rem clamp(0.75rem, 2vw, 2rem) 4rem !important; 
      }

      .discover-rail__heading {
      margin-bottom: 10px !important;
    }


      
        .shop-hub__rail {
          display:none !important;
        }

        .shop-hub__layout {
          display:block !important;
        }

        .shop-hub__main {
          width:100% !important;
          max-width:none !important;
          margin-top:24px !important;
          margin-bottom:32px !important;
        }

        #stardance-orders-btn {
          display:flex;
          align-items:center;
          justify-content:center;
          padding:8px 18px;
          margin-right:8px;
          margin-top:20px;
          border-radius:12px;
          text-decoration:none;
          font-weight:700;
          background:#fff;
          color:#111827;
          box-shadow:0 8px 20px rgba(0,0,0,.08);
          transition:.2s ease;
        }

        #stardance-orders-btn:hover {
          transform:translateY(-2px);
        }

        [aria-label="Shop updates"] {
          display:block !important;
          width:100% !important;
          margin:0 0 24px 0 !important;
        }

        .discover-rail__section--wishlist {
          display:block !important;
          width:100% !important;
          margin:0 0 32px 0 !important;
        }

        .discover-rail__section--wishlist .shop-goals__items {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
          gap: 16px !important;
        }

        .discover-rail__section--wishlist .shop-goals__item {
          width:100% !important;
        }

        .shop-hub__category-grid {
          gap:20px !important;
          margin-bottom:32px !important;
        }

        .shop-hub__category-link {
          border-radius:20px !important;
          overflow:hidden;
          transition:.2s ease;
        }

        .shop-hub__category-link:hover {
          transform:translateY(-4px);
        }

        @media (max-width:768px) {
          .shop-hub__topbar-right {
            display:flex;
            gap:10px;
          }

          .sidebar__nav-lock {
            display: none !important;
          }

          .shop-hub__region {
            flex:1;
          }

          .shop-hub__region select {
            width:100%;
          }

          .discover-rail__section--wishlist .shop-goals__items {
           grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          }

          .shop-hub__category-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))
              !important;
          }
        }
      `;

      document.head.appendChild(style);
    }
  }

  init();

  document.addEventListener("turbo:load", init);
}
