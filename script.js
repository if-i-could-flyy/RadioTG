document.addEventListener('DOMContentLoaded', () => {
    // Инициализация Telegram WebApp SDK
    if (window.Telegram && window.Telegram.WebApp) {
        Telegram.WebApp.ready();
        // Опционально: можно использовать API Mini Apps для настройки интерфейса
        // Telegram.WebApp.setHeaderColor('bg_color');
        // Telegram.WebApp.setBackgroundColor('secondary_bg_color');
        // Telegram.WebApp.MainButton.setText('Закрыть Радио').show().onClick(() => Telegram.WebApp.close());
         console.log('Telegram WebApp готов.');
    } else {
         console.warn('Telegram WebApp SDK не доступен.');
    }


    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    const radioStatus = document.getElementById('radio-status');
    const currentTrackDisplay = document.querySelector('.current-track');
    const currentTrackIndexDisplay = document.getElementById('current-track-index');
    const totalTracksDisplay = document.getElementById('total-tracks');
    // const volumeSlider = document.getElementById('volumeSlider'); // Если используете регулятор громкости


    // --- Список ваших треков ---
    // ВНИМАНИЕ: Замените эти URL на реальные ссылки на ваши аудиофайлы!
    // Убедитесь, что файлы доступны по HTTPS.
    const playlist = [
        { title: "Niall Horan - If You Leave Me", src: "https://github.com/if-i-could-flyy/RadioTG/blob/main/niall-horan-if-you-leave-me.mp3" },
        { title: "Niall Horan - Must be Love", src: "https://github.com/if-i-could-flyy/RadioTG/blob/main/niall-horan-must-be-love.mp3" },
        // Добавьте больше треков по аналогии
    ];

    let currentTrackIndex = 0;
    let isPlaying = false; // Флаг состояния воспроизведения

    // --- Функции управления плеером ---

    // Загрузка трека по индексу
    function loadTrack(index) {
        if (index >= 0 && index < playlist.length) {
            audioPlayer.src = playlist[index].src;
            currentTrackIndex = index;
            currentTrackDisplay.textContent = playlist[index].title;
            radioStatus.textContent = 'Статус: Загрузка...';
             currentTrackIndexDisplay.textContent = currentTrackIndex + 1; // Нумерация с 1
             totalTracksDisplay.textContent = playlist.length;
            // audioPlayer.load(); // В некоторых случаях может потребоваться
            console.log(`Загружен трек: ${playlist[index].title}`);
        } else {
            console.error("Неверный индекс трека:", index);
            currentTrackDisplay.textContent = "Ошибка загрузки трека";
            radioStatus.textContent = "Статус: Ошибка";
        }
    }

    // Воспроизведение
    function playTrack() {
        if (audioPlayer.src) {
            audioPlayer.play().then(() => {
                isPlaying = true;
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
                 // Статус обновляется при событии 'playing'
                console.log('Воспроизведение начато.');
            }).catch(error => {
                console.error("Ошибка воспроизведения:", error);
                radioStatus.textContent = 'Статус: Ошибка воспроизведения';
                isPlaying = false;
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            });
        } else {
             console.warn("Нет источника аудио для воспроизведения.");
             radioStatus.textContent = 'Статус: Нет трека';
        }
    }

    // Пауза
    function pauseTrack() {
        audioPlayer.pause();
        isPlaying = false;
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        radioStatus.textContent = 'Статус: Пауза';
        console.log('Воспроизведение на паузе.');
    }

    // Переключение на следующий случайный трек (с перемешиванием)
    function playNext() {
        if (playlist.length === 0) {
            currentTrackDisplay.textContent = "Список пуст";
            radioStatus.textContent = "Статус: Нет треков";
            return;
        }
        if (playlist.length === 1) {
             loadTrack(0); // Если только один трек, просто загружаем его
             playTrack();
             return;
        }

        let nextIndex;
        // Выбираем случайный индекс, убеждаясь, что он не совпадает с текущим (если треков больше одного)
        do {
            nextIndex = Math.floor(Math.random() * playlist.length);
        } while (nextIndex === currentTrackIndex);

        loadTrack(nextIndex);
        playTrack(); // Автоматически воспроизводим следующий трек
         console.log(`Переход к следующему треку (индекс: ${nextIndex})`);
    }

    // --- Обработчики событий ---

    // Кнопка Воспроизвести/Пауза
    playPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused || audioPlayer.ended) {
            playTrack();
        } else {
            pauseTrack();
        }
    });

    // Кнопка Следующий трек
    nextBtn.addEventListener('click', () => {
        playNext();
    });

    // Событие завершения трека - автоматически переключаем на следующий
    audioPlayer.addEventListener('ended', () => {
        console.log('Трек завершен, переключаем на следующий...');
        playNext();
    });

     // Событие начала воспроизведения
     audioPlayer.addEventListener('playing', () => {
         radioStatus.textContent = 'Статус: Воспроизведение';
         console.log('Событие: playing');
     });

     // Событие паузы
     audioPlayer.addEventListener('pause', () => {
        if (!audioPlayer.ended) { // Игнорируем паузу, когда трек просто закончился
            radioStatus.textContent = 'Статус: Пауза';
            console.log('Событие: pause');
        }
     });

     // Событие загрузки данных (можно использовать для индикации буферизации)
     audioPlayer.addEventListener('waiting', () => {
          radioStatus.textContent = 'Статус: Буферизация...';
          console.log('Событие: waiting');
     });

     // Событие ошибки
     audioPlayer.addEventListener('error', (e) => {
         console.error("Ошибка аудио плеера:", e);
         radioStatus.textContent = 'Статус: Ошибка';
         currentTrackDisplay.textContent = "Не удалось загрузить трек";
         isPlaying = false;
         playIcon.classList.remove('hidden');
         pauseIcon.classList.add('hidden');
     });

     // Событие обновления метаданных (может быть полезно)
     audioPlayer.addEventListener('loadedmetadata', () => {
          console.log('Метаданные загружены');
          // Можно использовать audioPlayer.duration для отображения длительности
     });


    // // Обработчик для регулятора громкости (если используете)
    // if (volumeSlider) {
    //     volumeSlider.addEventListener('input', () => {
    //         audioPlayer.volume = volumeSlider.value;
    //     });
    // }


    // --- Инициализация ---
    // Загружаем первый трек при загрузке страницы
    if (playlist.length > 0) {
        loadTrack(currentTrackIndex);
    } else {
        currentTrackDisplay.textContent = "Список пуст";
        radioStatus.textContent = "Статус: Нет треков";
         currentTrackIndexDisplay.textContent = 0;
         totalTracksDisplay.textContent = 0;
    }
});
