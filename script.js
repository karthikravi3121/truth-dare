const playerCountInput = document.getElementById("playerCount");
const nameInputsDiv = document.getElementById("nameInputs");
const startGameBtn = document.getElementById("startGameBtn");
const inputContainer = document.getElementById("input-container");
const wheelContainer = document.getElementById("wheel-container");
const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

let players = [];
let shuffledIndices = [];
let currentIndex = 0;
let myChart;

// Shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Generate input fields for player names
playerCountInput.addEventListener("change", () => {
  const count = parseInt(playerCountInput.value, 10);
  nameInputsDiv.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Player ${i} Name`;
    input.required = true;
    input.name = `player${i}`;
    nameInputsDiv.appendChild(input);
  }
});

// Start game and generate wheel
startGameBtn.addEventListener("click", () => {
  const inputs = nameInputsDiv.querySelectorAll("input");
  players = Array.from(inputs).map((input) => input.value.trim());
  if (players.length > 1 && players.every((name) => name !== "")) {
    shuffledIndices = shuffleArray([...Array(players.length).keys()]);
    currentIndex = 0;
    setupWheel();
    inputContainer.classList.add("hidden");
    wheelContainer.classList.remove("hidden");
  } else {
    alert("Please enter valid names for all players.");
  }
});

// Setup the wheel with player names and glowing borders
function setupWheel() {
  const pieColors = Array(players.length).fill("#36454F"); // All slices black
  myChart = new Chart(wheel, {
    plugins: [ChartDataLabels],
    type: "pie",
    data: {
      labels: players,
      datasets: [{
        backgroundColor: pieColors,
        borderColor: '#FF3300', // Border color
        borderWidth: 3,
        data: Array(players.length).fill(1),
      }],
    },
    options: {
      responsive: true,
      animation: { duration: 0 },
      plugins: {
        tooltip: false,
        legend: { display: false },
        datalabels: {
          color: "#ffffff", // Text color white
          formatter: (value, context) => {
            // Truncate long names to fit in the slice
            const maxLength = 10; // Maximum length of characters
            return context.chart.data.labels[context.dataIndex].length > maxLength
              ? context.chart.data.labels[context.dataIndex].substring(0, maxLength) + '...'
              : context.chart.data.labels[context.dataIndex];
          },
          font: { size: 20 }, // Adjust font size as needed

        },
      },
    },
  });
}

// Spin functionality with suspenseful hover and winner highlight
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>Good Luck!</p>`;

  const totalSlices = players.length;
  let currentSlice = 0; // Current highlighted slice
  let spinCount = 0;
  let speed = 100; // Initial speed
  let decelerationRate = 0.95; // Rate at which speed decreases

  const winnerIndex = shuffledIndices[currentIndex];
  currentIndex++;

   // Reshuffle if all slices are selected
   if (currentIndex >= shuffledIndices.length) {
     shuffledIndices = shuffleArray([...Array(totalSlices).keys()]);
     currentIndex = 0;
   }

   const spinInterval = setInterval(() => {
     // Reset all slices to black before highlighting
     myChart.data.datasets[0].backgroundColor.fill("#36454F");

     // Highlight the current slice with lime color
     myChart.data.datasets[0].backgroundColor[currentSlice] = "lime";
     myChart.update();

     // Move to the next slice
     currentSlice = (currentSlice + 1) % totalSlices; 
     spinCount++;

     // Gradually slow down
     if (spinCount > 20) {
       speed *= decelerationRate; // Apply deceleration
       if (speed < 20) speed = 20; // Minimum speed to ensure visibility
     }

     // Create suspense by allowing a chance for the pointer to jump away from the winner
     if (spinCount > 40) { // Start checking after a certain number of spins
       const jumpChance = Math.random(); // Random number between 0 and 1
       if (jumpChance < 0.3 && currentSlice === winnerIndex) { 
         currentSlice = (winnerIndex + Math.floor(Math.random() * (totalSlices -1)) +1) % totalSlices;
       }
     }

     // Stop spinning when the winner's slice is reached
     if (spinCount >20 && currentSlice === winnerIndex) {
       clearInterval(spinInterval);

       // Highlight only the winner slice in lime color without affecting others
       myChart.data.datasets[0].backgroundColor.fill("#36454F"); 
       myChart.data.datasets[0].backgroundColor[winnerIndex] ="lime"; 
       myChart.update();

       finalValue.innerHTML=`<p>It's ${players[winnerIndex]}!</p>`;

       setTimeout(() => {
         myChart.data.datasets[0].backgroundColor[winnerIndex] ="#36454F"; 
         myChart.update();
         spinBtn.disabled=false;
       },2000);
     }
   }, speed);
});

