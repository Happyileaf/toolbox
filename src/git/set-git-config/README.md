 # set-git-config

批量设置指定目录下所有 Git 仓库的**本地** `user.name` / `user.email`（写入各仓库的 `.git/config`，不影响全局配置）。

## 环境要求

- Node.js 16+（使用 ESM，无第三方依赖）
- 系统已安装 `git`

## 运行方式

参数支持两种提供方式，**命令行参数优先级高于文件内默认值**：

1. 直接编辑 `index.mjs` 顶部「默认配置」区，然后运行 `node index.mjs`。
2. 命令行传参（覆盖文件内同名默认值）：

```bash
node index.mjs [name] [email] [root] [-r|--recursive] [--dry-run]
```

## 参数说明

| 参数 | 说明 |
| --- | --- |
| `name` | 要写入的 `user.name`；命令行第 1 个位置参数，缺省取文件内 `DEFAULT_NAME` |
| `email` | 要写入的 `user.email`；命令行第 2 个位置参数，缺省取文件内 `DEFAULT_EMAIL` |
| `root` | 扫描根目录；命令行第 3 个位置参数，缺省取文件内 `DEFAULT_ROOT`（当前工作目录） |
| `-r`, `--recursive` | 递归扫描所有层级；默认只扫描直接子目录，或取 `DEFAULT_RECURSIVE` |
| `--dry-run` | 只预览变更，不实际修改 |

位置参数按 `name → email → root` 顺序解析，即传 `root` 时必须同时传 `name`、`email`。
`name` / `email` 在命令行和文件内默认值中都为空时，程序会打印用法并退出，不做任何修改。

扫描规则：

- 若 `root` 本身是 Git 仓库，只处理它自身。
- 否则扫描其直接子目录；带 `-r` 时继续向更深层递归。
- 发现某个目录含 `.git` 后不再向其内部继续扫描。
- 跳过 `node_modules` 目录。

## 使用示例

```bash
# 预览当前目录下各仓库现有身份与将要写入的内容
node index.mjs zyr zyr@example.com --dry-run

# 更新当前目录下所有直接子仓库
node index.mjs zyr zyr@example.com

# 递归扫描 ~/work 下所有层级的仓库
node index.mjs zyr zyr@example.com ~/work -r

# 已在文件内默认配置中写好 name/email/root 时，直接运行
node index.mjs -r --dry-run
```

## 注意事项

- 修改的是仓库级（local）配置，仅影响目标仓库的提交身份，不修改 `~/.gitconfig`。
- 批量操作前建议先加 `--dry-run` 确认扫描范围和变更内容。
- 该操作只写入配置、不改动提交历史，已有的提交作者信息不会被改变。
