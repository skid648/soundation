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
let generatedNotes = NoteGenerator.getNotes()


let partNotes = [
    [
        {"time" : "4n * 0", "degree" : 0, "duration" : "4n"},
        {"time" : "4n * 1", "degree" : 5, "duration" : "4n"},
        {"time" : "4n * 2", "degree" : 3, "duration" : "4n"},
        {"time" : "4n * 3", "degree" : 2, "duration" : "4n"},
    ],
    [
        {"time" : "2n * 0", "degree" : 0, "duration" : "2n"},
        {"time" : "2n * 1", "degree" : 4, "duration" : "2n"},
    ],

]



Tone.Transport.loop = true
Tone.Transport.loopEnd = "1m"

Interface.setControls()

let partInstance = new Part(partNotes[0])
partInstance.start()