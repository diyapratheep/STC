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
        name: "Desi Aunty, Padma",
        avatar: "👩",
        mascot: "https://api.dicebear.com/7.x/personas/svg?seed=desi-aunty&backgroundColor=b6e3f4",
        style: "gossip-loving, dramatic",
        positiveResponse: "Beta, you argue like a lawyer! Very sharp—just don’t forget to eat, haan?",
        negativeResponse: "This argument is like my neighbor’s son—loud, useless, and full of bad decisions.😤",
        
    },
    {
        name: "Surfer Dude, Kai",
        avatar: "🏄‍♂️",
        mascot: "https://api.dicebear.com/7.x/personas/svg?seed=surfer-dude&backgroundColor=ffd5dc",
        style: "laid-back, chill",
        positiveResponse: "Whoa, dude, that argument was smooth—like catching the perfect wave at sunrise!🌅",
        negativeResponse: "That was like paddling out, missing every wave, and then getting smacked in the face by your own board 🏄‍♂️",
    },
    {
        name: "Beanie Hipster, Finnegan (Fin)",
        avatar: "🧒🧢",
        mascot: "https://api.dicebear.com/9.x/open-peeps/svg?seed=Easton",
        style: "sarcastic, artsy, underground",
        positiveResponse: "You know, there’s a raw authenticity to your argument—very underground, very real.😉",
        negativeResponse: "Wow, this take is so uninspired, it should come with a Starbucks pumpkin spice latte.😒",
    },
    {
        name: "Holocaust Survivor, Samuela",
        avatar: "😷👴",
        mascot: "https://api.dicebear.com/7.x/personas/svg?seed=wise-samuel&backgroundColor=f4d150",
        style: "wise, solemn, reflective",
        positiveResponse: "You have conviction. And conviction is the only thing that ever truly matters.🫂",
        negativeResponse: "I have heard weak arguments before. They often ended in disaster.🥸",
    },
    {
        name: "Socially Awkward Bibliophile, Beatrice",
        avatar: "👧📖",
        mascot: "https://api.dicebear.com/9.x/miniavs/svg?seed=Ryan",
        style: "bookish, nervous, intellectual",
        positiveResponse: "Oh! This reminds me of a passage from *Middlemarch*! Very insightful! I—I need to reorganize my bookshelf just to process this.😃",
        negativeResponse: "This argument is so flawed, I could fill an entire annotated bibliography disproving it. 🫥😶‍🌫️",
    },
    {
        name: "Antarctic Latino, Alejandro (Alex)",
        avatar: "🐻☃️🧔‍♂️",
        mascot: "https://api.dicebear.com/7.x/personas/svg?seed=antarctic-alejandro&backgroundColor=6a994e",
        style: "resilient, adventurous, resourceful",
        positiveResponse: "Solid, amigo!👏 That argument stands firm—like a research base in the middle of a storm!⚡ It could survive a full Antarctic winter!",
        negativeResponse: "This logic would collapse faster than a tent in a whiteout blizzard.🤌🏕️ ",
    },
    {
        name: "Brooding CEO, Mr. Sterling",
        avatar: "👨‍💼👔",
        mascot: "https://api.dicebear.com/9.x/personas/svg?seed=Brooklynn",
        style: "cold, calculating, corporate",
        positiveResponse: "That’s a well-structured argument. High potential for growth. It’s scalable. It’s disruptive. It *wins*.👨‍💼",
        negativeResponse: "This argument hemorrhages logic the way bad businesses burn money.🤨",
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
    team1Submitted: false,
    team2Submitted: false,
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

    errorMessage.classList.add('hidden');
    const teamName = teamNameInput.value.trim();

    if (teamNumber === 1) {
        gameState.team1 = teamName;  // Store Team 1
        document.getElementById('team-name1').textContent = gameState.team1;
        sendToGoogleSheets(gameState.team1, "NAN", "NAN", 0, "Team 1 Registered");
        console.log("✅ Team 1 Registered:", gameState.team1);
        showSection('teamname2'); // Move to Team 2 Input

    } else if (teamNumber === 2) {
        gameState.team2 = teamName;  // Store Team 2
        document.getElementById('team-name2').textContent = gameState.team2;
        sendToGoogleSheets(gameState.team2, "NAN", "NAN", 0, "Team 2 Registered");
        console.log("✅ Team 2 Registered:", gameState.team2);
        showSection('welcome'); // Move to Welcome Screen
    }
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
    timerDisplay = document.getElementById('timer');
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
    
    document.getElementById('debate-input').disabled = false;
    if (gameState.timer) {  // Clear any existing timer before starting a new one
        clearInterval(gameState.timer);
    }

    gameState.timer = setInterval(() => {
        

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
// Submit debate argument
async function submitDebate() {
    const argument = document.getElementById('debate-input').value;
    if (!argument.trim()) return;

    clearInterval(gameState.timer);
    document.getElementById('debate-input').disabled = true;
    if (!gameState.team1 || !gameState.team2) {
        console.error("❌ ERROR: Team names are not set! Cannot submit debate.");
        return;
    }
    const currentTeam = gameState.team1Submitted ? gameState.team2 : gameState.team1;
    if (!currentTeam) {
        console.error("❌ ERROR: currentTeam is undefined before sending to Google Sheets!");
        return;
    }
    console.log("✅ Submitting for team:", currentTeam);
    // Send data to Google Sheets
    sendToGoogleSheets(currentTeam, gameState.currentTopic, gameState.currentCharacter.name, gameState.currentRound, argument);

    const results = document.getElementById('results');
    results.classList.remove('hidden');

    // Show assessing message until score is retrieved
    const assessingMessage = document.querySelector('.assessing-message');
    assessingMessage.classList.remove('hidden');
    document.getElementById('your-score').textContent = "Assessing score...";
    console.log("Passing expectedTeam:", currentTeam);

    // **Retrieve actual score from Google Sheets**
    setTimeout(() => retrieveDataFromGoogleSheets(currentTeam), 1000);
}



function displayResults(teamName, score) {
    const yourScore = document.getElementById('your-score');
    const commentary = document.getElementById('judge-comment');

    yourScore.textContent = `${teamName} has scored ${score} points`;

    const commentText = score >= 50 
        ? gameState.currentCharacter.positiveResponse
        : gameState.currentCharacter.negativeResponse;

    commentary.textContent = "";

    // Use Typed.js for animated commentary
    new Typed(commentary, {
        strings: [commentText],
        typeSpeed: 40,
        showCursor: false,
        onComplete: () => {
            if (!gameState.team1Submitted) {
                gameState.team1Submitted = true;
                document.querySelector('.submit-debate').classList.add('hidden');
                document.querySelector('.team2-turn').classList.remove('hidden'); // Show "Team 2's Turn"
            } else {
                gameState.team2Submitted = true;
                document.querySelector('.next-round-btn').classList.remove('hidden'); // Show "Next Round"
            }
        }
    });
}





function finish() {
    // Hide debate input and buttons
    document.querySelector(".debate-area").classList.add("hidden");
    document.querySelector(".next-round-btn").classList.add("hidden");
    document.querySelector(".team2-turn").classList.add("hidden");

    // Show final winner section
    showSection("winner");

    // Display final message
    document.getElementById("final-message").textContent = 
        "Debate over! Both teams played well. Check your mail for the winner! 🎉";

    // Set mascot image
    const finalMascot = document.getElementById("final-judge-mascot");
    finalMascot.style.backgroundImage = `url('${gameState.currentCharacter.mascot}')`;

    // Animate final commentary
    new Typed(document.getElementById("final-comment"), {
        strings: ["Debate over! Both teams played well. Check your mail for the winner! 🎉"],
        typeSpeed: 30,
        showCursor: false,
        preStringTyped: () => {
            // Trigger confetti celebration
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 }
            });
        }
    });
}

