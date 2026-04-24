(function() {
    // ─────────────────────────────────────
    // КОНФИГУРАЦИЯ
    // ─────────────────────────────────────
    const BOX_INTERVALS = {
        1: 1, // каждый день
        2: 2, // каждые 2 дня
        3: 4, // каждые 4 дня
        4: 7, // каждые 7 дней
        5: 14 // каждые 14 дней (освоено)
    };
    const TOTAL_BOXES = 5;
    const STORAGE_KEY_WORDS = 'lingualearn_words';
    const STORAGE_KEY_STREAK = 'lingualearn_streak';
    const STORAGE_KEY_LAST_STUDY = 'lingualearn_lastStudy';

    // ─────────────────────────────────────
    // ДАННЫЕ ПО УМОЛЧАНИЮ
    // ─────────────────────────────────────
    function getDefaultWords() {
        const today = getTodayISO();
        const pastDate = '2024-01-01';
        return [
            { id: 1, english: 'apple', russian: 'яблоко', category: 'Еда', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 2, english: 'bread', russian: 'хлеб', category: 'Еда', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 3, english: 'water', russian: 'вода', category: 'Еда', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 4, english: 'milk', russian: 'молоко', category: 'Еда', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 5, english: 'cheese', russian: 'сыр', category: 'Еда', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 6, english: 'house', russian: 'дом', category: 'Основные', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 7, english: 'book', russian: 'книга', category: 'Основные', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 8, english: 'friend', russian: 'друг', category: 'Основные', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 9, english: 'city', russian: 'город', category: 'Основные', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 10, english: 'morning', russian: 'утро', category: 'Основные', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 11, english: 'airport', russian: 'аэропорт', category: 'Путешествия', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 12, english: 'ticket', russian: 'билет', category: 'Путешествия', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 13, english: 'hotel', russian: 'отель', category: 'Путешествия', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 14, english: 'map', russian: 'карта', category: 'Путешествия', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 15, english: 'sun', russian: 'солнце', category: 'Природа', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 16, english: 'tree', russian: 'дерево', category: 'Природа', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 17, english: 'flower', russian: 'цветок', category: 'Природа', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 18, english: 'river', russian: 'река', category: 'Природа', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 19, english: 'computer', russian: 'компьютер', category: 'Технологии', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 20, english: 'phone', russian: 'телефон', category: 'Технологии', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 21, english: 'screen', russian: 'экран', category: 'Технологии', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 22, english: 'keyboard', russian: 'клавиатура', category: 'Технологии', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 23, english: 'office', russian: 'офис', category: 'Работа', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 24, english: 'meeting', russian: 'встреча', category: 'Работа', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
            { id: 25, english: 'project', russian: 'проект', category: 'Работа', box: 1, lastReviewed: pastDate, nextReview: pastDate, correctCount: 0, wrongCount: 0 },
        ];
    }

    // ─────────────────────────────────────
    // УТИЛИТЫ
    // ─────────────────────────────────────
    function getTodayISO() {
        const d = new Date();
        return d.toISOString().split('T')[0];
    }

    function addDays(isoDate, days) {
        const d = new Date(isoDate + 'T00:00:00');
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
    }

    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function generateId() {
        return Date.now() + Math.floor(Math.random() * 10000);
    }

    // ─────────────────────────────────────
    // ХРАНИЛИЩЕ (localStorage)
    // ─────────────────────────────────────
    function loadWords() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_WORDS);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.warn('Ошибка загрузки слов, использую значения по умолчанию');
        }
        const defaults = getDefaultWords();
        saveWords(defaults);
        return defaults;
    }

    function saveWords(words) {
        localStorage.setItem(STORAGE_KEY_WORDS, JSON.stringify(words));
    }

    function loadStreak() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_STREAK);
            return raw ? parseInt(raw, 10) : 0;
        } catch (e) {
            return 0;
        }
    }

    function saveStreak(streak) {
        localStorage.setItem(STORAGE_KEY_STREAK, streak.toString());
    }

    function loadLastStudyDate() {
        return localStorage.getItem(STORAGE_KEY_LAST_STUDY) || '';
    }

    function saveLastStudyDate(date) {
        localStorage.setItem(STORAGE_KEY_LAST_STUDY, date);
    }

    // ─────────────────────────────────────
    // ГЛОБАЛЬНОЕ СОСТОЯНИЕ
    // ─────────────────────────────────────
    let words = loadWords();
    let currentStreak = loadStreak();
    let lastStudyDate = loadLastStudyDate();

    let studyDueWords = [];
    let studyIndex = 0;
    let isFlipped = false;

    let quizQuestions = [];
    let quizIndex = 0;
    let quizCorrectCount = 0;
    let quizAnswered = false;

    // ─────────────────────────────────────
    // ОБНОВЛЕНИЕ СЕРИИ
    // ─────────────────────────────────────
    function updateStreak() {
        const today = getTodayISO();
        if (lastStudyDate === today) return;
        const yesterday = addDays(today, -1);
        if (lastStudyDate === yesterday) {
            currentStreak += 1;
        } else if (lastStudyDate === '') {
            currentStreak = 1;
        } else {
            currentStreak = 1;
        }
        lastStudyDate = today;
        saveStreak(currentStreak);
        saveLastStudyDate(lastStudyDate);
    }

    // ─────────────────────────────────────
    // ОСНОВНАЯ ЛОГИКА SPACED REPETITION
    // ─────────────────────────────────────
    function getWordsDueForReview() {
        const today = getTodayISO();
        return words.filter(w => w.nextReview <= today);
    }

    function processAnswer(wordId, isCorrect) {
        const word = words.find(w => w.id === wordId);
        if (!word) return;
        const today = getTodayISO();
        word.lastReviewed = today;
        if (isCorrect) {
            word.correctCount = (word.correctCount || 0) + 1;
            if (word.box < TOTAL_BOXES) {
                word.box += 1;
            }
        } else {
            word.wrongCount = (word.wrongCount || 0) + 1;
            word.box = 1;
        }
        const interval = BOX_INTERVALS[word.box] || 1;
        word.nextReview = addDays(today, interval);
        saveWords(words);
        updateStreak();
    }

    // ─────────────────────────────────────
    // ОТРИСОВКА: ДАШБОРД
    // ─────────────────────────────────────
    function renderDashboard() {
        const dueWords = getWordsDueForReview();
        const masteredWords = words.filter(w => w.box === TOTAL_BOXES);
        const totalReviews = words.reduce((sum, w) => sum + (w.correctCount || 0) + (w.wrongCount || 0), 0);
        const totalCorrect = words.reduce((sum, w) => sum + (w.correctCount || 0), 0);
        const accuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;

        document.getElementById('statsGrid').innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${words.length}</div>
                <div class="stat-label">Всего слов</div>
            </div>
            <div class="stat-card accent-warning">
                <div class="stat-value">${dueWords.length}</div>
                <div class="stat-label">Ожидают повторения</div>
            </div>
            <div class="stat-card accent-green">
                <div class="stat-value">${masteredWords.length}</div>
                <div class="stat-label">Освоено (бокс 5)</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${accuracy}%</div>
                <div class="stat-label">Точность ответов</div>
            </div>
        `;

        const boxCounts = {};
        for (let b = 1; b <= TOTAL_BOXES; b++) {
            boxCounts[b] = words.filter(w => w.box === b).length;
        }
        document.getElementById('leitnerBoxes').innerHTML = [1, 2, 3, 4, 5].map(b => `
            <div class="leitner-box box-${b}">
                Бокс ${b}
                <span class="box-count">${boxCounts[b]}</span>
            </div>
        `).join('');

        document.getElementById('streakDisplay').textContent = currentStreak;

        const badgeEl = document.querySelector('[data-panel="study"] .badge');
        if (!badgeEl) {
            const tab = document.querySelector('[data-panel="study"]');
            if (tab && dueWords.length > 0) {
                const span = document.createElement('span');
                span.className = 'badge';
                span.textContent = dueWords.length;
                tab.appendChild(span);
            }
        } else {
            badgeEl.textContent = dueWords.length;
            badgeEl.style.display = dueWords.length > 0 ? 'inline' : 'none';
        }
    }

    // ─────────────────────────────────────
    // ОТРИСОВКА: СЛОВАРЬ
    // ─────────────────────────────────────
    function renderWordTable() {
        const tbody = document.getElementById('wordTableBody');
        const emptyMsg = document.getElementById('wordTableEmpty');
        if (words.length === 0) {
            tbody.innerHTML = '';
            emptyMsg.style.display = 'block';
            return;
        }
        emptyMsg.style.display = 'none';
        tbody.innerHTML = words.map(w => {
            const boxColors = ['#e55353', '#f08040', '#f0a040', '#60b860', '#38a038'];
            const boxColor = boxColors[w.box - 1] || '#888';
            const nextReview = w.nextReview || '—';
            return `
                <tr>
                    <td><strong>${escapeHTML(w.english)}</strong></td>
                    <td>${escapeHTML(w.russian)}</td>
                    <td><span style="font-size:0.78rem;color:var(--text-light);">${escapeHTML(w.category)}</span></td>
                    <td><span class="box-indicator" style="background:${boxColor};">${w.box}</span></td>
                    <td style="font-size:0.8rem;color:var(--text-light);">${nextReview}</td>
                    <td><button class="btn btn-outline btn-sm" onclick="deleteWord(${w.id})" title="Удалить">🗑</button></td>
                </tr>
            `;
        }).join('');
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ─────────────────────────────────────
    // РЕЖИМ: КАРТОЧКИ (Study)
    // ─────────────────────────────────────
    function loadStudySession() {
        studyDueWords = shuffle(getWordsDueForReview());
        studyIndex = 0;
        isFlipped = false;
        if (studyDueWords.length === 0) {
            document.getElementById('studyDueInfo').textContent = '🎉 Нет слов для повторения!';
            document.getElementById('studyCounter').textContent = '0 / 0';
            document.getElementById('studyProgressBar').style.width = '0%';
            document.getElementById('fcWordFront').textContent = '—';
            document.getElementById('fcWordBack').textContent = '—';
            document.getElementById('fcCategoryFront').textContent = '—';
            document.getElementById('fcCategoryBack').textContent = '—';
            document.getElementById('btnForgot').disabled = true;
            document.getElementById('btnRemembered').disabled = true;
            document.getElementById('studyEmptyMsg').textContent = 'Все слова освоены или просмотрены. Возвращайтесь позже!';
            document.getElementById('flashcard').classList.remove('flipped');
            return;
        }
        document.getElementById('studyEmptyMsg').textContent = '';
        document.getElementById('btnForgot').disabled = false;
        document.getElementById('btnRemembered').disabled = false;
        showStudyCard();
    }

    function showStudyCard() {
        if (studyIndex >= studyDueWords.length) {
            document.getElementById('studyDueInfo').textContent = '🎉 Сессия завершена!';
            document.getElementById('studyCounter').textContent = `${studyDueWords.length} / ${studyDueWords.length}`;
            document.getElementById('studyProgressBar').style.width = '100%';
            document.getElementById('fcWordFront').textContent = 'Готово!';
            document.getElementById('fcWordBack').textContent = 'Отлично!';
            document.getElementById('fcCategoryFront').textContent = '';
            document.getElementById('fcCategoryBack').textContent = '';
            document.getElementById('btnForgot').disabled = true;
            document.getElementById('btnRemembered').disabled = true;
            document.getElementById('flashcard').classList.remove('flipped');
            isFlipped = false;
            renderDashboard();
            renderWordTable();
            return;
        }
        const word = studyDueWords[studyIndex];
        isFlipped = false;
        document.getElementById('flashcard').classList.remove('flipped');
        document.getElementById('fcWordFront').textContent = word.english;
        document.getElementById('fcCategoryFront').textContent = word.category;
        document.getElementById('fcWordBack').textContent = word.russian;
        document.getElementById('fcCategoryBack').textContent = word.category;
        document.getElementById('studyDueInfo').textContent = `📖 Повторение: карточка ${studyIndex + 1} из ${studyDueWords.length}`;
        document.getElementById('studyCounter').textContent = `${studyIndex + 1} / ${studyDueWords.length}`;
        document.getElementById('studyProgressBar').style.width = `${Math.round((studyIndex / studyDueWords.length) * 100)}%`;
    }

    function flipCard() {
        if (studyDueWords.length === 0 || studyIndex >= studyDueWords.length) return;
        const card = document.getElementById('flashcard');
        isFlipped = !isFlipped;
        if (isFlipped) {
            card.classList.add('flipped');
        } else {
            card.classList.remove('flipped');
        }
    }

    function answerFlashcard(isCorrect) {
        if (studyDueWords.length === 0 || studyIndex >= studyDueWords.length) return;
        const word = studyDueWords[studyIndex];
        processAnswer(word.id, isCorrect);
        studyIndex++;
        isFlipped = false;
        document.getElementById('flashcard').classList.remove('flipped');
        studyDueWords = shuffle(getWordsDueForReview());
        studyIndex = 0;
        showStudyCard();
        renderDashboard();
        renderWordTable();
        showToast(isCorrect ? '✅ Верно! +1 бокс' : '❌ Неверно — слово в бокс 1');
    }

    // ─────────────────────────────────────
    // РЕЖИМ: ТЕСТ (Quiz)
    // ─────────────────────────────────────
    function startQuiz() {
        const dueWords = getWordsDueForReview();
        if (dueWords.length < 2) {
            document.getElementById('quizEmptyMsg').textContent = '⚠ Нужно хотя бы 2 слова для теста. Добавьте слова или дождитесь повторений.';
            document.getElementById('quizQuestionCard').style.display = 'none';
            document.getElementById('quizResultCard').style.display = 'none';
            document.getElementById('quizStartRow').style.display = 'flex';
            return;
        }
        document.getElementById('quizEmptyMsg').textContent = '';
        document.getElementById('quizStartRow').style.display = 'none';
        document.getElementById('quizResultCard').style.display = 'none';
        document.getElementById('quizQuestionCard').style.display = 'block';
        quizQuestions = shuffle(dueWords.map(w => {
            const others = words.filter(ow => ow.id !== w.id);
            const distractors = shuffle(others).slice(0, Math.min(3, others.length));
            const options = shuffle([w, ...distractors]);
            return {
                wordId: w.id,
                english: w.english,
                correctRussian: w.russian,
                options: options.map(o => o.russian),
                correctIndex: options.findIndex(o => o.id === w.id)
            };
        }));
        quizIndex = 0;
        quizCorrectCount = 0;
        quizAnswered = false;
        showQuizQuestion();
    }

    function showQuizQuestion() {
        if (quizIndex >= quizQuestions.length) {
            finishQuiz();
            return;
        }
        quizAnswered = false;
        const q = quizQuestions[quizIndex];
        document.getElementById('quizWord').textContent = q.english;
        document.getElementById('quizCounter').textContent = `Вопрос ${quizIndex + 1} / ${quizQuestions.length}`;
        document.getElementById('quizScore').textContent = `Счёт: ${quizCorrectCount}`;
        document.getElementById('quizProgressBar').style.width = `${Math.round((quizIndex / quizQuestions.length) * 100)}%`;
        const optionsContainer = document.getElementById('quizOptions');
        optionsContainer.innerHTML = q.options.map((opt, i) => `
            <div class="quiz-option" data-index="${i}" onclick="selectQuizOption(${i}, this)">
                ${escapeHTML(opt)}
            </div>
        `).join('');
    }

    function selectQuizOption(selectedIndex, element) {
        if (quizAnswered) return;
        quizAnswered = true;
        const q = quizQuestions[quizIndex];
        const isCorrect = (selectedIndex === q.correctIndex);
        const allOptions = document.querySelectorAll('#quizOptions .quiz-option');
        allOptions.forEach((opt, i) => {
            opt.classList.add('disabled');
            if (i === q.correctIndex) opt.classList.add('correct');
            if (i === selectedIndex && !isCorrect) opt.classList.add('wrong');
        });
        if (isCorrect) quizCorrectCount++;
        processAnswer(q.wordId, isCorrect);
        document.getElementById('quizScore').textContent = `Счёт: ${quizCorrectCount}`;
        setTimeout(() => {
            quizIndex++;
            showQuizQuestion();
        }, 800);
    }

    function finishQuiz() {
        document.getElementById('quizQuestionCard').style.display = 'none';
        document.getElementById('quizResultCard').style.display = 'block';
        document.getElementById('quizResultScore').textContent = quizCorrectCount;
        document.getElementById('quizResultTotal').textContent = quizQuestions.length;
        document.getElementById('quizStartRow').style.display = 'flex';
        document.getElementById('quizProgressBar').style.width = '100%';
        renderDashboard();
        renderWordTable();
        const pct = Math.round((quizCorrectCount / quizQuestions.length) * 100);
        let emoji = '🎉';
        if (pct < 50) emoji = '📚';
        else if (pct < 80) emoji = '👍';
        showToast(`${emoji} Результат: ${quizCorrectCount}/${quizQuestions.length} (${pct}%)`);
    }

    // ─────────────────────────────────────
    // ДОБАВЛЕНИЕ / УДАЛЕНИЕ СЛОВ
    // ─────────────────────────────────────
    function openAddWordModal() {
        document.getElementById('modalOverlay').classList.add('visible');
        document.getElementById('inputEnglish').value = '';
        document.getElementById('inputRussian').value = '';
        document.getElementById('inputCategory').value = 'Основные';
        document.getElementById('inputEnglish').focus();
    }

    function closeModal() {
        document.getElementById('modalOverlay').classList.remove('visible');
    }

    function addWord() {
        const english = document.getElementById('inputEnglish').value.trim();
        const russian = document.getElementById('inputRussian').value.trim();
        const category = document.getElementById('inputCategory').value;
        if (!english || !russian) {
            showToast('⚠ Заполните оба поля');
            return;
        }
        const today = getTodayISO();
        const newWord = {
            id: generateId(),
            english,
            russian,
            category,
            box: 1,
            lastReviewed: '2020-01-01',
            nextReview: '2020-01-01',
            correctCount: 0,
            wrongCount: 0
        };
        words.push(newWord);
        saveWords(words);
        closeModal();
        renderDashboard();
        renderWordTable();
        showToast(`✅ Слово "${english}" добавлено!`);
    }

    function deleteWord(wordId) {
        if (!confirm('Удалить это слово?')) return;
        words = words.filter(w => w.id !== wordId);
        saveWords(words);
        renderDashboard();
        renderWordTable();
        studyDueWords = [];
        studyIndex = 0;
        document.getElementById('flashcard').classList.remove('flipped');
        isFlipped = false;
        loadStudySession();
        showToast('🗑 Слово удалено');
    }

    function resetWordsToDefault() {
        if (!confirm('Сбросить весь словарь до стандартных 25 слов? Весь прогресс будет потерян.')) return;
        words = getDefaultWords();
        saveWords(words);
        currentStreak = 0;
        lastStudyDate = '';
        saveStreak(0);
        saveLastStudyDate('');
        studyDueWords = [];
        studyIndex = 0;
        isFlipped = false;
        document.getElementById('flashcard').classList.remove('flipped');
        renderDashboard();
        renderWordTable();
        loadStudySession();
        document.getElementById('quizQuestionCard').style.display = 'none';
        document.getElementById('quizResultCard').style.display = 'none';
        document.getElementById('quizStartRow').style.display = 'flex';
        document.getElementById('quizEmptyMsg').textContent = '';
        showToast('🔄 Словарь сброшен до стандартного');
    }

    function resetProgress() {
        if (!confirm('Сбросить весь прогресс (боксы, серию, статистику)? Сами слова останутся.')) return;
        const pastDate = '2020-01-01';
        words = words.map(w => ({
            ...w,
            box: 1,
            lastReviewed: pastDate,
            nextReview: pastDate,
            correctCount: 0,
            wrongCount: 0
        }));
        saveWords(words);
        currentStreak = 0;
        lastStudyDate = '';
        saveStreak(0);
        saveLastStudyDate('');
        studyDueWords = [];
        studyIndex = 0;
        isFlipped = false;
        document.getElementById('flashcard').classList.remove('flipped');
        renderDashboard();
        renderWordTable();
        loadStudySession();
        document.getElementById('quizQuestionCard').style.display = 'none';
        document.getElementById('quizResultCard').style.display = 'none';
        document.getElementById('quizStartRow').style.display = 'flex';
        document.getElementById('quizEmptyMsg').textContent = '';
        showToast('🔄 Прогресс сброшен');
    }

    // ─────────────────────────────────────
    // ТОСТЫ
    // ─────────────────────────────────────
    let toastTimeout;

    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    }

    // ─────────────────────────────────────
    // ПЕРЕКЛЮЧЕНИЕ ПАНЕЛЕЙ
    // ─────────────────────────────────────
    function switchPanel(panelName) {
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        const panel = document.getElementById('panel-' + panelName);
        const tab = document.querySelector(`[data-panel="${panelName}"]`);
        if (panel) panel.classList.add('active');
        if (tab) tab.classList.add('active');
        if (panelName === 'dashboard') renderDashboard();
        if (panelName === 'study') loadStudySession();
        if (panelName === 'words') renderWordTable();
        if (panelName === 'quiz') {
            document.getElementById('quizQuestionCard').style.display = 'none';
            document.getElementById('quizResultCard').style.display = 'none';
            document.getElementById('quizStartRow').style.display = 'flex';
            document.getElementById('quizEmptyMsg').textContent = '';
            document.getElementById('quizProgressBar').style.width = '0%';
        }
    }

    document.getElementById('navTabs').addEventListener('click', function(e) {
        const tab = e.target.closest('.nav-tab');
        if (!tab) return;
        const panelName = tab.dataset.panel;
        if (panelName) switchPanel(panelName);
    });

    document.getElementById('modalOverlay').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    // ─────────────────────────────────────
    // ГЛОБАЛЬНЫЕ ФУНКЦИИ (для onclick)
    // ─────────────────────────────────────
    window.flipCard = flipCard;
    window.answerFlashcard = answerFlashcard;
    window.selectQuizOption = selectQuizOption;
    window.startQuiz = startQuiz;
    window.openAddWordModal = openAddWordModal;
    window.closeModal = closeModal;
    window.addWord = addWord;
    window.deleteWord = deleteWord;
    window.resetWordsToDefault = resetWordsToDefault;
    window.resetProgress = resetProgress;

    // ─────────────────────────────────────
    // ИНИЦИАЛИЗАЦИЯ
    // ─────────────────────────────────────
    function init() {
        renderDashboard();
        renderWordTable();
        loadStudySession();
        document.getElementById('quizQuestionCard').style.display = 'none';
        document.getElementById('quizResultCard').style.display = 'none';
        document.getElementById('quizStartRow').style.display = 'flex';
    }

    init();
})();
