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
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
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
            res.json([]);
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
            res.json([]);
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
            res.json({});
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