#!/bin/bash
set -ev
if [ "${TRAVIS_PULL_REQUEST}" = "false" ]
then
  npm test
else
  npm run test:unit
fi
