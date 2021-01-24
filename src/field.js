'use strict'

const carrotSound = new Audio('./sound/carrot_pull.mp3')
const ITEM_SIZE = 60
export default class Field {
	constructor(carrotCount, bugCount){
		this.carrotCount = carrotCount
		this.bugCount = bugCount

		this.field = document.querySelector('.game__field')

		this.fieldRect = this.field.getBoundingClientRect()
		this.field.addEventListener('click', this.onClick)

	}

	setClickListener (onItemClick){
		this.onItemClick = onItemClick
	}

	init() {
		this.field.innerHTML = '';
		this._addItem('carrot', this.carrotCount)
		this._addItem('bug', this.bugCount)
	}

	onClick = (e) => {
		if(e.target.className.includes('carrot')){
			this.field.removeChild(e.target.parentNode)
			playSound(carrotSound)
			this.onItemClick && this.onItemClick('carrot')
		} else if(e.target.className.includes('bug')){
			this.onItemClick && this.onItemClick('bug')
		}
	}

	_addItem (itemName, count){
		const x1 = 0
		const y1 = 0
		const x2 = this.fieldRect.width - ITEM_SIZE
		const y2 = this.fieldRect.height - ITEM_SIZE
		for(let i = 0; i < count; i++){
			const item = document.createElement('div')
			item.setAttribute('class', 'item-wrapper')
			const randomX = randomNumber(x1, x2)
			const randomY = randomNumber(y1, y2)
			item.style.transform = `translate(${randomX}px, ${randomY}px)`
			item.innerHTML = `<img src="./img/${itemName}.png" class="item ${itemName}">`
			this.field.appendChild(item)
		}
	}

}

function randomNumber(min, max){
	return Math.random() * (max - min) + min
}

function playSound(sound){
	sound.currentTime = 0
	sound.play()
}