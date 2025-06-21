import express from "express";
import { router as healthRouter } from "./routes/health";
import { router as ticketsRouter } from "./routes/tickets";
import { router as linearRouter } from "./routes/linear";

// Railway sets PORT env; fallback to 3000 for local dev
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

// Parse JSON bodies for all incoming requests
app.use(express.json());

// Mount application routes
app.use("/", healthRouter);
app.use("/", ticketsRouter);
app.use("/linear", linearRouter);

app.listen(PORT, () => {
  console.log(`🚂 Estimate-That service running on port ${PORT}`);
});
