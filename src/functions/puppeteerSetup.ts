import * as puppeteer from "puppeteer";

export async function launchPuppeteer() {
    const browser = await puppeteer.launch({
        headless: false, // ✅ 브라우저 UI를 표시하여 크롤링 확인 가능
        defaultViewport: null, // ✅ 뷰포트 크기 고정 해제 (윈도우 크기 설정 가능)
        args: ["--start-maximized"], // ✅ 브라우저 창 최대화
    });

    const page = await browser.newPage();

    // ✅ 화면 크기 조절 (너비 1920px, 높이 1080px)
    await page.setViewport({ width: 1920, height: 1080 });

    // ✅ User-Agent 설정 (봇 감지 우회)
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    return { browser, page };
}
