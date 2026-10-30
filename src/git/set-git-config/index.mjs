#!/usr/bin/env node
// 批量设置指定目录下所有 Git 仓库的本地 user.name / user.email
//
// 参数有两种提供方式，命令行参数优先级高于下面的内部默认值：
//   1. 直接修改下方「默认配置」区
//   2. 命令行传参: node index.mjs [name] [email] [root] [-r|--recursive] [--dry-run]
// 默认只扫描根目录的直接子目录；加 -r 递归扫描所有层级

import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { resolve, join, basename } from "node:path";

// ===== 默认配置（可直接修改这里；命令行参数优先级更高）=====
const DEFAULT_NAME = "";
const DEFAULT_EMAIL = "";
const DEFAULT_ROOT = process.cwd();
const DEFAULT_RECURSIVE = false;
const DEFAULT_DRY_RUN = false;
// ========================================================

const USAGE = `用法: node index.mjs [name] [email] [root] [-r|--recursive] [--dry-run]

参数（均可选，未传时使用文件内默认配置，命令行优先级更高）:
  name        要写入的 user.name
  email       要写入的 user.email
  root        扫描根目录，默认为当前工作目录
  -r, --recursive  递归扫描所有层级（默认只扫描直接子目录）
  --dry-run   只预览将要执行的变更，不实际修改`;

const parseArgs = (argv) => {
  const positional = [];
  let recursive = DEFAULT_RECURSIVE;
  let dryRun = DEFAULT_DRY_RUN;
  for (const arg of argv) {
    if (arg === "-r" || arg === "--recursive") {
      recursive = true;
    } else if (arg === "--dry-run") {
      dryRun = true;
    } else {
      positional.push(arg);
    }
  }
  return {
    name: positional[0] ?? DEFAULT_NAME,
    email: positional[1] ?? DEFAULT_EMAIL,
    root: resolve(positional[2] ?? DEFAULT_ROOT),
    recursive,
    dryRun,
  };
};

const runGit = (repo, args) =>
  execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" }).trim();

const gitConfigSet = (repo, key, value) => runGit(repo, ["config", key, value]);

const gitConfigGet = (repo, key) => {
  try {
    return runGit(repo, ["config", key]);
  } catch {
    return ""; // 未配置时 git config 退出码为 1
  }
};

const exists = (path) => {
  try {
    statSync(path);
    return true;
  } catch {
    return false;
  }
};

// 查找仓库：默认只扫描直接子目录，recursive 时继续向更深层递归
const findRepos = (dir, recursive) => {
  const repos = [];
  if (exists(join(dir, ".git"))) {
    repos.push(dir);
    return repos; // 目录本身是仓库，不再向内部扫描
  }

  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return repos;
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === "node_modules") continue;
    const full = join(dir, entry.name);
    if (exists(join(full, ".git"))) {
      repos.push(full);
    } else if (recursive) {
      repos.push(...findRepos(full, true));
    }
  }
  return repos;
};

const main = () => {
  const { name, email, root, recursive, dryRun } = parseArgs(process.argv.slice(2));

  if (!name || !email) {
    console.error(USAGE);
    process.exit(1);
  }

  if (!exists(root)) {
    console.error(`目录不存在: ${root}`);
    process.exit(1);
  }

  const repos = [...new Set(findRepos(root, recursive))].sort();

  if (repos.length === 0) {
    console.log(`未在 ${root} 下发现 Git 仓库`);
    return;
  }

  if (dryRun) {
    console.log(`[dry-run] 将把以下 ${repos.length} 个仓库的本地身份设置为 ${name} <${email}>：`);
    for (const repo of repos) {
      const currentName = gitConfigGet(repo, "user.name");
      const currentEmail = gitConfigGet(repo, "user.email");
      const current = currentName || currentEmail ? `${currentName} <${currentEmail}>` : "(未设置)";
      console.log(`${basename(repo).padEnd(28)} ${current} -> ${name} <${email}>`);
    }
    console.log("[dry-run] 未做任何修改");
    return;
  }

  for (const repo of repos) {
    gitConfigSet(repo, "user.name", name);
    gitConfigSet(repo, "user.email", email);
    const currentName = gitConfigGet(repo, "user.name");
    const currentEmail = gitConfigGet(repo, "user.email");
    console.log(`${basename(repo).padEnd(28)} ${currentName} <${currentEmail}>`);
  }

  console.log(`完成，共更新 ${repos.length} 个仓库`);
};

main();
