#!/bin/bash
exec node "$(dirname "$0")/verify-deploy.mjs" "$@"
