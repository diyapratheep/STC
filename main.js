// Debate topics and characters
const debateTopics = [
    "If bananas became the president?",
    "What if clouds could talk?",
    "Should socks be mandatory for hands?",
    "Is pizza a breakfast food?",
    "Should dolphins have social media accounts?",
    "Are unicorns just horses who went to art school?"
];

const debateCharacters = [
    {
        name: "Desi Aunty",
        avatar: "👩",
        mascot: "https://api.dicebear.com/7.x/personas/svg?seed=desi-aunty&backgroundColor=b6e3f4",
        style: "gossip-loving, dramatic",
        positiveResponse: "Hay Ram! Such brilliant points beta! Your parents must be so proud! 🎉",
        negativeResponse: "Chi chi chi... What is this nonsense? In our times we did much better! 😤",
        winnerResponse: "Wah wah! Such talent! Time to distribute sweets to the whole neighborhood! 🎊"
    },
    {
        name: "Surfer Dude",
        avatar: "🏄‍♂️",
        mascot: "https://api.dicebear.com/7.x/personas/svg?seed=surfer-dude&backgroundColor=ffd5dc",
        style: "laid-back, chill",
        positiveResponse: "Totally radical argument, bro! Catching those debate waves like a pro! 🌊",
        negativeResponse: "Bummer dude... That argument wiped out harder than a rookie on a tsunami! 🏊‍♂️",
        winnerResponse: "Cowabunga! You totally shredded this debate competition, dude! 🏆"
    }
];

// Current game state
let gameState = {
    roomCode: null,
    teamName: null,
    opponent: null,
    currentTopic: null,
    currentCharacter: null,
    timer: null,
    timeLeft: 120,
    currentRound: 1,
    inputSubmitted: false,
    scores: {
        team1: 0,
        team2: 0
    },
    isHost: false
};

// Room management
const activeRooms = new Map();

// DOM Elements
const sections = {
    landing: document.getElementById('landing-page'),
    teamName: document.getElementById('team-name'),
    roomCode: document.getElementById('room-code'),
    join: document.getElementById('join-section'),
    welcome: document.getElementById('welcome-screen'),
    die: document.getElementById('die-screen'),
    debateRoom: document.getElementById('debate-room'),
    winner: document.getElementById('winner-screen')
};

// Initialize floating elements with GSAP
function initializeFloatingElements() {
    const floatItems = document.querySelectorAll('.float-item');
    floatItems.forEach((item, index) => {
        gsap.to(item, {
            x: "random(-20, 20, 5)",
            y: "random(-20, 20, 5)",
            rotation: "random(-15, 15)",
            duration: "random(2, 4)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.2
        });
    });
}

// Show section with GSAP animation
function showSection(sectionId) {
    Object.values(sections).forEach(section => {
        section.classList.remove('active');
    });

    gsap.to(sections[sectionId], {
        display: 'block',
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        onStart: () => sections[sectionId].classList.add('active')
    });
}

// Generate unique room code
function generateRoomCode() {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    if (activeRooms.has(code)) {
        return generateRoomCode();
    }
    return code;
}

// Create room
function createRoom() {
    showSection('teamName');
    gameState.isHost = true;
}

// Handle team name submission
function handleTeamName() {
    const teamNameInput = document.getElementById('team-name-input');
    const errorMessage = document.querySelector('#team-name .error-message');
    
    if (!teamNameInput.value.trim()) {
        errorMessage.classList.remove('hidden');
        return;
    }

    gameState.teamName = teamNameInput.value.trim();
    errorMessage.classList.add('hidden');

    if (gameState.isHost) {
        const roomCode = generateRoomCode();
        gameState.roomCode = roomCode;
        activeRooms.set(roomCode, {
            host: gameState.teamName,
            guest: null,
            status: 'waiting'
        });
        document.getElementById('generated-code').textContent = roomCode;
        showSection('roomCode');
    } else {
        showSection('join');
    }
}

// Join room
// Join room
function joinRoom() {
    const codeInput = document.getElementById('room-code-input');
    const errorMessage = document.querySelector('#join-section .error-message');
    const code = codeInput.value.trim().toUpperCase();

    if (!activeRooms.has(code)) {
        errorMessage.textContent = "Invalid room code.";
        errorMessage.classList.remove('hidden');
        return;
    }

    const room = activeRooms.get(code);
    if (room.guest) {
        errorMessage.textContent = "Room is full.";
        errorMessage.classList.remove('hidden');
        return;
    }

    room.guest = gameState.teamName;
    room.status = 'ready';
    gameState.roomCode = code;
    gameState.opponent = room.host;

    updateTeamDisplay();
    showSection('welcome');
}

// Update team display
function updateTeamDisplay() {
    const room = activeRooms.get(gameState.roomCode);
    document.getElementById('team1-name').textContent = room.host;
    document.getElementById('team2-name').textContent = room.guest || 'Waiting...';
}

