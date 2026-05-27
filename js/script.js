const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type') || 'soft';

const config = {
    soft: {
        subtitle: 'Оцени урок по Soft Skills',
        question: 'ОЦЕНИ УРОК ПО SOFT SKILLS',
        primary: '#FF5A0A', accent: '#826CFF',
        scale: 5, start: 1,
        labels: { 1: 'Отвратительно', 2: 'Плохо', 3: 'Норм', 4: 'Хорошо', 5: 'Отлично' }
    },
    hard: {
        subtitle: 'Оцени хардовый урок',
        question: 'ОЦЕНИ ХАРДОВЫЙ УРОК',
        primary: '#22E07A', accent: '#0063AF',
        scale: 5, start: 1,
        labels: { 1: 'Отвратительно', 2: 'Плохо', 3: 'Норм', 4: 'Хорошо', 5: 'Отлично' }
    },
    creative: {
        subtitle: 'Оцени творческий урок',
        question: 'ОЦЕНИ ТВОРЧЕСКИЙ УРОК',
        primary: '#FFD700', accent: '#FF5A0A',
        scale: 5, start: 1,
        labels: { 1: 'Отвратительно', 2: 'Плохо', 3: 'Норм', 4: 'Хорошо', 5: 'Отлично' }
    },
    nps: {
        // ✅ Поменяли местами!
        subtitle: 'Порекомендуешь ли ты нас?', // Короткий в шапку
        question: 'ГОТОВ ЛИ ТЫ РЕКОМЕНДОВАТЬ SKYCAMP ДРУЗЬЯМ? 1 - ВООБЩЕ НЕ ГОТОВ, 10 - ТОЧНО ГОТОВ!', // Длинный в карточку
        primary: '#826CFF', accent: '#000000',
        scale: 10, start: 0,
        labels: null
    }
};

const cfg = config[type] || config.soft;

if (type === 'nps') document.body.classList.add('nps-mode');

document.title = `SkyCamp - ${cfg.subtitle}`;
document.getElementById('subtitle').textContent = cfg.subtitle;
document.getElementById('questionText').textContent = cfg.question;
document.documentElement.style.setProperty('--primary', cfg.primary);
document.documentElement.style.setProperty('--accent', cfg.accent);

const container = document.getElementById('ratingButtons');
for (let i = cfg.start; i <= cfg.scale; i++) {
    const label = document.createElement('label');
    label.className = 'rating-btn';
    
    let circleStyle = '';
    if (type === 'nps') {
        if (i >= 9) circleStyle = 'background:#22E07A;color:#fff;';
        else if (i <= 6) circleStyle = 'background:#FF5A0A;color:#fff;';
    }
    
    const textLabel = cfg.labels ? `<div class="label">${cfg.labels[i]}</div>` : '';
    
    label.innerHTML = `
        <input type="radio" name="rating" value="${i}" onchange="updateProgress(${i})">
        <div class="circle" style="${circleStyle}">${i}</div>
        ${textLabel}
    `;
    container.appendChild(label);
}

function updateProgress(val) {
    document.getElementById('progressBar').style.width = `${(val / cfg.scale) * 100}%`;
}

document.getElementById('surveyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const city = document.getElementById('city').value;
    const rating = document.querySelector('input[name="rating"]:checked');
    const comment = document.getElementById('comment').value.trim();
    
    if (!name || !city || !rating) {
        alert('Пожалуйста, заполни имя, город и выбери оценку!');
        return;
    }
    
    document.getElementById('loader').style.display = 'block';
    document.getElementById('submitBtn').style.display = 'none';
    
    try {
        await fetch('https://script.google.com/macros/s/AKfycbz330iryrjLFtcDt7QtB9ncGtBpvdXS3WYMsUPEZwPnSHVJuU4jd9iOxBGSG4UvnTU14g/exec', {
            method: 'POST', mode: 'no-cors',
            body: JSON.stringify({ name, city, rating: rating.value, comment, type })
        });
        
        document.getElementById('formCard').style.display = 'none';
        document.getElementById('successCard').style.display = 'block';
        const r = Math.floor(Math.random() * 13) + 1;
        document.getElementById('memeImg').src = `images/meme${r}.jpg`;
        
    } catch (err) {
        alert('Ошибка отправки. Проверь интернет.');
        document.getElementById('loader').style.display = 'none';
        document.getElementById('submitBtn').style.display = 'block';
    }
});
