
# 🕵️‍♂️ Crawling DevOps Announcement

**Crawling DevOps Announcement**는 DevOps 관련 채용 공고를 자동으로 크롤링하여 수집하는 프로젝트입니다.  


## 📌 기능 소개
- `구직사이트`에서 **DevOps 관련 채용 공고를 크롤링**합니다.
- **Puppeteer & TypeScript 기반**으로 동작합니다.
- **사이트별로 크롤링된 데이터를 JSON 파일로 저장후 중복제거**합니다.
- **날짜별로 저장**하여 데이터를 관리합니다.
- **사이트별 크롤링 방식**에 따라 다른 크롤러를 사용합니다.
---

## 🚀 실행 방법
- **프로젝트 클론**
```bash
git clone https://github.com/seokmingg/crawling-devops-announcement.git
cd crawling-devops-announcement
npm install
npm run start

```
---
## 📂 프로젝트 폴더 구조
```plaintext
crawling-devops-announcement/
│── src/
│   ├── index.ts                # 메인 실행 파일 (모든 크롤링 사이트 순회 & 실행)
│   ├── result/                  #  크롤링 데이터 저장 폴더
│   │   ├── 2025-02-15/           #  날짜별 폴더 (자동 생성)
│   │   │   ├── merged_jobs.json  #  크롤링후 합쳐진 중복제거된 데이터
│   │   │   ├── wanted_jobs.json  #  원티드 크롤링 데이터
│   │   │   ├── jumpit_jobs.json  #  점핏 크롤링 데이터
│   │   │   ├── saramin_jobs.json #  사람인 크롤링 데이터
│   │   │   ├── jobkorea_jobs.json#  잡코리아 크롤링 데이터
│   ├── dto/
│   │   ├── JobListing.dto.ts     # DTO 정의 (채용 공고 데이터 타입)
│   ├── functions/
│   │   ├── puppeteerSetup.ts     # Puppeteer 초기화 관련 코드 (브라우저 설정)
│   │   ├── autoScroll.ts         #  무한 스크롤 함수 (점핏, 원티드용)
│   │   ├── saveToFile.ts         #  JSON 파일 저장 함수 (날짜별로 저장)
│   │   ├── mergeFiles.ts         #  JSON 파일 병합 함수 (중복제거)
│   │   ├── crawlers/             #  사이트별 크롤러 폴더
│   │   │   ├── Scraper.ts        #  크롤러 인터페이스 (공통)
│   │   │   ├── wantedScraper.ts  #  원티드 크롤러 (무한 스크롤)
│   │   │   ├── jumpitScraper.ts  #  점핏 크롤러 (무한 스크롤)
│   │   │   ├── saraminScraper.ts #  사람인 크롤러 (페이지네이션)
│   │   │   ├── catchScraper.ts   #  캐치 크롤러 (페이지네이션)
│   │   │   ├── jobkoreaScraper.ts#  잡코리아 크롤러 (페이지네이션)
│── package.json                  # 프로젝트 패키지 관리
│── tsconfig.json                  # TypeScript 설정
│── README.md                      # 프로젝트 설명 문서


```
---
## 🛠 사이트 추가
- **새로운 사이트를 추가**하고 싶다면 `src/functions/crawlers` 폴더에 새로운 크롤러를 추가합니다.
- **추가한 함수를 index.ts**에 import한후  const scrapers: Scraper[] = [wantedScraper,...,새로운 크롤러]; 에 추가합니다.