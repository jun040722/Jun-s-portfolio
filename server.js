const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 업로드 폴더 생성 (Vercel에서는 /tmp 디렉토리 사용)
const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads' : path.join(__dirname, 'uploads');
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
} catch (error) {
    console.error('업로드 폴더 생성 오류:', error);
}

// Multer 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB 제한
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('지원하지 않는 파일 형식입니다.'), false);
        }
    }
});

// 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 파일 업로드 API
app.post('/api/upload', upload.array('files', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: '업로드된 파일이 없습니다.' });
        }

        const uploadedFiles = req.files.map(file => ({
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: `/uploads/${file.filename}`
        }));

        res.json({
            success: true,
            files: uploadedFiles
        });
    } catch (error) {
        console.error('파일 업로드 오류:', error);
        res.status(500).json({ error: '파일 업로드 중 오류가 발생했습니다.' });
    }
});

// 업로드된 파일 서빙
app.use('/uploads', express.static(uploadDir));

// 프로젝트 데이터 API
app.get('/api/projects', (req, res) => {
    try {
        const dataPath = process.env.NODE_ENV === 'production' 
            ? '/tmp/data/projects.json' 
            : path.join(__dirname, 'data', 'projects.json');
        
        if (fs.existsSync(dataPath)) {
            const data = fs.readFileSync(dataPath, 'utf8');
            res.json(JSON.parse(data));
        } else {
            // 기본 프로젝트 데이터 제공
            const defaultProjects = [
                {
                    id: 1,
                    name: "포트폴리오 웹사이트",
                    period: "2024.01 - 2024.02",
                    type: "web",
                    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
                    description: "React와 Tailwind CSS를 사용한 반응형 포트폴리오 웹사이트입니다. 다크모드 지원과 모바일 최적화가 포함되어 있습니다.",
                    techStack: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "GitHub Pages"],
                    features: [
                        "반응형 디자인 (모바일, 태블릿, 데스크톱)",
                        "다크모드/라이트모드 전환",
                        "실시간 프로필 편집",
                        "프로젝트 추가/편집/삭제",
                        "스킬 태그 관리",
                        "프로젝트 정렬 및 필터링"
                    ],
                    link: "https://github.com/jun040722/Jun-s-portfolio",
                    media: []
                },
                {
                    id: 2,
                    name: "AI 챗봇 애플리케이션",
                    period: "2023.11 - 2023.12",
                    type: "ai",
                    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
                    description: "OpenAI API를 활용한 지능형 챗봇 애플리케이션입니다. 자연어 처리와 대화형 인터페이스를 구현했습니다.",
                    techStack: ["Python", "OpenAI API", "React", "Node.js", "MongoDB"],
                    features: [
                        "자연어 처리 및 대화형 인터페이스",
                        "실시간 메시지 전송",
                        "대화 히스토리 저장",
                        "다국어 지원",
                        "사용자 인증 및 권한 관리"
                    ],
                    link: "https://github.com/example/ai-chatbot",
                    media: []
                },
                {
                    id: 3,
                    name: "모바일 할일 관리 앱",
                    period: "2023.08 - 2023.10",
                    type: "mobile",
                    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
                    description: "React Native로 개발한 크로스 플랫폼 할일 관리 애플리케이션입니다. 로컬 스토리지와 푸시 알림 기능을 포함합니다.",
                    techStack: ["React Native", "JavaScript", "AsyncStorage", "Push Notifications", "Expo"],
                    features: [
                        "할일 추가/편집/삭제",
                        "카테고리별 분류",
                        "우선순위 설정",
                        "푸시 알림",
                        "오프라인 동기화",
                        "다크모드 지원"
                    ],
                    link: "https://github.com/example/todo-app",
                    media: []
                }
            ];
            res.json(defaultProjects);
        }
    } catch (error) {
        console.error('프로젝트 데이터 로드 오류:', error);
        res.status(500).json({ error: '데이터 로드 중 오류가 발생했습니다.' });
    }
});

