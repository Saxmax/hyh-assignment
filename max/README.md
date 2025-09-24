# Intro

Hello HoldYourHat team,

I really enjoyed this work test!
These kinds of systems and internal tools is what I've come to love to develop.

It was a long time ago that I worked in `Phaser CE` (v2, community managed) - which uses and extends `PIXI.js`.
But I recognize and remember the syntax still. In any case, when I had issues the PIXI docs were easy to navigate and helpful.

I have attempted to create a particle system that should be developer-friendly and easy to use and configure.
All my work is contained within the sub-folder `max/`. Here is a quick run-through of the files:

- `Assignment`:
  This file holds code to call and start the particle system, as well as loading of the coin textures.
  Please look at the bottom of it for a quick way to preview some particle configuration examples.
- `Particles`:
  This is the Particle System class with all its internal and accessible functions.
  It maintains control of when to emit a particle and preparing its configuration for the desired effect.
- `Particle`:
  This is the class representing a single Particle.
  It has its own update (tick) and calculates motion and progresses its life cycle.
- `Particle Events` & `Particle Examples`:
  These are just meant to separate code to keep the Particle class readable.
- `Utilities`:
  Some helpful static functions.

# Playing the worktest

To test/verify the worktest, please just open the project index.html in a browser.
I run it with `npx serve .` since the JS loading of assets will yield CORS issues if run statically.

It is already configured to run the Coin Fountain simulation.
But I highly recommend navigating to the bottom of the `max/assignment.js` file and changing the loaded particle example,
and even playing around with the values yourself!

I have opted for allowing various configurations, where some properties can change over a particles lifetime,
some properties can be applied with a random value (of a defined range), and some properties are just number values.

# Project Retrospect

With more time on such a project, these are the features I would have wanted to implement:

- Properties should not be limited to either `number or start/end` or `number or min/max`, but all alternatives should work.
- Collision/Bounding box for particles to bounce against. Preferrably applying restitution properties to the particles, too.
- Non-linear easing options for properties that change over their lifecycle.
- A `timeScale` property for the particle system.
- An option to make the emit position follow a target (e.g a `PIXI.Sprite`).
- Emission shapes. Allowing a shape (line, rectangle edges, circle edges, etc) to be used for emitting particles, instead of a point or random range.
- JSDocs documentation of all developer accessible functions.

# Code Retrospect

I have kept this to pre-ES6 vanilla JavaScript as the assignment suggested,
and I believe I have kept it readable, neat, and tidy.
Would modern JS be allowed, I would use helpful features such as object destructuring and
JS classes to make life easier for any developer using the system.
In TypeScript I would implement interfaces and types everywhere making sure that everything was covered,
as this makes the code crystal clear and very self-documented since the IDE can help out more.
