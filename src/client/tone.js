"use strict"

import Tone from 'tone'
import _ from 'lodash'
import Part from "./library/models/music/Part"
import NoteGenerator from "./library/models/data/NoteGenerator"
import Note from "./library/models/music/Note"
import Log from "./library/Helpers/Logging"
import Player from "./library/models/music/Player"
import Sound from "./library/models/music/Sound"
import Fileplayer from "./library/models/music/Fileplayer"
import Interface from "./library/interface"

// Do | Re | Mi | Fa | Sol | La | Si  |
// C  | D  | E  | F  | G   | A  | B.  |

let instrumentNotes = {
    'Bb3': './assets/harp/Bb3.mp3', // Si  0
    'C3': './assets/harp/C3.mp3', // DO    1
    'C5': './assets/harp/C5.mp3', // DO    2
    'D6': './assets/harp/D6.mp3', // RE    3
    'Eb3': './assets/harp/Eb3.mp3', // MI  4
    'F4': './assets/harp/F4.mp3', // FA    5
    'G5': './assets/harp/G5.mp3', // SOL   6
    'Gb6': './assets/harp/Gb6.mp3' // SOL  7
}

let partNotes = [
    {"time" : "8n * 0", "degree" : 0, "duration" : "8n"},
    {"time" : "8n * 1", "degree" : 1, "duration" : "8n"},
    {"time" : "8n * 2", "degree" : 2, "duration" : "8n"},
    {"time" : "8n * 3", "degree" : 3, "duration" : "8n"},
    {"time" : "8n * 4", "degree" : 4, "duration" : "8n"},
    {"time" : "8n * 5", "degree" : 3, "duration" : "8n"},
    {"time" : "8n * 6", "degree" : 2, "duration" : "8n"},
    {"time" : "8n * 7", "degree" : 1, "duration" : "8n"},
]

Tone.Transport.loop = true
Tone.Transport.loopEnd = "1m"


Log.SpaceTitleAndLog('Transport Events', Tone.Transport)

let partInstance = new Part(partNotes)
partInstance.start()
.then(() => {
    $('.fa-play-circle-o').click((event) => {
        if (Tone.Transport.state === 'stopped') {
            Tone.Transport.start()

            $(event.currentTarget)
            .removeClass('fa-play-circle-o')
            .addClass('fa-pause-circle-o')
        } else {
            Tone.Transport.stop()

            $(event.currentTarget)
            .removeClass('fa-pause-circle-o')
            .addClass('fa-play-circle-o')
        }
    })
})



// let players = new Tone.Players(instrumentNotes).toMaster();
//
// var synth = new Tone.Synth().toMaster();

// Tone.Buffer.on('load', () => {
//     Tone.Transport.start()
//
//     // _.forEach(_.keys(instrumentNotes), (key, i) => {
//     //     Tone.Transport.scheduleRepeat((time) => {
//     //         players.get(key).start(time)
//     //     }, i);
//     // })
// })
//
// let ExamplePart = new Tone.Part(
//     function(time, value){
//
//         players.get(value.note).start(time)
//     },
//     part
// );
//
//
// // ExamplePart.loop = true;
// ExamplePart.start();

/** Trying every class */

// Log.SpaceTitleAndLog("Data / NoteGenerator", NoteGenerator.getNotes())
//
// let noteInstance = new Note("8n", 3, "8n")
// Log.SpaceTitleAndLog("Music / Note", noteInstance)

// let playerInstance = new Player("harp")
// playerInstance.load()
// .then(res => {
//     Log.SpaceTitleAndLog("Music / Player", playerInstance)
//     // playerInstance.play("Bb3", "2n", Tone.now())
// })

// let soundInstance = new Sound()
// soundInstance.load()
// .then(() => {
//     Log.SpaceTitleAndLog("Music / Sound", soundInstance)
//     // soundInstance.play(340, Tone.now(), "2n")
// })

// Tone.Transport.start()
//
// let FilePlayerInstance = new Fileplayer("https://gweb-musiclab-site.appspot.com/static/sound/harp", "C3", "Gb6", 3)
// FilePlayerInstance.load()
// .then(() => {
//     Log.SpaceTitleAndLog("Music / fileplayer", FilePlayerInstance)
//     console.log(FilePlayerInstance.triggerAttackRelease("A3", "8n"))
// })


// let PartInstance = new Part(partNotes)
// PartInstance.start()
// .then(() => {
//     Log.SpaceTitleAndLog("Music / Part", PartInstance)
//     Tone.Transport.start()
// })






