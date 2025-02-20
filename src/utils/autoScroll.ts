import * as puppeteer from "puppeteer";

export async function autoScroll(page: puppeteer.Page, maxScrolls: number = 150): Promise<void> {
    await page.evaluate((maxScrolls) => {
        return new Promise<void>((resolve) => {
            let totalHeight = 0;
            let scrollCount = 0;
            const distance = 1000; // ✅ 스크롤 거리 증가
            let previousHeight = 0;

            const timer = setInterval(() => {
                window.scrollBy(0, distance);
                totalHeight += distance;
                scrollCount++;

                // ✅ 새로운 데이터가 로드되었는지 확인
                const newHeight = document.body.scrollHeight;

                if (newHeight === previousHeight || scrollCount >= maxScrolls) {
                    clearInterval(timer);
                    resolve();
                }

                previousHeight = newHeight;
            }, 1000); // ✅ 1000ms 간격으로 스크롤 (더 많은 데이터 로드 가능)
        });
    }, maxScrolls);

    // ✅ Puppeteer 최신 버전(20+)에서 `page.waitForTimeout()` 제거됨 → `setTimeout` 사용
    await new Promise(resolve => setTimeout(resolve, 5000));
}
