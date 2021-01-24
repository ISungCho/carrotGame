'use strict'

import PopUp from './popup.js'
import Field from './field.js'

const CARROT_COUNT = 10
const BUG_COUNT = 10
const GAME_DURATION_SEC = 10

const playButton = document.querySelector('.game__button')
const timerIndicator = document.querySelector('.game__timer')
const gameCounter = document.querySelector('.game__count')

const bugSound = new Audio('./sound/bug_pull.mp3')
const winSound = new Audio('./sound/game_win.mp3')
const alertSound = new Audio('./sound/alert.wav')
const bgSound = new Audio('./sound/bg.mp3')

let started = false
let count = CARROT_COUNT
let timer = undefined

const gameFinishBanner = new PopUp()
const gameField = new Field(CARROT_COUNT, BUG_COUNT)

gameFinishBanner.setClickListener(() => startGame())
gameField.setClickListener(onItemClick)
function onItemClick(item) {
	if(!started) return 
	if(item === 'carrot'){
		updateGameCounter(count - 1)
		if(count <= 0){
			finishGame(true)
		}
	} else {
		finishGame()
	}
}
playButton.addEventListener('click', (e) => {
	if(started){
		stopGame()
	} else{
		startGame()
	}
})

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
	updateGameCounter(CARROT_COUNT)
	gameField.init()
}

function updateGameCounter (carrotCount) {
	count = carrotCount
	gameCounter.innerHTML = count
}

function playSound(sound){
	sound.currentTime = 0
	sound.play()
}

function stopSound(sound){
	sound.pause()
}