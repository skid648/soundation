"use strict"

import Tone from 'tone'
import _ from 'lodash'

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

let part = [
    {"time" : "8n * 0", "note": "Bb3", "degree" : 0, "duration" : "8n"},
    {"time" : "8n * 0", "note": "D6", "degree" : 3, "duration" : "8n"},

    {"time" : "8n * 1", "note": "C3", "degree" : 1, "duration" : "8n"},
    {"time" : "8n * 1", "note": "Eb3", "degree" : 4, "duration" : "8n"},

    {"time" : "8n * 2", "note": "C5", "degree" : 2, "duration" : "8n"},
    {"time" : "8n * 2", "note": "F4", "degree" : 5, "duration" : "8n"},

    {"time" : "8n * 3", "note": "D6", "degree" : 3, "duration" : "8n"},
    {"time" : "8n * 3", "note": "G5", "degree" : 6, "duration" : "8n"},

    {"time" : "8n * 4", "note": "Eb3", "degree" : 4, "duration" : "8n"},
    {"time" : "8n * 4", "note": "Gb6", "degree" : 7, "duration" : "8n"},

    {"time" : "8n * 5", "note": "C3", "degree" : 1, "duration" : "8n"},
    {"time" : "8n * 5", "note": "Eb3", "degree" : 4, "duration" : "8n"},

    {"time" : "8n * 6", "note": "C5", "degree" : 2, "duration" : "8n"},
    {"time" : "8n * 6", "note": "F4", "degree" : 5, "duration" : "8n"}
]

let players = new Tone.Players(instrumentNotes).toMaster();

var synth = new Tone.Synth().toMaster();

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




