/* ==========================================================================
   ZOMBIEDRIFT STUDIO - INTERACTIVE JS LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    let playerChoice = null;
    let opponentChoice = null;
    let isRevealed = false;

    /* ==========================================
       1. BACKGROUND CANVAS PARTICLE EFFECT
       ========================================== */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        let crystalsArray = [];
        let scratchArray = [];
        let sprayArray = [];
        
        let lastMouseX = null;
        let lastMouseY = null;
        
        // Dynamic section offsets for rink lines
        let sectionOffsets = {
            hero: 0,
            about: 1000,
            chess: 2000,
            roadmap: 3000,
            contact: 4000
        };
        
        function updateSectionOffsets() {
            const hero = document.getElementById('hero');
            const about = document.getElementById('about-game');
            const chess = document.getElementById('chess-phase');
            const roadmap = document.getElementById('roadmap');
            const contact = document.getElementById('contact');
            
            sectionOffsets.hero = hero ? hero.offsetTop : 0;
            sectionOffsets.about = about ? about.offsetTop : 900;
            sectionOffsets.chess = chess ? chess.offsetTop : 1700;
            sectionOffsets.roadmap = roadmap ? roadmap.offsetTop : 2500;
            sectionOffsets.contact = contact ? contact.offsetTop : 3400;
        }
        
        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            updateSectionOffsets();
        }
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);
        window.addEventListener('load', updateSectionOffsets);
        
        // Ice Crystal / Snowflake Particle Class
        class IceCrystal {
            constructor() {
                this.reset(true);
            }
            
            reset(randomY = false) {
                this.x = Math.random() * canvas.width;
                this.y = randomY ? Math.random() * canvas.height : -20;
                this.size = Math.random() * 4 + 1.2;
                // Larger crystals fall faster (parallax)
                this.speedY = (this.size * 0.22) + Math.random() * 0.3 + 0.1;
                this.speedX = (Math.random() * 0.4 - 0.2) + 0.05; // slight drift to the right
                this.swaySpeed = 0.01 + Math.random() * 0.02;
                this.swayAngle = Math.random() * Math.PI * 2;
                this.swayRadius = Math.random() * 0.5 + 0.2;
                this.opacity = (this.size / 5) * 0.35 + 0.05;
                this.angle = Math.random() * Math.PI * 2;
                this.spin = (Math.random() - 0.5) * 0.01;
                
                // Types: 0 = soft circle, 1 = ice shard (diamond), 2 = cross crystal
                this.type = Math.floor(Math.random() * 3);
                
                // Colors: white, cold cyan-blue, soft green biohazard ice
                const colors = [
                    `rgba(240, 248, 255, ${this.opacity})`, // Ice white
                    `rgba(165, 243, 252, ${this.opacity})`, // Ice cyan
                    `rgba(180, 255, 200, ${this.opacity * 0.8})` // Biohazard soft green
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            update() {
                this.y += this.speedY;
                this.swayAngle += this.swaySpeed;
                this.x += this.speedX + Math.sin(this.swayAngle) * this.swayRadius;
                this.angle += this.spin;
                
                // Reset if off-screen
                if (this.y > canvas.height + 20) {
                    this.reset(false);
                }
                if (this.x > canvas.width + 20) {
                    this.x = -20;
                } else if (this.x < -20) {
                    this.x = canvas.width + 20;
                }
            }
            
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.fillStyle = this.color;
                
                if (this.type === 0) {
                    // Soft circle snow
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                    ctx.fill();
                } else if (this.type === 1) {
                    // Diamond ice shard
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size * 1.5);
                    ctx.lineTo(this.size, 0);
                    ctx.lineTo(0, this.size * 1.5);
                    ctx.lineTo(-this.size, 0);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    // Ice cross crystal
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(-this.size * 1.2, 0);
                    ctx.lineTo(this.size * 1.2, 0);
                    ctx.moveTo(0, -this.size * 1.2);
                    ctx.lineTo(0, this.size * 1.2);
                    ctx.stroke();
                }
                ctx.restore();
            }
        }
        
        // Ice Shaving Spray Particle Class
        class IceSpray {
            constructor(x, y, vx, vy) {
                this.x = x;
                this.y = y;
                this.vx = vx + (Math.random() - 0.5) * 1.5;
                this.vy = vy - Math.random() * 1.5;
                this.size = Math.random() * 2 + 0.8;
                this.life = 0.6 + Math.random() * 0.4;
                this.decay = 0.015 + Math.random() * 0.015;
                this.gravity = 0.08;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += this.gravity;
                this.life -= this.decay;
            }
            
            draw() {
                ctx.fillStyle = `rgba(224, 242, 254, ${this.life * 0.5})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        function initCrystals() {
            crystalsArray = [];
            const numberOfCrystals = Math.floor((canvas.width * canvas.height) / 10000);
            const cappedCrystals = Math.min(numberOfCrystals, 120); // Cap for performance
            for (let i = 0; i < cappedCrystals; i++) {
                crystalsArray.push(new IceCrystal());
            }
        }
        initCrystals();
        window.addEventListener('resize', initCrystals);
        
        // Listen to mousemove for ice scratches and sprays
        window.addEventListener('mousemove', (e) => {
            const mx = e.clientX;
            const my = e.clientY;
            
            if (lastMouseX !== null && lastMouseY !== null) {
                const dx = mx - lastMouseX;
                const dy = my - lastMouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Add scratch segment if mouse moved
                if (dist > 1) {
                    scratchArray.push({
                        x1: lastMouseX,
                        y1: lastMouseY,
                        x2: mx,
                        y2: my,
                        life: 1.0,
                        decay: 0.006 + Math.random() * 0.006
                    });
                }
                
                // Add spray particles if mouse moved fast
                if (dist > 6) {
                    const sprayCount = Math.min(Math.floor(dist / 3), 6);
                    for (let i = 0; i < sprayCount; i++) {
                        const ratio = i / sprayCount;
                        const px = lastMouseX + dx * ratio;
                        const py = lastMouseY + dy * ratio;
                        const vx = -dx * 0.15;
                        const vy = -dy * 0.15;
                        sprayArray.push(new IceSpray(px, py, vx, vy));
                    }
                }
            }
            
            lastMouseX = mx;
            lastMouseY = my;
        });
        
        // Fade out mouse position when mouse leaves the window
        window.addEventListener('mouseout', () => {
            lastMouseX = null;
            lastMouseY = null;
        });
        
        // Draw hockey rink lines relative to scrollY
        function drawRinkMarkings() {
            const sy = window.scrollY;
            
            // Draw center circle and red line in Chess Simulator
            // Chess offset is the center line of the arena
            const chessCenterY = sectionOffsets.chess + 400; // approximate center of simulator box
            const centerDrawY = chessCenterY - sy;
            
            // Draw red goal lines
            const topGoalY = sectionOffsets.hero + 150 - sy;
            
            // Find total document height to draw bottom goal line
            const docHeight = document.documentElement.scrollHeight || 4000;
            const bottomGoalY = docHeight - 200 - sy;
            
            // Blue zone lines
            const blueLine1Y = sectionOffsets.about - sy;
            const blueLine2Y = sectionOffsets.roadmap - sy;
            
            // Draw First Blue Line
            if (blueLine1Y >= -10 && blueLine1Y <= canvas.height + 10) {
                ctx.strokeStyle = 'rgba(0, 165, 255, 0.05)';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.moveTo(0, blueLine1Y);
                ctx.lineTo(canvas.width, blueLine1Y);
                ctx.stroke();
            }
            
            // Draw Second Blue Line
            if (blueLine2Y >= -10 && blueLine2Y <= canvas.height + 10) {
                ctx.strokeStyle = 'rgba(0, 165, 255, 0.05)';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.moveTo(0, blueLine2Y);
                ctx.lineTo(canvas.width, blueLine2Y);
                ctx.stroke();
            }
            
            // Draw Center red line, center faceoff circle, and faceoff dots
            if (centerDrawY >= -150 && centerDrawY <= canvas.height + 150) {
                // Red center line
                ctx.strokeStyle = 'rgba(255, 60, 60, 0.04)';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(0, centerDrawY);
                ctx.lineTo(canvas.width, centerDrawY);
                ctx.stroke();
                
                // Center faceoff circle
                ctx.strokeStyle = 'rgba(0, 165, 255, 0.04)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(canvas.width / 2, centerDrawY, 110, 0, Math.PI * 2);
                ctx.stroke();
                
                // Center faceoff dot
                ctx.fillStyle = 'rgba(255, 60, 60, 0.05)';
                ctx.beginPath();
                ctx.arc(canvas.width / 2, centerDrawY, 8, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Goal crease at top
            if (topGoalY >= -100 && topGoalY <= canvas.height + 100) {
                // Goal line
                ctx.strokeStyle = 'rgba(255, 60, 60, 0.04)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, topGoalY);
                ctx.lineTo(canvas.width, topGoalY);
                ctx.stroke();
                
                // Goal crease (semi circle facing down)
                ctx.strokeStyle = 'rgba(0, 165, 255, 0.03)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(canvas.width / 2, topGoalY, 50, 0, Math.PI);
                ctx.stroke();
            }
            
            // Goal crease at bottom
            if (bottomGoalY >= -100 && bottomGoalY <= canvas.height + 100) {
                // Goal line
                ctx.strokeStyle = 'rgba(255, 60, 60, 0.04)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, bottomGoalY);
                ctx.lineTo(canvas.width, bottomGoalY);
                ctx.stroke();
                
                // Goal crease (semi circle facing up)
                ctx.strokeStyle = 'rgba(0, 165, 255, 0.03)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(canvas.width / 2, bottomGoalY, 50, Math.PI, Math.PI * 2);
                ctx.stroke();
            }
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 1. Draw Rink Markings in background
            drawRinkMarkings();
            
            // 2. Draw & Update Skate Scratches
            for (let i = scratchArray.length - 1; i >= 0; i--) {
                const s = scratchArray[i];
                s.life -= s.decay;
                if (s.life <= 0) {
                    scratchArray.splice(i, 1);
                    continue;
                }
                
                ctx.strokeStyle = `rgba(230, 245, 255, ${s.life * 0.15})`;
                ctx.lineWidth = 1 + s.life * 1.5;
                ctx.beginPath();
                ctx.moveTo(s.x1, s.y1);
                ctx.lineTo(s.x2, s.y2);
                ctx.stroke();
            }
            
            // 3. Draw & Update Spray
            for (let i = sprayArray.length - 1; i >= 0; i--) {
                const sp = sprayArray[i];
                sp.update();
                if (sp.life <= 0) {
                    sprayArray.splice(i, 1);
                    continue;
                }
                sp.draw();
            }
            
            // 4. Draw & Update Snowflakes / crystals
            for (let i = 0; i < crystalsArray.length; i++) {
                crystalsArray[i].update();
                crystalsArray[i].draw();
            }
            
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }


    /* ==========================================
       2. MOBILE HAMBURGER MENU TOGGLE
       ========================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('nav-links');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
        
        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }


    /* ==========================================
       3. TRANSLATIONS SYSTEM (LOCALIZATION)
       ========================================== */
    const translations = {
        ru: {
            "doc-title": "ZombieDrift Studio | Hockey Zombie Multiplayer",
            "meta-desc": "Официальный сайт игровой студии ZombieDrift. Разработчики безумного спортивного экшена Hockey Zombie Multiplayer. Узнайте больше об игре, игровом процессе и технологиях.",
            "meta-key": "ZombieDrift, Hockey Zombie, Hockey Zombie Multiplayer, PurrNet, Zero-GC, Unity, 1v1 PvP, инди-игры",
            "nav-privacy": "Приватность",
            "nav-roadmap": "Дорожная карта",
            "nav-contact": "Контакты",
            "nav-about": "<span class=\"nav-text-desktop\">Об игре</span><span class=\"nav-text-mobile\">Игра</span>",
            "nav-chess": "<span class=\"nav-text-desktop\">Шахматы</span><span class=\"nav-text-mobile\">Chess</span>",
            "btn-join": "Вступить в бой",
            "hero-tag": "Новый проект от ZombieDrift",
            "hero-title": "HOCKEY ZOMBIE<br><span class=\"highlight-text\">MULTIPLAYER</span>",
            "hero-desc": "Что будет, если скрестить хоккей и зомби-апокалипсис? Ураганные PvP-дуэли 1 на 1, где вместо обычной шайбы прыгают зомби-мутанты, а толпа ходячих мертвецов на льду только мешает играть. Берите клюшку и покажите сопернику, кто тут босс!",
            "btn-learn": "Подробнее об игре",
            "btn-play-sim": "Сыграть в Chess Phase",
            "about-tag": "Игровой процесс",
            "about-title": "ХОККЕЙ, ЗОМБИ И МНОГО КРОВИ",
            "about-subtitle": "Ураганные дуэли на льду, кишащем зомби. Забудьте про классические правила — здесь выживает сильнейший.",
            "feat1-title": "Жаркие дуэли 1 на 1",
            "feat1-desc": "Сражайтесь с реальным соперником в реальном времени. Следите за льдом, раздавайте приказы своим ботам и защищайте ворота.",
            "feat2-title": "Зомби вместо шайбы",
            "feat2-desc": "Забудьте про пластиковый диск. Ловите особых прыгучих зомби (Jumpers), перехватывайте их клюшкой и отправляйте мощным щелчком прямо в ворота соперника.",
            "feat3-title": "Толпа зомби под ногами",
            "feat3-desc": "На арене постоянно шатаются десятки мертвецов, которые мешают пасовать и бегать. Пробивайте себе дорогу сильными ударами клюшки!",
            "chess-tag": "Интерактивный симулятор",
            "chess-title": "ТАКТИЧЕСКАЯ ФАЗА",
            "chess-subtitle": "Перед каждым периодом вы тайно выбираете тактику для своих ботов-помощников. Это как камень-ножницы-бумага, но с реальным влиянием на геймплей.",
            "chess-intro-title": "Выберите тактику на следующий период:",
            "chess-intro-desc": "Ваш выбор даст ботам-помощникам баффы к скорости, силе удара или здоровью.",
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
            "cookie-text": "Этот сайт использует файлы cookie и локальное хранилище для улучшения вашего игрового опыта. Подробнее в нашей <a href=\"privacy.html\">Политике конфиденциальности</a>.",
            "btn-cookie-accept": "Принять",
            "road-tag": "Развитие",
            "road-title": "ДОРОЖНАЯ КАРТА ПРОЕКТА",
            "road-subtitle": "Следите за тем, как создается Hockey Zombie Multiplayer. Мы делимся планами и регулярно рассказываем, что уже готово.",
            "road-date1": "Апрель 2026",
            "road-title1": "Игровой пайплайн и ИИ ботов",
            "road-desc1": "Собрали базу: готов полный матч из 3 периодов, фаза выбора тактики (Chess Phase) и базовый интеллект ботов — они уже умеют отбиваться от зомби и забивать голы.",
            "road-date2": "Май 2026",
            "road-title2": "Физическая стабильность и кастомизация",
            "road-desc2": "Сделали сохранение настроек игрока, исправили баг с падением физики на сервере (PhysX краши больше не страшны) и настроили систему смены скинов.",
            "road-date3": "Июнь 2026 (Текущий этап)",
            "road-title3": "🧟 Исправление синхронизации зомби & Скины",
            "road-desc3": "Сглаживаем сетевые движения зомби (убираем подергивания при ходьбе), тестируем интерфейс выбора скинов в мультиплеере через ParrelSync.",
            "road-date4": "Июль - Август 2026",
            "road-title4": "Геймплей и защита",
            "road-desc4": "Планируем добавить анимации при пропущенных голах, сочные звуковые эффекты, серверный античит и компенсацию задержек (лагкомпенсацию) для шайбы, что летит.",
            "cont-tag": "Обратная связь",
            "cont-title": "СВЯЗАТЬСЯ СО СТУДИЕЙ",
            "cont-subtitle": "Хотите предложить фичу, сообщить о баге или обсудить сотрудничество? Напишите нам!",
            "cont-label-name": "Ваше имя",
            "cont-label-email": "Эл. почта",
            "cont-label-msg": "Сообщение",
            "btn-send": "Отправить сообщение",
            "foot-desc": "ZombieDrift Studio — независимая команда, которая делает бодрые мультиплеерные экшены.",
            "foot-nav-title": "Навигация",
            "foot-copy": "&copy; 2026 ZombieDrift Studio™. Все права защищены.",
            "foot-credits": "Все права на Hockey Zombie Multiplayer™ и товарные знаки ZombieDrift™ защищены.",
            "foot-legal-link": "Политика конфиденциальности и защита ИС",
            "foot-icons-link": "Иконки от Icons8",
            "foot-tech-title": "Технологии",
            "foot-tech-desc": "Используем продвинутые сетевые технологии, чтобы игра шла плавно и без лагов даже при слабом интернете.",
            "legal-toast-msg": "Защита ИС: Копирование материалов и исходного кода запрещено.",
            // Simulator strings
            "choice-att": "⚔️ АТАКА",
            "choice-ctrl": "🧠 КОНТРОЛЬ",
            "choice-def": "🛡️ ЗАЩИТА",
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
            "meta-desc": "Official website of ZombieDrift game studio. Developers of the crazy sports action game Hockey Zombie Multiplayer. Find out more about the game, gameplay, and technologies.",
            "meta-key": "ZombieDrift, Hockey Zombie, Hockey Zombie Multiplayer, PurrNet, Zero-GC, Unity, 1v1 PvP, indie games",
            "nav-privacy": "Privacy",
            "nav-roadmap": "Roadmap",
            "nav-contact": "Contact",
            "nav-about": "<span class=\"nav-text-desktop\">About Game</span><span class=\"nav-text-mobile\">Game</span>",
            "nav-chess": "<span class=\"nav-text-desktop\">Chess Phase</span><span class=\"nav-text-mobile\">Chess</span>",
            "btn-join": "Enter Battle",
            "hero-tag": "New Project from ZombieDrift",
            "hero-title": "HOCKEY ZOMBIE<br><span class=\"highlight-text\">MULTIPLAYER</span>",
            "hero-desc": "What happens when you mix hockey with a zombie apocalypse? Fast-paced 1v1 PvP duels where mutant zombies are used instead of pucks, and hordes of the walking dead try to block your way. Grab your stick and show your opponent who's boss!",
            "btn-learn": "About the Game",
            "btn-play-sim": "Play Chess Phase",
            "about-tag": "Gameplay",
            "about-title": "HOCKEY, ZOMBIES, AND LOTS OF BLOOD",
            "about-subtitle": "High-octane duels on an ice rink crawling with zombies. Forget the classic rules — only the strongest survive.",
            "feat1-title": "Intense 1v1 Duels",
            "feat1-desc": "Fight a real opponent in real-time. Keep an eye on the ice, command your bots, and defend your goal.",
            "feat2-title": "Zombies as Pucks",
            "feat2-desc": "Forget the plastic puck. Catch special jumping zombies (Jumpers), grab them with your stick, and send them flying into the opponent's goal.",
            "feat3-title": "Hordes of Zombies",
            "feat3-desc": "Decades of walking dead wander around the rink, blocking your passes. Clear your path with heavy stick hits!",
            "chess-tag": "Interactive Simulator",
            "chess-title": "TACTICAL PHASE",
            "chess-subtitle": "Before each period, secretly choose tactics for your helper bots. It's rock-paper-scissors with real gameplay impact.",
            "chess-intro-title": "Choose a tactic for the next period:",
            "chess-intro-desc": "Your choice will give helper bots speed, hit power, or health buffs.",
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
            "cookie-text": "This site uses cookies and local storage to improve your gaming experience. Read more in our <a href=\"privacy.html\">Privacy Policy</a>.",
            "btn-cookie-accept": "Accept",
            "road-tag": "Development",
            "road-title": "PROJECT ROADMAP",
            "road-subtitle": "See how Hockey Zombie Multiplayer is being built. We share our roadmap and post regular updates on what's ready.",
            "road-date1": "April 2026",
            "road-title1": "Game Pipeline & Bot AI",
            "road-desc1": "Laid the groundwork: fully working 3-period match cycle, tactical cards selection phase (Chess Phase), and basic bot AI that fights zombies and scores goals.",
            "road-date2": "May 2026",
            "road-title2": "Physics Stability & Customization",
            "road-desc2": "Added local settings saving, fixed server physics crashes (PhysX errors are no longer an issue), and set up the skin swapping system.",
            "road-date3": "June 2026 (Current)",
            "road-title3": "🧟 Zombie Sync Fix & Skins",
            "road-desc3": "Smoothing out client-side zombie movements (getting rid of walking jitters) and testing multiplayer skin swapping via ParrelSync.",
            "road-date4": "July - August 2026",
            "road-title4": "Gameplay & Defense",
            "road-desc4": "Planning custom fail animations for missed goals, juicy sound effects, server-side anti-cheat, and lag compensation for the flying zombie puck.",
            "cont-tag": "Feedback",
            "cont-title": "GET IN TOUCH WITH STUDIO",
            "cont-subtitle": "Want to suggest a feature, report a bug, or discuss collaboration? Drop us a line!",
            "cont-label-name": "Your name",
            "cont-label-email": "E-mail",
            "cont-label-msg": "Message",
            "btn-send": "Send Message",
            "foot-desc": "ZombieDrift Studio — an independent team making high-octane multiplayer action games.",
            "foot-nav-title": "Navigation",
            "foot-copy": "&copy; 2026 ZombieDrift Studio™. All rights reserved.",
            "foot-credits": "All rights to Hockey Zombie Multiplayer™ and ZombieDrift™ trademarks are protected.",
            "foot-legal-link": "Privacy Policy & IP Protection",
            "foot-icons-link": "Icons by Icons8",
            "foot-tech-title": "Technologies",
            "foot-tech-desc": "We use modern networking tools to ensure smooth gameplay and zero lag even on slower connections.",
            "legal-toast-msg": "IP Protection: Copying assets and source code is prohibited.",
            // Simulator strings
            "choice-att": "⚔️ ATTACK",
            "choice-ctrl": "🧠 CONTROL",
            "choice-def": "🛡️ DEFENSE",
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
            "meta-desc": "Офіційний сайт ігрової студії ZombieDrift. Розробники божевільного спортивного екшену Hockey Zombie Multiplayer. Дізнайтеся більше про гру, ігровий процес та технології.",
            "meta-key": "ZombieDrift, Hockey Zombie, Hockey Zombie Multiplayer, PurrNet, Zero-GC, Unity, 1v1 PvP, інді-ігри",
            "nav-privacy": "Приватність",
            "nav-roadmap": "Дорожня карта",
            "nav-contact": "Контакти",
            "nav-about": "<span class=\"nav-text-desktop\">Про гру</span><span class=\"nav-text-mobile\">Гра</span>",
            "nav-chess": "<span class=\"nav-text-desktop\">Шахи</span><span class=\"nav-text-mobile\">Шахи</span>",
            "btn-join": "Вступити в бій",
            "hero-tag": "Новий проект від ZombieDrift",
            "hero-title": "HOCKEY ZOMBIE<br><span class=\"highlight-text\">MULTIPLAYER</span>",
            "hero-desc": "Що буде, якщо схрестити хокей та зомбі-апокаліпсис? Отримуємо динамічні PvP-дуелі 1 на 1, де замість шайби літають зомбі-мутанти, а натовп ходячих мерців на льоду постійно заважає грі. Беріть ключку і покажіть супернику, хто тут бос!",
            "btn-learn": "Детальніше про гру",
            "btn-play-sim": "Зіграти в Chess Phase",
            "about-tag": "Ігровий процес",
            "about-title": "ХОКЕЙ, ЗОМБІ ТА БАГАТО КРОВІ",
            "about-subtitle": "Шалені дуелі на льоду, що кишить зомбі. Забудьте про класичні правила — тут виживає найсильніший.",
            "feat1-title": "Запеклі дуелі 1 на 1",
            "feat1-desc": "Битва з реальним суперником у реальному часі. Стежте за льодом, віддавайте накази своїм ботам та захищайте ворота.",
            "feat2-title": "Зомбі замість шайби",
            "feat2-desc": "Забудьте про пластиковий диск. Ловіть особливих стрибучих зомбі (Jumpers), перехоплюйте їх ключкою та відправляйте потужним клацанням прямо у ворота суперника.",
            "feat3-title": "Натовп зомбі під ногами",
            "feat3-desc": "Натовпи ходячих мерців постійно заважають грі. Зачищайте лід сильними ударами ключки, щоб пробитися до своєї мети.",
            "chess-tag": "Інтерактивний симулятор",
            "chess-title": "ТАКТИЧНА ФАЗА",
            "chess-subtitle": "Перед кожним періодом ви таємно обираєте тактику для своїх ботів-помічників. Це як камінь-ножиці-папір, але з реальним впливом на гру.",
            "chess-intro-title": "Оберіть тактику на наступний період:",
            "chess-intro-desc": "Ваш вибір дасть ботам-помічникам баффи до швидкості, сили удару або здоров'я.",
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
            "cookie-text": "Цей сайт використовує файли cookie та локальне збереження для покращення вашого ігрового досвіду. Детальніше у нашій <a href=\"privacy.html\">Політиці конфіденційності</a>.",
            "btn-cookie-accept": "Прийняти",
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
            "foot-copy": "&copy; 2026 ZombieDrift Studio™. Всі права захищені.",
            "foot-credits": "Всі права на Hockey Zombie Multiplayer™ та товарні знаки ZombieDrift™ захищені.",
            "foot-legal-link": "Політика конфіденційності та захист ІВ",
            "foot-icons-link": "Іконки від Icons8",
            "foot-tech-title": "Технології",
            "foot-tech-desc": "Гра побудована на сучасному стеку для забезпечення нульового GC та плавної мережевої синхронізації.",
            "legal-toast-msg": "Захист ІВ: Копіювання матеріалів та вихідного коду заборонено.",
            // Simulator strings
            "choice-att": "⚔️ АТАКА",
            "choice-ctrl": "🧠 КОНТРОЛЬ",
            "choice-def": "🛡️ ЗАХИСТ",
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
        
        // Update <html lang> for SEO & accessibility (ua → uk per ISO 639-1)
        const langMap = { ru: 'ru', en: 'en', ua: 'uk' };
        document.documentElement.setAttribute('lang', langMap[lang] || lang);
        
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

        // Update meta tags for SEO
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && translations[lang]['meta-desc']) {
            metaDesc.setAttribute('content', translations[lang]['meta-desc']);
        }
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords && translations[lang]['meta-key']) {
            metaKeywords.setAttribute('content', translations[lang]['meta-key']);
        }

        // Update Open Graph and Twitter Card meta tags for SEO / Social Sharing
        const ogTitle = document.getElementById('og-title');
        const ogDesc = document.getElementById('og-desc');
        const twitterTitle = document.getElementById('twitter-title');
        const twitterDesc = document.getElementById('twitter-desc');
        
        if (ogTitle && translations[lang]['doc-title']) ogTitle.setAttribute('content', translations[lang]['doc-title']);
        if (ogDesc && translations[lang]['meta-desc']) ogDesc.setAttribute('content', translations[lang]['meta-desc']);
        if (twitterTitle && translations[lang]['doc-title']) twitterTitle.setAttribute('content', translations[lang]['doc-title']);
        if (twitterDesc && translations[lang]['meta-desc']) twitterDesc.setAttribute('content', translations[lang]['meta-desc']);
        
        const nameInput = document.getElementById('form-name');
        const msgTextarea = document.getElementById('form-message');
        
        if (nameInput && msgTextarea) {
            if (lang === 'en') {
                nameInput.placeholder = "Max";
                msgTextarea.placeholder = "Tell us your ideas on improving zombie physics or network code...";
            } else if (lang === 'ua') {
                nameInput.placeholder = "Максим";
                msgTextarea.placeholder = "Розкажіть нам про ваші ідеї щодо покращення фізики зомбі або мережевого коду...";
            } else {
                nameInput.placeholder = "Максим";
                msgTextarea.placeholder = "Расскажите нам о ваших идеях по улучшению физики зомби или сетевого кода...";
            }
        }

        // Also update cookie banner placeholders if visible
        const cookieTextElem = document.getElementById('cookie-text-content');
        const cookieBtnElem = document.getElementById('btn-cookie-accept');
        if (cookieTextElem && cookieBtnElem) {
            cookieTextElem.innerHTML = translations[lang]['cookie-text'];
            cookieBtnElem.textContent = translations[lang]['btn-cookie-accept'];
        }

        // Update elements with data-lang-content (used in privacy.html)
        document.querySelectorAll('[data-lang-content]').forEach(elem => {
            if (elem.getAttribute('data-lang-content') === lang) {
                elem.style.display = elem.tagName === 'SPAN' ? 'inline' : 'block';
            } else {
                elem.style.display = 'none';
            }
        });

        // Specific routing for privacy page title and metadata
        const isLegalPage = document.body.classList.contains('legal-body');
        if (isLegalPage) {
            const pageTitlesRU = {
                ru: "ZombieDrift Studio | Политика конфиденциальности и защита ИС",
                en: "ZombieDrift Studio | Privacy Policy & IP Protection",
                ua: "ZombieDrift Studio | Політика конфіденційності та захист ІВ"
            };
            const pageDescriptions = {
                ru: "Политика конфиденциальности и защита интеллектуальной собственности Hockey Zombie Multiplayer от ZombieDrift Studio.",
                en: "Privacy Policy and Intellectual Property Protection of Hockey Zombie Multiplayer by ZombieDrift Studio.",
                ua: "Політика конфіденційності та захист інтелектуальної власності Hockey Zombie Multiplayer від ZombieDrift Studio."
            };
            
            const titleText = pageTitlesRU[lang] || pageTitlesRU['en'];
            document.title = titleText;
            
            if (metaDesc && pageDescriptions[lang]) {
                metaDesc.setAttribute('content', pageDescriptions[lang]);
            }
            if (ogTitle) ogTitle.setAttribute('content', titleText);
            if (ogDesc && pageDescriptions[lang]) ogDesc.setAttribute('content', pageDescriptions[lang]);
            if (twitterTitle) twitterTitle.setAttribute('content', titleText);
            if (twitterDesc && pageDescriptions[lang]) twitterDesc.setAttribute('content', pageDescriptions[lang]);
        }
        
        localStorage.setItem('zombiedrift_lang', lang);

        const screenResult = document.getElementById('screen-result-text');
        if (playerChoice === null && screenResult) {
            screenResult.textContent = translations[lang]['sim-start-prompt'];
        }

        // Update simulator slots reactively if elements are loaded
        const slotPlayer = document.getElementById('slot-player');
        const slotOpponent = document.getElementById('slot-opponent');
        if (slotPlayer && slotOpponent) {
            if (playerChoice) {
                updateSlotVisual(slotPlayer, playerChoice);
            } else {
                updateSlotVisual(slotPlayer, null);
            }

            if (isRevealed && opponentChoice) {
                updateSlotVisual(slotOpponent, opponentChoice);
            } else if (playerChoice && !isRevealed) {
                updateSlotVisual(slotOpponent, null);
                if (screenResult) {
                    if (lang === 'en') {
                        screenResult.textContent = 'Card selected. Press "Reveal Cards" to run simulation.';
                    } else if (lang === 'ua') {
                        screenResult.textContent = 'Карту обрано. Натисніть "Розкрити карти" для симуляції періоду.';
                    } else {
                        screenResult.textContent = 'Карта выбрана. Нажмите "Раскрыть карты" для симуляции периода.';
                    }
                }
            } else {
                updateSlotVisual(slotOpponent, null);
            }
        }

        if (isRevealed && playerChoice && opponentChoice && screenResult) {
            determineChessResult(playerChoice, opponentChoice);
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

    // Load saved language on start or detect from browser/URL
    const urlParams = new URLSearchParams(window.location.search);
    let startLang = localStorage.getItem('zombiedrift_lang') || urlParams.get('lang');
    
    if (!startLang) {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            if (browserLang.startsWith('uk') || browserLang.startsWith('uk-') || browserLang.includes('ua')) {
                startLang = 'ua';
            } else if (browserLang.startsWith('en')) {
                startLang = 'en';
            } else {
                startLang = 'ru';
            }
        } else {
            startLang = 'ru';
        }
    }
    
    // Set active language button state and apply language
    const defaultBtn = document.querySelector(`.lang-btn[data-lang="${startLang}"]`);
    if (defaultBtn) {
        defaultBtn.click();
    } else {
        setLanguage('ru');
    }


    /* ==========================================
       4. INTERACTIVE CHESS PHASE SIMULATOR
       ========================================== */
    const chessCards = document.querySelectorAll('.chess-card');
    const btnReveal = document.getElementById('btn-reveal-choice');
    const btnReset = document.getElementById('btn-reset-sim');
    const slotPlayer = document.getElementById('slot-player');
    const slotOpponent = document.getElementById('slot-opponent');
    const screenResult = document.getElementById('screen-result-text');
    
    const choices = ['attack', 'control', 'defense'];
    
    const choiceIcons = {
        attack: 'icons8-sword-50.png',
        control: 'icons8-brain-64.png',
        defense: 'icons8-shield-50.png'
    };

    const choiceKeyMap = {
        attack: 'att',
        control: 'ctrl',
        defense: 'def'
    };

    const choiceColors = {
        attack: '#bd00ff', // Magenta
        control: '#00d2ff', // Cyan
        defense: '#00ff66'  // Green
    };

    function updateSlotVisual(slotElement, choice) {
        if (!slotElement) return;

        if (!choice) {
            slotElement.innerHTML = '—';
            slotElement.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            slotElement.style.boxShadow = 'none';
            return;
        }

        if (choice === 'choosing') {
            slotElement.innerHTML = `<span class="slot-text" style="color: var(--text-muted); opacity: 0.6;">${translations[currentLang]['sim-choosing']}</span>`;
            slotElement.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            slotElement.style.boxShadow = 'none';
            return;
        }

        const iconFile = choiceIcons[choice];
        const keySuffix = choiceKeyMap[choice];
        const fullText = translations[currentLang][`choice-${keySuffix}`];
        const choiceName = fullText.includes(' ') ? fullText.split(' ')[1] : fullText;
        const color = choiceColors[choice];
        
        slotElement.innerHTML = `
            <img src="${iconFile}" class="slot-icon" style="filter: brightness(0) invert(1) drop-shadow(0 0 5px ${color})" alt="${choiceName}">
            <span class="slot-text" style="color: ${color}">${choiceName}</span>
        `;
        slotElement.style.borderColor = color;
        slotElement.style.boxShadow = `0 0 10px ${color}`;
    }

    function determineChessResult(player, opponent) {
        const screenResult = document.getElementById('screen-result-text');
        if (!screenResult) return;

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
            const choiceText = translations[currentLang][`choice-${choiceKeyMap[player]}`].split(' ')[1];
            desc = translations[currentLang]['res-tie-desc'].replace('{choice}', choiceText);
            screenResult.style.color = 'var(--text-muted)';
        } else if (status === 'win') {
            title = translations[currentLang]['res-win-title'];
            desc = translations[currentLang][`res-win-${choiceKeyMap[player]}`];
            screenResult.style.color = 'var(--neon-green)';
        } else {
            title = translations[currentLang]['res-lose-title'];
            desc = translations[currentLang][`res-lose-${choiceKeyMap[opponent]}`];
            screenResult.style.color = '#ff3333';
        }
        
        screenResult.innerHTML = `<strong>${title}</strong><br>${desc}`;
    }

    if (chessCards.length > 0 && btnReveal && btnReset && slotPlayer && slotOpponent && screenResult) {
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
                
                updateSlotVisual(slotPlayer, playerChoice);
                
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
            
            updateSlotVisual(slotOpponent, 'choosing');
            
            let blinkCount = 0;
            const interval = setInterval(() => {
                const tempChoice = choices[Math.floor(Math.random() * choices.length)];
                updateSlotVisual(slotOpponent, tempChoice);
                blinkCount++;
                
                if (blinkCount > 8) {
                    clearInterval(interval);
                    
                    opponentChoice = choices[Math.floor(Math.random() * choices.length)];
                    isRevealed = true;
                    
                    updateSlotVisual(slotOpponent, opponentChoice);
                    determineChessResult(playerChoice, opponentChoice);
                    btnReset.classList.remove('btn-hidden');
                }
            }, 120);
        });

        btnReset.addEventListener('click', () => {
            playerChoice = null;
            opponentChoice = null;
            isRevealed = false;
            chessCards.forEach(c => c.classList.remove('selected'));
            
            updateSlotVisual(slotPlayer, null);
            updateSlotVisual(slotOpponent, null);
            
            screenResult.textContent = translations[currentLang]['sim-start-prompt'];
            screenResult.style.color = 'var(--text-muted)';
            
            btnReveal.classList.add('btn-disabled');
            btnReveal.setAttribute('disabled', 'true');
            btnReveal.classList.remove('btn-hidden');
            
            btnReset.classList.add('btn-hidden');
        });
    }





    /* ==========================================
       6. CONTACT FORM & SUBMISSION HANDLER
       ========================================== */
    const form = document.getElementById('studio-contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const btnSubmit = document.getElementById('btn-submit-form');
    
    if (form && btnSubmit && formFeedback) {
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
    }

    /* ==========================================
       7. IP PROTECTION & RIGHT-CLICK TOAST
       ========================================== */
    const toast = document.createElement('div');
    toast.className = 'ip-toast';
    document.body.appendChild(toast);

    let toastTimeout;
    function showToast() {
        const msgKey = 'legal-toast-msg';
        toast.textContent = translations[currentLang][msgKey] || "Copying protected.";
        toast.classList.add('show');
        
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        showToast();
    });

    document.addEventListener('copy', (e) => {
        if (window.getSelection().anchorNode) {
            const parent = window.getSelection().anchorNode.parentNode;
            if (parent && (parent.tagName === 'INPUT' || parent.tagName === 'TEXTAREA' || parent.closest('.allow-select'))) {
                return;
            }
        }
        e.preventDefault();
        showToast();
    });

    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            showToast();
        }
    });

    /* ==========================================
       8. PRIVACY / COOKIE CONSENT BANNER
       ========================================== */
    const cookieBanner = document.getElementById('cookie-banner');
    const btnCookieAccept = document.getElementById('btn-cookie-accept');
    
    if (cookieBanner && btnCookieAccept) {
        // Check if user has already accepted
        const consent = localStorage.getItem('zombiedrift_cookie_consent');
        if (!consent) {
            // Show banner with a small delay for a smooth introduction
            setTimeout(() => {
                cookieBanner.classList.remove('hidden');
            }, 1000);
        }
        
        btnCookieAccept.addEventListener('click', () => {
            // Add slide-out class for transition
            cookieBanner.classList.add('slide-out');
            
            // Set item in localStorage
            localStorage.setItem('zombiedrift_cookie_consent', 'true');
            
            // Remove completely after transition animation
            setTimeout(() => {
                cookieBanner.classList.add('hidden');
            }, 400);
        });
    }
});

