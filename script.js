// =============================================================
// Вставьте сюда ваш массив playlist с правильными URL GitHub Pages
// Пример:
const playlist = [
    { title: "Niall Horan - If You Leave Me", src: "https://if-i-could-flyy.github.io/RadioTG/niall-horan-if-you-leave-me.mp3" },
    { title: "Niall Horan - Arms Of A Stranger", src: "https://if-i-could-flyy.github.io/RadioTG/muzlome_Niall_Horan_-_Arms_Of_A_Stranger.mp3" },
    { title: "Niall Horan - Finally Free", src: "https://if-i-could-flyy.github.io/RadioTG/muzlome_Niall_Horan_-_Finally_Free.mp3" },
    { title: "Niall Horan - Heartbreak Weather, src: "https://if-i-could-flyy.github.io/RadioTG/muzlome_Niall_Horan_-_Heartbreak_Weather.mp3" },
    { title: "Louis Tomlinson - Angels Fly", src: "https://if-i-could-flyy.github.io/RadioTG/Angels%20Fly.mp3" }, // Убедитесь в правильности имени файла
    // Добавьте другие ваши треки сюда
];
// =============================================================


// Получаем ссылки на все нужные HTML элементы
const audio = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('play-pause-btn');
const nextBtn = document.getElementById('next-btn');
const volumeSlider = document.getElementById('volumeSlider');
const currentTrackElement = document.querySelector('.current-track');
const radioStatusElement = document.getElementById('radio-status');
const currentTrackIndexElement = document.getElementById('current-track-index');
const totalTracksElement = document.getElementById('total-tracks');
const playIcon = playPauseBtn.querySelector('.play-icon');
const pauseIcon = playPauseBtn.querySelector('.pause-icon');


// Переменная для отслеживания текущего индекса трека в плейлисте (начинаем с 0)
let currentTrackIndex = 0;

// --- Функции управления воспроизведением ---

// Функция для обновления отображаемой информации о треке и счетчика
function updateTrackInfo() {
    if (playlist.length > 0) {
        currentTrackElement.textContent = playlist[currentTrackIndex].title;
        currentTrackIndexElement.textContent = currentTrackIndex + 1; // +1 для пользователя (счетчик с 1)
        totalTracksElement.textContent = playlist.length;
    } else {
        currentTrackElement.textContent = 'Плейлист пуст';
        currentTrackIndexElement.textContent = '0';
        totalTracksElement.textContent = '0';
    }
}

// Функция для загрузки трека по индексу
function loadTrack(index) {
     if (index >= 0 && index < playlist.length) {
        currentTrackIndex = index;
        audio.src = playlist[currentTrackIndex].src;
        updateTrackInfo(); // Обновляем информацию сразу при загрузке
        radioStatusElement.textContent = 'Статус: Загрузка...';
        console.log("Попытка загрузить:", playlist[currentTrackIndex].title);
     } else {
         console.error("Ошибка: Недопустимый индекс трека:", index);
         radioStatusElement.textContent = 'Статус: Ошибка';
         // Можно сбросить индекс или остановить воспроизведение
         // currentTrackIndex = 0;
         // audio.src = ''; // Очистить источник
     }
}


// Функция для переключения между воспроизведением и паузой
function togglePlayPause() {
    if (audio.paused || audio.ended) {
        // Если на паузе или закончился, пытаемся воспроизвести
        audio.play()
             .then(() => {
                 console.log("Воспроизведение начато");
                 radioStatusElement.textContent = 'Статус: Воспроизводится';
                 playIcon.classList.add('hidden');
                 pauseIcon.classList.remove('hidden');
             })
             .catch(error => {
                 console.error("Ошибка при попытке play():", error);
                 radioStatusElement.textContent = 'Статус: Ошибка воспроизведения';
                 // Если play() не сработал (например, не было взаимодействия пользователя),
                 // возможно, нужно уведомить пользователя
             });
    } else {
        // Если воспроизводится, ставим на паузу
        audio.pause();
        console.log("Воспроизведение на паузе");
        radioStatusElement.textContent = 'Статус: Пауза';
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }
}

// Функция для перехода к следующему треку
function playNextTrack() {
    console.log("Переход к следующему треку...");
    currentTrackIndex++;
    if (currentTrackIndex >= playlist.length) {
        currentTrackIndex = 0; // Зацикливаем плейлист, переходим на первый трек
        console.log("Плейлист завершен, начинаем сначала.");
        // audio.pause(); // Если не нужно зацикливать, а просто остановить
        // radioStatusElement.textContent = 'Статус: Завершено';
        // playIcon.classList.remove('hidden');
        // pauseIcon.classList.add('hidden');
        // return; // Если не нужно зацикливать
    }
     // Загружаем и пытаемся воспроизвести следующий трек
     loadTrack(currentTrackIndex);
     // Важно: play() нужно вызвать после loadTrack, часто после события 'loadedmetadata'
     // Но для простоты и быстрого старта, попробуем вызвать сразу.
     // В более сложных случаях может потребоваться ждать событий готовности.
     audio.play().catch(error => {
          console.error("Не удалось автоматически воспроизвести следующий трек:", error);
          radioStatusElement.textContent = 'Статус: Требует взаимодействия';
          // Если автозапуск не сработал (правила браузеров), возможно, нужно
          // просто загрузить трек и ждать, пока пользователь нажмет "Плей"
          playIcon.classList.remove('hidden');
          pauseIcon.classList.add('hidden');
     });
}

// --- Обработчики событий для аудиоэлемента ---

// Событие при завершении воспроизведения текущего трека
audio.addEventListener('ended', playNextTrack);

// Событие при постановке на паузу (например, пользователь нажал паузу или вкладка стала неактивной)
audio.addEventListener('pause', () => {
    radioStatusElement.textContent = 'Статус: Пауза';
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
});

// Событие при начале воспроизведения
audio.addEventListener('play', () => {
    radioStatusElement.textContent = 'Статус: Воспроизводится';
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
});

// Событие при ошибке загрузки или воспроизведения
audio.addEventListener('error', (e) => {
    console.error("Ошибка аудио:", e);
    radioStatusElement.textContent = 'Статус: Ошибка загрузки трека';
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');

    // Можно автоматически попытаться перейти к следующему треку при ошибке
    // playNextTrack();
});

// Событие при начале загрузки метаданных (продолжительность, и т.д.)
audio.addEventListener('loadedmetadata', () => {
     console.log("Метаданные загружены для:", playlist[currentTrackIndex]?.title);
     // Статус можно обновить, но play() еще может не сработать до полной загрузки
     // radioStatusElement.textContent = 'Статус: Готов к воспроизведению';
});

// --- Обработчики событий для кнопок и ползунка ---

// Кнопка Плей/Пауза
playPauseBtn.addEventListener('click', togglePlayPause);

// Кнопка Следующий трек
nextBtn.addEventListener('click', playNextTrack);

// Ползунок громкости
volumeSlider.addEventListener('input', () => {
    // Значение ползунка (от 0 до 1) напрямую соответствует свойству volume аудиоэлемента
    audio.volume = volumeSlider.value;
    // console.log("Громкость установлена на:", audio.volume); // Для отладки
});


// --- Инициализация при загрузке страницы ---

// Устанавливаем начальную громкость аудиоэлемента
// Это также устанавливает громкость при первой загрузке страницы
audio.volume = volumeSlider.value;

// Отображаем общее количество треков
totalTracksElement.textContent = playlist.length;

// Загружаем первый трек при загрузке страницы
if (playlist.length > 0) {
    loadTrack(currentTrackIndex);

    // Опционально: Автоматически начать воспроизведение первого трека
    // audio.play().catch(error => {
    //     console.log("Автозапуск заблокирован:", error);
    //     radioStatusElement.textContent = 'Статус: Готов (нажмите Плей)';
    //     // Показываем иконку плей, если автозапуск не сработал
    //      playIcon.classList.remove('hidden');
    //      pauseIcon.classList.add('hidden');
    // });

} else {
    currentTrackElement.textContent = 'Плейлист пуст';
    radioStatusElement.textContent = 'Статус: Нет треков';
    playPauseBtn.disabled = true; // Отключаем кнопки, если нет треков
    nextBtn.disabled = true;
    volumeSlider.disabled = true;
}

// Инициализируем отображение первого трека (или пустого плейлиста)
updateTrackInfo();

// Для Telegram Mini App: Запросить разрешение на закрытие
if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand(); // Можно попробовать расширить окно Mini App

    // Опционально: Запретить закрытие без предупреждения при воспроизведении
    // Telegram.WebApp.onEvent('backButtonClicked', function() {
    //     if (!audio.paused) {
    //          if (confirm('Музыка сейчас играет. Вы уверены, что хотите выйти?')) {
    //               audio.pause();
    //               Telegram.WebApp.close();
    //          }
    //     } else {
    //          Telegram.WebApp.close();
    //     }
    // });
     // Telegram.WebApp.enableClosingConfirmation(); // Альтернатива onEvent('backButtonClicked') для стандартного диалога
}

