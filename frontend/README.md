# Kakaw Frontend

## How to run:

- Install Node.js
- Navigate to the `kakaw/frontend` directory
- Install dependencies: `npm install`
- Run the development server: `npm run dev`

This should allow you to view the kakaw site locally at [http://localhost:3000](http://localhost:3000). Changes to any pages or components should automatically trigger recompilations upon saving.

## Development

- `/pages` contains all pages that can be loaded by running the server.
- `/components` is for storing components that we might wish to reuse multiple times in one page or multiple pages.
- `/public` is for storing any assets, particularly images that we need for some pages.
- `tailwind.config.js` is useful for specifying custom colors or styles that you might wish to employ in various pages.

Make sure to use `npm run format` or Prettier format-on-save to format all code!
