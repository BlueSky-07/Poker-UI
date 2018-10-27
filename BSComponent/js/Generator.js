import Card from './Card.js'

export default class Generator {
  static get numbers() {
    return ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'Joker']
  }
  
  static get suits() {
    return [
      {name: 'heart', color: 'red'},
      {name: 'diamond', color: 'red'},
      {name: 'spade', color: 'black'},
      {name: 'club', color: 'black'},
      {name: 'joker', color: ''}
    ]
  }
  
  static get angle() {
    return Math.floor(Math.random() * 360) + 'deg'
  }
  
  static get colorHEX() {
    return Math.floor(Math.random() * 0x1000000)
  }
  
  static get colorSuit() {
    const c = Generator.colorHEX
    return [
      c.toString(16).padStart(7, '#000000'),
      ((c + 0x222222) % 0x1000000).toString(16).padStart(7, '#000000')
    ]
  }
  
  static get cbStyle() {
    const [from, to] = Generator.colorSuit
    return `.card-back {background: linear-gradient(${Generator.angle}, ${from}, ${to});}`
  }
  
  static generate(isCard = false) {
    if (Generator.hacked) {
      const c = Generator.hacked
      Generator.hacked = false
      return c
    }
    const number = Generator.numbers[Math.floor(Math.random() * Generator.numbers.length)]
    const suit = Generator.suits[Math.floor(Math.random() * Generator.suits.length)]
    let data = {}
    if (suit.name !== 'joker' && number !== 'Joker') {
      data = {
        number, suit, cbStyle: Generator.cbStyle
      }
    } else if (suit.name === 'joker' && number === 'Joker') {
      data = {
        number, cbStyle: Generator.cbStyle,
        suit: {
          name: suit.name,
          color: ['red', 'black'][(Math.floor(Math.random() * 2))]
        }
      }
    } else {
      data = Generator.generate()
    }
    return isCard ? new Card(data) : data
  }
  
  static hack(enabled = false) {
    if (enabled) {
      window.hack = ({number = 0, suit = {name: '', color: ''}}) => {
        Generator.hacked = {
          number, suit, cbStyle: Generator.cbStyle
        }
      }
    }
  }
}