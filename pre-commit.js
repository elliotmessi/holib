#!/usr/bin/env node

const { execSync } = require('child_process');
const { existsSync } = require('fs');

if (process.env.SKIP_SIMPLE_GIT_HOOKS === '1') {
  console.log('[INFO] SKIP_SIMPLE_GIT_HOOKS is set to 1, skipping hook.');
  process.exit(0);
}

// 检查是否有未暂存的修改
const hasUnstagedChanges = () => {
  try {
    const output = execSync('git status --porcelain', {
      encoding: 'utf8',
    });
    // 只检查有未暂存修改的文件（状态码包含 M、D、A 等）
    const lines = output.trim().split('\n').filter(Boolean);
    // 过滤掉只有暂存修改的文件（状态码以 M 开头，第二个字符是空格）
    const hasUnstaged = lines.some(line => !line.startsWith(' M') && !line.startsWith(' A') && !line.startsWith(' D'));
    return hasUnstaged;
  } catch (error) {
    console.error('[ERROR] Failed to check unstaged changes:', error.message);
    return false;
  }
};

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
  // 检查是否有未暂存的修改，如果有则跳过lint-staged，避免合并冲突
  if (hasUnstagedChanges()) {
    console.warn('[WARNING] Found unstaged changes, skipping lint-staged to avoid merge conflicts.');
    console.warn('[WARNING] Please either stage all changes or stash them before committing.');
    // 不强制失败，允许提交，但给出警告
    process.exit(0);
  }

  const stagedFiles = getStagedFiles();
  
  // 如果没有暂存文件，直接退出
  if (stagedFiles.length === 0) {
    console.log('[INFO] No staged files, skipping pre-commit checks.');
    process.exit(0);
  }

  // 过滤出各目录下的文件
  const backendFiles = stagedFiles.filter(file => file.startsWith('backend/'));
  const adminFiles = stagedFiles.filter(file => file.startsWith('admin/'));
  const appFiles = stagedFiles.filter(file => file.startsWith('app/'));

  // 执行对应目录的lint-staged，只在有文件需要处理时执行
  let success = true;

  if (backendFiles.length > 0) {
    // 检查是否有需要格式化的文件（JS/TS文件）
    const hasJSTSFiles = backendFiles.some(file => /\.(js|jsx|ts|tsx)$/.test(file));
    if (hasJSTSFiles) {
      console.log('[INFO] Running lint-staged for backend files...');
      if (!runCommand('pnpm lint-staged', './backend')) {
        success = false;
      }
    }
  }

  if (adminFiles.length > 0) {
    // 检查是否有需要格式化的文件（JS/TS/CSS文件）
    const hasJSTSFiles = adminFiles.some(file => /\.(js|jsx|ts|tsx|css|less|scss|pcss)$/.test(file));
    if (hasJSTSFiles) {
      console.log('[INFO] Running lint-staged for admin files...');
      if (!runCommand('pnpm lint-staged', './admin')) {
        success = false;
      }
    }
  }

  if (appFiles.length > 0) {
    // 检查是否有需要格式化的文件
    const hasJSTSFiles = appFiles.some(file => /\.(js|jsx|ts|tsx)$/.test(file));
    if (hasJSTSFiles) {
      console.log('[INFO] Running lint-staged for app files...');
      if (!runCommand('pnpm lint-staged', './app')) {
        success = false;
      }
    }
  }

  // 重新暂存可能被格式化修改的文件
  const gitAddCommand = `git add ${stagedFiles.join(' ')}`;
  runCommand(gitAddCommand);

  if (success) {
    console.log('[INFO] Pre-commit hook completed successfully!');
    process.exit(0);
  } else {
    console.error('[ERROR] Pre-commit hook failed!');
    process.exit(1);
  }
};

main();