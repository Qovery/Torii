---
sidebar_position: 1
---

# Introduction

:::warning

⚠️ Torii is in active development and not ready for production yet. Contributions appreciated.

:::

Torii is a simple, powerful and extensible open-source Internal Developer Portal where developers can find all the tools and
services they need to build, deploy, and manage their applications.

Torii focus on three principles:

- **Easily configurable**: Platform Engineers can easily define a catalog of tools and services available to developers. They can also
  define a scorecard and a workflow for each tool and service.
- **Easily usable**: Developers can easily find and use the tools and services they need to build, deploy, and manage their applications via
  a simple web interface.
- **Easily extensible**: Platform Engineers can easily extend Torii by adding new tools and services to the catalog.

That's it!

## Motivation

Today you have the choice between three options to build your Internal Developer Portal:

1. Use [Backstage](https://backstage.io) from Spotify. It's a great solution, but it's hard to extend and customize. You need to be a
   TypeScript/React expert to extend it.
2. Use a proprietary SaaS solution like Port, Cortex, OpsLevel, etc. It's a great solution, but it's expensive and you don't have control
   over the codebase.
3. Build your own solution from scratch. It's a great solution, but it's hard to maintain and scale. You need to be a full-stack developer
   to build it.

Torii is a simple, powerful, and extensible open-source Internal Developer Portal that aims to be the best of all worlds. It's easy to
extend and customize, it's free, and you have control over the codebase.

--- 

Curious to understand in more detail the motivation behind Torii? Read these articles:

- [Why Backstage is So Complex? Is There An Alternative?](https://romaricphilogene.substack.com/p/platform-tips-20-why-backstage-is)
- [What Could Be A Better Alternative To Backstage?](https://romaricphilogene.substack.com/p/platform-tips-21-what-could-be-a)

Curious to understand Torii is built? Read these articles:

- [Building a Better Alternative To Backstage - Part I](https://romaricphilogene.substack.com/p/platform-tips-22-building-a-better)
- Building a Better Alternative To Backstage - Part II (coming soon)
- Building a Better Alternative To Backstage - Part III (coming soon)

Refer to the [Design section](design.mdx) to understand the current architecture and design of Torii.

## FAQ

### What's the difference between Torii and Qovery?

The Qovery and Torii projects are two different projects with different goals:

- [Qovery](https://www.qovery.com) is an Internal Developer **Platform** focusing on the Software Development Lifecycle (build, deploy,
  run).
- Torii is an Internal Developer **Portal** focusing on unifying the experience of all engineering tools.

Here is a features table to help you understand the difference:

| Feature               | Qovery (Internal Developer Platform) | Torii (Internal Developer Portal) |
|-----------------------|--------------------------------------|-----------------------------------|
| Build                 | ✅                                    | ❌                                 |
| Deploy                | ✅                                    | ❌                                 |
| Run                   | ✅                                    | ❌                                 |
| Ephemeral Environment | ✅                                    | ❌                                 |
| Self-Service          | ✅                                    | ✅                                 |
| Catalogs Service      | ❌                                    | ✅                                 |
| Scorecard Service     | ❌                                    | ✅                                 |
| Workflow Service      | Partial with the concept of Pipeline | ✅                                 |

### Why Torii?

Torii is a [Japanese gate](https://en.wikipedia.org/wiki/Torii) most commonly found at the entrance of or within a Shinto shrine, where it
symbolically marks the transition from the mundane to the sacred.
