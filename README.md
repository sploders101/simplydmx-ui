# SimplyDMX UI

This project is the open-source frontend of SimplyDMX, my proprietary DMX software written in Rust using Tauri and a ***highly*** modular plugin framework. SimplyDMX core will run in a dedicated binary, which will spawn a WebView through Tauri and display this interface.

## Why is only half of SimplyDMX open-source?

The goal of open-sourcing the graphical interface is to maintain proprietary rights to SimplyDMX, as well as the ability to sell it with a decently-high barrier to piracy, while making it as open and customizable as possible. Shortly after the initial release (maybe during alpha or beta if I change my mind), a plugin loader and SDK will be provided, in addition to a self-documenting code browser to give users everything they need to write custom plugins, integrations, and user interfaces. The framework for the self-documented code browser has already been implemented, and the data for it exists, but it will not be given high priority until release for personal and business reasons.

## Some background

Personally, I feel like the lighting industry doesn't have any software that I would consider *good*. There are a only a handful of good options, and they all have their strengths and weaknesses, but I want something with all of it. I think one of the greatest pitfalls in the industry is proprietary, closed-source implementations. Unfortunately, if I want to turn this into a business, it is a necessary evil. However, what I *can* do, is make SimplyDMX the most open closed-source software there is.

The goal of SimplyDMX is to take a step back and look at what's there, taking the good from each platform and leaving the bad, while leaving it open enough that users who have the ability to write software can infinitely customize it exactly the way they want, potentially even opening the door to working with partners that provide different implementations to fit different use cases.

For now though, I have spent a year on architecture, and it's time to fast-track user-accessible functionality, so as I add new features to the backend, you'll likely see them pop up here, too. This project won't be usable for a while, and I won't be accepting pull requests until at least alpha release. I will be adding a license shortly, but feel free to copy and use anything in this repository.

## Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).
