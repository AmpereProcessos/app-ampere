import type { NextApiHandler } from "next";

// Retired: this migration could replace valid material IDs with undefined.
// Keep the URL inert for every HTTP method; do not import database clients here.
const retiredPurchaseCompositionMigration: NextApiHandler = (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  return res.status(410).json({
    error: { message: "Esta rotina de compras foi desativada." },
  });
};

export default retiredPurchaseCompositionMigration;
