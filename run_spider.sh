#!/bin/bash
# 安装依赖并运行爬虫服务

echo "安装 Python 依赖..."
pip install fastapi uvicorn playwright -q

echo "安装 Playwright 浏览器..."
playwright install chromium --with-deps 2>/dev/null

echo ""
echo "运行服务..."
echo "你的抖音直播间链接是什么？输入后按回车"
read -r room_id

echo ""
echo "启动爬虫服务 + 内网穿透..."
echo "完成后会给你一个公网链接"
echo ""

python3 -c "
import subprocess
import sys
import time
import socket

# 启动 FastAPI 服务
server = subprocess.Popen([
    sys.executable, 'douyin_api.py'
], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# 等待服务启动
time.sleep(3)

print('本地服务已启动: http://localhost:8000')
print('')
print('现在启动 localtunnel...')
"

# 启动 localtunnel
lt --port 8000 --subdomain dklive-spider
