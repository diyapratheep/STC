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
    teamName: null,
    currentTopic: null,
    currentCharacter: null,
    timer: null,
    timeLeft: 120,
    currentRound: 1,
    currentTurn:1,
    inputSubmitted: false,
    score: 0,
};



// DOM Elements
const sections = {
    landing: document.getElementById('landing-page'),
    teamName: document.getElementById('team-name'),
    welcome: document.getElementById('welcome-screen'),
    die: document.getElementById('die-screen'),
    debateRoom: document.getElementById('debate-room'),
    winner: document.getElementById('winner-screen'),
    teamname2: document.getElementById('team-name-2')
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
    // Hide all sections except the battle area
    Object.values(sections).forEach(section => {
            section.classList.remove('active');
            section.style.display = "none";
        
    });

    const targetSection = sections[sectionId];
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = "block";

        gsap.to(targetSection, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
        });
    } else {
        console.error(`Section "${sectionId}" not found!`);
    }
}




// Handle team name submission
function handleTeamName(teamNumber) {
    const teamNameInput = document.getElementById(teamNumber === 1 ? 'team-name-input' : 'team-name-input-2');
    const errorMessage = teamNameInput.nextElementSibling;

    if (!teamNameInput.value.trim()) {
        errorMessage.classList.remove('hidden');
        return;
    }
    gameState.teamName = teamNameInput.value.trim();
    if (teamNumber === 1) {
        
        document.getElementById('team-name1').textContent = gameState.teamName;
        sendToGoogleSheets(gameState.teamName, "NAN", "NAN", 0, "Team 1 Registered");
        console.log("Switching to team-name-2");
        showSection('teamname2');
  // Move to Team 2 Input
    } else if (teamNumber === 2) {
        
        document.getElementById('team-name2').textContent = gameState.teamName;
        sendToGoogleSheets(gameState.teamName, "NAN", "NAN", 0, "Team 2 Registered");
        showSection('welcome');  // Move to Welcome Screen
    }

    errorMessage.classList.add('hidden');
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

    // Set mascot next to topic
    const mascotElement = document.getElementById('topic-mascot');
    mascotElement.style.backgroundImage = `url('${gameState.currentCharacter.mascot}')`;
    mascotElement.classList.remove('hidden');
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
    sendToGoogleSheets(gameState.teamName, gameState.currentTopic,gameState.currentCharacter.name, gameState.currentRound,argument); // heloooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo

    const results = document.getElementById('results');
    results.classList.remove('hidden');

    // Show assessing message
    const assessingMessage = document.querySelector('.assessing-message');
    assessingMessage.classList.remove('hidden');

    // Simulate backend delay and score calculation
    setTimeout(() => {
        assessingMessage.classList.add('hidden');
        const pscore = Math.floor(Math.random() * 100);
        
        // Update scores
        
            gameState.score += pscore;
        
        
        
        displayResults(pscore);
    }, 2000);
}

// Display results with typing animation
function displayResults(pscore) {
    const results = document.getElementById('results');
    const yourScore = document.getElementById('your-score');
    const commentary = document.getElementById('judge-comment');
    
    yourScore.textContent = pscore;
    
    const commentText = pscore >= 50 
        ? gameState.currentCharacter.positiveResponse
        : gameState.currentCharacter.negativeResponse;
    commentary.textContent = "";
    // Use Typed.js for commentary animation
    new Typed(commentary, {
        strings: [commentText],
        typeSpeed: 40,
        showCursor: false,
        onComplete: () => {
            document.querySelector('.next-round-btn').classList.remove('hidden');
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
    if (gameState.currentRound > 10) {
        showWinner();
        return;
    }
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

function sendToGoogleSheets(teamName,topic, character, round, argument) {
    const scriptURL = "https://script.google.com/macros/s/AKfycbzLREI0AaC1iGn1f2UEldrgsb7SDPGo2eay3o9ewA7SPtOeZ12vt-5n8MEZGlgWWRWI/exec"; // Replace with your deployed URL

    fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            teamName: teamName,
            topic: topic,
            character: character,
            round: round,
            argument: argument
        })
    }).then(response => console.log("Data sent to Google Sheets"))
      .catch(error => console.error("Error:", error));
}


// Reset game
function resetGame() {
    gameState = {

        teamName: null,

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
    };
    showSection('landing');
}

// Event Listeners
document.querySelector('.start-game').addEventListener('click', () => {
    showSection('teamName');
});


document.querySelector('.continue-btn[data-team="1"]').addEventListener('click', () => {
    handleTeamName(1);
});

document.querySelector('.continue-btn[data-team="2"]').addEventListener('click', () => {
    handleTeamName(2);
});

document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => showSection('landing'));
});



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