// 전역 변수
let projects = [];
let skills = [];
let editingProjectIndex = -1;
let currentProjectMedia = [];

// 초기 데이터
const initialProjects = [
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

const initialSkills = [
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

// DOM 요소들
const elements = {
    // 프로필 관련
    profileName: document.getElementById('profileName'),
    profileSchool: document.getElementById('profileSchool'),
    profileMajor: document.getElementById('profileMajor'),
    profileAge: document.getElementById('profileAge'),
    profilePhone: document.getElementById('profilePhone'),
    profileEmail: document.getElementById('profileEmail'),
    profileGithub: document.getElementById('profileGithub'),
    profileInitials: document.getElementById('profileInitials'),
    
    // 프로젝트 관련
    projectsGrid: document.getElementById('projectsGrid'),
    projectSort: document.getElementById('projectSort'),
    projectFilter: document.getElementById('projectFilter'),
    
    // 스킬 관련
    skillsGrid: document.getElementById('skillsGrid'),
    
    // 모달 관련
    profileModal: document.getElementById('profileModal'),
    projectModal: document.getElementById('projectModal'),
    skillModal: document.getElementById('skillModal'),
    
    // 버튼들
    darkModeToggle: document.getElementById('darkModeToggle'),
    editProfileBtn: document.getElementById('editProfileBtn'),
    addProjectBtn: document.getElementById('addProjectBtn'),
    addSkillBtn: document.getElementById('addSkillBtn'),
    
    // 폼 관련
    profileForm: document.getElementById('profileForm'),
    projectForm: document.getElementById('projectForm'),
    skillForm: document.getElementById('skillForm')
};

// 초기화 함수
async function init() {
    await loadData();
    setupEventListeners();
    renderProjects();
    renderSkills();
    setupDarkMode();
}

// 데이터 로드
async function loadData() {
    try {
        // 백엔드에서 데이터 로드
        const [projectsResponse, skillsResponse, profileResponse] = await Promise.allSettled([
            fetch('/api/projects'),
            fetch('/api/skills'),
            fetch('/api/profile')
        ]);
        
        if (projectsResponse.status === 'fulfilled' && projectsResponse.value.ok) {
            const projectsData = await projectsResponse.value.json();
            projects = projectsData.length > 0 ? projectsData : initialProjects;
        } else {
            // 백엔드 실패 시 로컬 스토리지 사용
            const savedProjects = localStorage.getItem('portfolio_projects');
            projects = savedProjects ? JSON.parse(savedProjects) : initialProjects;
        }
        
        if (skillsResponse.status === 'fulfilled' && skillsResponse.value.ok) {
            const skillsData = await skillsResponse.value.json();
            skills = skillsData.length > 0 ? skillsData : initialSkills;
        } else {
            // 백엔드 실패 시 로컬 스토리지 사용
            const savedSkills = localStorage.getItem('portfolio_skills');
            skills = savedSkills ? JSON.parse(savedSkills) : initialSkills;
        }
        
        if (profileResponse.status === 'fulfilled' && profileResponse.value.ok) {
            const profileData = await profileResponse.value.json();
            if (Object.keys(profileData).length > 0) {
                updateProfileDisplay(profileData);
            }
        } else {
            // 백엔드 실패 시 로컬 스토리지 사용
            const savedProfile = localStorage.getItem('portfolio_profile');
            if (savedProfile) {
                const profile = JSON.parse(savedProfile);
                updateProfileDisplay(profile);
            }
        }
    } catch (error) {
        console.error('데이터 로드 오류:', error);
        // 모든 백엔드 요청 실패 시 로컬 스토리지 사용
        const savedProjects = localStorage.getItem('portfolio_projects');
        const savedSkills = localStorage.getItem('portfolio_skills');
        const savedProfile = localStorage.getItem('portfolio_profile');
        
        projects = savedProjects ? JSON.parse(savedProjects) : initialProjects;
        skills = savedSkills ? JSON.parse(savedSkills) : initialSkills;
        
        if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            updateProfileDisplay(profile);
        }
    }
}

// 데이터 저장
async function saveData() {
    try {
        // 백엔드에 저장
        await fetch('/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projects)
        });
        
        await fetch('/api/skills', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(skills)
        });
        
        // 로컬 스토리지에도 백업
        localStorage.setItem('portfolio_projects', JSON.stringify(projects));
        localStorage.setItem('portfolio_skills', JSON.stringify(skills));
    } catch (error) {
        console.error('데이터 저장 오류:', error);
        // 백엔드 실패 시 로컬 스토리지만 사용
        localStorage.setItem('portfolio_projects', JSON.stringify(projects));
        localStorage.setItem('portfolio_skills', JSON.stringify(skills));
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 다크모드 토글
    elements.darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // 프로필 편집
    elements.editProfileBtn.addEventListener('click', openProfileModal);
    elements.profileForm.addEventListener('submit', handleProfileSubmit);
    document.getElementById('closeProfileModal').addEventListener('click', closeProfileModal);
    
    // 프로젝트 관련
    elements.addProjectBtn.addEventListener('click', openProjectModal);
    elements.projectForm.addEventListener('submit', handleProjectSubmit);
    document.getElementById('closeProjectModal').addEventListener('click', closeProjectModal);
    elements.projectSort.addEventListener('change', renderProjects);
    elements.projectFilter.addEventListener('change', renderProjects);
    
    // 스킬 관련
    elements.addSkillBtn.addEventListener('click', openSkillModal);
    elements.skillForm.addEventListener('submit', handleSkillSubmit);
    document.getElementById('closeSkillModal').addEventListener('click', closeSkillModal);
    
    // 파일 업로드 관련
    setupFileUpload();
    
    // 모달 외부 클릭으로 닫기
    [elements.profileModal, elements.projectModal, elements.skillModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
}

// 다크모드 설정
function setupDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.documentElement.classList.add('dark');
    }
}

