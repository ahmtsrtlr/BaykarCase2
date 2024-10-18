/** @format */

const quizContainer = document.getElementById("quiz-container");
const headerElement = document.getElementById("title");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const timerElement = document.getElementById("timer");
const nextButton = document.getElementById("next");
const resultsElement = document.getElementById("results");

let qNumber = 0;
let questions = [];
let currentQuestionIndex = 0;
let selectedAnswers = [];
let timerInterval;

fetch("https://jsonplaceholder.typicode.com/posts")
	.then((response) => response.json())
	.then((data) => {
		questions = data.slice(0, 10).map((item) => ({
			qNumber: item.id,
			question: item.title,
			options: [
				"A) " + item.body.slice(0, 10),
				"B) " + item.body.slice(11, 20),
				"C) " + item.body.slice(21, 30),
				"D) " + item.body.slice(31, 40),
			],
		}));
		displayQuestion();
	});

function displayQuestion() {
	const currentQuestion = questions[currentQuestionIndex];

	headerElement.textContent = `Question ${currentQuestion.qNumber}:`;
	questionElement.textContent = currentQuestion.question;

	optionsElement.innerHTML = "";
	currentQuestion.options.forEach((option, index) => {
		const optionElement = document.createElement("div");
		optionElement.textContent = option;
		optionElement.classList.add("option");
		optionElement.dataset.index = index;
		optionElement.onclick = () => selectAnswer(index);
		optionsElement.appendChild(optionElement);
	});

	timerElement.textContent = "30";
	nextButton.style.display = "none";

	startTimer();
}

function startTimer() {
	let timeLeft = 30;
	timerElement.style.color = "black";
	timerInterval = setInterval(() => {
		timeLeft--;
		timerElement.textContent = timeLeft;

		if (timeLeft <= 10) {
			timerElement.style.color = "red";
		}

		if (timeLeft <= 0) {
			clearInterval(timerInterval);
			endQuestion();
		}
	}, 1000);

	optionsElement.childNodes.forEach((option) => {
		option.onclick = null;
	});

	setTimeout(() => {
		optionsElement.childNodes.forEach((option) => {
			option.onclick = () => selectAnswer(option.dataset.index);
		});
	}, 100);
}

function selectAnswer(index) {
	selectedAnswers[currentQuestionIndex] = index;
	clearInterval(timerInterval);
	endQuestion();
}

function endQuestion() {
	optionsElement.childNodes.forEach((option) => {
		option.onclick = null;
	});
	nextButton.style.display = "block";

	nextButton.onclick = () => {
		if (currentQuestionIndex < questions.length - 1) {
			currentQuestionIndex++;
			displayQuestion();
			console.log(currentQuestionIndex);
		} else {
			showResults();
		}
	};
}
function showResults() {
	quizContainer.style.display = "none";
	resultsElement.style.display = "block";
	resultsElement.innerHTML = "<h2>Results:</h2>";

	selectedAnswers.forEach((answer, index) => {
		const question = questions[index];
		resultsElement.innerHTML += `
            <div class="resultItem">
                <p><strong>Number:</strong> ${question.qNumber}</p>
                <p><strong>Question:</strong> ${question.question}</p>
                <p><strong>Your answer:</strong> ${question.options[answer]}</p>
            </div>
        `;
	});
}