// Start next round
function startNextRound() {
    gameState.currentRound++;
    if (gameState.currentRound > 1) {
        finish();
        return;
    }
    gameState.team1Submitted = false;
    gameState.team2Submitted = false;
    
    // Reset UI
    document.getElementById('debate-input').value = '';
    document.getElementById('debate-input').disabled = false;
    document.getElementById('results').classList.add('hidden');
    document.querySelector('.next-round-btn').classList.add('hidden');
    document.querySelector('.team2-turn').classList.add('hidden');
    document.querySelector('.submit-debate').classList.remove('hidden');
    document.getElementById('current-round').textContent = gameState.currentRound;
    
    // Start new countdown and timer
    startCountdown();
}

function sendToGoogleSheets(teamName,topic, character, round, argument) {
    const scriptURL = ""; // Replace with your Apps Script Web App URL

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

function retrieveDataFromGoogleSheets(expectedTeam) {
    const scriptURL = ""; // Replace with your Apps Script Web App URL

    let attempts = 0;
    const maxAttempts = 15;
    
    function fetchData() {
        console.log("Checking for new data...");
        console.log("Expected Team:", expectedTeam); // Ensure expectedTeam is being passed correctly

        fetch(scriptURL)
            .then(response => response.json())
            .then(data => {
                console.log("Received Data:", data);
                console.log("Received Team:", data.teamName);
                data.teamName = String(data.teamName).trim();
                expectedTeam = String(expectedTeam).trim(); 
                if (!expectedTeam) {
                    console.warn("⚠️ Warning: expectedTeam is undefined or null.");
                    return;
                }

                // Check if the latest data belongs to the expected team
                if (data.teamName === expectedTeam) {
                    console.log("✅ Match Found! Updating score...");
                    document.querySelector('.assessing-message').classList.add('hidden'); // Hide assessing message
                    displayResults(data.teamName, data.score);
                } else if (attempts < maxAttempts) {
                    console.log("🔄 No match yet, retrying...");
                    attempts++;
                    setTimeout(fetchData, 2000); // Retry after 2 seconds
                } else {
                    console.warn("⏳ Timeout: No new data received within time limit.");
                }
            })
            .catch(error => console.error("❌ Error fetching data:", error));
    }

    fetchData();  
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
        currentTurn:1,
        team1Submitted: false,
        team2Submitted: false,
        score: 0,
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

document.querySelector(".team2-turn").addEventListener("click", () => {
    document.querySelector(".team2-turn").classList.add("hidden");
    document.querySelector(".submit-debate").classList.remove("hidden");
    document.getElementById("debate-input").value = "";
    document.getElementById("debate-input").disabled = false;
    gameState.currentTurn = 2;
    
    startCountdown();});

initializeFloatingElements();