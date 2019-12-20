#!/bin/bash

cd /opt/app/current

Xvfb :10 -screen 0 1600x1200x24 &
export DISPLAY=:10

echo APPLICATION_VARIABLES
echo NODE_ENV=$NODE_ENV
echo RUNNING NIGHTMARE
make test
cp mochawesome-report/mochawesome.html mochawesome-report/$JOB_NAME.html
cp mochawesome-report/mochawesome.json mochawesome-report/$JOB_NAME.json