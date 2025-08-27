# CG Downer

Chrome 확장 프로그램 프로젝트입니다.

## 프로젝트 구조

```
chatgpt-md-export/
├── manifest.json          # 확장 프로그램 매니페스트
├── service_worker.js      # 서비스 워커
├── content.js            # 콘텐츠 스크립트
├── options.js            # 옵션 페이지 스크립트
├── options.html          # 옵션 페이지
├── popup.js              # 팝업 스크립트
├── popup.html            # 팝업 페이지
├── icons/                # 아이콘 디렉토리
│   ├── icon16.png        # 16x16 아이콘
│   ├── icon48.png        # 48x48 아이콘
│   └── icon128.png       # 128x128 아이콘
```

## 설치 방법

1. Chrome 브라우저에서 `chrome://extensions/` 접속
2. 개발자 모드 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. 이 프로젝트 폴더 선택

## 사용법

설치 후 Chrome 확장 프로그램 아이콘을 클릭하여 사용할 수 있습니다.

## 개발

이 프로젝트는 Chrome 확장 프로그램 API를 사용하여 개발되었습니다.
