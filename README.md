# Toolbox

A collection of self-contained utilities for everyday tasks.

个人实用工具集合，用于统一管理日常工作、文件处理、数据转换、系统操作、网络处理、自动化任务等场景中积累的实用工具。

仓库中的每个工具都是一个独立单元，可以单独开发、运行、复制和迁移，不依赖其他工具的源码。

## Design Goals

- **Centralized**：集中管理常用工具，避免脚本和工具分散。
- **Self-contained**：每个工具拥有独立的源码、依赖和配置。
- **Portable**：复制单个工具目录即可迁移到其他项目或环境。
- **Independent**：工具之间不存在源码依赖，可以独立演进。
- **Minimal**：根据实际复杂度组织代码，避免过度工程化。
- **AI-friendly**：提供清晰的目录结构和开发规范，方便 AI 理解、创建和维护工具。

## Project Structure

```text
toolbox/
├── AGENTS.md
├── README.md
├── .gitignore
├── standards/              # 工具规范文件
│   └── tool-design.md
└── src/
    └── <category>/
        └── <tool>/
            ├── index.ts
            └── README.md
```

实际目录会随着工具增加而自然扩展。上面仅展示基本组织方式，不代表所有工具都必须采用相同文件结构。

### Directory Conventions

采用两级工具组织结构，并通过 `src/` 统一管理源码：

- **src**：所有工具源码的统一存放目录。
- **Category**：按照工具解决的问题或使用场景分类。
- **Tool**：一个目录代表一个独立工具，可以包含一个或多个相关功能。

例如，`src/git/branch-manager/` 是一个独立工具，负责 Git 分支管理，可以提供清理、检查、删除等相关命令。

分类目录不需要提前穷举，随着工具积累按需创建。

工具目录统一使用 `kebab-case` 命名，保持名称简洁、明确。

`src/` 仅用于源码组织，不承担公共模块、统一运行时或工具注册等职责。

## Technology Stack

采用多语言策略，根据实际需求选择合适的技术。

| Language | Role | Use Cases |
| --- | --- | --- |
| TypeScript + Node.js | Default | 文件处理、项目分析、CLI、自动化、网络请求 |
| Python | Supplementary | 数据处理、图像处理、AI、科学计算 |
| Rust | Specialized | 高性能计算、系统级工具、独立二进制分发 |
| Shell / PowerShell | Lightweight | 操作系统原生命令和简单自动化 |

### Language Selection

1. 默认优先使用 TypeScript + Node.js。
2. 当其他语言拥有明显的生态或技术优势时，可以选择其他语言。
3. 不为了统一技术栈而强制使用同一种语言。
4. 不为了性能优势而过早引入复杂技术。
5. 优先考虑开发效率、维护成本和实际使用体验。

## Tool Design Principles

以下为各原则的概览说明；工具设计的权威规范见 [standards/tool-design.md](standards/tool-design.md)，两者冲突时以规范文件为准。

### 1. Self-contained

每个工具必须能够独立迁移：

- 自己管理源码和内部模块。
- 自己声明第三方依赖。
- 自己管理必要的配置。
- 不依赖仓库根目录的运行时模块。
- 不依赖其他工具目录中的源码。

允许工具内部进行合理的模块拆分，但不建立跨工具源码依赖。

优先保持工具独立性，接受合理的代码重复，不为了消除重复而强制抽取公共模块。

### 2. Independent Execution

每个工具应有明确的运行入口和使用方式，根据工具复杂度选择合适的工程结构。

**Simple Tool**

```text
json-formatter/
├── index.ts
└── README.md
```

**Standard Tool**

```text
branch-manager/
├── index.ts
├── commands/
├── package.json
└── README.md
```

**Complex Tool**

```text
data-analyzer/
├── src/
│   ├── index.ts
│   ├── analyzer.ts
│   └── reporter.ts
├── tests/
├── package.json
├── tsconfig.json
└── README.md
```

不要求所有工具使用相同的工程结构，按实际需要增加文件和目录。

工具可以采用直接执行、编译运行或 CLI 等不同方式，不要求统一运行机制。

### 3. Multiple Commands

一个工具允许包含多个相关命令。

```text
branch-manager/
├── index.ts
├── commands/
│   ├── clean.ts
│   ├── check.ts
│   └── delete.ts
└── README.md
```

