#!/usr/bin/env node
import { intro, text, confirm, outro, spinner, isCancel, cancel } from '@clack/prompts';
import { scaffold } from './src/scaffold.js';
import fs from 'node:fs/promises';
import path from 'node:path';

// Helper function to handle user cancellation (Ctrl+C) smoothly
function handleCancel(value) {
  if (isCancel(value)) {
    cancel('Scaffolding cancelled. See you next time!');
    process.exit(0);
  }
}

// Helper to check which package manager ran the script
function getPackageManager() {
  const ua = process.env.npm_config_user_agent || '';
  if (ua.startsWith('yarn')) return 'yarn';
  if (ua.startsWith('pnpm')) return 'pnpm';
  if (ua.startsWith('bun')) return 'bun';
  return 'npm';
}

async function main() {
  intro('✨ Welcome to the dhemeira react-starter generator! ✨');

  const args = process.argv.slice(2);
  const positionalArgs = args.filter((arg) => !arg.startsWith('-'));
  let appName = positionalArgs[0];

  if (!appName) {
    const defaultName = 'my-app';

    const inputName = await text({
      message: 'What is the name of your new project?',
      placeholder: defaultName,
      validate(value) {
        if (!value) return;
        if (value.match(/[^a-zA-Z0-9-_]/)) {
          return 'Name can only contain letters, numbers, dashes, and underscores';
        }
      },
    });
    handleCancel(inputName);

    appName = !inputName || inputName.trim().length === 0 ? defaultName : inputName;

    if (!inputName || inputName.trim().length === 0) {
      // This overwrites the blank Clack line visually with the chosen default name
      process.stdout.write(`\x1b[1A\x1b[3C\x1b[2m${defaultName}\x1b[0m\n`);
    }
  }

  const targetDir = path.resolve(process.cwd(), appName);
  try {
    const files = await fs.readdir(targetDir);
    if (files.length > 0) {
      cancel(`Operation cancelled: The directory ./${appName} already exists and is not empty.`);
      process.exit(1);
    }
  } catch (err) {
    // Directory doesn't exist, safe to proceed
  }

  let shouldInstall = !args.includes('--no-install');
  if (shouldInstall && !args.includes('--install')) {
    shouldInstall = await confirm({
      message: 'Would you like to install npm dependencies now?',
      initialValue: true,
    });
    handleCancel(shouldInstall);
  }

  let shouldGit = !args.includes('--no-git');
  if (shouldGit && !args.includes('--git')) {
    shouldGit = await confirm({
      message: 'Would you like to initialize a git repository?',
      initialValue: true,
    });
    handleCancel(shouldGit);
  }

  // Define ANSI color formatting codes
  const BLUE_BOLD = '\x1b[1;34m';
  const RESET = '\x1b[0m';

  const s = spinner();
  s.start(`Scaffolding project in ${BLUE_BOLD}./${appName}${RESET}`);

  try {
    await scaffold({
      appName,
      shouldInstall,
      shouldGit,
      spinner: s,
    });

    outro(`🎉 Project successfully created inside ${BLUE_BOLD}./${appName}${RESET}!`);

    // Determine the user's package manager ecosystem
    const pkgManager = getPackageManager();
    const runCmd = pkgManager === 'yarn' ? 'yarn dev' : `${pkgManager} run dev`;
    const installCmd = pkgManager === 'yarn' ? 'yarn' : `${pkgManager} install`;

    console.log(`\nNext steps:`);
    console.log(`  ${BLUE_BOLD}cd ${appName}${RESET}`);

    // Explicitly inject the installation step if it was skipped
    if (!shouldInstall) {
      console.log(`  ${BLUE_BOLD}${installCmd}${RESET}`);
    }

    console.log(`  ${BLUE_BOLD}${runCmd}${RESET}\n`);
  } catch (err) {
    s.stop('❌ Scaffolding failed!');
    console.error(err);
    process.exit(1);
  }
}

main();
