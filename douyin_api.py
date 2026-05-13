#!/usr/bin/env python3
"""
抖音直播数据爬虫 - 调试版
"""
from fastapi import FastAPI, Query
from playwright.async_api import async_playwright
import uvicorn
import re

app = FastAPI(title="抖音直播数据API")

async def get_live_data(room_id: str):
    """获取直播间数据"""
    async with async_playwright() as p:
        try:
            browser = await p.chromium.launch(
                headless=True,
                args=['--no-sandbox', '--disable-setuid-sandbox']
            )
            page = await browser.new_page()
            
            url = f'https://live.douyin.com/{room_id}'
            await page.goto(url, timeout=30000, wait_until="commit")
            await page.wait_for_timeout(5000)
            
            # 获取文本内容
            text = await page.evaluate('document.body.innerText')
            
            print(f"=== 页面文本内容 ===")
            print(text[:2000])
            print("=== END ===")
            
            data = {
                'room_id': room_id,
                'text_preview': text[:500],
                'success': True
            }
            
            await browser.close()
            return data
            
        except Exception as e:
            try: await browser.close()
            except: pass
            return {'success': False, 'error': str(e)}

@app.get("/api/live")
async def get_live(room_id: str = Query(...)):
    if 'douyin.com' in room_id:
        match = re.search(r'douyin\.com/(\w+)', room_id)
        if match: room_id = match.group(1)
    return await get_live_data(room_id)

@app.get("/health")
async def health(): return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
