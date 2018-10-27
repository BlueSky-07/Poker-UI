import BSComponent from 'https://static.ihint.me/BSXml/BSComponent.js'
import Generator from './Generator.js'

export default class Card extends BSComponent {
  constructor({number = 0, suit = {name: '', color: ''}, cbStyle = Generator.cbStyle}) {
    super()
    this.joker = number === 'Joker'
    this.template = `
        div #app .card-container .card-back .card-in {
          ! click hit
          div .symbol-container {
            div .number {
              //~ style color: ${suit.color};
              //{{$number}}
            }
            img .suit {
              //~ src img/{{$suit.name}}.svg
            }
          }
          style #cbStyle {
            ${cbStyle}
          }
        }
      `
    this.dataset = {
      number, suit, cbStyle
    }
    this.functions = {
      hit({$this}) {
        if ($this.state === 'disable') {
        } else if ($this.state === 'back') {
          $this.refresh('show')
          $this.refresh('joker')
        } else {
          $this.read(Generator.generate())
          $this.refresh('back')
        }
      }
    }
    this.style = `
        .card-container {
          width: 10em;
          height: 15em;
          border: 2px solid #000;
          border-radius: 0.5em;
          box-shadow: #999 0 0 2em;
          overflow: hidden;
          background-color: #fff;
          cursor: pointer;
        }
        
        .gray {
          filter: grayscale(1);
        }
        
        .card-back {
          border: 2px solid #fff;
          box-shadow: #888 0 0 5em;
        }
        
        .card-back .symbol-container {
          display: none;
        }
        
        .symbol-container {
          margin: 10%;
          width: 80%;
        }
        
        .joker .number {
          text-transform: uppercase;
          font-size: 2em;
          writing-mode: vertical-lr;
        }
        
        .number {
          height: 0;
          font-size: 5em;
          font-weight: bold;
          line-height: 1em;
          text-shadow: #000 1px 1px 1px;
        }
        
        .suit {
          position: relative;
          right: 0;
          bottom: -5em;
          height: 12em;
          width: 12em;
        }
        
        .card-show {
          animation: flip 0.5s 0s 1 both;
        }
        
        .card-in {
          animation: rotateIn 0.5s 0s 1 both;
        }
        
        .card-back::after {
          content: 'Poker';
          color: #fff;
          font-size: 6em;
          font-weight: bold;
          -webkit-text-stroke: 2px #222;
          display: block;
          background-color: #444;
          width: 2em;
          padding: 0 1em;
          position: relative;
          top: 1em;
          left: -0.85em;
          transform: rotate3d(0, 0, 1, 45deg) rotate3d(0, 1, 0, -180deg);
        }
        
        .card-out {
          animation: rotateOut 0.5s 0s 1 both;
        }
        
        @keyframes rotateIn {
          from {
            transform-origin: center;
            transform: rotate3d(0, 0, 1, 200deg) rotate3d(0, 1, 0, -180deg) scale(.5);
            opacity: 0;
          }
        
          to {
            transform-origin: center;
            transform: rotate3d(0, 0, 1, -5deg) rotate3d(0, 1, 0, -180deg);
            opacity: 1;
          }
        }
        
        @keyframes rotateOut {
          from {
            transform-origin: center;
            opacity: 1;
          }
        
          to {
            transform-origin: center;
            transform: rotate3d(0, 0, 1, -200deg) scale(.5);
            opacity: 0;
          }
        }
        
        @keyframes flip {
          from {
            transform: rotate3d(0, 0, 1, -5deg) rotate3d(0, 1, 0, 180deg);
          }
        
          10% {
            transform: perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -90deg);
            animation-timing-function: ease-out;
          }
        
          40% {
            transform: perspective(400px) translate3d(0, 0, 200px) rotate3d(0, 1, 0, -30deg);
            animation-timing-function: ease-out;
          }
        
          80% {
            transform: perspective(400px) translate3d(0, 0, 180px);
            animation-timing-function: ease-in;
          }
        
          95% {
            transform: perspective(400px) rotate3d(0, 0, 1, 7deg) scale3d(.95, .95, .95);
            animation-timing-function: ease-in;
          }
        
          to {
            transform: perspective(400px) rotate3d(0, 0, 1, 5deg);
            animation-timing-function: ease-in;
          }
        }
      `
  }
  
  afterPaint() {
    this.els = {
      number: this.$el('.number'),
      suit: this.$el('.suit'),
      cbStyle: this.$el('#cbStyle')
    }
    this.state = 'back'
    
    this.motion = {
      x: 0, y: 0, z: 0, action: true
    }
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', e => {
        const {x, y, z} = e.accelerationIncludingGravity
        if (this.motion.action && this.state === 'back') {
          if (
              Math.abs(x - this.motion.x) > 20 ||
              Math.abs(y - this.motion.y) > 20 ||
              Math.abs(z - this.motion.z) > 20
          ) {
            this.el.click()
            this.motion.action = false
          }
        }
        Object.assign(this.motion, {
          x, y, z
        })
      })
    }
    
  }
  
  refresh(command, ...args) {
    this.state = 'disable'
    this.motion.action = false
    switch (command) {
      case 'back': {
        this.el.classList.add('card-out')
        this.el.classList.remove('card-show')
        setTimeout(() => {
          this.el.classList.remove('card-out')
          this.el.classList.add('card-in')
          this.el.classList.add('card-back')
          this.el.classList.remove('joker')
          this.el.classList.remove('gray')
          setTimeout(() => {
            this.state = 'back'
            this.motion.action = true
          }, 500)
        }, 500)
        break
      }
      case 'show': {
        this.el.classList.remove('card-in')
        this.el.classList.add('card-show')
        this.els.number.innerText = this.dataset.number
        this.els.number.style.color = this.dataset.suit.color
        this.els.suit.src = `img/${this.dataset.suit.name}.svg`
        setTimeout(() => {
          this.el.classList.remove('card-back')
          this.els.cbStyle.innerText = this.dataset.cbStyle
        }, 50)
        setTimeout(() => {
          this.state = 'show'
        }, 500)
        break
      }
      case 'joker': {
        this.joker = this.dataset.number === 'Joker'
        if (this.joker) {
          this.el.classList.add('joker')
          if (this.dataset.suit.color === 'black') {
            this.el.classList.add('gray')
          }
        }
        break
      }
      default:
        super.refresh()
    }
  }
}
