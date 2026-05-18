#!/bin/bash

python3 << END
from pathlib import Path
import os

config_path = Path("config.js")

content = config_path.read_text()

content = content.replace(
"**VAPI_PUBLIC_KEY**",
os.environ.get("VAPI_PUBLIC_KEY", "")
)

content = content.replace(
"**ASSISTANT_EN**",
os.environ.get("ASSISTANT_ID_EN", "")
)

content = content.replace(
"**ASSISTANT_ES**",
os.environ.get("ASSISTANT_ID_ES", "")
)

content = content.replace(
"**ASSISTANT_AR**",
os.environ.get("ASSISTANT_ID_AR", "")
)

config_path.write_text(content)

print("Config injection complete.")
END
