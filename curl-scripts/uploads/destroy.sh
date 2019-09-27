#!/bin/bash

API="https://gentle-stream-17108.herokuapp.com"
URL_PATH="/uploads"
ID="5d8925ea27278f18d333a9f6"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE \

echo
