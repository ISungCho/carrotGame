const READY_STATUS = 'ready'
const PUASE_STATUS = 'puase'
const PLAY_STATUS = 'play'
const END_STATUS = 'end'
const START_COUNT = 10
const START_TIME = 10

let status = READY_STATUS
let count = START_COUNT
let time = START_TIME

const playButton = document.querySelector('#play_button')
const replayButton = document.querySelector('#replay_button')

const timerClass = document.querySelector('.timer')
const counterClass = document.querySelector('.counter')

const resultArea = document.querySelector('.result_area')
const resultText = document.querySelector('.result_text')

const bottomArea = document.querySelector('.bottom_area')
const bottomAreaPos = bottomArea.getBoundingClientRect()

replayButton.addEventListener('click', (e) => {
	if(status === END_STATUS){
		status = PLAY_STATUS
		resultArea.style.visibility = 'hidden'
		playButton.style.visibility = 'visible'
		bottomArea.innerHTML = ''
		startGame()
	}
})
playButton.addEventListener('click', (e) => {
	if(status === PLAY_STATUS){
		status = PUASE_STATUS
		playButton.innerHTML = '<i class="fas fa-play"></i>'
	} else if(status === READY_STATUS){
		status = PLAY_STATUS
		playButton.innerHTML = '<i class="fas fa-stop"></i>'
		startGame()
	} else {
		status = PLAY_STATUS
		playButton.innerHTML = '<i class="fas fa-stop"></i>'
	}
})
bottomArea.addEventListener('click', (e) => {
	if(e.target.className.includes('carrot')){
		count--
		counterClass.innerHTML = count
		if(count <= 0){
			status = END_STATUS
			resultText.innerHTML = 'YOU WIN!'
		}
		bottomArea.removeChild(e.target.parentNode) 
	} else if(e.target.className.includes('bug')){
		status = END_STATUS
		resultText.innerHTML = 'YOU LOSE!'
	}
})

const startGame = () => {
	time = START_TIME
	count = START_COUNT
	timerClass.innerHTML = `00:${START_TIME}`
	counterClass.innerHTML = START_COUNT
	setTimer()
	setCounter()
}

const setCounter = () => {
	for(let i = 0; i < START_COUNT; i++){
		const carrot = document.createElement('div')
		carrot.setAttribute('class', 'item-wrapper')
		const randomX = Math.floor(Math.random() * (bottomAreaPos.width - 60))
		const randomY = Math.floor(Math.random() * (bottomAreaPos.height - 60))
		carrot.style.transform = `translate(${randomX}px, ${randomY}px)`
		carrot.innerHTML = `<img src="./img/carrot.png" class="item carrot">`
		bottomArea.appendChild(carrot)
	}
	for(let i = 0; i < START_COUNT; i++){
		const bug = document.createElement('div')
		bug.setAttribute('class', 'item-wrapper')
		const randomX = Math.floor(Math.random() * (bottomAreaPos.width - 60))
		const randomY = Math.floor(Math.random() * (bottomAreaPos.height - 60))
		bug.style.transform = `translate(${randomX}px, ${randomY}px)`
		bug.innerHTML = `<img src="./img/bug.png" class="item bug">`
		bottomArea.appendChild(bug)
	}
}

const setTimer = () => {
	const timer = setInterval(() => {
		if(status === PLAY_STATUS){
			let timeText = START_TIME
			time -= 1
			if(time < 0){
				status = END_STATUS
				resultText.innerHTML = 'YOU LOSE!'
			} else if(time < 10){
				timeText = '0' + time
				timerClass.innerHTML = `00:${timeText}`
			}
		} else if(status === END_STATUS) {
			resultArea.style.visibility = 'visible'
			playButton.style.visibility = 'hidden'
			clearInterval(timer)
			return
		} else if(status === PUASE_STATUS){
			return 
		}
	}, 1000)
}