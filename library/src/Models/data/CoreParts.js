import _ from 'lodash'

class Parts {
  constructor() {
    this.parts = [
      {
        partName: '1 note',
        partData: [
          { time: '8n * 0', degree: 0, duration: '8n' },
          { time: '8n * 1', degree: 1, duration: '8n' },
          { time: '8n * 2', degree: 2, duration: '8n' },
          { time: '8n * 3', degree: 3, duration: '8n' },
          { time: '8n * 4', degree: 4, duration: '8n' },
          { time: '8n * 5', degree: 3, duration: '8n' },
          { time: '8n * 6', degree: 2, duration: '8n' },
          { time: '8n * 7', degree: 1, duration: '8n' },

        ],
      },
      {
        partName: '2 notes',
        partData: [
          { time: '8n * 0', degree: 3, duration: '8n' },
          { time: '8n * 1', degree: 5, duration: '8n' },
          { time: '8n * 2', degree: 4, duration: '8n' },
          { time: '8n * 3', degree: 5, duration: '8n' },
          { time: '8n * 4', degree: 3, duration: '8n' },
          { time: '8n * 5', degree: 5, duration: '8n' },
          { time: '8n * 6', degree: 4, duration: '8n' },
          { time: '8n * 7', degree: 5, duration: '8n' },
        ],
      },
      {
        partName: '3 notes',
        partData: [
          { time: '4n * 0', degree: 0, duration: '4n' },
          { time: '4n * 0', degree: 4, duration: '4n' },
          { time: '4n * 1', degree: 1, duration: '4n' },
          { time: '4n * 1', degree: 5, duration: '4n' },
          { time: '4n * 2', degree: 2, duration: '4n' },
          { time: '4n * 2', degree: 6, duration: '4n' },
          { time: '4n * 3', degree: 3, duration: '4n' },
          { time: '4n * 3', degree: 7, duration: '4n' },
        ],
      },
      {
        partName: '4 notes',
        partData: [
          { time: '4n * 0', degree: 0, duration: '4n' },
          { time: '4n * 1', degree: 1, duration: '4n' },
          { time: '4n * 2', degree: 2, duration: '4n' },
          { time: '4n * 3', degree: 3, duration: '4n' },
        ],
      },
      {
        partName: '5 notes',
        partData: [
          { time: '16n * 0', degree: 0, duration: '16n' },
          { time: '16n * 0', degree: 2, duration: '16n' },
          { time: '16n * 0', degree: 6, duration: '16n' },

          { time: '16n * 1', degree: 5, duration: '16n' },
          { time: '16n * 2', degree: 6, duration: '16n' },
          { time: '16n * 3', degree: 5, duration: '16n' },

          { time: '16n * 4', degree: 6, duration: '16n' },
          { time: '16n * 4', degree: 4, duration: '16n' },

          { time: '16n * 5', degree: 5, duration: '16n' },
          { time: '16n * 6', degree: 6, duration: '16n' },
          { time: '16n * 7', degree: 5, duration: '16n' },

          { time: '16n * 8', degree: 0, duration: '16n' },
          { time: '16n * 8', degree: 2, duration: '16n' },
          { time: '16n * 8', degree: 6, duration: '16n' },

          { time: '16n * 9', degree: 5, duration: '16n' },
          { time: '16n * 10', degree: 6, duration: '16n' },
          { time: '16n * 11', degree: 5, duration: '16n' },

          { time: '16n * 12', degree: 6, duration: '16n' },
          { time: '16n * 12', degree: 4, duration: '16n' },

          { time: '16n * 13', degree: 5, duration: '16n' },
          { time: '16n * 14', degree: 6, duration: '16n' },
          { time: '16n * 15', degree: 5, duration: '16n' },
        ],
      },
      {
        partName: '6 notes',
        partData: [
          { time: '8t * 0', degree: 5, duration: '8t' },
          { time: '8t * 1', degree: 4, duration: '8t' },
          { time: '8t * 2', degree: 3, duration: '8t' },
          { time: '8t * 3', degree: 4, duration: '8t' },
          { time: '8t * 4', degree: 3, duration: '8t' },
          { time: '8t * 5', degree: 2, duration: '8t' },
          { time: '8t * 6', degree: 3, duration: '8t' },
          { time: '8t * 7', degree: 2, duration: '8t' },
          { time: '8t * 8', degree: 1, duration: '8t' },
          { time: '8t * 9', degree: 2, duration: '8t' },
          { time: '8t * 10', degree: 3, duration: '8t' },
          { time: '8t * 11', degree: 4, duration: '8t' },
        ],
      },
      {
        partName: '7 notes',
        partData: [
          { time: '8t * 0', degree: 0, duration: '8t' },
          { time: '8t * 0', degree: 2, duration: '8t' },

          { time: '8t * 1', degree: 1, duration: '8t' },
          { time: '8t * 1', degree: 3, duration: '8t' },

          { time: '8t * 2', degree: 2, duration: '8t' },
          { time: '8t * 2', degree: 4, duration: '8t' },

          { time: '8t * 3', degree: 3, duration: '8t' },
          { time: '8t * 3', degree: 5, duration: '8t' },

          { time: '8t * 4', degree: 2, duration: '8t' },
          { time: '8t * 4', degree: 4, duration: '8t' },

          { time: '8t * 5', degree: 1, duration: '8t' },
          { time: '8t * 5', degree: 5, duration: '8t' },

          { time: '8t * 6', degree: 0, duration: '8t' },
          { time: '8t * 6', degree: 6, duration: '8t' },

          { time: '8t * 7', degree: 1, duration: '8t' },
          { time: '8t * 7', degree: 5, duration: '8t' },

          { time: '8t * 8', degree: 2, duration: '8t' },
          { time: '8t * 8', degree: 6, duration: '8t' },

          { time: '8t * 9', degree: 3, duration: '8t' },
          { time: '8t * 9', degree: 7, duration: '8t' },

          { time: '8t * 10', degree: 6, duration: '8t' },
          { time: '8t * 10', degree: 2, duration: '8t' },

          { time: '8t * 11', degree: 5, duration: '8t' },
          { time: '8t * 11', degree: 1, duration: '8t' },
        ],
      },
    ]
    this.initialPart = _.first(this.parts)
    this.nextPartIndex = 0
  }

  get(partName, full = false) {
    const part = _.find(this.parts, { partName })
    if (full) return part
    return (part == null)
      ? null
      : part.partData
  }

  next() {
    if (this.nextPartIndex >= this.parts.length - 1) {
      this.nextPartIndex = 0
    } else {
      this.nextPartIndex = this.nextPartIndex + 1
    }
    return this.parts[this.nextPartIndex]
  }
}


export default new Parts()
