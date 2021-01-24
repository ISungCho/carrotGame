'use strict'

import Game from './game.js'
import PopUp from './popup.js'

const gameFinishBanner = new PopUp()
const game = new Game(10, 10, 10)

gameFinishBanner.setClickListener(() => game.start())
game.setClickListener((text) => gameFinishBanner.showWithText(text))

