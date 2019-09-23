#!/bin/bash

API="https://gentle-stream-17108.herokuapp.com"
URL_PATH="/uploads"
ID="5d8927d127278f18d333a9f8"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE \

echo