app.post('/api/projects', (req, res) => {
    try {
        const dataDir = process.env.NODE_ENV === 'production' ? '/tmp/data' : path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const dataPath = path.join(dataDir, 'projects.json');
        const projects = req.body;
        fs.writeFileSync(dataPath, JSON.stringify(projects, null, 2));
        
        res.json({ success: true });
    } catch (error) {
        console.error('프로젝트 데이터 저장 오류:', error);
        res.status(500).json({ error: '데이터 저장 중 오류가 발생했습니다.' });
    }
});

// 스킬 데이터 API
app.get('/api/skills', (req, res) => {
    try {
        const dataPath = process.env.NODE_ENV === 'production' 
            ? '/tmp/data/skills.json' 
            : path.join(__dirname, 'data', 'skills.json');
        
        if (fs.existsSync(dataPath)) {
            const data = fs.readFileSync(dataPath, 'utf8');
            res.json(JSON.parse(data));
        } else {
            // 기본 스킬 데이터 제공
            const defaultSkills = [
                { name: "JavaScript", color: "blue" },
                { name: "React", color: "blue" },
                { name: "Node.js", color: "green" },
                { name: "Python", color: "green" },
                { name: "TypeScript", color: "blue" },
                { name: "MongoDB", color: "green" },
                { name: "AWS", color: "yellow" },
                { name: "Docker", color: "blue" },
                { name: "Git", color: "purple" },
                { name: "Figma", color: "pink" }
            ];
            res.json(defaultSkills);
        }
    } catch (error) {
        console.error('스킬 데이터 로드 오류:', error);
        res.status(500).json({ error: '데이터 로드 중 오류가 발생했습니다.' });
    }
});

app.post('/api/skills', (req, res) => {
    try {
        const dataDir = process.env.NODE_ENV === 'production' ? '/tmp/data' : path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const dataPath = path.join(dataDir, 'skills.json');
        const skills = req.body;
        fs.writeFileSync(dataPath, JSON.stringify(skills, null, 2));
        
        res.json({ success: true });
    } catch (error) {
        console.error('스킬 데이터 저장 오류:', error);
        res.status(500).json({ error: '데이터 저장 중 오류가 발생했습니다.' });
    }
});

// 프로필 데이터 API
app.get('/api/profile', (req, res) => {
    try {
        const dataPath = process.env.NODE_ENV === 'production' 
            ? '/tmp/data/profile.json' 
            : path.join(__dirname, 'data', 'profile.json');
        
        if (fs.existsSync(dataPath)) {
            const data = fs.readFileSync(dataPath, 'utf8');
            res.json(JSON.parse(data));
        } else {
            // 기본 프로필 데이터 제공
            const defaultProfile = {
                name: "Jun",
                school: "서울대학교",
                major: "컴퓨터공학과",
                age: "25",
                phone: "+82-10-1234-5678",
                email: "jun@example.com",
                github: "https://github.com/jun040722"
            };
            res.json(defaultProfile);
        }
    } catch (error) {
        console.error('프로필 데이터 로드 오류:', error);
        res.status(500).json({ error: '데이터 로드 중 오류가 발생했습니다.' });
    }
});

app.post('/api/profile', (req, res) => {
    try {
        const dataDir = process.env.NODE_ENV === 'production' ? '/tmp/data' : path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const dataPath = path.join(dataDir, 'profile.json');
        const profile = req.body;
        fs.writeFileSync(dataPath, JSON.stringify(profile, null, 2));
        
        res.json({ success: true });
    } catch (error) {
        console.error('프로필 데이터 저장 오류:', error);
        res.status(500).json({ error: '데이터 저장 중 오류가 발생했습니다.' });
    }
});

// 에러 핸들링
app.use((error, req, res, next) => {
    console.error('서버 오류:', error);
    res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
});

// Vercel 서버리스 환경을 위한 export
module.exports = app; 