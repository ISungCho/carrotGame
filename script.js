'use strict' +
''
const CARROT_SIZE = 60
const CARROT_COUNT = 10
const BUG_COUNT = 10
const GAME_DURATION_SEC = 10

const field = document.querySelector('.game__field')
const fieldRect = field.getBoundingClientRect()
const playButton = document.querySelector('.game__button')
const timerIndicator = document.querySelector('.game__timer')
const gameCounter = document.querySelector('.game__count')

const popUp = document.querySelector('.pop-up')
const popUpText = document.querySelector('.pop-up__message')
const popUpRefresh = document.querySelector('.pop-up__refresh')

const carrotSound = new Audio('./sound/carrot_pull.mp3')
const bugSound = new Audio('./sound/bug_pull.mp3')
const winSound = new Audio('./sound/game_win.mp3')
const alertSound = new Audio('./sound/alert.mp3')
const bgSound = new Audio('./sound/bg.mp3')

let started = false
let count = CARROT_COUNT
let time = GAME_DURATION_SEC

popUpRefresh.addEventListener('click', (e) => {
	if(!started){
		started = true
		popUp.style.visibility = 'hidden'
		playButton.style.visibility = 'visible'
		field.innerHTML = ''
		startGame()
	}
})
playButton.addEventListener('click', (e) => {
	if(started){
		started = false
		playButton.innerHTML = '<i class="fas fa-play"></i>'
	} else{
		started = true
		playButton.innerHTML = '<i class="fas fa-stop"></i>'
		startGame()
	}
})

field.addEventListener('click', onFieldClick)

function onFieldClick (e) {
	if(!started) return 
	if(e.target.className.includes('carrot')){
		count--
		gameCounter.innerHTML = count
		carrotSound.play()
		if(count <= 0){
			started = false
			popUpText.innerHTML = 'YOU WIN!'
			winSound.play()
		}
		field.removeChild(e.target.parentNode) 
	} else if(e.target.className.includes('bug')){
		started = false
		bugSound.play()
		popUpText.innerHTML = 'YOU LOSE!'
	}
}

function startGame () {
	time = GAME_DURATION_SEC
	count = CARROT_COUNT
	timerIndicator.innerHTML = `00:${GAME_DURATION_SEC}`
	gameCounter.innerHTML = CARROT_COUNT
	setTimer()
	setCounter()
	bgSound.play()
}

function setCounter () {
	for(let i = 0; i < CARROT_COUNT; i++){
		const carrot = document.createElement('div')
		carrot.setAttribute('class', 'item-wrapper')
		const randomX = Math.floor(Math.random() * (fieldRect.width - CARROT_SIZE))
		const randomY = Math.floor(Math.random() * (fieldRect.height - CARROT_SIZE))
		carrot.style.transform = `translate(${randomX}px, ${randomY}px)`
		carrot.innerHTML = `<img src="./img/carrot.png" class="item carrot">`
		field.appendChild(carrot)
	}
	for(let i = 0; i < CARROT_COUNT; i++){
		const bug = document.createElement('div')
		bug.setAttribute('class', 'item-wrapper')
		const randomX = Math.floor(Math.random() * (fieldRect.width - CARROT_SIZE))
		const randomY = Math.floor(Math.random() * (fieldRect.height - CARROT_SIZE))
		bug.style.transform = `translate(${randomX}px, ${randomY}px)`
		bug.innerHTML = `<img src="./img/bug.png" class="item bug">`
		field.appendChild(bug)
	}
}

function setTimer () {
	const timer = setInterval(() => {
		if(started){
			let timeText = GAME_DURATION_SEC
			time -= 1
			if(time < 0){
				started = false
				popUpText.innerHTML = 'YOU LOSE!'
			} else if(time < 10){
				timeText = '0' + time
				timerIndicator.innerHTML = `00:${timeText}`
			}
		} else {
			popUp.style.visibility = 'visible'
			playButton.style.visibility = 'hidden'
			clearInterval(timer)
			bgSound.pause()
			return
		}
	}, 1000)
}