入口负责命令注册和分发，具体命令负责业务逻辑。

简单工具不需要引入命令分发机制。

一个工具可以有多个相关执行入口，但不应将不相关的功能合并到一起。

### 4. Parameters and Configuration

接受参数的工具应同时支持**文件内默认值**（入口文件顶部可编辑的默认配置区）与**命令行参数**两种来源，命令行参数始终优先；不得在默认值中提交个人信息或凭据，必填值缺失时打印用法并以非零状态码退出。

完整规则见 [standards/tool-design.md](standards/tool-design.md) 的「参数与配置」一节，`src/git/set-git-config/` 为参考实现。

### 5. Dependency Management

- 每个工具独立声明第三方依赖。
- 不使用仓库根目录统一管理所有工具的运行时依赖。
- 优先使用成熟、轻量的依赖。
- 简单功能优先考虑语言标准库。
- 避免引入不必要的框架。
- 工具应明确说明运行环境和依赖安装方式。
- 允许调用操作系统原生命令和外部程序，但需要明确说明相关环境要求。

### 6. Safety

涉及文件删除、批量修改、系统操作、Git 操作等可能产生破坏性影响的功能时：

- 尽可能提供 `--dry-run`。
- 必要时提供执行前确认。
- 明确展示操作范围。
- 避免未经确认执行不可逆操作。
- 对重要数据的修改尽可能提供备份或恢复方案。

### 7. Documentation

每个具有独立使用价值的工具应提供 README，至少说明：

- 工具用途。
- 环境要求。
- 依赖安装。
- 运行方式。
- 参数说明。
- 使用示例。
- 注意事项。

简单且无需额外说明的单文件工具，可以使用代码注释代替独立文档。

## AI Collaboration

本仓库主要通过 AI 辅助创建、维护和改进工具。

AI 在处理仓库任务时应遵循：

1. 优先理解现有目录结构和开发约定。
2. 新增工具前检查是否存在功能相近的工具。
3. 根据工具实际复杂度选择工程结构。
4. 遵循工具自包含原则，不引入跨工具源码依赖。
5. 尽量减少第三方依赖和不必要的抽象。
6. 修改工具时控制影响范围，避免影响其他工具。
7. 对不确定的信息明确标注，不将推测表述为事实。
8. 未明确指定 Git 分支时，使用主分支。
9. 涉及破坏性操作时，优先采用可预览、可确认的执行方式。
10. 优先沿用工具现有技术栈和编码风格，不随意引入新的技术体系。
11. 新增工具时使用 kebab-case 命名，并放入合适的分类目录。
12. 不为了消除少量重复代码而引入跨工具共享模块。
13. 所有工具源码统一放在 `src/` 下，仓库级文档和配置保留在根目录。
14. 接受参数的工具应同时支持文件内默认值与命令行参数，命令行优先；不在默认值中提交个人信息或凭据。

## Core Constraints

| Dimension | Convention |
| --- | --- |
| Repository | Personal utilities collection |
| Source Directory | `src/` |
| Organization | Category → Tool |
| Naming | kebab-case |
| Tool Granularity | One directory represents one tool |
| Entry Points | One or more related commands |
| Source Dependencies | No cross-tool source dependencies |
| Runtime Dependencies | Independently managed by each tool |
| Technology | Multi-language, TypeScript first |
| Complexity | Progressive, avoid over-engineering |
| Portability | Each tool can be copied and migrated independently |

## Future Evolution

随着工具数量和使用场景增长，可以逐步扩展：

- 增加更多工具分类。
- 为复杂工具补充测试和自动化验证。
- 完善统一的工具发现和索引机制。
- 为高频使用的工具提供更方便的命令入口。
- 在有明确需求时，将独立工具发展为可分发的 CLI 或二进制程序。
- 根据实际使用场景增加自动化工作流。

这些能力按需引入，不作为初期建设要求。

## Core Philosophy

**One repository, multiple independent tools.**

每个工具专注解决一组相关问题，可以独立开发、运行、复制和迁移。

`src/` 负责统一存放源码，Category 负责组织工具，Tool 负责具体功能，工具内部负责自己的实现。

保持工具独立性，避免不必要的架构抽象，让整个仓库随着实际需求自然增长。
