#!/bin/bash
set -e
set -o pipefail

cd dist
npx knex migrate:down --env production
npx knex migrate:latest --env production
npx knex seed:run
cd ../
node dist/src/main.js