function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', isDark);
}

// 프로필 관련 함수들
function openProfileModal() {
    const profile = {
        name: elements.profileName.textContent,
        school: elements.profileSchool.textContent,
        major: elements.profileMajor.textContent,
        age: elements.profileAge.textContent.replace('세', ''),
        phone: elements.profilePhone.textContent,
        email: elements.profileEmail.textContent,
        github: elements.profileGithub.href
    };
    
    document.getElementById('editName').value = profile.name;
    document.getElementById('editSchool').value = profile.school;
    document.getElementById('editMajor').value = profile.major;
    document.getElementById('editAge').value = profile.age;
    document.getElementById('editPhone').value = profile.phone;
    document.getElementById('editEmail').value = profile.email;
    document.getElementById('editGithub').value = profile.github;
    
    elements.profileModal.classList.remove('hidden');
}

function closeProfileModal() {
    elements.profileModal.classList.add('hidden');
}

async function handleProfileSubmit(e) {
    e.preventDefault();
    
    const profile = {
        name: document.getElementById('editName').value,
        school: document.getElementById('editSchool').value,
        major: document.getElementById('editMajor').value,
        age: document.getElementById('editAge').value,
        phone: document.getElementById('editPhone').value,
        email: document.getElementById('editEmail').value,
        github: document.getElementById('editGithub').value
    };
    
    try {
        // 백엔드에 저장
        await fetch('/api/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile)
        });
        
        // 로컬 스토리지에도 백업
        localStorage.setItem('portfolio_profile', JSON.stringify(profile));
    } catch (error) {
        console.error('프로필 저장 오류:', error);
        // 백엔드 실패 시 로컬 스토리지만 사용
        localStorage.setItem('portfolio_profile', JSON.stringify(profile));
    }
    
    updateProfileDisplay(profile);
    closeProfileModal();
}

function updateProfileDisplay(profile) {
    elements.profileName.textContent = profile.name;
    elements.profileSchool.textContent = profile.school;
    elements.profileMajor.textContent = profile.major;
    elements.profileAge.textContent = `${profile.age}세`;
    elements.profilePhone.textContent = profile.phone;
    elements.profileEmail.textContent = profile.email;
    elements.profileGithub.href = profile.github;
    elements.profileGithub.textContent = 'GitHub';
    
    // 이니셜 업데이트
    const initials = profile.name.split(' ').map(n => n[0]).join('').substring(0, 2);
    elements.profileInitials.textContent = initials;
}

