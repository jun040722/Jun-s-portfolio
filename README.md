# JUN'S PORTFOLIO

포트폴리오 웹사이트 프로젝트입니다. 프론트엔드와 백엔드를 모두 포함하고 있습니다.

## 기능

- 📝 프로필 정보 편집
- 🎯 프로젝트 추가/편집/삭제
- 🏷️ 기술 스택 관리
- 📁 파일 업로드 (이미지, 비디오)
- 🌙 다크모드 지원
- 📱 반응형 디자인

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 서버 실행

```bash
# 개발 모드 (자동 재시작)
npm run dev

# 프로덕션 모드
npm start
```

### 3. 브라우저에서 접속

```
http://localhost:3000
```

## 프로젝트 구조

```
├── index.html          # 메인 HTML 파일
├── script.js           # 프론트엔드 JavaScript
├── styles.css          # CSS 스타일
├── server.js           # 백엔드 서버
├── package.json        # 프로젝트 설정
├── uploads/            # 업로드된 파일 저장소
└── data/               # JSON 데이터 파일들
    ├── projects.json
    ├── skills.json
    └── profile.json
```

## API 엔드포인트

### 파일 업로드
- `POST /api/upload` - 파일 업로드

### 프로젝트 관리
- `GET /api/projects` - 프로젝트 목록 조회
- `POST /api/projects` - 프로젝트 데이터 저장

### 스킬 관리
- `GET /api/skills` - 스킬 목록 조회
- `POST /api/skills` - 스킬 데이터 저장

### 프로필 관리
- `GET /api/profile` - 프로필 정보 조회
- `POST /api/profile` - 프로필 정보 저장

## 기술 스택

### 프론트엔드
- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (ES6+)

### 백엔드
- Node.js
- Express.js
- Multer (파일 업로드)
- CORS

## 파일 업로드 기능

- 지원 형식: JPG, PNG, GIF, WebP, MP4, WebM
- 최대 파일 크기: 10MB
- 최대 파일 개수: 10개

## 주의사항

1. 서버를 실행하기 전에 `npm install`을 먼저 실행하세요.
2. 업로드된 파일은 `uploads/` 폴더에 저장됩니다.
3. 데이터는 `data/` 폴더의 JSON 파일에 저장됩니다.
4. 백엔드 서버가 실행되지 않으면 로컬 스토리지를 사용합니다.

## 문제 해결

### 파일 업로드가 안 되는 경우
1. 백엔드 서버가 실행 중인지 확인
2. 브라우저 콘솔에서 오류 메시지 확인
3. 파일 형식과 크기가 제한을 초과하지 않았는지 확인

### 데이터가 저장되지 않는 경우
1. `data/` 폴더가 생성되었는지 확인
2. 서버 로그에서 오류 메시지 확인
3. 파일 권한 문제가 없는지 확인 