#!/bin/bash
set -e
set -o pipefail

ionic build
npx cap sync
npx cap open ios