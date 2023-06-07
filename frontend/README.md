# Kakaw Frontend

## How to run:

- Install Node.js
- Navigate to the `kakaw/frontend` directory
- Install dependencies: `npm install`
- For development, run `npm run dev`
- For production, compile the application with `npm run build`, and then launch the server with `npm run start`.

Most functionality doesn't work if the backend isn't running -- consult `backend/README.md` for instructions to run that.

To host this publicly (i.e. on some domain instead of `localhost`), change the constants in `frontend/lib/baseUrl.ts` to use the correct domain, scheme (hopefully `https`/`wss` if you have set up TLS), and port (or lack thereof if you are on the default ones), and then recompile.

In development, this allows you to view the kakaw site locally at [http://localhost:3000](http://localhost:3000). Changes to any pages or components should automatically trigger recompilations upon saving.

## Development

- `/pages` contains all pages that can be loaded by running the server.
- `/components` is for storing components that we might wish to reuse multiple times in one page or multiple pages.
- `/public` is for storing any assets, particularly images that we need for some pages.
- `tailwind.config.js` is useful for specifying custom colors or styles that you might wish to employ in various pages.

Make sure to use `npm run format` or Prettier format-on-save to format all code!
