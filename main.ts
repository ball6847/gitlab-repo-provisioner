// Main entry point for the GitLab Repository Provisioner
import { CliApplication } from "./src/infrastructure/cli/cli_application.ts";

async function main(): Promise<void> {
  const app = new CliApplication();
  await app.run();
}

if (import.meta.main) {
  main().catch((error) => {
    console.error(
      "Fatal error:",
      error instanceof Error ? error.message : String(error),
    );
    Deno.exit(1);
  });
}
