#!/usr/bin/env node

const { execSync } = require('child_process');
const { existsSync } = require('fs');

if (process.env.SKIP_SIMPLE_GIT_HOOKS === '1') {
  console.log('[INFO] SKIP_SIMPLE_GIT_HOOKS is set to 1, skipping hook.');
  process.exit(0);
}

// 获取所有暂存的文件路径
const getStagedFiles = () => {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf8',
    });
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error('[ERROR] Failed to get staged files:', error.message);
    process.exit(1);
  }
};

// 执行命令并处理结果
const runCommand = (command, cwd = process.cwd()) => {
  try {
    execSync(command, {
      cwd,
      stdio: 'inherit',
      shell: true,
    });
    return true;
  } catch (error) {
    console.error(`[ERROR] Command failed: ${command}`);
    return false;
  }
};

// 主逻辑
const main = () => {
  const stagedFiles = getStagedFiles();
  
  // 初始化标志
  let needLintBackend = false;
  let needLintAdmin = false;
  let needLintApp = false;

  // 检查每个文件，确定需要执行lint的目录
  for (const file of stagedFiles) {
    if (file.startsWith('backend/')) {
      needLintBackend = true;
    } else if (file.startsWith('admin/')) {
      needLintAdmin = true;
    } else if (file.startsWith('app/')) {
      needLintApp = true;
    }
  }

  // 执行对应目录的lint-staged
  if (needLintBackend) {
    console.log('[INFO] Running lint-staged for backend files...');
    if (!runCommand('pnpm lint-staged', './backend')) {
      process.exit(1);
    }
  }

  if (needLintAdmin) {
    console.log('[INFO] Running lint-staged for admin files...');
    if (!runCommand('pnpm lint-staged', './admin')) {
      process.exit(1);
    }
  }

  if (needLintApp) {
    console.log('[INFO] Running lint-staged for app files...');
    if (!runCommand('pnpm lint-staged', './app')) {
      process.exit(1);
    }
  }

  // 重新暂存可能被格式化修改的文件
  if (stagedFiles.length > 0) {
    runCommand(`git add ${stagedFiles.join(' ')}`);
  }

  console.log('[INFO] Pre-commit hook completed successfully!');
};

main();