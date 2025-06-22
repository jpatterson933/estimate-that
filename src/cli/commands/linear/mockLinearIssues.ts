import { Command, createCommand } from "commander";
import { LinearService } from "../../../modules/linear/service";

export function mockLinearIssues(): Command {
  return createCommand("linear:get-issues")
    .description("Get all linear issues from linear using api key")
    .action(async () => {
      const issues = await LinearService.getAllIssues();
      console.info(issues);
    });
}
