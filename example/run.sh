#!/usr/bin/env bash

yarn start > ./my.log 2>&1 &
echo $! > ./dev-pid.txt
