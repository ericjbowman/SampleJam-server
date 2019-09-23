#!/bin/bash

API="https://gentle-stream-17108.herokuapp.com"
URL_PATH="/examples"
TEXT="blarp"
TITLE="bloop"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "example": {
      "text": "'"${TEXT}"'",
      "title": "'"${TITLE}"'"
    }
  }'

echo
