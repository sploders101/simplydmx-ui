# SimplyDMX UI

This project is the open-source frontend of SimplyDMX, my proprietary DMX software written in Rust using Tauri and a ***highly***
modular plugin framework. SimplyDMX core will run in a dedicated binary, which will spawn a WebView through [Tauri](https://tauri.app/)
and display this interface.

## What is SimplyDMX?

SimplyDMX is a general-purpose automated lighting program with a focus on stage lighting.

I'm not really a fan of the current state of the stage lighting industry. Each program does one thing really well, and everything else kind
of tapers off. I have heard of programs that can do it all well, but they are quite expensive and I have not gotten an opportunity to work
with them. The goal of SimplyDMX is to take a step back and look at the lighting industry as it is, taking what I like about a variety of
applications and compiling it into one software package with a scalable architecture.

My primary target audience is the pro-sumer space, from the perspective of worship. However, while that *is* my primary focus, I will be
designing SimplyDMX to fit multiple categories such as small bands and venues, holiday lighting, etc. Despite the namesake, SimplyDMX's
architecture doesn't even limit it to DMX. Any type of output can be implemented due to the segmentation of lighting values (fixture IDs
and attributes), patches (mapping of fixture types to outputs with extra data to help assemble the result), outputs (protocols used to
communicate with lights), and transports (carrier protocols, such as USB, E.131, ArtNet, etc).

## What sets SimplyDMX apart from other attempts at this goal?

SimplyDMX has a ***very*** well thought-out architecture designed to scale and be as fast, modular, and efficient as possible, to the point
that it should be able to run a moderately-sized show on a $35 Raspberry Pi.

As someone who runs stage lighting quite often, I feel I'm well-equipped to understand the needs of the prosumer/enthusiast. However, I am
also a tinkerer and a developer. I like my software to be open and configurable. Everything within SimplyDMX is modular and self-documenting,
and I don't have access to any APIs I don't expose. For plugins to communicate, their communication parameters must be documented and stored
in a registry. All of those types and functions will be documented in typescript here, and I will be creating a Rust WebAssembly SDK later
for creating plugins.

I am taking as much time as I need. I'm not in a hurry, and have spent an entire year building just the framework for SimplyDMX.
That doesn't mean features will come slowly after release, nor does it mean I'm not hard at work; it just means I'll take the time necessary
to do things *right*. I want SimplyDMX to last, and work *well*.

Finally, I'm all about user choice, and I understand that no program can be one-size-fits-all, so SimplyDMX has been built to be modular.
I can create as many sizes as I want by mixing and matching components together in different configurations. There's not much sense
re-inventing the wheel all the time. All these programs do kind of the same thing, right? Why not create a solid foundation that works well,
and give it as many facets as we want? One UI can be simple, while the other is complex and gives you *all* the options. And why can't we
have a common data format that works with all of them? And why can't the user have an SDK that allows them to extend the programs functionality
with whatever outrageous thing they want, like say, a Philips Hue integration?

## Why is only half of SimplyDMX open-source?

The goal of open-sourcing the graphical interface is to maintain proprietary rights to SimplyDMX, while making it as open and customizable as
possible. Shortly after the initial release (maybe during alpha or beta if I change my mind), a plugin loader and SDK will be provided, in
addition to a self-documenting code browser to give users everything they need to write custom plugins, integrations, and user interfaces.
This self-documenting code is actually used to generate the file at `src/scripts/api/ipc/rpc.ts`. It's a little klunky at the moment, but it
works well and I plan to circle back to it once I have a releasable product.

The point is, I want SimplyDMX to be ultra-customizable and I don't want to hide the way things work. Unfortunately, I'm worried that if I
release the backend source code, I won't have enough *paying* customers to support the project, so that's going to stay closed-source for now.
