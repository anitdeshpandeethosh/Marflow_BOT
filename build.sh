#!/bin/bash

# Replace VAPI key

sed -i "s|**VAPI_PUBLIC_KEY**|${VAPI_PUBLIC_KEY}|g" config.js

# Replace assistant IDs

sed -i "s|**ASSISTANT_EN**|${ASSISTANT_ID_EN}|g" config.js

sed -i "s|**ASSISTANT_ES**|${ASSISTANT_ID_ES}|g" config.js

sed -i "s|**ASSISTANT_AR**|${ASSISTANT_ID_AR}|g" config.js
