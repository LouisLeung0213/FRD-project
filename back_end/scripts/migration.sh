set -e
set -o pipefail

npx knex migrate:down
npx knex migrate:up
npx knex seed:run
