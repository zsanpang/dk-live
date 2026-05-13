#!/usr/bin/env python3
"""
抖音登录脚本
"""
from playwright.async_api import async_playwright
import asyncio

async def login_douyin():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, args=['--no-sandbox'])
        context = await browser.new_context()
        page = await context.new_page()
        
        # 访问抖音登录页
        await page.goto('https://www.douyin.com/login/')
        await page.wait_for_load_state('networkidle')
        
        print("请在打开的浏览器中完成登录...")
        print("登录完成后告诉我，我会提取 Cookie")
        
        # 等待用户登录
        await page.wait_for_timeout(300)
        
        # 获取 Cookie
        cookies = await context.cookies()
        print("\n=== Cookie ===")
        for c in cookies:
            print(f"{c['name']}={c['value'][:50]}...")
        
        await browser.close()
        return cookies

if __name__ == "__main__":
    asyncio.run(login_douyin())
