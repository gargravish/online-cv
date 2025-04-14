document.addEventListener('DOMContentLoaded', () => {
    loadResumeData();
});

async function loadResumeData() {
    const loadingIndicator = document.getElementById('loading-indicator');
    const resumeContent = document.getElementById('resume-content');
    try {
        const response = await fetch('resume-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Hide loading, show content
        loadingIndicator.style.display = 'none';
        resumeContent.classList.remove('hidden');

        // Populate sections
        renderPersonalInfo(data.personalInfo);
        renderSummary(data.summary);
        renderSkills(data.skills);
        renderExperience(data.experience);
        renderContributions(data.contributions);
        renderEducation(data.education);
        renderCertifications(data.certifications);
        // renderAwards(data.awards); // Call if you add an awards section

        // Set footer year and name
        document.getElementById('footer-year').textContent = new Date().getFullYear();
        document.getElementById('footer-name').textContent = data.personalInfo.name;

        // Set page title
        document.title = `${data.personalInfo.name} - ${data.personalInfo.title}`;

    } catch (error) {
        console.error('Error loading resume data:', error);
        loadingIndicator.textContent = 'Error loading resume data. Please check the console.';
        loadingIndicator.style.color = 'red';
    }
}

function renderPersonalInfo(info) {
    const headerInfo = document.getElementById('header-info');
    const headerLinks = document.getElementById('header-links');

    headerInfo.innerHTML = `
        <h1 class="text-3xl font-bold">${info.name}</h1>
        <p class="text-xl text-blue-200">${info.title}</p>
    `;

    headerLinks.innerHTML = `
        ${info.email ? `<a href="mailto:${info.email}" title="Email" class="hover:text-blue-300"><i class="fas fa-envelope"></i></a>` : ''}
        ${info.phone ? `<a href="tel:${info.phone}" title="Phone" class="hover:text-blue-300"><i class="fas fa-phone"></i></a>` : ''}
        ${info.location ? `<span class="text-blue-300 hidden md:inline-block"><i class="fas fa-map-marker-alt mr-1"></i> ${info.location}</span>` : ''}
        ${info.linkedin ? `<a href="${info.linkedin}" target="_blank" title="LinkedIn" class="hover:text-blue-300"><i class="fab fa-linkedin"></i></a>` : ''}
        ${info.github ? `<a href="${info.github}" target="_blank" title="GitHub" class="hover:text-blue-300"><i class="fab fa-github"></i></a>` : ''}
        ${info.medium ? `<a href="${info.medium}" target="_blank" title="Medium Blog" class="hover:text-blue-300"><i class="fab fa-medium"></i></a>` : ''}
    `;
}

function renderSummary(summary) {
    document.getElementById('summary-text').innerHTML = summary; // Use innerHTML if summary contains tags like <strong>
}

function renderSkills(skills) {
    const grid = document.getElementById('skills-grid');
    grid.innerHTML = ''; // Clear existing
    skills.forEach(skillGroup => {
        const card = document.createElement('div');
        card.className = 'card';
        let itemsHTML = skillGroup.items.map(item => `<span class="tag">${item}</span>`).join(' ');
        card.innerHTML = `
            <h3 class="flex items-center"><i class="${skillGroup.icon || 'fas fa-star'} mr-2 text-blue-600"></i>${skillGroup.category}</h3>
            <p>${itemsHTML}</p>
        `;
        grid.appendChild(card);
    });
}

function renderExperience(experience) {
    const list = document.getElementById('experience-list');
    list.innerHTML = ''; // Clear existing
    experience.forEach(job => {
        const card = document.createElement('div');
        card.className = 'card';
        let responsibilitiesHTML = job.responsibilities.map(res => `<li>${res}</li>`).join('');
        card.innerHTML = `
            <h4>${job.title}</h4>
            <p class="font-semibold text-lg text-blue-700">${job.company}</p>
            <p class="date-location">${job.location ? `${job.location} | ` : ''}${job.dates}</p>
            <ul>${responsibilitiesHTML}</ul>
        `;
        list.appendChild(card);
    });
}

function renderContributions(contributions) {
    const grid = document.getElementById('contributions-grid');
    grid.innerHTML = ''; // Clear existing

    // Key Projects Card (formerly Open Source)
    if (contributions["Key Projects"] && contributions["Key Projects"].length > 0) {
        const osCard = document.createElement('div');
        osCard.className = 'card';
        let projectsHTML = contributions["Key Projects"].map(proj => `
            <li class="mb-3">
                <strong>${proj.name}:</strong> ${proj.description}
                ${proj.tags ? proj.tags.map(tag => `<span class="tag !bg-green-100 !text-green-800 ml-2">${tag}</span>`).join('') : ''}
                ${proj.link ? ` <a href="${proj.link}" target="_blank" class="text-blue-600 hover:underline">[Link]</a>` : ''}
            </li>
        `).join('');
        osCard.innerHTML = `
            <h3 class="flex items-center"><i class="fab fa-github mr-2 text-gray-800"></i>Key Projects</h3>
            <p class="mb-2">Explore projects at: <a href="${document.getElementById('header-links').querySelector('a[title=GitHub]').href}" target="_blank" class="text-blue-600 hover:underline font-semibold">github.com/gargravish</a></p>
            <ul class="list-none p-0">${projectsHTML}</ul>
        `;
        grid.appendChild(osCard);
    }

    // Blog Card
    if (contributions.blog) {
        const blogCard = document.createElement('div');
        blogCard.className = 'card';
        blogCard.innerHTML = `
            <h3 class="flex items-center"><i class="fab fa-medium mr-2 text-gray-800"></i>Technical Blog</h3>
             <p class="mb-2">Read articles at: <a href="${contributions.blog.url}" target="_blank" class="text-blue-600 hover:underline font-semibold">${contributions.blog.url.split('//')[1]}</a></p>
            <p>${contributions.blog.description}</p>
        `;
        grid.appendChild(blogCard);
    }

     // Speaking Card
    if (contributions.speaking && contributions.speaking.length > 0) {
        const speakCard = document.createElement('div');
        // Make it span potentially 2 columns if needed and space allows
        speakCard.className = 'card md:col-span-2';
        let speakingHTML = contributions.speaking.map(speak => `
            <li><strong>${speak.event}:</strong> ${speak.topic}</li>
        `).join('');
        speakCard.innerHTML = `
            <h3 class="flex items-center"><i class="fas fa-microphone-alt mr-2 text-blue-600"></i>Public Speaking</h3>
            <ul class="list-disc pl-5 mt-2">${speakingHTML}</ul>
        `;
        grid.appendChild(speakCard);
    }
}


function renderEducation(education) {
    const list = document.getElementById('education-list');
    list.innerHTML = ''; // Clear existing
    education.forEach(edu => {
        const card = document.createElement('div');
        card.className = 'card'; // Use card style for each entry
        card.innerHTML = `
            <h4 class="text-lg">${edu.degree}</h4>
            <p class="font-semibold">${edu.institution}</p>
            <p class="date-location">${edu.location ? `${edu.location} | ` : ''}${edu.year}</p>
        `;
        list.appendChild(card);
    });
}

function renderCertifications(certifications) {
    const list = document.getElementById('certifications-list');
    list.innerHTML = ''; // Clear existing
    certifications.forEach(cert => {
        const tag = document.createElement('span');
        tag.className = `tag ${cert.tagClass || ''}`; // Add base tag class and specific color class
        tag.textContent = `${cert.name}${cert.year ? ` (${cert.year})` : ''}`;
        list.appendChild(tag);
    });
}

// **** NEW CATEGORY RENDER FUNCTION EXAMPLE ****
/*
function renderAwards(awards) {
    const list = document.getElementById('awards-list');
    if (!list || !awards || awards.length === 0) {
        // If no awards data or element doesn't exist, hide the section
        const section = document.getElementById('awards');
        if(section) section.style.display = 'none';
        return;
     }
    list.innerHTML = ''; // Clear existing
    awards.forEach(award => {
        const item = document.createElement('div'); // Or maybe list items <li>
        item.className = 'card'; // Or just text-based
        item.innerHTML = `
            <h4 class="text-md font-semibold">${award.name}</h4>
            <p class="text-sm text-gray-600">${award.organization ? `${award.organization} | ` : ''}${award.year}</p>
            ${award.description ? `<p class="mt-1 text-gray-700">${award.description}</p>` : ''}
        `;
        list.appendChild(item);
    });
}
*/