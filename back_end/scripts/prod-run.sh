#!/bin/bash
set -e
set -o pipefail

cd dist
npx knex migrate:latest --env production
npx knex seed:run
cd ../
node dist/src/main.js
