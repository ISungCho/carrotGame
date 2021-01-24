'use strict'

import GameBuilder, { Reason } from './game.js'
import PopUp from './popup.js'
import * as sound from './sound.js'

const gameFinishBanner = new PopUp()
const game = new GameBuilder()
	.setDuration(5)
	.setBugCount(3)
	.setCarrotCount(3)
	.build()

gameFinishBanner.setClickListener(() => game.start())
game.setClickListener((reason) => {
	let message = ''
	switch(reason){
		case Reason.win:
			sound.playWin()
			message = 'YOU WON 🎉'
			break;
		case Reason.lose:
			sound.playBug()
			message = 'YOU LOST 💩'
			break;
		case Reason.cancel:
			sound.playAlert()
			message = 'REPLAY❓'
			break;
		default:
			throw new Error('Not valid reason')
	}
	gameFinishBanner.showWithText(message)
})

