#!/usr/bin/env bash
echo "storing parent version."
git rev-parse HEAD > .parent-version
git add .parent-version
