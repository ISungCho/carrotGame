'use strict'

import Game from './game.js'
import PopUp from './popup.js'

const gameFinishBanner = new PopUp()
const game = new Game(2, 2, 2)

gameFinishBanner.setClickListener(() => game.start())
game.setClickListener((reason) => {
	let message = ''
	switch(reason){
		case 'win':
			message = 'YOU WON 🎉'
			break;
		case 'lose':
			message = 'YOU LOST 💩'
			break;
		case 'cancel':
			message = 'REPLAY❓'
			break;
		default:
			throw new Error('Not valid reason')
	}
	gameFinishBanner.showWithText(message)
})

