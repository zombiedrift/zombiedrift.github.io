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
            
            // Loop particles when they exit viewport
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
        
        // Draw toxic grid lines subtly
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
       2. INTERACTIVE CHESS PHASE SIMULATOR
       ========================================== */
    const chessCards = document.querySelectorAll('.chess-card');
    const btnReveal = document.getElementById('btn-reveal-choice');
    const btnReset = document.getElementById('btn-reset-sim');
    const slotPlayer = document.getElementById('slot-player');
    const slotOpponent = document.getElementById('slot-opponent');
    const screenResult = document.getElementById('screen-result-text');
    
    let playerChoice = null;
    const choices = ['attack', 'control', 'defense'];
    const choiceNames = {
        attack: '⚔️ АТАКА',
        control: '🛡️ КОНТРОЛЬ',
        defense: '🧱 ЗАЩИТА'
    };
    
    const choiceColors = {
        attack: '#bd00ff', // Magenta
        control: '#00d2ff', // Cyan
        defense: '#00ff66'  // Green
    };

    chessCards.forEach(card => {
        card.addEventListener('click', () => {
            if (btnReveal.classList.contains('btn-disabled') === false && playerChoice !== null) {
                // If already played and not reset, prevent change until reset
                if (btnReset.classList.contains('btn-hidden') === false) return;
            }
            
            // Remove selected from others
            chessCards.forEach(c => c.classList.remove('selected'));
            
            // Select this card
            card.classList.add('selected');
            playerChoice = card.getAttribute('data-card');
            
            // Enable Reveal Button
            btnReveal.classList.remove('btn-disabled');
            btnReveal.removeAttribute('disabled');
            
            // Preview in slot
            slotPlayer.textContent = choiceNames[playerChoice];
            slotPlayer.style.borderColor = choiceColors[playerChoice];
            slotPlayer.style.boxShadow = `0 0 10px ${choiceColors[playerChoice]}`;
            
            screenResult.textContent = 'Карта выбрана. Нажмите "Раскрыть карты" для симуляции периода.';
        });
    });

    btnReveal.addEventListener('click', () => {
        if (!playerChoice) return;
        
        // Disable cards interaction & reveal button
        btnReveal.classList.add('btn-hidden');
        
        // Opponent choosing logic
        slotOpponent.textContent = 'ВЫБОР...';
        slotOpponent.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        slotOpponent.style.boxShadow = 'none';
        
        let blinkCount = 0;
        const interval = setInterval(() => {
            const tempChoice = choices[Math.floor(Math.random() * choices.length)];
            slotOpponent.textContent = choiceNames[tempChoice];
            blinkCount++;
            
            if (blinkCount > 8) {
                clearInterval(interval);
                
                // Final opponent choice
                const opponentChoice = choices[Math.floor(Math.random() * choices.length)];
                slotOpponent.textContent = choiceNames[opponentChoice];
                slotOpponent.style.borderColor = choiceColors[opponentChoice];
                slotOpponent.style.boxShadow = `0 0 10px ${choiceColors[opponentChoice]}`;
                
                // Calculate match result
                determineChessResult(playerChoice, opponentChoice);
                
                // Show reset button
                btnReset.classList.remove('btn-hidden');
            }
        }, 120);
    });

    function determineChessResult(player, opponent) {
        let title = '';
        let desc = '';
        let isWin = false;
        let isTie = false;
        
        if (player === opponent) {
            isTie = true;
        } else if (
            (player === 'attack' && opponent === 'control') ||
            (player === 'control' && opponent === 'defense') ||
            (player === 'defense' && opponent === 'attack')
        ) {
            isWin = true;
        }
        
        if (isTie) {
            title = 'НИЧЬЯ В ШАХМАТНОЙ ФАЗЕ!';
            desc = `Оба выбрали ${choiceNames[player].split(' ')[1]}. Ваши боты не получили баффов. Период начнется в равных условиях!`;
            screenResult.style.color = 'var(--text-muted)';
        } else if (isWin) {
            title = 'ПОБЕДА В ШАХМАТНОЙ ФАЗЕ!';
            if (player === 'attack') {
                desc = 'АТАКА побеждает КОНТРОЛЬ! Ваши боты получили бафф: <span class="highlight-text">+25% к Силе удара клюшкой</span> на следующий период матча.';
            } else if (player === 'control') {
                desc = 'КОНТРОЛЬ побеждает ЗАЩИТУ! Ваши боты получили бафф: <span class="text-neon-cyan">+20% к Скорости бега</span> на следующий период матча.';
            } else {
                desc = 'ЗАЩИТА побеждает АТАКУ! Ваши боты получили бафф: <span class="text-neon-magenta">+30% к Максимальному здоровью</span> на следующий период матча.';
            }
            screenResult.style.color = 'var(--neon-green)';
        } else {
            title = 'ПОРАЖЕНИЕ В ШАХМАТНОЙ ФАЗЕ!';
            if (opponent === 'attack') {
                desc = 'Соперник выбрал АТАКУ и победил ваш КОНТРОЛЬ. Его боты получили бафф на силу удара. Будьте осторожны!';
            } else if (opponent === 'control') {
                desc = 'Соперник выбрал КОНТРОЛЬ и победил вашу ЗАЩИТУ. Его боты будут бегать быстрее!';
            } else {
                desc = 'Соперник выбрал ЗАЩИТУ и победил вашу АТАКУ. Его боты получили прибавку к здоровью!';
            }
            screenResult.style.color = '#ff3333';
        }
        
        screenResult.innerHTML = `<strong>${title}</strong><br>${desc}`;
    }

    btnReset.addEventListener('click', () => {
        // Reset selections
        playerChoice = null;
        chessCards.forEach(c => c.classList.remove('selected'));
        
        slotPlayer.textContent = '—';
        slotPlayer.style.borderColor = 'rgba(255, 255, 255, 0.05)';
        slotPlayer.style.boxShadow = 'none';
        
        slotOpponent.textContent = '—';
        slotOpponent.style.borderColor = 'rgba(255, 255, 255, 0.05)';
        slotOpponent.style.boxShadow = 'none';
        
        screenResult.textContent = 'Выберите карту выше, чтобы начать...';
        screenResult.style.color = 'var(--text-muted)';
        
        btnReveal.classList.add('btn-disabled');
        btnReveal.setAttribute('disabled', 'true');
        btnReveal.classList.remove('btn-hidden');
        
        btnReset.classList.add('btn-hidden');
    });


    /* ==========================================
       3. INTERACTIVE PLAYER CUSTOMIZER
       ========================================== */
    const nicknameInput = document.getElementById('custom-nickname');
    const nameplate = document.getElementById('player-nameplate');
    const colorBtns = document.querySelectorAll('.color-btn');
    const skinSelect = document.getElementById('skin-index-select');
    const playerNumber = document.getElementById('player-number');
    const root = document.documentElement;
    
    // Live Nickname Sync
    nicknameInput.addEventListener('input', (e) => {
        let value = e.target.value.trim();
        if (value === '') {
            nameplate.textContent = 'ZombieKicker';
        } else {
            nameplate.textContent = value;
        }
        
        // Dynamic Player Number change based on Nickname length just for fun
        const charSum = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const calcNumber = (charSum % 99) + 1;
        playerNumber.textContent = calcNumber;
    });
    
    // Color Swap handler
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const selectedColor = btn.getAttribute('data-color');
            root.style.setProperty('--player-color', selectedColor);
            
            // Adjust visor or accent color subtly
            if (selectedColor === '#00ff66') {
                root.style.setProperty('--player-visor-color', '#00ff66');
            } else if (selectedColor === '#00d2ff') {
                root.style.setProperty('--player-visor-color', '#ffcc00');
            } else {
                root.style.setProperty('--player-visor-color', '#00ff66');
            }
        });
    });
    
    // Skin Gear Index handler
    skinSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        const playerJersey = document.getElementById('player-jersey');
        const playerArmor = document.getElementById('player-armor');
        
        if (value === '0') {
            // Jersey Retro
            playerJersey.setAttribute('rx', '5');
            playerArmor.setAttribute('d', 'M 50,90 Q 100,70 150,90 L 160,115 L 40,115 Z');
        } else if (value === '1') {
            // Cyber Armor
            playerJersey.setAttribute('rx', '15');
            playerArmor.setAttribute('d', 'M 45,90 Q 100,60 155,90 L 168,115 L 32,115 Z');
        } else if (value === '2') {
            // Wasteland Survivor
            playerJersey.setAttribute('rx', '0');
            playerArmor.setAttribute('d', 'M 52,90 Q 100,80 148,90 L 158,115 L 42,115 Z');
        }
    });


    /* ==========================================
       4. SIMULATED DIAGNOSTICS DASHBOARD
       ========================================== */
    const dashTick = document.getElementById('dash-tick');
    const dashPing = document.getElementById('dash-ping');
    const dashZombies = document.getElementById('dash-zombies');
    const graphBars = document.querySelectorAll('.graph-bar');
    
    // Simulating changing metric numbers
    setInterval(() => {
        // Ping variance 12ms - 22ms
        const ping = Math.floor(Math.random() * 10) + 12;
        dashPing.textContent = `${ping} ms`;
        
        // Tick rate stays extremely stable
        const tick = Math.random() > 0.95 ? 59.9 : 60.0;
        dashTick.textContent = `${tick.toFixed(1)} Hz`;
        
        // Active Zombies variance
        const zombies = Math.floor(Math.random() * 8) + 38;
        dashZombies.textContent = `${zombies} / 50`;
        
        // Modulate graph bars dynamically (simulate latency flow)
        // Store heights in an array, shift left, insert new at right
        const heights = [];
        graphBars.forEach(bar => {
            heights.push(parseFloat(bar.style.height));
        });
        
        heights.shift(); // Remove oldest
        // New height matches ping ratio (mapped from 12-22ms to 40-90% height)
        const newHeight = ((ping - 12) / 10) * 50 + 40; 
        heights.push(newHeight);
        
        // Apply back to bars
        graphBars.forEach((bar, index) => {
            bar.style.height = `${heights[index]}%`;
        });
        
    }, 1200);


    /* ==========================================
       5. CONTACT FORM & SUBMISSION HANDLER
       ========================================== */
    const form = document.getElementById('studio-contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const btnSubmit = document.getElementById('btn-submit-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        btnSubmit.textContent = 'ОТПРАВКА...';
        btnSubmit.classList.add('btn-disabled');
        btnSubmit.setAttribute('disabled', 'true');
        
        // Simulate networking delay
        setTimeout(() => {
            formFeedback.classList.remove('hidden');
            formFeedback.className = 'form-feedback-message success';
            formFeedback.innerHTML = '<strong>Сообщение успешно доставлено!</strong><br>Команда ZombieDrift свяжется с вами по указанной почте в течение 24 часов.';
            
            // Reset fields
            form.reset();
            
            btnSubmit.textContent = 'Отправить сообщение';
            btnSubmit.classList.remove('btn-disabled');
            btnSubmit.removeAttribute('disabled');
            
            // Reset customizer colors back to defaults
            setTimeout(() => {
                formFeedback.classList.add('hidden');
            }, 8000);
            
        }, 1500);
    });
});
