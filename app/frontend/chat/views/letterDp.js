import { stringToHslColor } from '../helper'
import View from './view'

class LetterDp extends View {
  _generateMarkUp(name) {
    return `<div style="background-color:${stringToHslColor(
      name
    )};" class="letter-dp ">${name.charAt(0)}</div>`
  }
}

export default new LetterDp()
