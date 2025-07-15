# 포트폴리오 웹사이트 배포 가이드

## 🚀 배포 방법들

### 1. GitHub Pages (추천 - 무료, 간단)

**장점**: 완전 무료, 설정 간단, 커스텀 도메인 지원
**단점**: 정적 사이트만 지원

#### 단계별 가이드:

1. **GitHub 저장소 생성**
   ```bash
   # 로컬에서 Git 초기화
   git init
   git add .
   git commit -m "Initial commit"
   
   # GitHub에서 새 저장소 생성 후
   git remote add origin https://github.com/yourusername/portfolio.git
   git push -u origin main
   ```

2. **GitHub Pages 활성화**
   - GitHub 저장소 페이지에서 Settings → Pages
   - Source를 "Deploy from a branch" 선택
   - Branch를 "main" 선택
   - Save 클릭

3. **배포 완료**
   - 몇 분 후 `https://yourusername.github.io/portfolio`에서 접속 가능

### 2. Netlify (추천 - 무료, 자동 배포)

**장점**: 무료, 자동 배포, 커스텀 도메인, SSL 자동 설정
**단점**: 무료 플랜에 제한 있음

#### 단계별 가이드:

1. **Netlify 가입**: https://netlify.com
2. **배포 방법 선택**:
   - **Drag & Drop**: `index.html`이 있는 폴더를 Netlify에 드래그
   - **Git 연동**: GitHub 저장소와 연결하여 자동 배포

3. **설정**:
   - Site name 설정 (예: `my-portfolio`)
   - 배포 완료 후 `https://your-site-name.netlify.app`에서 접속

### 3. Vercel (추천 - 무료, 빠른 배포)

**장점**: 무료, 매우 빠른 배포, 자동 SSL, 커스텀 도메인
**단점**: 무료 플랜에 제한 있음

#### 단계별 가이드:

1. **Vercel 가입**: https://vercel.com
2. **GitHub 연동**: GitHub 저장소 연결
3. **자동 배포**: 코드 푸시 시 자동으로 배포됨

### 4. Firebase Hosting (Google - 무료)

**장점**: Google 지원, 무료, 빠른 CDN
**단점**: 설정이 조금 복잡

#### 단계별 가이드:

1. **Firebase CLI 설치**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase 프로젝트 생성**:
   ```bash
   firebase login
   firebase init hosting
   ```

3. **배포**:
   ```bash
   firebase deploy
   ```

## 🌐 커스텀 도메인 설정

### GitHub Pages + 커스텀 도메인

1. **도메인 구매**: Namecheap, GoDaddy 등에서 도메인 구매
2. **DNS 설정**:
   ```
   Type: CNAME
   Name: www
   Value: yourusername.github.io
   ```
3. **GitHub 설정**: Settings → Pages → Custom domain에 도메인 입력

### Netlify + 커스텀 도메인

1. **도메인 추가**: Site settings → Domain management
2. **DNS 설정**: Netlify에서 제공하는 네임서버로 변경

## 📱 배포 전 체크리스트

- [ ] 모든 링크가 올바르게 작동하는지 확인
- [ ] 모바일에서 반응형이 제대로 작동하는지 확인
- [ ] 다크모드가 정상 작동하는지 확인
- [ ] 이미지가 모두 로드되는지 확인
- [ ] 브라우저 호환성 테스트 (Chrome, Firefox, Safari, Edge)

## 🔧 배포 후 최적화

### 1. 이미지 최적화
```html
<!-- WebP 형식 사용 -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
```

### 2. 메타 태그 추가
```html
<!-- SEO 최적화 -->
<meta name="description" content="포트폴리오 웹사이트">
<meta name="keywords" content="포트폴리오, 웹개발, 프론트엔드">
<meta property="og:title" content="포트폴리오">
<meta property="og:description" content="포트폴리오 웹사이트">
<meta property="og:image" content="https://yoursite.com/og-image.jpg">
```

### 3. Google Analytics 추가
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚨 주의사항

1. **로컬 스토리지**: 현재 데이터는 브라우저에만 저장되므로, 다른 기기에서는 데이터가 공유되지 않습니다.
2. **이미지 호스팅**: 프로젝트 썸네일 이미지는 외부 URL을 사용하므로, 이미지가 삭제되면 표시되지 않을 수 있습니다.
3. **HTTPS**: 배포 시 HTTPS를 사용하여 보안을 강화하세요.

## 💡 추천 배포 순서

1. **GitHub Pages** (가장 간단)
2. **Netlify** (자동 배포 원할 시)
3. **Vercel** (빠른 배포 원할 시)
4. **커스텀 도메인** (브랜딩이 중요할 시)

## 📞 문제 해결

### 배포 후 페이지가 안 보이는 경우
- 파일명이 정확한지 확인 (`index.html`)
- 대소문자 구분 확인
- 캐시 삭제 후 새로고침

### 이미지가 안 보이는 경우
- 이미지 URL이 올바른지 확인
- CORS 정책 확인
- 이미지 호스팅 서비스 사용 권장 (Cloudinary, Imgur 등)

---

**배포가 완료되면 포트폴리오를 공유하여 더 많은 사람들에게 보여주세요! 🎉** 