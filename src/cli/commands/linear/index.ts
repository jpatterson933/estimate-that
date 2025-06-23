import { Command } from "commander";
import { getLinearIssues, upsertLinearIssues } from "./mockLinearIssues";

export const linearComamands = (program: Command) => {
  const linear = new Command("linear").description(
    "Linear specific commands, used for testing and development"
  );

  linear.addCommand(getLinearIssues());
  linear.addCommand(upsertLinearIssues());

  program.addCommand(linear);
};
