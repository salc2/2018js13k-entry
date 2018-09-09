import './lib/sonantx.js';
declare var sonantx: any;
const audioCtx:AudioContext = new AudioContext();


const jsonOnFloor = {
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
    "fx_delay_amt": 0,
    "fx_pan_freq": 2,
    "fx_pan_amt": 84,
    "lfo_osc1_freq": 0,
    "lfo_fx_freq": 1,
    "lfo_freq": 3,
    "lfo_amt": 96,
    "lfo_waveform": 0
};

var sourceFloor: AudioBufferSourceNode;
var soundGenFloor = new sonantx.SoundGenerator(jsonOnFloor);
soundGenFloor.createAudioBuffer(147, function(buffer) {
    sourceFloor = audioCtx.createBufferSource();
    sourceFloor.buffer = buffer;
    sourceFloor.connect(audioCtx.destination);
    
});

export function soundOnFloor(){
    sourceFloor.start()
}


const jsonTheme = {
    "rowLen": 7692,
    "endPattern": 7,
    "songData": [
        {
            "osc1_oct": 7,
            "osc1_det": 0,
            "osc1_detune": 0,
            "osc1_xenv": 0,
            "osc1_vol": 192,
            "osc1_waveform": 2,
            "osc2_oct": 7,
            "osc2_det": 0,
            "osc2_detune": 0,
            "osc2_xenv": 0,
            "osc2_vol": 201,
            "osc2_waveform": 3,
            "noise_fader": 0,
            "env_attack": 100,
            "env_sustain": 150,
            "env_release": 13636,
            "env_master": 191,
            "fx_filter": 2,
            "fx_freq": 5839,
            "fx_resonance": 254,
            "fx_delay_time": 6,
            "fx_delay_amt": 121,
            "fx_pan_freq": 6,
            "fx_pan_amt": 147,
            "lfo_osc1_freq": 0,
            "lfo_fx_freq": 1,
            "lfo_freq": 6,
            "lfo_amt": 195,
            "lfo_waveform": 0,
            "p": [
                1,
                1,
                2,
                3,
                1,
                1
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
            "osc1_vol": 192,
            "osc1_waveform": 0,
            "osc2_oct": 7,
            "osc2_det": 0,
            "osc2_detune": 0,
            "osc2_xenv": 0,
            "osc2_vol": 192,
            "osc2_waveform": 0,
            "noise_fader": 0,
            "env_attack": 200,
            "env_sustain": 2000,
            "env_release": 20000,
            "env_master": 192,
            "fx_filter": 0,
            "fx_freq": 11025,
            "fx_resonance": 255,
            "fx_delay_time": 0,
            "fx_delay_amt": 0,
            "fx_pan_freq": 0,
            "fx_pan_amt": 0,
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
                1
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
            "osc1_vol": 192,
            "osc1_waveform": 0,
            "osc2_oct": 7,
            "osc2_det": 0,
            "osc2_detune": 0,
            "osc2_xenv": 0,
            "osc2_vol": 192,
            "osc2_waveform": 0,
            "noise_fader": 0,
            "env_attack": 200,
            "env_sustain": 2000,
            "env_release": 20000,
            "env_master": 192,
            "fx_filter": 0,
            "fx_freq": 11025,
            "fx_resonance": 255,
            "fx_delay_time": 0,
            "fx_delay_amt": 0,
            "fx_pan_freq": 0,
            "fx_pan_amt": 0,
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
                1
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
            "osc1_vol": 192,
            "osc1_waveform": 0,
            "osc2_oct": 7,
            "osc2_det": 0,
            "osc2_detune": 0,
            "osc2_xenv": 0,
            "osc2_vol": 192,
            "osc2_waveform": 0,
            "noise_fader": 0,
            "env_attack": 200,
            "env_sustain": 2000,
            "env_release": 20000,
            "env_master": 192,
            "fx_filter": 0,
            "fx_freq": 11025,
            "fx_resonance": 255,
            "fx_delay_time": 0,
            "fx_delay_amt": 0,
            "fx_pan_freq": 0,
            "fx_pan_amt": 0,
            "lfo_osc1_freq": 0,
            "lfo_fx_freq": 0,
            "lfo_freq": 0,
            "lfo_amt": 0,
            "lfo_waveform": 0,
            "p": [
                0,
                0,
                0,
                0,
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
    "songLen": 40
};
var songGen = new sonantx.MusicGenerator(jsonTheme);
var source:AudioBufferSourceNode;
export function playSound(){
if(source){
    source.loop = true;
    source.start()
    source.loopEnd = 36.00;
}else{
    songGen.createAudioBuffer(function(buffer) {
    source = audioCtx.createBufferSource();
    source.buffer = buffer;
    const gain = audioCtx.createGain()
    gain.gain.value = 0.5;
    gain.connect(audioCtx.destination)
    source.connect(gain);
    source.loop = true;
    source.start()
    source.loopEnd = 36.00;
});
}

}
