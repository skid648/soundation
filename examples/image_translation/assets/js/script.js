
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
        $('#bpm .color').css('background', color)
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

      updateBpmMapping = () => {
        let settings = $('#bpm .row')
        let mapping = {}
        _.forEach(settings, row => {
          mapping[$(row).find('.color-value').attr('style').replace('background: ', '')] = $(row).find('input').val()
        })
        harp.setBpmMapping(mapping)
      }

      resetBpmMapping = () => {
        let mapping = {
          '#000000': 50,
          '#808080': 60,
          '#0000ff': 70,
          '#800080': 80,
          '#ff0000': 90,
          '#008000': 100,
          '#ffa500': 110,
          '#ffff00': 120,
          '#00ffff': 130,
          '#ffffff': 140,
        }
        harp.setBpmMapping(mapping)
        let settings = $('#bpm .row')
        _.forEach(settings, row => {
          let originalBpm = mapping[$(row).find('.color-value').attr('style').replace('background: ', '')]
          $(row).find('input').val(originalBpm)
        })
      }

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
      // When mouse hovers image
      $('#tracks img').mousemove((event) => {
        const color = harp.colors.get(event, '#tracks img', trackImage.imageData)
        $('#tracks .color').css('background', color)
        // resume the harp and change the track being played based on the color
        harp.resume()
        harp.track({ color, displayElement: '.track-value' })
      })

      // When mouse leaves the image, stop the sound
      $('#tracks img').mouseout(() => {
        harp.pause()
      })

      // clicking on image
      $('#tracks img').click((event) => {
        const color = harp.colors.get(event, '#tracks img', trackImage.imageData)
        // Shout the color when the users clicks
        harp.shoutColor(color)
      })

      updateTrackMapping = () => {
        let settings = $('#tracks .row')
        let mapping = {}
        _.forEach(settings, row => {
          mapping[$(row).find('.color-value').attr('style').replace('background: ', '')] = $(row).find('select').val()
        })
        harp.setTrackMapping(mapping)
      }

      resetTrackMapping = () => {
        let mapping = {
          '#000000': '1 note',
          '#808080': '2 notes',
          '#0000ff': '3 notes',
          '#800080': '4 notes',
          '#ff0000': '4 notes',
          '#008000': '4 notes',
          '#ffa500': '4 notes',
          '#ffff00': '5 notes',
          '#00ffff': '6 notes',
          '#ffffff': '7 notes',
        }
        harp.setTrackMapping(mapping)
        let settings = $('#tracks .row')
        _.forEach(settings, row => {
          let originalTrack = mapping[$(row).find('.color-value').attr('style').replace('background: ', '')]
          $(row).find('select').val(originalTrack)
        })
      }
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
        $('#key .color').css('background', color)
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

      updateKeyMapping = () => {
        let settings = $('#key .row')
        let mapping = {}
        _.forEach(settings, row => {
          mapping[$(row).find('.color-value').attr('style').replace('background: ', '')] = $(row).find('select').val()
        })
        harp.setKeyMapping(mapping)
      }

      resetKeyMapping = () => {
        const mapping = {
          '#000000': 'C',
          '#808080': 'G',
          '#0000ff': 'G#',
          '#800080': 'D#',
          '#ff0000': 'A',
          '#008000': 'F#',
          '#ffa500': 'E',
          '#ffff00': 'B',
          '#00ffff': 'C#',
          '#ffffff': 'D',
        }
        let settings = $('#key .row')
        _.forEach(settings, row => {
          let originalTrack = mapping[$(row).find('.color-value').attr('style').replace('background: ', '')]
          $(row).find('select').val(originalTrack)
        })
        harp.setKeyMapping(mapping)
      }
    })
})

/**
 * Show bpm info on hover
 */

$('#bpm-title').hover(() => {
  $('.notification').html()
  $('.notification').html($('#bpm-title-info').html())
  $('.notification').css('opacity', '1')
  $('.notification').css('left', '0px')
}, () => {
  $('.notification').css('opacity', '0')

  $('.notification').css('left', '-10px')
})

$('#bpm-link').hover(() => {
  $('.notification').html()
  $('.notification').html($('#bpm-title-info').html())
  $('.notification').css('opacity', '1')
  $('.notification').css('left', '0px')
}, () => {
  $('.notification').css('opacity', '0')

  $('.notification').css('left', '-10px')
})

/**
 * Show tracks info on hover
 */

$('#track-title').hover(() => {
  $('.notification').html()
  $('.notification').html($('#track-title-info').html())
  $('.notification').css('opacity', '1')
  $('.notification').css('left', '0px')
}, () => {
  $('.notification').css('opacity', '0')

  $('.notification').css('left', '-10px')
})

$('#tracks-link').hover(() => {
  $('.notification').html()
  $('.notification').html($('#track-title-info').html())
  $('.notification').css('opacity', '1')
  $('.notification').css('left', '0px')
}, () => {
  $('.notification').css('opacity', '0')

  $('.notification').css('left', '-10px')
})

/**
 * Show key info on hover
 */

$('#key-title').hover(() => {
  $('.notification').html()
  $('.notification').html($('#key-title-info').html())
  $('.notification').css('opacity', '1')
  $('.notification').css('left', '0px')
}, () => {
  $('.notification').css('opacity', '0')

  $('.notification').css('left', '-10px')
})

$('#key-link').hover(() => {
  $('.notification').html()
  $('.notification').html($('#key-title-info').html())
  $('.notification').css('opacity', '1')
  $('.notification').css('left', '0px')
}, () => {
  $('.notification').css('opacity', '0')

  $('.notification').css('left', '-10px')
})


/**
 * Share buttons
 */

$(document).ready(() => {
  $('.fb-share').click(function (e) {
    e.preventDefault();
    window.open(
      $(this).attr('href'),
      '_blank',
      `height=450, width=550, top=${($(window).height() / 2) - 275}, left=${($(window).width() / 2) - 225}, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0`,
    )
    return false
  })
})

$(document).ready(() => {
  $('.twitter-share').click(function (e) {
    e.preventDefault();
    window.open(
      $(this).attr('href'),
      '_blank',
      `height=450, width=550, top=${($(window).height() / 2) - 275}, left=${($(window).width() / 2) - 225}, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0`,
    )
    return false
  })
})

$(document).ready(() => {
  $('.google-share').click(function (e) {
    e.preventDefault();
    window.open(
      $(this).attr('href'),
      '_blank',
      `height=450, width=550, top=${($(window).height() / 2) - 275}, left=${($(window).width() / 2) - 225}, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0`,
    )
    return false
  })
})


$('.fa-sliders-h').click(function (e) {
  const settingsPane = $(this).siblings('.settings')
  $(this).toggleClass('clicked')
  settingsPane.toggleClass('open')
})

/**
 * Behavioral javascript
 * @param element
 */

const scrollToElement = function (element) {
  console.log(element)
  $('html, body').animate({
    scrollTop: $(element).offset().top,
  }, 2000);
}

$('a:contains("Documentation")').click(function (event) {
  $('.menu a').removeClass('active')
  $(this).addClass('active')
  $('.examples').hide()
  $('.paper').hide()
  $('.docs').show()
  $('.docs').css('opacity', '1')
})

$('a:contains("Example")').click(function (event) {
  $('.menu a').removeClass('active')
  $(this).addClass('active')
  $('.docs').hide()
  $('.docs').css('opacity', '0')
  $('.paper').hide()
  $('.examples').show()
})