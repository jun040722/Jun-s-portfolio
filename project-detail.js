// 전역 변수
let currentProject = null;
let projects = [];
let currentProjectMedia = [];

// DOM 요소들
const elements = {
    projectTitle: document.getElementById('projectTitle'),
    projectPeriod: document.getElementById('projectPeriod'),
    projectType: document.getElementById('projectType'),
    projectDescription: document.getElementById('projectDescription'),
    projectImage: document.getElementById('projectImage'),
    projectTechStack: document.getElementById('projectTechStack'),
    projectFeatures: document.getElementById('projectFeatures'),
    projectLinks: document.getElementById('projectLinks'),
    editProjectBtn: document.getElementById('editProjectBtn'),
    deleteProjectBtn: document.getElementById('deleteProjectBtn'),
    projectModal: document.getElementById('projectModal'),
    projectForm: document.getElementById('projectForm'),
    darkModeToggle: document.getElementById('darkModeToggle')
};

// 초기화 함수
function init() {
    loadData();
    setupEventListeners();
    loadProjectDetail();
    setupDarkMode();
}

// 데이터 로드
function loadData() {
    const savedProjects = localStorage.getItem('portfolio_projects');
    projects = savedProjects ? JSON.parse(savedProjects) : [];
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 다크모드 토글
    elements.darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // 프로젝트 편집
    elements.editProjectBtn.addEventListener('click', openProjectModal);
    elements.projectForm.addEventListener('submit', handleProjectSubmit);
    document.getElementById('closeProjectModal').addEventListener('click', closeProjectModal);
    
    // 프로젝트 삭제
    elements.deleteProjectBtn.addEventListener('click', deleteProject);
    
    // 파일 업로드 관련
    setupFileUpload();
    
    // 모달 외부 클릭으로 닫기
    elements.projectModal.addEventListener('click', (e) => {
        if (e.target === elements.projectModal) {
            closeProjectModal();
        }
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

// URL에서 프로젝트 ID 가져오기
function getProjectIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// 프로젝트 상세 정보 로드
function loadProjectDetail() {
    const projectId = getProjectIdFromUrl();
    if (!projectId) {
        showError('프로젝트 ID가 없습니다.');
        return;
    }
    
    currentProject = projects.find(p => p.id == projectId);
    if (!currentProject) {
        showError('프로젝트를 찾을 수 없습니다.');
        return;
    }
    
    renderProjectDetail();
}

// 프로젝트 상세 정보 렌더링
function renderProjectDetail() {
    if (!currentProject) return;
    
    // 기본 정보
    elements.projectTitle.textContent = currentProject.name;
    elements.projectPeriod.textContent = currentProject.period;
    elements.projectType.textContent = getTypeLabel(currentProject.type);
    elements.projectType.className = `px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeClass(currentProject.type)}`;
    elements.projectDescription.textContent = currentProject.description || '프로젝트 설명이 없습니다.';
    
    // 이미지
    if (currentProject.thumbnail) {
        elements.projectImage.innerHTML = `<img src="${currentProject.thumbnail}" alt="${currentProject.name}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500\\'><svg class=\\'w-16 h-16\\' fill=\\'none\\' stroke=\\'currentColor\\' viewBox=\\'0 0 24 24\\'><path stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'2\\' d=\\'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z\\'></path></svg></div>'">`;
    }
    
    // 기술 스택
    renderTechStack();
    
    // 주요 기능
    renderFeatures();
    
    // 미디어 갤러리
    renderMediaGallery();
    
    // 프로젝트 링크
    renderLinks();
}

// 기술 스택 렌더링
function renderTechStack() {
    const techStack = currentProject.techStack || [];
    if (techStack.length === 0) {
        elements.projectTechStack.innerHTML = '<p class="text-gray-500 dark:text-gray-400">기술 스택 정보가 없습니다.</p>';
        return;
    }
    
    elements.projectTechStack.innerHTML = techStack.map(tech => 
        `<span class="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">${tech}</span>`
    ).join('');
}

// 주요 기능 렌더링
function renderFeatures() {
    const features = currentProject.features || [];
    if (features.length === 0) {
        elements.projectFeatures.innerHTML = '<p class="text-gray-500 dark:text-gray-400">주요 기능 정보가 없습니다.</p>';
        return;
    }
    
    elements.projectFeatures.innerHTML = features.map(feature => 
        `<li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>${feature}</span>
        </li>`
    ).join('');
}

// 미디어 갤러리 렌더링
function renderMediaGallery() {
    const mediaGallery = document.getElementById('projectMediaGallery');
    const noMediaMessage = document.getElementById('noMediaMessage');
    
    if (!mediaGallery || !noMediaMessage) return;
    
    const media = currentProject.media || [];
    
    if (media.length === 0) {
        mediaGallery.style.display = 'none';
        noMediaMessage.style.display = 'block';
        return;
    }
    
    mediaGallery.style.display = 'grid';
    noMediaMessage.style.display = 'none';
    
    mediaGallery.innerHTML = media.map((item, index) => {
        const isVideo = item.type.startsWith('video/');
        const isImage = item.type.startsWith('image/');
        
        return `
            <div class="group cursor-pointer" onclick="openMediaModal(${index})">
                <div class="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    ${isImage ? 
                        `<img src="${item.data}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">` :
                        `<video src="${item.data}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" muted></video>`
                    }
                    ${isVideo ? `
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="bg-black bg-opacity-50 rounded-full p-3">
                                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                        </div>
                    ` : ''}
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 truncate">${item.name}</p>
            </div>
        `;
    }).join('');
}

// 미디어 모달 열기
function openMediaModal(index) {
    const media = currentProject.media[index];
    if (!media) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    modal.onclick = () => modal.remove();
    
    const isVideo = media.type.startsWith('video/');
    const isImage = media.type.startsWith('image/');
    
    const content = document.createElement('div');
    content.className = 'max-w-4xl max-h-full p-4';
    content.onclick = (e) => e.stopPropagation();
    
    if (isImage) {
        content.innerHTML = `
            <img src="${media.data}" alt="${media.name}" class="max-w-full max-h-full object-contain">
        `;
    } else if (isVideo) {
        content.innerHTML = `
            <video src="${media.data}" controls class="max-w-full max-h-full">
                Your browser does not support the video tag.
            </video>
        `;
    }
    
    modal.appendChild(content);
    document.body.appendChild(modal);
}

// 프로젝트 링크 렌더링
function renderLinks() {
    const link = currentProject.link;
    if (!link) {
        elements.projectLinks.innerHTML = '<p class="text-gray-500 dark:text-gray-400">프로젝트 링크가 없습니다.</p>';
        return;
    }
    
    elements.projectLinks.innerHTML = `
        <a href="${link}" target="_blank" rel="noopener noreferrer" 
           class="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            프로젝트 보기
        </a>
    `;
}

// 프로젝트 편집 모달 열기
function openProjectModal() {
    if (!currentProject) return;
    
    // 미디어 데이터 초기화
    currentProjectMedia = [];
    
    document.getElementById('editProjectName').value = currentProject.name;
    document.getElementById('editProjectPeriod').value = currentProject.period;
    document.getElementById('editProjectType').value = currentProject.type;
    document.getElementById('editProjectThumbnail').value = currentProject.thumbnail || '';
    document.getElementById('editProjectDescription').value = currentProject.description;
    document.getElementById('editProjectTechStack').value = (currentProject.techStack || []).join(', ');
    document.getElementById('editProjectFeatures').value = (currentProject.features || []).join('\n');
    document.getElementById('editProjectLink').value = currentProject.link || '';
    
    // 기존 미디어 데이터 로드
    if (currentProject.media) {
        currentProjectMedia = [...currentProject.media];
        renderMediaPreview();
    }
    
    elements.projectModal.classList.remove('hidden');
}

// 프로젝트 편집 모달 닫기
function closeProjectModal() {
    elements.projectModal.classList.add('hidden');
}

// 프로젝트 편집 제출
function handleProjectSubmit(e) {
    e.preventDefault();
    
    if (!currentProject) return;
    
    const projectData = {
        name: document.getElementById('editProjectName').value,
        period: document.getElementById('editProjectPeriod').value,
        type: document.getElementById('editProjectType').value,
        thumbnail: document.getElementById('editProjectThumbnail').value,
        description: document.getElementById('editProjectDescription').value,
        techStack: document.getElementById('editProjectTechStack').value.split(',').map(s => s.trim()).filter(s => s),
        features: document.getElementById('editProjectFeatures').value.split('\n').map(s => s.trim()).filter(s => s),
        link: document.getElementById('editProjectLink').value,
        media: [...currentProjectMedia]
    };
    
    // 프로젝트 업데이트
    const projectIndex = projects.findIndex(p => p.id === currentProject.id);
    if (projectIndex !== -1) {
        projects[projectIndex] = {
            ...projects[projectIndex],
            ...projectData
        };
        currentProject = projects[projectIndex];
        
        // 로컬 스토리지에 저장
        localStorage.setItem('portfolio_projects', JSON.stringify(projects));
        
        // 화면 업데이트
        renderProjectDetail();
        closeProjectModal();
        
        showSuccess('프로젝트가 성공적으로 업데이트되었습니다.');
    }
}

// 프로젝트 삭제
function deleteProject() {
    if (!currentProject) return;
    
    if (confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
        projects = projects.filter(p => p.id !== currentProject.id);
        localStorage.setItem('portfolio_projects', JSON.stringify(projects));
        
        showSuccess('프로젝트가 삭제되었습니다.');
        
        // 메인 페이지로 리다이렉트
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// 유틸리티 함수들
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

// 알림 함수들
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    // 간단한 알림 표시
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 파일 업로드 설정
function setupFileUpload() {
    const mediaUploadArea = document.getElementById('mediaUploadAreaDetail');
    const projectMedia = document.getElementById('projectMediaDetail');
    
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
    const mediaPreview = document.getElementById('mediaPreviewDetail');
    if (!mediaPreview) return;
    
    mediaPreview.innerHTML = currentProjectMedia.map((media, index) => {
        const isVideo = media.type.startsWith('video/');
        const isImage = media.type.startsWith('image/');
        
        return `
            <div class="relative group">
                <div class="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    ${isImage ? 
                        `<img src="${media.data}" alt="${media.name}" class="w-full h-full object-cover">` :
                        `<video src="${media.data}" class="w-full h-full object-cover" controls></video>`
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

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init); 