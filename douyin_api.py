#!/usr/bin/env python3
"""
抖音直播数据爬虫 API 服务
运行方式: python douyin_api.py
API: http://localhost:8000/api/live?room_id=直播间ID
"""
from fastapi import FastAPI, Query
from playwright.sync_api import sync_playwright
import json
import uvicorn
import re
import argparse

app = FastAPI(title="抖音直播数据API")

def get_live_data(room_id: str):
    """获取直播间数据"""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        )
        page = context.new_page()
        
        try:
            page.goto(f'https://live.douyin.com/{room_id}', wait_until='networkidle', timeout=20000)
            page.wait_for_timeout(3000)
            
            # 获取页面数据
            data = {
                'room_id': room_id,
                'online_count': 0,
                'like_count': 0,
                'anchor_name': '',
                'room_title': '',
            }
            
            # 尝试获取在线人数
            try:
                online_text = page.locator('[class*="online"]').first.text_content(timeout=2000)
                data['online_count'] = int(re.sub(r'[^\d]', '', online_text))
            except:
                pass
            
            # 尝试获取点赞
            try:
                like_text = page.locator('[class*="like-count"]').first.text_content(timeout=2000)
                data['like_count'] = int(re.sub(r'[^\d]', '', like_text))
            except:
                pass
            
            # 获取主播名
            try:
                data['anchor_name'] = page.locator('[class*="anchor"]').first.text_content(timeout=2000)
            except:
                pass
                
            # 获取直播间标题
            try:
                data['room_title'] = page.locator('[class*="title"]').first.text_content(timeout=2000)
            except:
                pass
                
        except Exception as e:
            return {'error': str(e)}
        finally:
            browser.close()
    
    return data

@app.get("/api/live")
async def get_live(room_id: str = Query(..., description="直播间ID或链接")):
    # 提取room_id
    if 'douyin.com' in room_id:
        match = re.search(r'douyin\.com/(\w+)', room_id)
        if match:
            room_id = match.group(1)
    
    data = get_live_data(room_id)
    return data

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
