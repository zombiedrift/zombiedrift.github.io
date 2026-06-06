/* ==========================================================================
   ZOMBIEDRIFT STUDIO - INTERACTIVE JS LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================
       1. BACKGROUND CANVAS PARTICLE EFFECT
       ========================================== */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    const colors = [
        'rgba(0, 255, 102, 0.15)', // Neon Green
        'rgba(0, 210, 255, 0.12)', // Neon Cyan
        'rgba(189, 0, 255, 0.08)'  // Neon Magenta
    ];
    
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 4 + 1;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;
            
            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function initParticles() {
        particlesArray = [];
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    initParticles();
    window.addEventListener('resize', initParticles);
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.01)';
        ctx.lineWidth = 1;
        const gridSize = 80;
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    /* ==========================================
       2. MOBILE HAMBURGER MENU TOGGLE
       ========================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const headerActions = document.getElementById('header-actions');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            headerActions.classList.toggle('active');
        });
        
        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                headerActions.classList.remove('active');
            });
        });
    }


    /* ==========================================
       3. TRANSLATIONS SYSTEM (LOCALIZATION)
       ========================================== */
    const translations = {
        ru: {
            "doc-title": "ZombieDrift Studio | Hockey Zombie Multiplayer",
            "nav-about": "Об игре",
            "nav-chess": "Шахматная фаза",
            "nav-skins": "Скины",
            "nav-roadmap": "Дорожная карта",
            "nav-contact": "Контакты",
            "btn-join": "Вступить в бой",
            "hero-tag": "Свежий релиз от ZombieDrift",
            "hero-title": "HOCKEY ZOMBIE<br><span class=\"highlight-text\">MULTIPLAYER</span>",
            "hero-desc": "Безумный гибрид спортивного симулятора и кооперативного выживания в формате 1v1 PvP. Крушите толпы зомби клюшкой и забивайте прыгающих зомби-шайб в ворота противника!",
            "btn-learn": "Подробнее об игре",
            "btn-play-sim": "Сыграть в Chess Phase",
            "about-tag": "Игровой процесс",
            "about-title": "СПОРТ. КРОВЬ. ВЫЖИВАНИЕ.",
            "about-subtitle": "Динамичные дуэли на ледовой арене с толпами зомби, где классические хоккейные правила смешались с апокалипсисом.",
            "feat1-title": "Интенсивный 1v1 PvP",
            "feat1-desc": "Вы играете против реального оппонента. Контролируйте лед, командуйте ботами-помощниками и защищайте свои ворота.",
            "feat2-title": "Живые \"Зомби-Шайбы\"",
            "feat2-desc": "Обычные шайбы устарели! Выслеживайте особых зомби-прыгунов (Jumpers), захватывайте их клюшкой и запускайте мощными бросками в ворота.",
            "feat3-title": "50+ Зомби на арене",
            "feat3-desc": "Толпы ходячих мертвецов постоянно мешают игре. Зачищайте лед сильными ударами клюшки, чтобы пробиться к цели.",
            "chess-tag": "Интерактивный симулятор",
            "chess-title": "ШАХМАТНАЯ ФАЗА (RPS)",
            "chess-subtitle": "Перед началом каждого периода игроки тайно выбирают карты стратегии для ботов-хоккеистов по принципу Камень-Ножницы-Бумага.",
            "chess-intro-title": "Выберите карту стратегии на следующий период:",
            "chess-intro-desc": "Ваша тактика определит баффы характеристик (скорость, сила удара, здоровье) ваших ботов-помощников.",
            "card-att-title": "АТАКА",
            "card-att-benefit": "Побеждает Контроль<br><small>+25% Сила удара</small>",
            "card-ctrl-title": "КОНТРОЛЬ",
            "card-ctrl-benefit": "Побеждает Защиту<br><small>+20% Скорость бега</small>",
            "card-def-title": "ЗАЩИТА",
            "card-def-benefit": "Побеждает Атаку<br><small>+30% Здоровье ботов</small>",
            "btn-reveal": "Раскрыть карты",
            "btn-reset": "Начать заново",
            "sim-your-choice": "Ваш выбор",
            "sim-opp-choice": "Выбор Соперника",
            "sim-start-prompt": "Выберите карту выше, чтобы начать...",
            "cust-tag": "Кастомизация",
            "cust-title": "НАСТРОЙКА ХОККЕИСТА",
            "cust-subtitle": "Создайте свой стиль на арене. Никнейм и цвета экипировки мгновенно синхронизируются через сеть PurrNet.",
            "cust-panel-title": "Панель раздевалки",
            "cust-label-nick": "Имя хоккеиста (Никнейм)",
            "cust-label-color": "Цвет команды (SyncVar)",
            "cust-label-gear": "Экипировка (SkinIndex)",
            "cust-opt-jersey": "Стандартный джерси (Jersey Retro)",
            "cust-opt-armor": "Кибер-защита (Cyber Armor)",
            "cust-opt-surv": "Выживший хоккеист (Wasteland Survivor)",
            "cust-sync-status": "СИНХРОНИЗИРОВАНО С СЕРВЕРОМ",
            "road-tag": "Развитие",
            "road-title": "ДОРОЖНАЯ КАРТА ПРОЕКТА",
            "road-subtitle": "Следите за прогрессом разработки Hockey Zombie Multiplayer. Мы постоянно улучшаем код и добавляем новые возможности.",
            "road-date1": "Апрель 2026",
            "road-title1": "Игровой пайплайн и ИИ ботов",
            "road-desc1": "Реализован полный цикл 3-периодного матча, сетевая фаза выбора карт стратегий (Chess Phase) и авторитетный ИИ ботов-хоккеистов, способных бить зомби и забивать прыгунов.",
            "road-date2": "Май 2026",
            "road-title2": "Физическая стабильность и кастомизация",
            "road-desc2": "Интегрирован менеджер данных игрока (PlayerDataManager) с поддержкой PlayerPrefs. Добавлена NaN-валидация для пресечения PhysX крашей на сервере. Подготовлен визуальный контроллер смены материалов.",
            "road-date3": "Июнь 2026 (Текущий этап)",
            "road-title3": "🧟 Исправление синхронизации зомби & Скины",
            "road-desc3": "Оптимизация работы Rigidbody и NavMeshAgent зомби на стороне клиента (избавление от подергиваний). Развертывание UI смены скинов хоккеистов на ParrelSync мультиплеерных тестах.",
            "road-date4": "Июль - Август 2026",
            "road-title4": "Геймплей и защита",
            "road-desc4": "Внедрение механики фрейл-стейта при пропущенных голах от зомби, аудиосистемы озвучки голов и серверного античита (Server-side validation) с лагокомпенсацией для \"шайбы\".",
            "cont-tag": "Обратная связь",
            "cont-title": "СВЯЗАТЬСЯ СО СТУДИЕЙ",
            "cont-subtitle": "Хотите предложить фичу, сообщить о баге или обсудить сотрудничество? Напишите нам!",
            "cont-label-name": "Ваше имя",
            "cont-label-email": "Эл. почта",
            "cont-label-msg": "Сообщение",
            "btn-send": "Отправить сообщение",
            "foot-desc": "ZombieDrift Studio — независимый разработчик высокодинамичных мультиплеерных экшенов.",
            "foot-nav-title": "Навигация",
            "foot-copy": "&copy; 2026 ZombieDrift. Все права защищены.",
            "foot-credits": "Сделано для демонстрации проекта Hockey Zombie Multiplayer.",
            // Simulator strings
            "choice-att": "⚔️ АТАКА",
            "choice-ctrl": "🛡️ КОНТРОЛЬ",
            "choice-def": "🧱 ЗАХИСТ",
            "sim-choosing": "ВЫБОР...",
            "res-tie-title": "НИЧЬЯ В ШАХМАТНОЙ ФАЗЕ!",
            "res-tie-desc": "Оба выбрали {choice}. Ваши боты не получили баффов. Период начнется в равных условиях!",
            "res-win-title": "ПОБЕДА В ШАХМАТНОЙ ФАЗЕ!",
            "res-win-att": "АТАКА побеждает КОНТРОЛЬ! Ваши боты получили бафф: <span class=\"highlight-text\">+25% к Силе удара клюшкой</span> на следующий период матча.",
            "res-win-ctrl": "КОНТРОЛЬ побеждает ЗАЩИТУ! Ваши боты получили бафф: <span class=\"text-neon-cyan\">+20% к Скорости бега</span> на следующий период матча.",
            "res-win-def": "ЗАЩИТА побеждает АТАКУ! Ваши боты получили бафф: <span class=\"text-neon-magenta\">+30% к Максимальному здоровью</span> на следующий период матча.",
            "res-lose-title": "ПОРАЖЕНИЕ В ШАХМАТНОЙ ФАЗЕ!",
            "res-lose-att": "Соперник выбрал АТАКУ и победил ваш КОНТРОЛЬ. Его боты получили бафф на силу удара. Будьте осторожны!",
            "res-lose-ctrl": "Соперник выбрал КОНТРОЛЬ и победил вашу ЗАЩИТУ. Его боты будут бегать быстрее!",
            "res-lose-def": "Соперник выбрал ЗАЩИТУ и победил вашу АТАКУ. Его боты получили прибавку к здоровью!",
            "form-success": "<strong>Сообщение успешно доставлено!</strong><br>Команда ZombieDrift свяжется с вами по указанной почте в течение 24 часов."
        },
        en: {
            "doc-title": "ZombieDrift Studio | Hockey Zombie Multiplayer",
            "nav-about": "About Game",
            "nav-chess": "Chess Phase",
            "nav-skins": "Skins",
            "nav-roadmap": "Roadmap",
            "nav-contact": "Contact",
            "btn-join": "Enter Battle",
            "hero-tag": "Fresh Release from ZombieDrift",
            "hero-title": "HOCKEY ZOMBIE<br><span class=\"highlight-text\">MULTIPLAYER</span>",
            "hero-desc": "A mad hybrid of a sports simulator and co-op survival in 1v1 PvP format. Crush hordes of zombies with your hockey stick and shoot jumping zombie pucks into the opponent's goal!",
            "btn-learn": "About the Game",
            "btn-play-sim": "Play Chess Phase",
            "about-tag": "Gameplay",
            "about-title": "SPORTS. BLOOD. SURVIVAL.",
            "about-subtitle": "Dynamic duels on an ice arena with zombie hordes, where classic hockey rules are blended with the apocalypse.",
            "feat1-title": "Intense 1v1 PvP",
            "feat1-desc": "Play against a real opponent. Control the ice, command your helper bots, and defend your goal.",
            "feat2-title": "Live \"Zombie Pucks\"",
            "feat2-desc": "Regular pucks are obsolete! Hunt down special Jumper zombies, grab them with your stick, and launch them into the goal.",
            "feat3-title": "50+ Zombies on Arena",
            "feat3-desc": "Hordes of walking dead constantly block your way. Clear the ice with heavy stick strikes to break through to your target.",
            "chess-tag": "Interactive Simulator",
            "chess-title": "CHESS PHASE (RPS)",
            "chess-subtitle": "Before each period, players secretly choose strategy cards for their hockey bots based on the Rock-Paper-Scissors principle.",
            "chess-intro-title": "Select a strategy card for the next period:",
            "chess-intro-desc": "Your tactics will determine stat buffs (speed, hit power, health) for your helper bots.",
            "card-att-title": "ATTACK",
            "card-att-benefit": "Beats Control<br><small>+25% Hit Power</small>",
            "card-ctrl-title": "CONTROL",
            "card-ctrl-benefit": "Beats Defense<br><small>+20% Run Speed</small>",
            "card-def-title": "DEFENSE",
            "card-def-benefit": "Beats Attack<br><small>+30% Bot Health</small>",
            "btn-reveal": "Reveal Cards",
            "btn-reset": "Start Over",
            "sim-your-choice": "Your Choice",
            "sim-opp-choice": "Opponent Choice",
            "sim-start-prompt": "Choose a card above to start...",
            "cust-tag": "Customization",
            "cust-title": "HOCKEY PLAYER SETUP",
            "cust-subtitle": "Create your style on the arena. Nicknames and gear colors sync instantly via the PurrNet network.",
            "cust-panel-title": "Locker Room Panel",
            "cust-label-nick": "Player Nickname",
            "cust-label-color": "Team Color (SyncVar)",
            "cust-label-gear": "Gear Gearbox (SkinIndex)",
            "cust-opt-jersey": "Default Jersey (Jersey Retro)",
            "cust-opt-armor": "Cyber Protection (Cyber Armor)",
            "cust-opt-surv": "Wasteland Survivor",
            "cust-sync-status": "SYNCHRONIZED WITH SERVER",
            "road-tag": "Development",
            "road-title": "PROJECT ROADMAP",
            "road-subtitle": "Follow the development progress of Hockey Zombie Multiplayer. We continuously optimize the code and add new features.",
            "road-date1": "April 2026",
            "road-title1": "Game Pipeline & Bot AI",
            "road-desc1": "Implemented full 3-period match cycle, network strategy cards selection (Chess Phase), and authoritative hockey bot AI that attacks zombies and scores goals.",
            "road-date2": "May 2026",
            "road-title2": "Physics Stability & Customization",
            "road-desc2": "Integrated PlayerDataManager with PlayerPrefs. Added NaN-validation to prevent server PhysX crashes. Prepared visual controller for material swapping.",
            "road-date3": "June 2026 (Current)",
            "road-title3": "🧟 Zombie Sync Fix & Skins",
            "road-desc3": "Optimized Rigidbody and NavMeshAgent configurations for client proxies. Testing customization synchronization on ParrelSync multi-editor build.",
            "road-date4": "July - August 2026",
            "road-title4": "Gameplay & Defense",
            "road-desc4": "Adding fail-states for missed zombie goals, hit/score sound FX, server-side anti-cheat logic, and lag compensation for the Jumper puck.",
            "cont-tag": "Feedback",
            "cont-title": "GET IN TOUCH WITH STUDIO",
            "cont-subtitle": "Want to suggest a feature, report a bug, or discuss collaboration? Drop us a line!",
            "cont-label-name": "Your name",
            "cont-label-email": "E-mail",
            "cont-label-msg": "Message",
            "btn-send": "Send Message",
            "foot-desc": "ZombieDrift Studio — independent developer of high-octane multiplayer action games.",
            "foot-nav-title": "Navigation",
            "foot-copy": "&copy; 2026 ZombieDrift. All rights reserved.",
            "foot-credits": "Made for demonstrating the Hockey Zombie Multiplayer project.",
            // Simulator strings
            "choice-att": "⚔️ ATTACK",
            "choice-ctrl": "🛡️ CONTROL",
            "choice-def": "🧱 DEFENSE",
            "sim-choosing": "CHOOSING...",
            "res-tie-title": "CHESS PHASE TIE!",
            "res-tie-desc": "Both selected {choice}. Your bots did not get any buffs. The period starts on equal ground!",
            "res-win-title": "CHESS PHASE VICTORY!",
            "res-win-att": "ATTACK beats CONTROL! Your bots received a buff: <span class=\"highlight-text\">+25% Stick Hit Power</span> for the next period.",
            "res-win-ctrl": "CONTROL beats DEFENSE! Your bots received a buff: <span class=\"text-neon-cyan\">+20% Run Speed</span> for the next period.",
            "res-win-def": "DEFENSE beats ATTACK! Your bots received a buff: <span class=\"text-neon-magenta\">+30% Max Health</span> for the next period.",
            "res-lose-title": "CHESS PHASE DEFEAT!",
            "res-lose-att": "Opponent chose ATTACK and defeated your CONTROL. Their bots received a hit power buff. Watch out!",
            "res-lose-ctrl": "Opponent chose CONTROL and defeated your DEFENSE. Their bots will run faster!",
            "res-lose-def": "Opponent chose DEFENSE and defeated your ATTACK. Their bots received extra health!",
            "form-success": "<strong>Message delivered successfully!</strong><br>ZombieDrift team will contact you at the provided email within 24 hours."
        },
        ua: {
            "doc-title": "ZombieDrift Studio | Hockey Zombie Multiplayer",
            "nav-about": "Про гру",
            "nav-chess": "Шахова фаза",
            "nav-skins": "Скіни",
            "nav-roadmap": "Дорожня карта",
            "nav-contact": "Контакти",
            "btn-join": "Вступить в бій",
            "hero-tag": "Свіжий реліз від ZombieDrift",
            "hero-title": "HOCKEY ZOMBIE<br><span class=\"highlight-text\">MULTIPLAYER</span>",
            "hero-desc": "Шалений гібрид спортивного симулятора та кооперативного виживання у форматі 1v1 PvP. Розбивайте натовпи зомбі ключкою та забивайте зомбі-шайб («стрибунів») у ворота суперника!",
            "btn-learn": "Детальніше про гру",
            "btn-play-sim": "Зіграти в Chess Phase",
            "about-tag": "Ігровий процес",
            "about-title": "СПОРТ. КРОВ. ВИЖИВАННЯ.",
            "about-subtitle": "Динамічні дуелі на льодовій арені з натовпами зомбі, де класичні хокейні правила змішалися з апокаліпсисом.",
            "feat1-title": "Інтенсивний 1v1 PvP",
            "feat1-desc": "Ви граєте проти реального суперника. Контролюйте лід, командуйте ботами-помічниками та захищайте свої ворота.",
            "feat2-title": "Живі \"Зомбі-Шайби\"",
            "feat2-desc": "Звичайні шайби застаріли! Вистежуйте особливих зомбі-стрибунів (Jumpers), захоплюйте їх ключкою та запускайте потужними ударами у ворота.",
            "feat3-title": "50+ Зомбі на арені",
            "feat3-desc": "Натовпи ходячих мерців постійно заважають грі. Зачищайте лід сильними ударами ключки, щоб пробитися до своєї мети.",
            "chess-tag": "Інтерактивний симулятор",
            "chess-title": "ШАХОВА ФАЗА (RPS)",
            "chess-subtitle": "Перед початком кожного періоду гравці таємно обирають карти стратегії для ботів за принципом Камінь-Ножиці-Папір.",
            "chess-intro-title": "Оберіть карту стратегії на наступний період:",
            "chess-intro-desc": "Ваша тактика визначить баффовання характеристик (швидкість, сила удару, здоров'я) ваших ботів-помічників.",
            "card-att-title": "АТАКА",
            "card-att-benefit": "Перемагає Контроль<br><small>+25% Сила удару</small>",
            "card-ctrl-title": "КОНТРОЛЬ",
            "card-ctrl-benefit": "Перемагає Захист<br><small>+20% Швидкість бігу</small>",
            "card-def-title": "ЗАХИСТ",
            "card-def-benefit": "Перемагає Атаку<br><small>+30% Здоров'я ботів</small>",
            "btn-reveal": "Розкрити карти",
            "btn-reset": "Почати заново",
            "sim-your-choice": "Ваш вибір",
            "sim-opp-choice": "Вибір Суперника",
            "sim-start-prompt": "Оберіть карту вище, щоб почати...",
            "cust-tag": "Кастомізація",
            "cust-title": "НАЛАШТУВАННЯ ХОКЕЇСТА",
            "cust-subtitle": "Створіть свій стиль на арені. Нікнейм та кольори екіпірування миттєво синхронізуються через мережу PurrNet.",
            "cust-panel-title": "Панель роздягальні",
            "cust-label-nick": "Ім'я хокеїста (Нікнейм)",
            "cust-label-color": "Колір команди (SyncVar)",
            "cust-label-gear": "Екіпірування (SkinIndex)",
            "cust-opt-jersey": "Стандартний джерсі (Jersey Retro)",
            "cust-opt-armor": "Кібер-захист (Cyber Armor)",
            "cust-opt-surv": "Вцілілий хокеїст (Wasteland Survivor)",
            "cust-sync-status": "СИНХРОНІЗОВАНО З СЕРВЕРОМ",
            "road-tag": "Розвиток",
            "road-title": "ДОРОЖНЯ КАРТА ПРОЕКТА",
            "road-subtitle": "Слідкуйте за прогресом розробки Hockey Zombie Multiplayer. Ми постійно покращуємо код та додаємо нові можливості.",
            "road-date1": "Квітень 2026",
            "road-title1": "Ігровий пайплайн та ШІ ботів",
            "road-desc1": "Реалізовано повний цикл 3-періодного матчу, мережева фаза вибору карт стратегій (Chess Phase) та авторитетний ШІ ботів-хокеїстів, здатних бити зомбі та забивати стрибунів.",
            "road-date2": "Травень 2026",
            "road-title2": "Фізична стабільність та кастомізація",
            "road-desc2": "Інтегровано менеджер даних гравця (PlayerDataManager) з підтримкою PlayerPrefs. Додано NaN-валідацію для запобігання PhysX крашів на сервері. Підготовлено візуальний контролер зміни матеріалів.",
            "road-date3": "Червень 2026 (Поточний етап)",
            "road-title3": "🧟 Виправлення синхронізації зомбі & Скіни",
            "road-desc3": "Оптимізація роботи Rigidbody та NavMeshAgent зомби на стороні клієнта (усунення посмикувань). Розгортання UI зміни скінів хокеїстів на ParrelSync мультиплеерних тестах.",
            "road-date4": "Липень - Серпень 2026",
            "road-title4": "Геймплей та захист",
            "road-desc4": "Впровадження механіки фейл-стейту при пропущенних голах від зомбі, аудіосистеми озвучки голів та серверного античіта (Server-side validation) з лагокомпенсацією для стрибуна.",
            "cont-tag": "Зворотній зв'язок",
            "cont-title": "ЗВ'ЯЗАТИСЯ ЗІ СТУДІЄЮ",
            "cont-subtitle": "Хочете запропонувати фічу, повідомити про баг або обговорити співпрацю? Напишіть нам!",
            "cont-label-name": "Ваше ім'я",
            "cont-label-email": "Ел. пошта",
            "cont-label-msg": "Повідомлення",
            "btn-send": "Надіслати повідомлення",
            "foot-desc": "ZombieDrift Studio — незалежний розробник високодинамічних мультиплеерних екшенів.",
            "foot-nav-title": "Навігація",
            "foot-copy": "&copy; 2026 ZombieDrift. Всі права захищені.",
            "foot-credits": "Зроблено для демонстрації проекту Hockey Zombie Multiplayer.",
            // Simulator strings
            "choice-att": "⚔️ АТАКА",
            "choice-ctrl": "🛡️ КОНТРОЛЬ",
            "choice-def": "🧱 ЗАХИСТ",
            "sim-choosing": "ВИБІР...",
            "res-tie-title": "НІЧИЯ У ШАХОВІЙ ФАЗІ!",
            "res-tie-desc": "Обидва обрали {choice}. Ваші боти не отримали баффів. Період почнеться в рівних умовах!",
            "res-win-title": "ПЕРЕМОГА У ШАХОВІЙ ФАЗІ!",
            "res-win-att": "АТАКА перемагає КОНТРОЛЬ! Ваші боти отримали бафф: <span class=\"highlight-text\">+25% до Сили удару ключкою</span> на наступний період.",
            "res-win-ctrl": "КОНТРОЛЬ перемагає ЗАХИСТ! Ваші боти отримали бафф: <span class=\"text-neon-cyan\">+20% до Швидкості бігу</span> на наступний період.",
            "res-win-def": "ЗАХИСТ перемагає АТАКУ! Ваші боти отримали бафф: <span class=\"text-neon-magenta\">+30% до Максимального здоров'я</span> на наступний період.",
            "res-lose-title": "ПОРАЗКА У ШАХОВІЙ ФАЗІ!",
            "res-lose-att": "Суперник обрав АТАКУ і переміг ваш КОНТРОЛЬ. Його боти отримали бафф на силу удару. Будьте обережні!",
            "res-lose-ctrl": "Суперник обрав КОНТРОЛЬ і переміг вашу ЗАЩИТУ. Його боти бігатимуть швидше!",
            "res-lose-def": "Суперник обрав ЗАХИСТ і переміг вашу АТАКУ. Його боти отримали додаткове здоров'я!",
            "form-success": "<strong>Повідомлення успішно доставлено!</strong><br>Команда ZombieDrift зв'яжеться з вами за вказаною поштою протягом 24 годин."
        }
    };

    let currentLang = 'ru';

    function setLanguage(lang) {
        if (!translations[lang]) return;
        currentLang = lang;
        
        document.querySelectorAll('[data-i18n]').forEach(elem => {
            const key = elem.getAttribute('data-i18n');
            if (translations[lang][key]) {
                if (key === 'doc-title') {
                    document.title = translations[lang][key];
                } else {
                    elem.innerHTML = translations[lang][key];
                }
            }
        });
        
        const nickInput = document.getElementById('custom-nickname');
        const nameInput = document.getElementById('form-name');
        const msgTextarea = document.getElementById('form-message');
        
        if (lang === 'en') {
            nickInput.placeholder = "Enter nickname";
            nameInput.placeholder = "Max";
            msgTextarea.placeholder = "Tell us your ideas on improving zombie physics or network code...";
        } else if (lang === 'ua') {
            nickInput.placeholder = "Введіть нікнейм";
            nameInput.placeholder = "Максим";
            msgTextarea.placeholder = "Розкажіть нам про ваші ідеї щодо покращення фізики зомбі або мережевого коду...";
        } else {
            nickInput.placeholder = "Введите никнейм";
            nameInput.placeholder = "Максим";
            msgTextarea.placeholder = "Расскажите нам о ваших идеях по улучшению физики зомби или сетевого кода...";
        }
        
        if (playerChoice === null) {
            screenResult.textContent = translations[lang]['sim-start-prompt'];
        }
    }

    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });


    /* ==========================================
       4. INTERACTIVE CHESS PHASE SIMULATOR
       ========================================== */
    const chessCards = document.querySelectorAll('.chess-card');
    const btnReveal = document.getElementById('btn-reveal-choice');
    const btnReset = document.getElementById('btn-reset-sim');
    const slotPlayer = document.getElementById('slot-player');
    const slotOpponent = document.getElementById('slot-opponent');
    const screenResult = document.getElementById('screen-result-text');
    
    let playerChoice = null;
    const choices = ['attack', 'control', 'defense'];
    
    const choiceColors = {
        attack: '#bd00ff', // Magenta
        control: '#00d2ff', // Cyan
        defense: '#00ff66'  // Green
    };

    chessCards.forEach(card => {
        card.addEventListener('click', () => {
            if (btnReveal.classList.contains('btn-disabled') === false && playerChoice !== null) {
                if (btnReset.classList.contains('btn-hidden') === false) return;
            }
            
            chessCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            playerChoice = card.getAttribute('data-card');
            
            btnReveal.classList.remove('btn-disabled');
            btnReveal.removeAttribute('disabled');
            
            const translationKey = `choice-${playerChoice.substring(0, 4)}`;
            slotPlayer.textContent = translations[currentLang][translationKey];
            slotPlayer.style.borderColor = choiceColors[playerChoice];
            slotPlayer.style.boxShadow = `0 0 10px ${choiceColors[playerChoice]}`;
            
            if (currentLang === 'en') {
                screenResult.textContent = 'Card selected. Press "Reveal Cards" to run simulation.';
            } else if (currentLang === 'ua') {
                screenResult.textContent = 'Карту обрано. Натисніть "Розкрити карти" для симуляції періоду.';
            } else {
                screenResult.textContent = 'Карта выбрана. Нажмите "Раскрыть карты" для симуляции периода.';
            }
        });
    });

    btnReveal.addEventListener('click', () => {
        if (!playerChoice) return;
        
        btnReveal.classList.add('btn-hidden');
        
        slotOpponent.textContent = translations[currentLang]['sim-choosing'];
        slotOpponent.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        slotOpponent.style.boxShadow = 'none';
        
        let blinkCount = 0;
        const interval = setInterval(() => {
            const tempChoice = choices[Math.floor(Math.random() * choices.length)];
            const translationKey = `choice-${tempChoice.substring(0, 4)}`;
            slotOpponent.textContent = translations[currentLang][translationKey];
            blinkCount++;
            
            if (blinkCount > 8) {
                clearInterval(interval);
                
                const opponentChoice = choices[Math.floor(Math.random() * choices.length)];
                const finalTranslationKey = `choice-${opponentChoice.substring(0, 4)}`;
                slotOpponent.textContent = translations[currentLang][finalTranslationKey];
                slotOpponent.style.borderColor = choiceColors[opponentChoice];
                slotOpponent.style.boxShadow = `0 0 10px ${choiceColors[opponentChoice]}`;
                
                determineChessResult(playerChoice, opponentChoice);
                btnReset.classList.remove('btn-hidden');
            }
        }, 120);
    });

    function determineChessResult(player, opponent) {
        let title = '';
        let desc = '';
        let status = 'lose';
        
        if (player === opponent) {
            status = 'tie';
        } else if (
            (player === 'attack' && opponent === 'control') ||
            (player === 'control' && opponent === 'defense') ||
            (player === 'defense' && opponent === 'attack')
        ) {
            status = 'win';
        }
        
        if (status === 'tie') {
            title = translations[currentLang]['res-tie-title'];
            const choiceText = translations[currentLang][`choice-${player.substring(0, 4)}`].split(' ')[1];
            desc = translations[currentLang]['res-tie-desc'].replace('{choice}', choiceText);
            screenResult.style.color = 'var(--text-muted)';
        } else if (status === 'win') {
            title = translations[currentLang]['res-win-title'];
            desc = translations[currentLang][`res-win-${player.substring(0, 4)}`];
            screenResult.style.color = 'var(--neon-green)';
        } else {
            title = translations[currentLang]['res-lose-title'];
            desc = translations[currentLang][`res-lose-${opponent.substring(0, 4)}`];
            screenResult.style.color = '#ff3333';
        }
        
        screenResult.innerHTML = `<strong>${title}</strong><br>${desc}`;
    }

    btnReset.addEventListener('click', () => {
        playerChoice = null;
        chessCards.forEach(c => c.classList.remove('selected'));
        
        slotPlayer.textContent = '—';
        slotPlayer.style.borderColor = 'rgba(255, 255, 255, 0.05)';
        slotPlayer.style.boxShadow = 'none';
        
        slotOpponent.textContent = '—';
        slotOpponent.style.borderColor = 'rgba(255, 255, 255, 0.05)';
        slotOpponent.style.boxShadow = 'none';
        
        screenResult.textContent = translations[currentLang]['sim-start-prompt'];
        screenResult.style.color = 'var(--text-muted)';
        
        btnReveal.classList.add('btn-disabled');
        btnReveal.setAttribute('disabled', 'true');
        btnReveal.classList.remove('btn-hidden');
        
        btnReset.classList.add('btn-hidden');
    });


    /* ==========================================
       5. INTERACTIVE PLAYER CUSTOMIZER
       ========================================== */
    const nicknameInput = document.getElementById('custom-nickname');
    const nameplate = document.getElementById('player-nameplate');
    const colorBtns = document.querySelectorAll('.color-btn');
    const skinSelect = document.getElementById('skin-index-select');
    const playerNumber = document.getElementById('player-number');
    const root = document.documentElement;
    
    nicknameInput.addEventListener('input', (e) => {
        let value = e.target.value.trim();
        if (value === '') {
            nameplate.textContent = 'ZombieKicker';
        } else {
            nameplate.textContent = value;
        }
        
        const charSum = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const calcNumber = (charSum % 99) + 1;
        playerNumber.textContent = calcNumber;
    });
    
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const selectedColor = btn.getAttribute('data-color');
            root.style.setProperty('--player-color', selectedColor);
            
            if (selectedColor === '#00ff66') {
                root.style.setProperty('--player-visor-color', '#00ff66');
            } else if (selectedColor === '#00d2ff') {
                root.style.setProperty('--player-visor-color', '#ffcc00');
            } else {
                root.style.setProperty('--player-visor-color', '#00ff66');
            }
        });
    });
    
    skinSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        const playerJersey = document.getElementById('player-jersey');
        const playerArmor = document.getElementById('player-armor');
        
        if (value === '0') {
            playerJersey.setAttribute('rx', '5');
            playerArmor.setAttribute('d', 'M 50,90 Q 100,70 150,90 L 160,115 L 40,115 Z');
        } else if (value === '1') {
            playerJersey.setAttribute('rx', '15');
            playerArmor.setAttribute('d', 'M 45,90 Q 100,60 155,90 L 168,115 L 32,115 Z');
        } else if (value === '2') {
            playerJersey.setAttribute('rx', '0');
            playerArmor.setAttribute('d', 'M 52,90 Q 100,80 148,90 L 158,115 L 42,115 Z');
        }
    });


    /* ==========================================
       6. CONTACT FORM & SUBMISSION HANDLER
       ========================================== */
    const form = document.getElementById('studio-contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const btnSubmit = document.getElementById('btn-submit-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const originalText = translations[currentLang]['btn-send'];
        btnSubmit.textContent = currentLang === 'en' ? 'SENDING...' : (currentLang === 'ua' ? 'ВІДПРАВКА...' : 'ОТПРАВКА...');
        btnSubmit.classList.add('btn-disabled');
        btnSubmit.setAttribute('disabled', 'true');
        
        setTimeout(() => {
            formFeedback.classList.remove('hidden');
            formFeedback.className = 'form-feedback-message success';
            formFeedback.innerHTML = translations[currentLang]['form-success'];
            
            form.reset();
            
            btnSubmit.textContent = originalText;
            btnSubmit.classList.remove('btn-disabled');
            btnSubmit.removeAttribute('disabled');
            
            setTimeout(() => {
                formFeedback.classList.add('hidden');
            }, 8000);
            
        }, 1500);
    });
});
