'use strict'

import Field from './field.js'
import * as sound from './sound.js'

export default class Game {
	constructor(carrotCount, bugCount, gameDuration){
		this.carrotCount = carrotCount
		this.gameDuration = gameDuration

		this.started = false
		this.count = carrotCount
		this.timer = undefined

		this.playButton = document.querySelector('.game__button')
		this.timerIndicator = document.querySelector('.game__timer')
		this.gameCounter = document.querySelector('.game__count')

		this.gameField = new Field(carrotCount, bugCount)
		this.gameField.setClickListener(this.onItemClick)

		this.playButton.addEventListener('click', this.onPlay)
	}

	setClickListener(onGameStop) {
		this.onGameStop = onGameStop
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
			this.stop()
		} else{
			this.start()
		}
	}

	start () {
		this.started = true
		this._initGame()
		this._showStopButton()
		this._showTimerAndScore()
		this._startGameTimer()
		sound.playBackgroundSound()
	}

	stop (){
		this.started = false
		this._stopGameTimer()
		this._hidePlayButton();
		this.onGameStop && this.onGameStop('cancel')
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
		this.onGameStop && this.onGameStop(win ? 'win' : 'lose')
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
		let remainingTimeSec = this.gameDuration
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