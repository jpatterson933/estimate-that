import express from "express";
import { router as healthRouter } from "./routes/health";
import { router as ticketsRouter } from "./routes/tickets";
import { router as linearRouter } from "./routes/linear";

// Railway sets PORT env; fallback to 3000 for local dev
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
// Capture raw request body so we can verify webhook signatures that rely on the exact payload string (e.g., Linear)
app.use(
  express.json({
    verify: (req, _res, buf) => {
      // Store raw body on the request object for downstream handlers
      (req as any).rawBody = buf.toString("utf8");
    },
  })
);

// Mount application routes
app.use("/", healthRouter);
app.use("/", ticketsRouter);
app.use("/linear", linearRouter);

app.listen(PORT, () => {
  console.log(`🚂 Estimate-That service running on port ${PORT}`);
});