document.addEventListener("DOMContentLoaded", () => {
  const playerCountInput = document.getElementById("playerCount");
  const nameInputsContainer = document.getElementById("nameInputs");
  const startGameBtn = document.getElementById("startGameBtn");
  const wheelContainer = document.getElementById("wheel-container");
  const spinButton = document.getElementById("spin-btn");
  const finalValueDisplay = document.getElementById("final-value");
  const truthDareButtons = document.getElementById("truth-dare-buttons");
  const truthBtn = document.getElementById("truth-btn");
  const dareBtn = document.getElementById("dare-btn");
  const toggleSwitch = document.getElementById("toggle-switch");

  // Arrays for truth and dare questions
  const easyTruthQuestions = [
    "What is your most embarrassing moment?",
    "Who is your secret crush?",
    "What is the most childish thing you still do?",
    "If you could live in a fictional world, which one would you choose?",
    "What is the biggest secret you have kept from your family?",
    "If you could go back in time and erase one thing you did, what's that?",
    "If you could be anyone, who would you be?",
    "If your house caught on fire, what are the first three objects you would save?",
    "What would you do if you were invisible?",
    "What's the goofiest thing you've Googled on your phone lately?"
  ];

  const easyDareQuestions = [
    "Let three ice cubes melt in your mouth.",
    "Let someone draw on your face with a pen.",
    "Do 20 pushups in a row.",
    "Call a random contact and flirt with them.",
    "Let someone tickle you for 30 seconds.",
    "Recite the alphabet backward",
    "Give the person to your right a scalp massage.",
    "Try to lick your elbow.",
    "Perform a dance with an opposite gender.",
    "Post an embarrassing picture on social media."
  ];

  const difficultTruthQuestions = [
      "What's one thing you only do when you're alone?",
      "What's your favourite gross food combination?",
      "Did you ever have a crush on a teacher at school?",
      "Have you ever stolen anything?",
      "Do you still have feelings for an ex?",
      "Who do you think is the hottest guy/girl at school?",
      "Have you ever made out on your friend's sibling?",
      "What crime would you commit if there were no consequences?",
      "What's the dumbest thing you've done to get attention?",
      "If you ran out of toilet paper in a public bathroom, what would you do?"
  ];

  const difficultDareQuestions = [
      "Only answer 'yes' for the next hour.",
      "Act like a mime for the next 5 minutes.",
      "Share your search history.",
      "Give me your best sexy crawl.",
      "Call your mom and tell her you're pregnant.",
      "Send a dirty text to someone right now.",
      "Call someone and moan in the middle of the conversation",
      "Lick the wall / Suck your big toe / Eat a piece of paper.",
      "Pretend you're a baby being born.",
      "Call my mom and thank her for raising an amazing kid."
  ];

  // Function to get a random question
  function getRandomQuestion(questions) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      return questions[randomIndex];
  }

  // Function to initialize player name inputs
  function initializePlayerInputs(count) {
      nameInputsContainer.innerHTML = ""; // Clear previous inputs
      for (let i = 0; i < count; i++) {
          const input = document.createElement("input");
          input.type = "text";
          input.placeholder = `Player ${i + 1} Name`;
          nameInputsContainer.appendChild(input);
      }
  }

  // Start game button click event
  startGameBtn.addEventListener("click", () => {
      const playerCount = parseInt(playerCountInput.value);
      if (playerCount >= 2) {
          initializePlayerInputs(playerCount);
          wheelContainer.classList.remove('hidden');
          playerCountInput.disabled = true; // Disable input after starting
          startGameBtn.disabled = true; // Disable button after starting
      } else {
          alert("Please enter at least 2 players.");
      }
  });

  // Spin button click event
  spinButton.addEventListener("click", () => {
      // Logic for spinning the wheel goes here (this is where you'd integrate Chart.js)
      
      // Simulate a spin result for demonstration (you should replace this with actual spinning logic)
      const spinResult = Math.floor(Math.random() * 360); // Random angle between 0 and 360
      finalValueDisplay.textContent = `Good Luck !`;
      
      // Show Truth and Dare buttons after spinning
      truthDareButtons.classList.remove('hidden');
      
      // Hide question display when spinning
      questionDisplay.style.display = 'none';
  });

 // Create question display element
 const questionDisplay = document.createElement("div");
 questionDisplay.id = "question-display";
 questionDisplay.style.display = "none"; // Initially hidden
 document.querySelector("#truth-dare-buttons").after(questionDisplay);

 // Truth button click event
 truthBtn.addEventListener("click", () => {
     const selectedQuestions = toggleSwitch.checked ? difficultTruthQuestions : easyTruthQuestions;
     const question = getRandomQuestion(selectedQuestions);
     questionDisplay.textContent = `Truth: ${question}`;
     questionDisplay.style.color = toggleSwitch.checked ? "red" : "blue";
     questionDisplay.style.display = "block"; // Show the question
 });

 // Dare button click event
 dareBtn.addEventListener("click", () => {
     const selectedQuestions = toggleSwitch.checked ? difficultDareQuestions : easyDareQuestions;
     const question = getRandomQuestion(selectedQuestions);
     questionDisplay.textContent = `Dare: ${question}`;
     questionDisplay.style.color = toggleSwitch.checked ? "darkorange" : "green";
     questionDisplay.style.display = "block"; // Show the question
 });

 // Toggle switch functionality
 toggleSwitch.addEventListener("change", () => {
     if (toggleSwitch.checked) {
         console.log("Toggle is ON");
         document.body.style.backgroundColor = "#4CAF50"; // Change background color
         questionDisplay.style.display = 'none'; // Hide any displayed questions when toggled
         truthDareButtons.classList.add('hidden'); // Hide buttons until spun again
     } else {
         console.log("Toggle is OFF");
         document.body.style.backgroundColor = ""; // Reset background color
         questionDisplay.style.display = 'none'; // Hide any displayed questions when toggled
         truthDareButtons.classList.add('hidden'); // Hide buttons until spun again
     }
 });
});
