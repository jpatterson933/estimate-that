import crypto from "crypto";
import { env } from "../../env";
import { LinearWebhookPayloadSchema, LinearWebhookPayload } from "./schema";

export class LinearService {
  /**
   * Main webhook processing method - handles signature verification, parsing, and processing
   */
  static async processWebhook(
    rawPayload: string | Record<string, any>,
    signature?: string
  ): Promise<void> {
    const payloadString =
      typeof rawPayload === "string" ? rawPayload : JSON.stringify(rawPayload);

    // Verify signature
    if (!signature || !this.verifyWebhookSignature(payloadString, signature)) {
      throw new Error("Invalid webhook signature");
    }

    // Parse and validate using schema (ensure we have an object)
    const parsedPayload =
      typeof rawPayload === "string" ? JSON.parse(rawPayload) : rawPayload;

    const webhookData = LinearWebhookPayloadSchema.parse(parsedPayload);

    // Only process Issue events
    if (webhookData.type === "Issue") {
      await this.processIssueEvent(webhookData);
    } else {
      console.log(`Ignoring webhook type: ${webhookData.type}`);
    }
  }

  /**
   * Verify Linear webhook signature
   */
  private static verifyWebhookSignature(
    payload: string,
    signature: string
  ): boolean {
    const expectedSignature = crypto
      .createHmac("sha256", env.LINEAR_WEBHOOK_SECRET)
      .update(payload, "utf8")
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  }

  /**
   * Process Linear issue events
   */
  private static async processIssueEvent(
    payload: LinearWebhookPayload
  ): Promise<void> {
    const { action, data: issue } = payload;

    console.log(`Processing Linear ${action} for issue ${issue.identifier}`);

    switch (action) {
      case "create":
        await this.handleIssueCreate(issue);
        break;
      case "update":
        await this.handleIssueUpdate(issue, payload.updatedFrom);
        break;
      case "remove":
        await this.handleIssueRemove(issue);
        break;
      default:
        console.log(`Unhandled action: ${action}`);
    }
  }

  private static async handleIssueCreate(
    issue: LinearWebhookPayload["data"]
  ): Promise<void> {
    // Only track issues with estimates
    if (!issue.estimate) {
      console.log(`Skipping issue ${issue.identifier} - no estimate`);
      return;
    }

    // TODO: Create ticket in database
    console.log(
      `Would create ticket for ${issue.identifier} with ${issue.estimate} points`
    );
  }

  private static async handleIssueUpdate(
    issue: LinearWebhookPayload["data"],
    updatedFrom?: Partial<LinearWebhookPayload["data"]>
  ): Promise<void> {
    // Check if estimate was added/changed
    if (issue.estimate && issue.estimate !== updatedFrom?.estimate) {
      console.log(
        `Estimate changed for ${issue.identifier}: ${updatedFrom?.estimate} → ${issue.estimate}`
      );
    }

    // Check if issue was completed
    if (issue.completedAt && !updatedFrom?.completedAt) {
      console.log(
        `Issue ${issue.identifier} completed at ${issue.completedAt}`
      );
      // TODO: Record outcome
    }

    // TODO: Update ticket in database
  }

  private static async handleIssueRemove(
    issue: LinearWebhookPayload["data"]
  ): Promise<void> {
    console.log(`Issue ${issue.identifier} removed`);
    // TODO: Mark ticket as deleted or remove from database
  }
}
