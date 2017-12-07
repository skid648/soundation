"use strict"

import Tone from 'tone'
import _ from 'lodash'
import Part from "./library/models/music/Part"
import Interface from "./library/interface"
import CoreParts from './library/models/data/CoreParts'
import Fileplayer from './library/models/music/Fileplayer'

// Do | Re | Mi | Fa | Sol | La | Si  |
// C  | D  | E  | F  | G   | A  | B.  |

Tone.Transport.loop = true
Tone.Transport.loopStart = "0m"
Tone.Transport.loopEnd = "1m"
Tone.Transport.bpm.value = 50

$(document).on('input', '#bpm', function () {
    let bpm = parseInt($(this).val())
    Tone.Transport.bpm.value = bpm
    $("#bpm_label").html( bpm )
});

let partInstance = new Part(CoreParts[0].partData, CoreParts[0].partName)

partInstance.start()
.then(() => {
    Interface.setControls(partInstance)
})

/**
 *   URLs
 *
 *   https://gweb-musiclab-site.appspot.com/static/sound/harp/Eb3.mp3
 *   https://gweb-musiclab-site.appspot.com/static/sound/harp/Bb3.mp3
 *   https://gweb-musiclab-site.appspot.com/static/sound/harp/F4.mp3
 *   https://gweb-musiclab-site.appspot.com/static/sound/harp/C5.mp3
 *   https://gweb-musiclab-site.appspot.com/static/sound/harp/G5.mp3
 *   https://gweb-musiclab-site.appspot.com/static/sound/harp/D6.mp3
 */

/**
 * Simulate this Player
 *   triggering atack release for note: C3 at time: 3.430748299319728
 *   triggering atack release for note: E3 at time: 3.7307482993197323
 *   triggering atack release for note: G3 at time: 4.030748299319736
 *   triggering atack release for note: C4 at time: 4.33074829931974
 *   triggering atack release for note: E4 at time: 4.630748299319745
 *   triggering atack release for note: C4 at time: 4.930748299319749
 *   triggering atack release for note: G3 at time: 5.230748299319753
 *   triggering atack release for note: E3 at time: 5.530748299319757
 *   triggering atack release for note: C3 at time: 5.830748299319762
 *   triggering atack release for note: E3 at time: 6.130748299319766
 *   triggering atack release for note: G3 at time: 6.43074829931977
 *   triggering atack release for note: C4 at time: 6.7307482993197745
 *   triggering atack release for note: E4 at time: 7.030748299319779
 *   triggering atack release for note: C4 at time: 7.330748299319783
 *   triggering atack release for note: G3 at time: 7.630748299319787
 *   triggering atack release for note: E3 at time: 7.9307482993197915
 */

// let samplePlayer = new Tone.Player('https://gweb-musiclab-site.appspot.com/static/sound/harp/Eb3.mp3', () => {
//     console.log(`loaded`);
//     samplePlayer.start("1n", 0)
// }).toMaster()

let basicFilePlayer = new Fileplayer('https://gweb-musiclab-site.appspot.com/static/sound/harp/', 'C3', 'B5')
basicFilePlayer.triggerAttackRelease("C3",)