// Roll die animation
function rollDie() {
    const die = document.getElementById('debate-die');
    const topicReveal = document.getElementById('topic-reveal');
    
    die.classList.add('rolling');
    gsap.to(die, {
        rotation: 1440,
        scale: 1.5,
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => {
            die.classList.remove('rolling');
            rollForDebate();
            topicReveal.classList.remove('hidden');
            gsap.to(topicReveal, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        }
    });
}

// Roll for topic and character
function rollForDebate() {
    const topicIndex = Math.floor(Math.random() * debateTopics.length);
    const characterIndex = Math.floor(Math.random() * debateCharacters.length);
    
    gameState.currentTopic = debateTopics[topicIndex];
    gameState.currentCharacter = debateCharacters[characterIndex];
    
    document.getElementById('rolled-topic').textContent = gameState.currentTopic;
    document.getElementById('judge-character').innerHTML = `
        ${gameState.currentCharacter.avatar} ${gameState.currentCharacter.name}
        <p style="font-size: 0.9rem; color: #666;">
            Style: ${gameState.currentCharacter.style}
        </p>
    `;

    // Set mascot
    const mascotElement = document.getElementById('judge-mascot');
    mascotElement.style.backgroundImage = `url('${gameState.currentCharacter.mascot}')`;
}

// Start debate
function startDebate() {
    showSection('debateRoom');
    document.getElementById('debate-topic').textContent = gameState.currentTopic;
    document.getElementById('current-round').textContent = gameState.currentRound;
    startCountdown();
}

// Countdown animation
function startCountdown() {
    const overlay = document.querySelector('.countdown-overlay');
    const countdownNumber = document.querySelector('.countdown-number');
    overlay.classList.remove('hidden');
    
    let count = 3;
    const countdown = setInterval(() => {
        countdownNumber.textContent = count;
        if (count <= 0) {
            clearInterval(countdown);
            overlay.classList.add('hidden');
            startTimer();
        }
        count--;
    }, 1000);
}

// Timer functionality
function startTimer() {
    const timerDisplay = document.getElementById('timer');
    gameState.timeLeft = 120;
    document.getElementById('debate-input').disabled = false;

    gameState.timer = setInterval(() => {
        if (gameState.inputSubmitted) {
            clearInterval(gameState.timer);
            return;
        }

        gameState.timeLeft--;
        const minutes = Math.floor(gameState.timeLeft / 60);
        const seconds = gameState.timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            document.getElementById('debate-input').disabled = true;
            document.querySelector('.submit-debate').click();
        }
    }, 1000);
}

// Submit debate argument
async function submitDebate() {
    const argument = document.getElementById('debate-input').value;
    if (!argument.trim()) return;

    gameState.inputSubmitted = true;
    clearInterval(gameState.timer);
    document.getElementById('debate-input').disabled = true;

    const results = document.getElementById('results');
    results.classList.remove('hidden');

    // Show assessing message
    const assessingMessage = document.querySelector('.assessing-message');
    assessingMessage.classList.remove('hidden');

    // Simulate backend delay and score calculation
    setTimeout(() => {
        assessingMessage.classList.add('hidden');
        const score = Math.floor(Math.random() * 100);
        
        // Update scores
        if (gameState.isHost) {
            gameState.scores.team1 += score;
        } else {
            gameState.scores.team2 += score;
        }
        
        displayResults(score);
    }, 2000);
}

// Display results with typing animation
function displayResults(score) {
    const results = document.getElementById('results');
    const yourScore = document.getElementById('your-score');
    const commentary = document.getElementById('judge-comment');
    
    yourScore.textContent = score;
    
    const commentText = score >= 50 
        ? gameState.currentCharacter.positiveResponse
        : gameState.currentCharacter.negativeResponse;
    
    // Use Typed.js for commentary animation
    new Typed(commentary, {
        strings: [commentText],
        typeSpeed: 40,
        showCursor: false,
        onComplete: () => {
            if (gameState.currentRound < 10) {
                document.querySelector('.next-round-btn').classList.remove('hidden');
            } else {
                showWinner();
            }
        }
    });
}

// Show winner
function showWinner() {
    const winningTeam = gameState.scores.team1 > gameState.scores.team2 
        ? activeRooms.get(gameState.roomCode).host 
        : activeRooms.get(gameState.roomCode).guest;
    
    document.getElementById('winning-team').textContent = winningTeam;
    
    // Set final mascot
    const finalMascot = document.getElementById('final-judge -mascot');
    finalMascot.style.backgroundImage = `url('${gameState.currentCharacter.mascot}')`;

    // Display final commentary
    const finalComment = document.getElementById('final-comment');
    new Typed(finalComment, {
        strings: [gameState.currentCharacter.winnerResponse],
        typeSpeed: 40,
        showCursor: false,
        onComplete: () => {
            // Trigger confetti celebration
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    });

    showSection('winner');
}

// Start next round
function startNextRound() {
    gameState.currentRound++;
    gameState.inputSubmitted = false;
    
    // Reset UI
    document.getElementById('debate-input').value = '';
    document.getElementById('debate-input').disabled = false;
    document.getElementById('results').classList.add('hidden');
    document.querySelector('.next-round-btn').classList.add('hidden');
    document.getElementById('current-round').textContent = gameState.currentRound;
    
    // Start new countdown and timer
    startCountdown();
}

// Reset game
function resetGame() {
    gameState = {
        roomCode: null,
        teamName: null,
        opponent: null,
        currentTopic: null,
        currentCharacter: null,
        timer: null,
        timeLeft: 120,
        currentRound: 1,
        inputSubmitted: false,
        scores: {
            team1: 0,
            team2: 0
        },
        isHost: false
    };
    showSection('landing');
}

// Event Listeners
document.querySelector('.create-room').addEventListener('click', createRoom);
document.querySelector('.join-room').addEventListener('click', () => {
    gameState.isHost = false;
    showSection('teamName');
});

document.querySelector('.continue-btn').addEventListener('click', handleTeamName);

document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => showSection('landing'));
});

document.querySelector('.join-btn').addEventListener('click', joinRoom);

document.querySelector('.proceed-btn').addEventListener('click', () => {
    showSection('die');
});

document.querySelector('.roll-die-btn').addEventListener('click', rollDie);
document.querySelector('.start-debate-btn').addEventListener('click', startDebate);
document.querySelector('.submit-debate').addEventListener('click', submitDebate);
document.querySelector('.next-round-btn').addEventListener('click', startNextRound);
document.querySelector('.new-game-btn').addEventListener('click', resetGame);

// Initialize
initializeFloatingElements();