// 프로젝트 관련 함수들
function openProjectModal(projectIndex = -1) {
    editingProjectIndex = projectIndex;
    const modalTitle = document.getElementById('projectModalTitle');
    
    // 미디어 데이터 초기화
    currentProjectMedia = [];
    
    if (projectIndex >= 0) {
        const project = projects[projectIndex];
        modalTitle.textContent = '프로젝트 편집';
        
        document.getElementById('editProjectName').value = project.name;
        document.getElementById('editProjectPeriod').value = project.period;
        document.getElementById('editProjectType').value = project.type;
        document.getElementById('editProjectThumbnail').value = project.thumbnail || '';
        document.getElementById('editProjectDescription').value = project.description;
        document.getElementById('editProjectTechStack').value = (project.techStack || []).join(', ');
        document.getElementById('editProjectFeatures').value = (project.features || []).join('\n');
        document.getElementById('editProjectLink').value = project.link || '';
        
        // 기존 미디어 데이터 로드
        if (project.media) {
            currentProjectMedia = [...project.media];
            renderMediaPreview();
        }
    } else {
        modalTitle.textContent = '프로젝트 추가';
        
        document.getElementById('editProjectName').value = '';
        document.getElementById('editProjectPeriod').value = '';
        document.getElementById('editProjectType').value = 'web';
        document.getElementById('editProjectThumbnail').value = '';
        document.getElementById('editProjectDescription').value = '';
        document.getElementById('editProjectTechStack').value = '';
        document.getElementById('editProjectFeatures').value = '';
        document.getElementById('editProjectLink').value = '';
        
        // 미디어 프리뷰 초기화
        const mediaPreview = document.getElementById('mediaPreview');
        if (mediaPreview) {
            mediaPreview.innerHTML = '';
        }
    }
    
    elements.projectModal.classList.remove('hidden');
}

function closeProjectModal() {
    elements.projectModal.classList.add('hidden');
    editingProjectIndex = -1;
}

function handleProjectSubmit(e) {
    e.preventDefault();
    
    const projectData = {
        name: document.getElementById('editProjectName').value,
        period: document.getElementById('editProjectPeriod').value,
        type: document.getElementById('editProjectType').value,
        thumbnail: document.getElementById('editProjectThumbnail').value,
        description: document.getElementById('editProjectDescription').value,
        techStack: document.getElementById('editProjectTechStack') ? 
            document.getElementById('editProjectTechStack').value.split(',').map(s => s.trim()).filter(s => s) : [],
        features: document.getElementById('editProjectFeatures') ? 
            document.getElementById('editProjectFeatures').value.split('\n').map(s => s.trim()).filter(s => s) : [],
        link: document.getElementById('editProjectLink') ? 
            document.getElementById('editProjectLink').value : '',
        media: [...currentProjectMedia]
    };
    
    if (editingProjectIndex >= 0) {
        // 편집 모드
        projects[editingProjectIndex] = {
            ...projects[editingProjectIndex],
            ...projectData
        };
    } else {
        // 추가 모드
        const newProject = {
            id: Date.now(),
            ...projectData
        };
        projects.unshift(newProject);
    }
    
    saveData();
    renderProjects();
    closeProjectModal();
}

function deleteProject(projectId) {
    if (confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
        projects = projects.filter(p => p.id !== projectId);
        saveData();
        renderProjects();
    }
}

