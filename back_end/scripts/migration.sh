#!/bin/bash
set -e
set -o pipefail

yarn knex migrate:down
yarn knex migrate:up
yarn knex seed:run
