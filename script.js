'use strict' +
''
const ITEM_SIZE = 60
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
	initGame()
	bgSound.play()
}

function initGame () {
	addItem('carrot', CARROT_COUNT)
	addItem('bug', BUG_COUNT)
}

function addItem (itemName, count){
	const x1 = 0
	const y1 = 0
	const x2 = fieldRect.width - ITEM_SIZE
	const y2 = fieldRect.height - ITEM_SIZE
	for(let i = 0; i < count; i++){
		const item = document.createElement('div')
		item.setAttribute('class', 'item-wrapper')
		const randomX = randomNumber(x1, x2)
		const randomY = randomNumber(y1, y2)
		item.style.transform = `translate(${randomX}px, ${randomY}px)`
		item.innerHTML = `<img src="./img/${itemName}.png" class="item ${itemName}">`
		field.appendChild(item)
	}
}

function randomNumber(min, max){
	return Math.random() * (max - min) + min
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