function renderProjects() {
    const sortType = elements.projectSort.value;
    const filterType = elements.projectFilter.value;
    
    let filteredProjects = projects;
    
    // 필터링
    if (filterType !== 'all') {
        filteredProjects = projects.filter(p => p.type === filterType);
    }
    
    // 정렬
    switch (sortType) {
        case 'recent':
            filteredProjects.sort((a, b) => new Date(b.period.split(' - ')[0]) - new Date(a.period.split(' - ')[0]));
            break;
        case 'oldest':
            filteredProjects.sort((a, b) => new Date(a.period.split(' - ')[0]) - new Date(b.period.split(' - ')[0]));
            break;
        case 'name':
            filteredProjects.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    elements.projectsGrid.innerHTML = filteredProjects.map((project, index) => `
        <div class="project-card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300" onclick="openProjectDetail(${project.id})">
            <div class="relative h-48 bg-gray-200 dark:bg-gray-700">
                ${project.thumbnail ? 
                    `<img src="${project.thumbnail}" alt="${project.name}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500\\'><svg class=\\'w-16 h-16\\' fill=\\'none\\' stroke=\\'currentColor\\' viewBox=\\'0 0 24 24\\'><path stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'2\\' d=\\'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z\\'></path></svg></div>'">` :
                    `<div class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>`
                }
                <div class="absolute top-2 right-2 flex gap-1" onclick="event.stopPropagation()">
                    <button onclick="openProjectModal(${filteredProjects.findIndex(p => p.id === project.id)})" class="p-1 bg-white dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button onclick="deleteProject(${project.id})" class="p-1 bg-white dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
                <!-- 상세보기 버튼 -->
                <div class="absolute bottom-2 right-2">
                    <span class="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded-full">
                        상세보기 →
                    </span>
                </div>
            </div>
            <div class="p-6">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">${project.name}</h3>
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeClass(project.type)}">${getTypeLabel(project.type)}</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">${project.period}</p>
            </div>
        </div>
    `).join('');
}

function getTypeBadgeClass(type) {
    const classes = {
        web: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        mobile: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        ai: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    return classes[type] || classes.other;
}

function getTypeLabel(type) {
    const labels = {
        web: '웹 개발',
        mobile: '모바일 앱',
        ai: 'AI/ML',
        other: '기타'
    };
    return labels[type] || '기타';
}

// 스킬 관련 함수들
function openSkillModal() {
    document.getElementById('editSkillName').value = '';
    document.getElementById('editSkillColor').value = 'blue';
    elements.skillModal.classList.remove('hidden');
}

function closeSkillModal() {
    elements.skillModal.classList.add('hidden');
}

function handleSkillSubmit(e) {
    e.preventDefault();
    
    const skillName = document.getElementById('editSkillName').value.trim();
    const skillColor = document.getElementById('editSkillColor').value;
    
    if (skillName) {
        const newSkill = { name: skillName, color: skillColor };
        skills.push(newSkill);
        saveData();
        renderSkills();
        closeSkillModal();
    }
}

function deleteSkill(skillIndex) {
    if (confirm('정말로 이 스킬을 삭제하시겠습니까?')) {
        skills.splice(skillIndex, 1);
        saveData();
        renderSkills();
    }
}

function renderSkills() {
    elements.skillsGrid.innerHTML = skills.map((skill, index) => `
        <div class="skill-tag skill-${skill.color} px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <span>${skill.name}</span>
            <button onclick="deleteSkill(${index})" class="text-current hover:opacity-70 transition-opacity">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

// 파일 업로드 설정
function setupFileUpload() {
    const mediaUploadArea = document.getElementById('mediaUploadArea');
    const projectMedia = document.getElementById('projectMedia');
    const mediaPreview = document.getElementById('mediaPreview');
    
    if (mediaUploadArea && projectMedia) {
        // 클릭으로 파일 선택
        mediaUploadArea.addEventListener('click', () => {
            projectMedia.click();
        });
        
        // 드래그 앤 드롭
        mediaUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            mediaUploadArea.classList.add('border-primary-500', 'bg-primary-50', 'dark:bg-primary-900');
        });
        
        mediaUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            mediaUploadArea.classList.remove('border-primary-500', 'bg-primary-50', 'dark:bg-primary-900');
        });
        
        mediaUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            mediaUploadArea.classList.remove('border-primary-500', 'bg-primary-50', 'dark:bg-primary-900');
            const files = Array.from(e.dataTransfer.files);
            handleFileUpload(files);
        });
        
        // 파일 선택 시
        projectMedia.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            handleFileUpload(files);
        });
    }
}

// 파일 업로드 처리
function handleFileUpload(files) {
    const mediaPreview = document.getElementById('mediaPreview');
    const validFiles = files.filter(file => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
        return validTypes.includes(file.type);
    });
    
    validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const mediaData = {
                name: file.name,
                type: file.type,
                size: file.size,
                data: e.target.result
            };
            
            currentProjectMedia.push(mediaData);
            renderMediaPreview();
        };
        reader.readAsDataURL(file);
    });
}

// 미디어 프리뷰 렌더링
function renderMediaPreview() {
    const mediaPreview = document.getElementById('mediaPreview');
    if (!mediaPreview) return;
    
    mediaPreview.innerHTML = currentProjectMedia.map((media, index) => {
        const isVideo = media.type.startsWith('video/');
        const isImage = media.type.startsWith('image/');
        const mediaSrc = media.url || media.data; // 백엔드 URL 또는 로컬 데이터
        
        return `
            <div class="relative group">
                <div class="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    ${isImage ? 
                        `<img src="${mediaSrc}" alt="${media.name}" class="w-full h-full object-cover">` :
                        `<video src="${mediaSrc}" class="w-full h-full object-cover" controls preload="metadata"></video>`
                    }
                </div>
                <button onclick="removeMedia(${index})" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    ×
                </button>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">${media.name}</p>
            </div>
        `;
    }).join('');
}

// 미디어 제거
function removeMedia(index) {
    currentProjectMedia.splice(index, 1);
    renderMediaPreview();
}

// 프로젝트 상세 페이지로 이동
function openProjectDetail(projectId) {
    window.location.href = `project-detail.html?id=${projectId}`;
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init); 