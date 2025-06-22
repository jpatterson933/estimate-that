import { Command } from "commander";
import { linearComamands } from "./commands/linear";

const program = new Command();

program
  .name("Estimate-That CLI")
  .description(
    "Estimate-That CLI to perform various actions on the platform. Use --help to see all available commands."
  )
  .version("0.0.1");

type CommandRegistryFn = (program: Command) => void;

const commands: CommandRegistryFn[] = [linearComamands];

/**
 * Bootstrap the CLI by registering all commands and parsing the arguments.
 */
async function bootstrap() {
  for (const registerCommands of commands) {
    registerCommands(program);
  }
  await program.parseAsync();
}

bootstrap();
