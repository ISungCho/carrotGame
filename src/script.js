'use strict'

import PopUp from './popup.js'

const ITEM_SIZE = 60
const CARROT_COUNT = 10
const BUG_COUNT = 10
const GAME_DURATION_SEC = 10

const field = document.querySelector('.game__field')
const fieldRect = field.getBoundingClientRect()
const playButton = document.querySelector('.game__button')
const timerIndicator = document.querySelector('.game__timer')
const gameCounter = document.querySelector('.game__count')

const carrotSound = new Audio('./sound/carrot_pull.mp3')
const bugSound = new Audio('./sound/bug_pull.mp3')
const winSound = new Audio('./sound/game_win.mp3')
const alertSound = new Audio('./sound/alert.wav')
const bgSound = new Audio('./sound/bg.mp3')

let started = false
let count = CARROT_COUNT
let timer = undefined

const gameFinishBanner = new PopUp()

gameFinishBanner.setClickListener(() => startGame())
playButton.addEventListener('click', (e) => {
	if(started){
		stopGame()
	} else{
		startGame()
	}
})

field.addEventListener('click', onFieldClick)

function startGame () {
	started = true
	initGame()
	showStopButton()
	showTimerAndScore()
	startGameTimer()
	playSound(bgSound)
}

function stopGame (){
	started = false
	stopGameTimer()
	hidePlayButton();
	gameFinishBanner.showWithText('REPLAY❓')
	playSound(alertSound)
	stopSound(bgSound)
}

function finishGame(win){
	started = false;
	hidePlayButton()
	if(win){
		playSound(winSound)
	} else {
		playSound(bugSound)
	}
	stopGameTimer()
	stopSound(bgSound)
	gameFinishBanner.showWithText(win ? 'YOU WON 🎉' : 'YOU LOST 💩')

}

function hidePlayButton() {
	playButton.style.visibility = 'hidden'
}

function showStopButton() {
	const icon = playButton.querySelector('.fas')
	icon.classList.add('fa-stop')
	icon.classList.remove('fa-play')
	playButton.style.visibility = 'visible'
}

function showTimerAndScore () {
	timerIndicator.style.visibility = 'visible'
	gameCounter.style.visibility = 'visible'
}

function startGameTimer () {
	let remainingTimeSec = GAME_DURATION_SEC
	updateTimerText(remainingTimeSec)
	timer = setInterval(() => {
		updateTimerText(remainingTimeSec--)
		if(remainingTimeSec <= 0){
			stopGameTimer()
			finishGame(count <= 0)
			return 
		}
	}, 1000)

}

function stopGameTimer() {
  clearInterval(timer);
}
function updateTimerText (time) {
	const minutes = Math.floor(time / 60)
	const seconds = time % 60
	timerIndicator.innerHTML = `${minutes}:${seconds}`
}

function initGame () {
  field.innerHTML = '';
	updateGameCounter(CARROT_COUNT)
	addItem('carrot', CARROT_COUNT)
	addItem('bug', BUG_COUNT)
}
function onFieldClick (e) {
	if(!started) return 
	if(e.target.className.includes('carrot')){
		field.removeChild(e.target.parentNode)
		updateGameCounter(count - 1)
		playSound(carrotSound)
		if(count <= 0){
			finishGame(true)
		}
	} else if(e.target.className.includes('bug')){
		finishGame()
	}
}

function updateGameCounter (carrotCount) {
	count = carrotCount
	gameCounter.innerHTML = count
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

function playSound(sound){
	sound.currentTime = 0
	sound.play()
}

function stopSound(sound){
	sound.pause()
}