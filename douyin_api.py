#!/usr/bin/env python3
"""
抖音直播数据爬虫 API 服务 (异步版本)
运行方式: python douyin_api.py
API: http://localhost:8000/api/live?room_id=直播间ID
"""
from fastapi import FastAPI, Query
from playwright.async_api import async_playwright
import json
import uvicorn
import re

app = FastAPI(title="抖音直播数据API")

async def get_live_data(room_id: str):
    """获取直播间数据"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        )
        page = await context.new_page()
        
        try:
            await page.goto(f'https://live.douyin.com/{room_id}', wait_until='networkidle', timeout=20000)
            await page.wait_for_timeout(3000)
            
            data = {
                'room_id': room_id,
                'online_count': 0,
                'like_count': 0,
                'anchor_name': '',
                'room_title': '',
            }
            
            # 获取在线人数
            try:
                online_elem = page.locator('[class*="online"]').first
                online_text = await online_elem.text_content(timeout=2000)
                data['online_count'] = int(re.sub(r'[^\d]', '', online_text))
            except:
                pass
            
            # 获取点赞
            try:
                like_elem = page.locator('[class*="like-count"]').first
                like_text = await like_elem.text_content(timeout=2000)
                data['like_count'] = int(re.sub(r'[^\d]', '', like_text))
            except:
                pass
                
        except Exception as e:
            return {'error': str(e)}
        finally:
            await browser.close()
    
    return data

@app.get("/api/live")
async def get_live(room_id: str = Query(..., description="直播间ID或链接")):
    # 提取room_id
    if 'douyin.com' in room_id:
        match = re.search(r'douyin\.com/(\w+)', room_id)
        if match:
            room_id = match.group(1)
    
    data = await get_live_data(room_id)
    return data

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
