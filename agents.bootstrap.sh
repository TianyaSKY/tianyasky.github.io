#!/usr/bin/env sh
# 下载项目 AGENTS.md 模板到当前目录。

set -eu

url="https://raw.githubusercontent.com/tianyasky/tianyasky.github.io/main/AGENTS.md"
output="AGENTS.md"

curl --fail --location --output "$output" "$url"
printf 'AGENTS.md 已下载到: %s/%s\n' "$(pwd)" "$output"
