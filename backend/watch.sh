#!/bin/sh

# launch typescript compiler in background
npx tsc -w &
# launch nodemon in background
npx nodemon dist/server.js &
# keep running until those commands exit
wait
