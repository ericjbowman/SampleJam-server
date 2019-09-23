#!/bin/bash

API="http://localhost:4741"
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
