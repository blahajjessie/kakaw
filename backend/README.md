# kakaw backend

How to run this:

- Install Node.js
- Navigate to `kakaw/backend`
- Install dependencies: `npm install`
- Run the server: `./watch.sh`

`watch.sh` launches the TypeScript compiler in watch mode, so that it recompiles when you change any code, and also launches [Nodemon](https://nodemon.io/) on the output file so that it automatically restarts the server once it has finished compiling.

If you only want to compile and run the server once, you can build it with `npx tsc` and then run it with `node .` or `node dist/server.js`.

I set up Prettier for code formatting. You can install [the extension for VS Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) or for other editors to format code when you save any file, or you can run `npx prettier -w src` to format the entire directory from the command line.
