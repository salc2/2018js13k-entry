import {Cmd, emptyCmd, create} from './cmd';
import {Action} from './actions';
import './lib/sonantx.js';
declare var sonantx: any;
const audioCtx:AudioContext = new AudioContext();






export function soundSplashEnemy(): Cmd<Action>{
    return create( () =>{
        soundGenInven.createAudioBuffer(125, function(buffer) {
        var source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
        });
    } ,null);

}

const jsonInven = {
    "osc1_oct": 9,
    "osc1_det": 0,
    "osc1_detune": 0,
    "osc1_xenv": 0,
    "osc1_vol": 255,
    "osc1_waveform": 0,
    "osc2_oct": 9,
    "osc2_det": 0,
    "osc2_detune": 12,
    "osc2_xenv": 0,
    "osc2_vol": 255,
    "osc2_waveform": 0,
    "noise_fader": 0,
    "env_attack": 100,
    "env_sustain": 0,
    "env_release": 14545,
    "env_master": 70,
    "fx_filter": 0,
    "fx_freq": 0,
    "fx_resonance": 240,
    "fx_delay_time": 2,
    "fx_delay_amt": 27,
    "fx_pan_freq": 3,
    "fx_pan_amt": 47,
    "lfo_osc1_freq": 0,
    "lfo_fx_freq": 0,
    "lfo_freq": 0,
    "lfo_amt": 0,
    "lfo_waveform": 0
};


var soundGenInven = new sonantx.SoundGenerator(jsonInven);
export function gotInventorySound():Cmd<Action>{
    return create( () =>{
        soundGenInven.createAudioBuffer(159, function(buffer) {
        var source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
    });
    } ,null);
}


