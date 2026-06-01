import { useEffect } from "react";
import { enhanceShopCards } from "./overlay";
import { enhanceCategories } from "./categories";
import { enhanceShopLayout } from "./shop-layout";

export default function Overlay() {
  useEffect(() => {
    enhanceShopCards();
    enhanceShopLayout();
    enhanceCategories();
  }, []);

  return null;
}
    