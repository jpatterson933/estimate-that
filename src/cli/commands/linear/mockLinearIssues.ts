import { Command, createCommand } from "commander";
import { LinearService } from "../../../modules/linear/service";

export function getLinearIssues(): Command {
  return createCommand("linear:get-issues")
    .description("Get all linear issues from linear using api key")
    .action(async () => {
      const issues = await LinearService.getAllIssues();
      console.info(issues);
    });
}

export function upsertLinearIssues(): Command {
  return createCommand("linear:upsert-issues")
    .description("Upsert linear issues into the database")
    .action(async () => {
      const issues = await LinearService.upsertIssues();
      console.info(issues);
    });
}
