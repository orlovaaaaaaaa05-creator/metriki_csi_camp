// Оставляем массив пустым, чтобы текст не выводился
const ratings = ['', '', '', '', '']; 

const TOTAL_MEMES = 13; // Укажи своё количество мемов
const MEME_EXTENSION = 'jpg'; 

function initTimeline() {
    const container = document.getElementById('timelinePoints');
    container.innerHTML = '';
    ratings.forEach((rating, index) => {
        const point = document.createElement('label');
        point.className = 'timeline-point';
        point.innerHTML = `
            <input type="radio" name="rating" value="${index + 1}" onchange="updateTimelineProgress(${index + 1})">
            <div class="point-circle">${index + 1}</div>
            <!-- Убрали вывод текста, теперь здесь пусто -->
        `;
        container.appendChild(point);
    });
}

function updateTimelineProgress(value) {
    const percentage = ((value - 1) / 4) * 100;
    document.getElementById('timelineProgress').style.width = percentage + '%';
}

function loadRandomMeme() {
    const randomNum = Math.floor(Math.random() * TOTAL_MEMES) + 1;
    const memePath = `images/meme${randomNum}.${MEME_EXTENSION}`;
    const img = document.getElementById('dailyMeme');
    img.src = memePath;
    img.onerror = () => {
        img.parentElement.innerHTML = '<div style="padding:40px;font-size:3em;"></div>';
    };
}

document.getElementById('npsForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const selectedRating = document.querySelector('input[name="rating"]:checked');
    const name = document.getElementById('childName').value.trim();
    const city = document.getElementById('city').value;
    const comment = document.getElementById('comment').value.trim();

    if (!name) { alert('Введи имя!'); return; }
    if (!city) { alert('Выбери город!'); return; }
    if (!selectedRating) { alert('Выбери оценку на шкале!'); return; }

    const formData = {
        name: name,
        city: city,
        rating: selectedRating.value,
        comment: comment,
        timestamp: new Date().toISOString()
    };

    try {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('submitBtn').style.display = 'none';
        
        await sendToGoogleSheets(formData);
        
        document.getElementById('mainFormSection').style.display = 'none';
        document.getElementById('successSection').style.display = 'block';
        loadRandomMeme();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Ошибка отправки! Попробуй ещё раз.');
        document.getElementById('loading').style.display = 'none';
        document.getElementById('submitBtn').style.display = 'block';
    }
});

async function sendToGoogleSheets(data) {
    // Твой URL скрипта
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxBEOtOESMAaH2k_MTuJ-gDE3I-UcT2jJDx3LhxkWvRWgB6JtrkkKqw3E4gd5NKYzxJxw/exec';
    await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: JSON.stringify(data), mode: 'no-cors' });
}

initTimeline();