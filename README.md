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

## Google Drive 연동

이 확장 프로그램은 ChatGPT 대화 내용을 Google Drive에 직접 저장하는 기능을 제공합니다. 연동 방법은 다음과 같습니다.

1.  **옵션 페이지 열기**: 브라우저 툴바의 확장 프로그램 아이콘을 클릭한 후, 팝업 창에서 '옵션' 또는 톱니바퀴 아이콘을 클릭하여 설정 페이지를 엽니다.
2.  **Google 계정 연결**: '저장 설정' 섹션에서 'Google 계정 연결'을 찾은 후 '연결' 버튼을 클릭합니다.
3.  **권한 승인**: Google 로그인 및 권한 요청 창이 나타나면, 화면의 안내에 따라 로그인하고 파일 업로드 권한을 승인합니다.
4.  **저장 위치 선택**: '저장 위치' 옵션에서 'Google Drive'를 선택합니다.
5.  **(선택 사항) 폴더 ID 지정**: 특정 폴더에 파일을 저장하고 싶다면, Google Drive에서 해당 폴더를 열고 웹 브라우저 주소창의 URL 마지막 부분에 있는 폴더 ID를 복사하여 'Google Drive 폴더 ID' 입력란에 붙여넣습니다. (예: `https://drive.google.com/drive/folders/1AbC-dEfG_hIjKlMnOpQrStUvWxYzAbCd` 에서 `1AbC-dEfG_hIjKlMnOpQrStUvWxYzAbCd` 부분이 폴더 ID입니다.)
6.  **설정 저장**: '설정 저장' 버튼을 클릭하여 변경 사항을 저장합니다.
