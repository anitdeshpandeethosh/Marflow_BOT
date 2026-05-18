#!/bin/bash

sed -i "s|**VAPI_PUBLIC_KEY**|$VAPI_PUBLIC_KEY|g" config.js

sed -i "s|**ASSISTANT_EN**|$ASSISTANT_EN|g" config.js

sed -i "s|**ASSISTANT_ES**|$ASSISTANT_ES|g" config.js

sed -i "s|**ASSISTANT_AR**|$ASSISTANT_AR|g" config.js
