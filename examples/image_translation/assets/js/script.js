
/**
 * BPM TEST
 */

const bpmImageSrc = $('#bpm img').attr('src')
const bpmImage = new MarvinImage()

bpmImage.load(bpmImageSrc, () => {
  const harp = new Soundation(`http://${window.location.host}/assets/harp`)
  harp.imageClassifier({}, 10)
  harp.load()
    .then(() => {
      // When mouse hover image
      $('#bpm img').mousemove((event) => {
        // get color value from image and coordinates
        const color = harp.colors.get(event, '#bpm img', bpmImage.imageData)
        $('#bpm .explanation .color').css('background', color)
        // resume the harp
        harp.resume()
        // change the tempo based on the color
        harp.bpm({ color, displayElement: '.bpm-value' })
      })

      // When mouse leaves the image stop the sound
      $('#bpm img').mouseout(() => harp.pause())

      // clicking on image
      $('#bpm img').click((event) => {
        // grab color from pixel
        const color = harp.colors.get(event, '#bpm img', bpmImage.imageData)
        // Shout the color when the users clicks
        harp.shoutColor(color)
      })
    })
})

/**
 * TRACK TEST
 */

const trackImageSrc = $('#tracks img').attr('src')
const trackImage = new MarvinImage()

trackImage.load(trackImageSrc, () => {
  const harp = new Soundation(`http://${window.location.host}/assets/harp`)
  harp.imageClassifier({}, 10)
  harp.load()
    .then(() => {
      // When mouse hover image
      $('#tracks img').mousemove((event) => {
        const color = harp.colors.get(event, '#tracks img', trackImage.imageData)
        $('#tracks .explanation .color').css('background', color)
        // resume the harp and change the track being played based on the color
        harp.resume()
        harp.track({ color, displayElement: '.track-value' })
      })

      // When mouse leaves the image stop the sound
      $('#tracks img').mouseout(() => {
        harp.pause()
      })

      // clicking on image
      $('#tracks img').click((event) => {
        const color = harp.colors.get(event, '#tracks img', trackImage.imageData)
        // Shout the color when the users clicks
        harp.shoutColor(color)
      })
    })
})

/**
 * KEY TEST
 */

const keyImageSrc = $('#key img').attr('src')
const keyImage = new MarvinImage()

keyImage.load(keyImageSrc, () => {
  let lastColor = {}
  const harp = new Soundation(`http://${window.location.host}/assets/harp`)

  harp.imageClassifier({}, 10)
  harp.load()
    .then(() => {
      // When mouse hover image
      $('#key img').mousemove((event) => {
        const color = harp.colors.get(event, '#key img', keyImage.imageData)
        $('#key .explanation .color').css('background', color)
        // resume the harp and change the key of the sound based on the color
        harp.resume()
        harp.key({ color, displayElement: '.key-value' })
        lastColor = color
      })

      // When mouse leaves the image stop the sound
      $('#key img').mouseout(() => {
        harp.pause()
        harp.strum({
          color: lastColor,
          delay: 200,
        })
      })

      // clicking on image
      $('#key img').click((event) => {
        // grab color from pixel
        const color = harp.colors.get(event, '#key img', keyImage.imageData)

        // Shout the color when the users clicks
        harp.shoutColor(color)
      })
    })
})

const scrollToElement = function (element) {
  console.log(element)
  $('html, body').animate({
    scrollTop: $(element).offset().top
  }, 2000);
}

$('#bpm-title').hover(() => {
  $('.notification').html()
  $('.notification').html($('#bpm-title-info').html())
  $('.notification').css('opacity', '1')
  $('.notification').css('left', '0px')
}, () => {
  $('.notification').css('opacity', '0')

  $('.notification').css('left', '-10px')
})

$('#track-title').hover(() => {
  $('.notification').html()
  $('.notification').html($('#track-title-info').html())
  $('.notification').css('opacity', '1')
  $('.notification').css('left', '0px')
}, () => {
  $('.notification').css('opacity', '0')

  $('.notification').css('left', '-10px')
})

$('#key-title').hover(() => {
  $('.notification').html()
  $('.notification').html($('#key-title-info').html())
  $('.notification').css('opacity', '1')
  $('.notification').css('left', '0px')
}, () => {
  $('.notification').css('opacity', '0')

  $('.notification').css('left', '-10px')
})

