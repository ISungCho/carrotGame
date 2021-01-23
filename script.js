const START_COUNT = 10
const START_TIME = 10

let isPlay = false
let count = START_COUNT
let time = START_TIME

const playButton = document.querySelector('.game__button')
const replayButton = document.querySelector('.pop-up__refresh')

const timerClass = document.querySelector('.game__timer')
const counterClass = document.querySelector('.game__count')

const resultArea = document.querySelector('.pop-up')
const resultText = document.querySelector('.pop-up__message')

const bottomArea = document.querySelector('.game__field')
const bottomAreaPos = bottomArea.getBoundingClientRect()

const carrotSound = new Audio('./sound/carrot_pull.mp3')
const bugSound = new Audio('./sound/bug_pull.mp3')
const winSound = new Audio('./sound/game_win.mp3')
const alertSound = new Audio('./sound/alert.mp3')
const bgSound = new Audio('./sound/bg.mp3')

replayButton.addEventListener('click', (e) => {
	if(!isPlay){
		isPlay = true
		resultArea.style.visibility = 'hidden'
		playButton.style.visibility = 'visible'
		bottomArea.innerHTML = ''
		startGame()
	}
})
playButton.addEventListener('click', (e) => {
	if(isPlay){
		isPlay = false
		playButton.innerHTML = '<i class="fas fa-play"></i>'
	} else{
		isPlay = true
		playButton.innerHTML = '<i class="fas fa-stop"></i>'
		startGame()
	}
})
bottomArea.addEventListener('click', (e) => {
	if(!isPlay) return 
	if(e.target.className.includes('carrot')){
		count--
		counterClass.innerHTML = count
		carrotSound.play()
		if(count <= 0){
			isPlay = false
			resultText.innerHTML = 'YOU WIN!'
			winSound.play()
		}
		bottomArea.removeChild(e.target.parentNode) 
	} else if(e.target.className.includes('bug')){
		isPlay = false
		bugSound.play()
		resultText.innerHTML = 'YOU LOSE!'
	}
})

const startGame = () => {
	time = START_TIME
	count = START_COUNT
	timerClass.innerHTML = `00:${START_TIME}`
	counterClass.innerHTML = START_COUNT
	setTimer()
	setCounter()
	bgSound.play()
}

const setCounter = () => {
	for(let i = 0; i < START_COUNT; i++){
		const carrot = document.createElement('div')
		carrot.setAttribute('class', 'item-wrapper')
		const randomX = Math.floor(Math.random() * (bottomAreaPos.width - 60))
		const randomY = Math.floor(Math.random() * (bottomAreaPos.height - 60))
		carrot.style.transform = `translate(${randomX}px, ${randomY}px)`
		carrot.innerHTML = `<img src="./img/carrot.png" class="item carrot">`
		bottomArea.appendChild(carrot)
	}
	for(let i = 0; i < START_COUNT; i++){
		const bug = document.createElement('div')
		bug.setAttribute('class', 'item-wrapper')
		const randomX = Math.floor(Math.random() * (bottomAreaPos.width - 60))
		const randomY = Math.floor(Math.random() * (bottomAreaPos.height - 60))
		bug.style.transform = `translate(${randomX}px, ${randomY}px)`
		bug.innerHTML = `<img src="./img/bug.png" class="item bug">`
		bottomArea.appendChild(bug)
	}
}

const setTimer = () => {
	const timer = setInterval(() => {
		if(isPlay){
			let timeText = START_TIME
			time -= 1
			if(time < 0){
				isPlay = false
				resultText.innerHTML = 'YOU LOSE!'
			} else if(time < 10){
				timeText = '0' + time
				timerClass.innerHTML = `00:${timeText}`
			}
		} else {
			resultArea.style.visibility = 'visible'
			playButton.style.visibility = 'hidden'
			clearInterval(timer)
			bgSound.pause()
			return
		}
	}, 1000)
}