# kakaw backend

## How to run this:

- Install Node.js (ideally version 18)
- Navigate to the `kakaw/backend` directory

- Install dependencies: `npm install`

### To run the server in Development mode:
- Run the watch script: `./watch.sh`

`watch.sh` launches the TypeScript compiler in watch mode, so that it recompiles when you change any code, and also launches [Nodemon](https://nodemon.io/) on the output file so that it automatically restarts the server once it has finished compiling.


### To run in production mode:

If you only want to compile and run the server once, you can build it with `npx tsc` and then run it with `node .` or `node dist/server.js`.

## Configuring options

There are a few options that can be set in [preferences.ts](src/preferences.ts). These can be used to configure the server to run in using development settings or production settings. 
- `HostDisconnectDelay` changes how much time the server takes to end a game after the host disconnects. This exists so that the host can rejoin a game if they lose internet or accidentally close the tab. This is currently set to 500 (milliseconds), so the tests don't time out.
- `corsOff` disables the default (very strict) cors settings, usually for development. 
- `frontendUrl` specifies where the host is running for CORS reasons. This only affects anything if CORS is turned off. 
- `backendPort` specifies which port the backend should listen on. Default: 8080

## Formatting Code
Prettier for code formatting is set up. You can install [the extension for VS Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) or for other editors to format code when you save any file, or you can run `npx prettier -w src` to format the entire directory from the command line.

