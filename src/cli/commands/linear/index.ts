import { Command } from "commander";
import { mockLinearIssues } from "./mockLinearIssues";

export const linearComamands = (program: Command) => {
  const linear = new Command("linear").description(
    "Linear specific commands, used for testing and development"
  );

  linear.addCommand(mockLinearIssues());

  program.addCommand(linear);
};