const jsonTheme = {
    "rowLen": 7692,
    "endPattern": 10,
    "songData": [
        {
            "osc1_oct": 7,
            "osc1_det": 0,
            "osc1_detune": 0,
            "osc1_xenv": 0,
            "osc1_vol": 255,
            "osc1_waveform": 1,
            "osc2_oct": 7,
            "osc2_det": 0,
            "osc2_detune": 9,
            "osc2_xenv": 0,
            "osc2_vol": 154,
            "osc2_waveform": 1,
            "noise_fader": 0,
            "env_attack": 197,
            "env_sustain": 88,
            "env_release": 10614,
            "env_master": 45,
            "fx_filter": 0,
            "fx_freq": 11025,
            "fx_resonance": 255,
            "fx_delay_time": 2,
            "fx_delay_amt": 146,
            "fx_pan_freq": 3,
            "fx_pan_amt": 47,
            "lfo_osc1_freq": 0,
            "lfo_fx_freq": 0,
            "lfo_freq": 0,
            "lfo_amt": 0,
            "lfo_waveform": 0,
            "p": [
                1,
                1,
                2,
                3,
                1,
                1,
                1,
                2,
                3
            ],
            "c": [
                {
                    "n": [
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0
                    ]
                },
                {
                    "n": [
                        159,
                        0,
                        0,
                        0,
                        159,
                        0,
                        0,
                        0,
                        159,
                        0,
                        0,
                        0,
                        159,
                        0,
                        151,
                        0,
                        159,
                        0,
                        0,
                        0,
                        159,
                        0,
                        0,
                        0,
                        159,
                        0,
                        0,
                        0,
                        159,
                        0,
                        151,
                        0
                    ]
                },
                {
                    "n": [
                        159,
                        0,
                        0,
                        0,
                        159,
                        0,
                        0,
                        0,
                        159,
                        0,
                        0,
                        0,
                        159,
                        0,
                        0,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0,
                        147,
                        0
                    ]
                }
            ]
        },
        {
            "osc1_oct": 7,
            "osc1_det": 0,
            "osc1_detune": 0,
            "osc1_xenv": 0,
            "osc1_vol": 255,
            "osc1_waveform": 1,
            "osc2_oct": 7,
            "osc2_det": 0,
            "osc2_detune": 9,
            "osc2_xenv": 0,
            "osc2_vol": 154,
            "osc2_waveform": 1,
            "noise_fader": 0,
            "env_attack": 197,
            "env_sustain": 88,
            "env_release": 10614,
            "env_master": 45,
            "fx_filter": 0,
            "fx_freq": 11025,
            "fx_resonance": 255,
            "fx_delay_time": 2,
            "fx_delay_amt": 146,
            "fx_pan_freq": 3,
            "fx_pan_amt": 47,
            "lfo_osc1_freq": 0,
            "lfo_fx_freq": 0,
            "lfo_freq": 0,
            "lfo_amt": 0,
            "lfo_waveform": 0,
            "p": [
                1,
                1,
                0,
                2,
                1,
                1,
                1,
                0,
                2
            ],
            "c": [
                {
                    "n": [
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0,
                        143,
                        0
                    ]
                }
            ]
        },
        {
            "osc1_oct": 7,
            "osc1_det": 0,
            "osc1_detune": 0,
            "osc1_xenv": 0,
            "osc1_vol": 255,
            "osc1_waveform": 1,
            "osc2_oct": 7,
            "osc2_det": 0,
            "osc2_detune": 9,
            "osc2_xenv": 0,
            "osc2_vol": 154,
            "osc2_waveform": 1,
            "noise_fader": 0,
            "env_attack": 197,
            "env_sustain": 88,
            "env_release": 10614,
            "env_master": 45,
            "fx_filter": 0,
            "fx_freq": 11025,
            "fx_resonance": 255,
            "fx_delay_time": 2,
            "fx_delay_amt": 146,
            "fx_pan_freq": 3,
            "fx_pan_amt": 47,
            "lfo_osc1_freq": 0,
            "lfo_fx_freq": 0,
            "lfo_freq": 0,
            "lfo_amt": 0,
            "lfo_waveform": 0,
            "p": [
                1,
                1,
                0,
                2,
                1,
                1,
                1,
                0,
                2
            ],
            "c": [
                {
                    "n": [
                        140,
                        0,
                        140,
                        0,
                        140,
                        0,
                        140,
                        0,
                        140,
                        0,
                        140,
                        0,
                        140,
                        0,
                        140,
                        0,
                        139,
                        0,
                        139,
                        0,
                        139,
                        0,
                        139,
                        0,
                        139,
                        0,
                        139,
                        0,
                        139,
                        0,
                        139,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        139,
                        0,
                        139,
                        0,
                        139,
                        0,
                        139,
                        0,
                        139,
                        0,
                        139,
                        0,
                        139,
                        0,
                        139,
                        0
                    ]
                }
            ]
        },
        {
            "osc1_oct": 7,
            "osc1_det": 0,
            "osc1_detune": 0,
            "osc1_xenv": 0,
            "osc1_vol": 255,
            "osc1_waveform": 3,
            "osc2_oct": 8,
            "osc2_det": 0,
            "osc2_detune": 0,
            "osc2_xenv": 0,
            "osc2_vol": 255,
            "osc2_waveform": 0,
            "noise_fader": 127,
            "env_attack": 22,
            "env_sustain": 22,
            "env_release": 2193,
            "env_master": 255,
            "fx_filter": 3,
            "fx_freq": 4067,
            "fx_resonance": 176,
            "fx_delay_time": 4,
            "fx_delay_amt": 12,
            "fx_pan_freq": 2,
            "fx_pan_amt": 84,
            "lfo_osc1_freq": 0,
            "lfo_fx_freq": 1,
            "lfo_freq": 3,
            "lfo_amt": 96,
            "lfo_waveform": 0,
            "p": [
                0,
                0,
                0,
                0,
                1,
                1,
                1
            ],
            "c": [
                {
                    "n": [
                        0,
                        164,
                        0,
                        0,
                        0,
                        152,
                        0,
                        0,
                        154,
                        0,
                        159,
                        0,
                        154,
                        0,
                        164,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ]
        }
    ],
    "songLen": 57
};

var songGen = new sonantx.MusicGenerator(jsonTheme);
export function playSound(){
    songGen.createAudioBuffer(function(buffer) {
        var source = audioCtx.createBufferSource();
        source.buffer = buffer;
        const gain = audioCtx.createGain()
        gain.gain.value = 0.18;
        gain.connect(audioCtx.destination)
        source.connect(gain);
        source.loop = true;
        source.start()
        source.loopEnd = 46.00;
    });

}
