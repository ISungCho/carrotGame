'use strict'

import Field from './field.js'
import PopUp from './popup.js'
import * as sound from './sound.js'

export default class Game {
	constructor(carrotCount, bugCount, gameDurationSec){
		this.started = false
		this.carrotCount = carrotCount
		this.gameDurationSec = gameDurationSec
		this.count = carrotCount
		this.timer = undefined

		this.gameField = new Field(carrotCount, bugCount)
		this.gameFinishBanner = new PopUp()

		this.playButton = document.querySelector('.game__button')
		this.timerIndicator = document.querySelector('.game__timer')
		this.gameCounter = document.querySelector('.game__count')

		this.gameField.setClickListener(this.onItemClick)
		this.gameFinishBanner.setClickListener(() => this.startGame())
		this.playButton.addEventListener('click', this.onPlay)
	}

	onItemClick = (item) => {
		if(!this.started) return 
		if(item === 'carrot'){
			this._updateGameCounter(this.count - 1)
			if(this.count <= 0){
				this.finishGame(true)
			}
		} else if(item === 'bug'){
			this.finishGame()
		}
	}

	onPlay = () => {
		if(this.started){
			this.stopGame()
		} else{
			this.startGame()
		}
	}

	startGame () {
		this.started = true
		this._initGame()
		this._showStopButton()
		this._showTimerAndScore()
		this._startGameTimer()
		sound.playBackgroundSound()
	}

	stopGame (){
		this.started = false
		this._stopGameTimer()
		this._hidePlayButton();
		this.gameFinishBanner.showWithText('REPLAY❓')
		sound.playAlertSound()
		sound.stopBackgroundSound()
	}

	finishGame(win){
		this.started = false;
		this._hidePlayButton()
		if(win){
			sound.playWinSound()
		} else {
			sound.playBugSound()
		}
		this._stopGameTimer()
		sound.stopBackgroundSound()
		this.gameFinishBanner.showWithText(win ? 'YOU WON 🎉' : 'YOU LOST 💩')
	}

	_initGame () {
		this._updateGameCounter(this.carrotCount)
		this.gameField.init()
	}

	_updateGameCounter (updatedCarrotCount) {
		this.count = updatedCarrotCount
		this.gameCounter.innerHTML = updatedCarrotCount
	}

	_hidePlayButton() {
		this.playButton.style.visibility = 'hidden'
	}

	_showStopButton() {
		const icon = this.playButton.querySelector('.fas')
		icon.classList.add('fa-stop')
		icon.classList.remove('fa-play')
		this.playButton.style.visibility = 'visible'
	}

	_showTimerAndScore () {
		this.timerIndicator.style.visibility = 'visible'
		this.gameCounter.style.visibility = 'visible'
	}

	_startGameTimer () {
		let remainingTimeSec = this.gameDurationSec
		this._updateTimerText(remainingTimeSec)
		this.timer = setInterval(() => {
			this._updateTimerText(remainingTimeSec--)
			if(remainingTimeSec <= 0){
				this._stopGameTimer()
				this.finishGame(this.count <= 0)
				return 
			}
		}, 1000)
	}

	_stopGameTimer() {
		clearInterval(this.timer);
	}

	_updateTimerText (time) {
		const minutes = Math.floor(time / 60)
		const seconds = time % 60
		this.timerIndicator.innerHTML = `${minutes}:${seconds}`
	}
}