import ColorClassifier from 'color-classifier'
import _ from 'lodash'

class Classifier {
  constructor(imageArray) {
    this.palette = _extractColorPallete(imageArray) || ['#000', '#FFFFFF']
    this.colorClassifier = new ColorClassifier(this.palette);
  }

  _extractColorPallete(imageArray) {
    let uniqueColors = _.uniq
  }
}

export default new Classifier()


const color = colorClassifier.classify('#fefefe');

console.log(color); // {r: 255, g: 255, b: 255}