import degit from 'degit';
import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const TEMPLATE = 'dhemeira/react-ts-starter';

function getPackageManager() {
  const ua = process.env.npm_config_user_agent || '';
  if (ua.startsWith('yarn')) return 'yarn';
  if (ua.startsWith('pnpm')) return 'pnpm';
  if (ua.startsWith('bun')) return 'bun';
  return 'npm'; // Fallback
}

export async function scaffold({ appName, shouldInstall, shouldGit, spinner }) {
  const targetDir = path.resolve(process.cwd(), appName);

  await fs.mkdir(targetDir, { recursive: true });

  const emitter = degit(TEMPLATE, {
    cache: false,
    force: true,
    verbose: false,
  });

  await emitter.clone(targetDir);

  // Update package.json name field
  const pkgPath = path.join(targetDir, 'package.json');
  try {
    const pkgData = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
    pkgData.name = appName;
    await fs.writeFile(pkgPath, JSON.stringify(pkgData, null, 2), 'utf8');
  } catch (err) {
    // Silence error if template doesn't have a package.json
  }

  if (shouldInstall) {
    const pkgManager = getPackageManager();
    const installCmd = pkgManager === 'yarn' ? 'yarn' : `${pkgManager} install`;

    spinner.message(`Installing dependencies using ${pkgManager}...`);
    await new Promise((resolve) => setTimeout(resolve, 50));
    try {
      execSync(installCmd, { cwd: targetDir, stdio: 'ignore' });
    } catch (e) {
      // Fallback if execution fails
    }
  }

  if (shouldGit) {
    spinner.message('Initializing Git repository...');
    await new Promise((resolve) => setTimeout(resolve, 50));
    try {
      execSync('git init', { cwd: targetDir, stdio: 'ignore' });
    } catch (e) {
      // Fallback
    }
  }

  // Stop the spinner right before the main script triggers the outro
  spinner.stop('Scaffolding complete!');
}
