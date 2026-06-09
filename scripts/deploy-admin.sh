#!/bin/bash
exec node "$(dirname "$0")/deploy-admin.mjs" "$@"
