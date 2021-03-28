// 其他 AudioContext API 移步 https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext
// @ts-ignore;
import {MusicConfig} from "src/music/MusicConfig";
// @ts-ignore;
import {biquadFilterFrequency} from "@/components/canvasConfig";
import {DomUtil} from "@/tools/DomUtil";




interface IMusicVisualizerConifg {
  musicConfig: MusicConfig;
  size: number;
  draw?: Function;
  volume?: number;
}

function createPanner(){
  console.log(MusicVisualizer.ac.createPanner)
  const panner = MusicVisualizer.ac.createPanner();
  panner.panningModel = 'HRTF';
  panner.distanceModel = 'inverse';
  panner.refDistance = 1;
  panner.maxDistance = 10;
  panner.rolloffFactor = 10;
  panner.coneInnerAngle = 360;
  panner.coneOuterAngle = 0;
  panner.coneOuterGain = 0;


  if (panner.orientationX) {
    panner.orientationX.value = 0;
    panner.orientationY.value = 0;
    panner.orientationZ.value = 0;

    panner.positionX.value = 0;
    panner.positionY.value = 0;
    panner.positionZ.value = 0;
  } else {
    panner.setOrientation && panner.setOrientation(0,0,0);
    panner.setPosition && panner.setPosition(0,0,0)
  }

  return panner;
}

function initListener (){
  const listener = MusicVisualizer.ac.listener;

  if (listener.forwardX) {

    listener.forwardX.value = 0;
    listener.forwardY.value = 1;
    listener.forwardZ.value = 0;

    listener.upX.value = 0;
    listener.upY.value = 0;
    listener.upZ.value = 1;


    listener.positionX.value = 0;
    listener.positionY.value = 0;
    listener.positionZ.value = 0;
  } else {

    listener.setOrientation && listener.setOrientation(0, 1, 0, 0, 0, 1);
    listener.setPosition && listener.setPosition(0, 0, 0)
  }
  return listener;
}


function createBiquadFilters(input: AudioNode, output: AudioNode) {
  // @ts-ignore;
  const biquadFilters =  biquadFilterFrequency.map(frequency => createBiquadFilter(frequency));
  // @ts-ignore;
  biquadFilters.forEach(biquadFilter => {
    input.connect(biquadFilter);
    input = biquadFilter;
  });
  input.connect(output);
  return biquadFilters;
}

function createBiquadFilter(frequency: number) {
  const biquadFilter = MusicVisualizer.ac.createBiquadFilter();
  biquadFilter.type = 'peaking';
  biquadFilter.frequency.value = frequency;
  return biquadFilter;
}

function createAudioSource(context: MusicVisualizer) {
  const $audio = context.$audio = document.createElement('audio');
  const source = MusicVisualizer.ac.createMediaElementSource($audio);
  $audio.crossOrigin = "anonymous";
  $audio.autoplay = true;
  $audio.volume = context.musicConfig.volume.main;

  $audio.onended = () => context.musicConfig.ended && context.musicConfig.ended();
  return {$audio, source}
}


export class MusicVisualizer {
  duration: number = 1;
  playing: boolean = false;
  stopType: string = '';
  source?: any = null;
  latestPlayTime: number = 0;
  count: number = 0;
  delay: DelayNode;
  musicConfig: MusicConfig;
  gain: GainNode;
  // merger: ChannelMergerNode;
  // splitter: ChannelSplitterNode;
  // gainNodes: { main: GainNode, left: GainNode, right: GainNode };
  size: number;
  analyser: AnalyserNode;
  analyserBefore: AnalyserNode;

  biquadFilters: BiquadFilterNode[];
  draw?: Function;
  resetLatestPlayTime: boolean = false;
  xhr: XMLHttpRequest;
  panner: PannerNode;
  $audio: HTMLMediaElement;
  // 音频上下文
  ac: AudioContext;
  // @ts-ignore;
  static ac: AudioContext = new (window.AudioContext || window.webkitAudioContext)();//共用的
  constructor(obj: IMusicVisualizerConifg) {

    this.ac = MusicVisualizer.ac;
    this.musicConfig = obj.musicConfig;

    const {$audio, source} = createAudioSource(this);
    this.$audio = $audio;
    $audio.volume = 0.01;
    const panner = this.panner = createPanner();
    initListener();

    const analyser = this.analyser = MusicVisualizer.ac.createAnalyser();
    const analyserBefore = this.analyserBefore = MusicVisualizer.ac.createAnalyser();
    const gain = this.gain = MusicVisualizer.ac.createGain();
    gain.gain.value = 0.5;


    this.size = obj.size || 8;
    analyserBefore.fftSize = analyser.fftSize = this.size * 2;


    const delay = this.delay = MusicVisualizer.ac.createDelay();
    delay.delayTime.value = 1.8;
    // navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(res=> {
    //   const node = MusicVisualizer.ac.createMediaStreamSource(res);
    //   $audio.autoplay = false;
    //   node.connect(analyserBefore);
    // });


    source.connect(analyserBefore);
    // 音源 -> 滤波器
    // @ts-ignore;
    this.biquadFilters = createBiquadFilters(analyserBefore, delay);

    delay.connect(analyser);
    analyser.connect(panner); // 最终听到的
    panner.connect(gain);
    gain.connect(MusicVisualizer.ac.destination);


    // ajax
    this.xhr = new XMLHttpRequest();
    this.draw = obj.draw;

    obj.volume && this.changeVolume(obj.volume);
    this.visualize();
  }

  load(url: string, fun: Function) {
    this.stopType = '';
    this.playing = false;
    this.xhr.abort();
    this.xhr.open("GET", url);
    this.xhr.responseType = "arraybuffer";
    this.xhr.onload = () => {
      fun(this.xhr.response);
    };
    this.xhr.send();
  };


// BaseAudioContext.decodeAudioData()用来生成AudioBuffer
// AudioBuffer供AudioBufferSourceNode使用，这样，AudioBufferSourceNode才可以播放音频数据
  decode(arrayBuffer: ArrayBuffer, fun: Function) {
    MusicVisualizer.ac.decodeAudioData(arrayBuffer, function (buffer: any) {
      fun(buffer);
    }, function (err: Error) {
      console.log(err);
    });
  };

  play(path: ArrayBuffer | string) {
    const n = ++this.count;
    this.source && this.source[this.source.stop ? "stop" : "noteOff"](); // 开始前先暂停之前音频的播放，防止多份音频同时播放
    this.resetLatestPlayTime = true;

    if (path instanceof ArrayBuffer) {
      this.decode(path, (buffer: ArrayBuffer) => {
        if (n !== this.count) return;
        const bufferSource: AudioBufferSourceNode = MusicVisualizer.ac.createBufferSource();
        // 将解码成功后的buffer赋值给bufferSource的buffer属性
        // @ts-ignore;
        bufferSource.buffer = buffer;
        // bufferSource.loop = true;
        bufferSource.connect(this.analyserBefore);
        // @ts-ignore;
        bufferSource[bufferSource.start ? "start" : "noteOn"](0);
        this.source = bufferSource;
        this.resetLatestPlayTime && (this.latestPlayTime = MusicVisualizer.ac.currentTime);
      });
    } else {

      console.log('play')
      // @ts-ignore;
      if (window.isPhone) {
        console.log('play')
        this.load(path, (arrayBuffer: ArrayBuffer) => {
          if (n !== this.count) return;
          this.decode(arrayBuffer, (buffer: ArrayBuffer) => {
            this.playing = true;
            if (n !== this.count) return;
            const bufferSource: AudioBufferSourceNode = MusicVisualizer.ac.createBufferSource();
            // @ts-ignore;
            bufferSource.buffer = buffer;
            bufferSource.connect(this.analyserBefore);
            // @ts-ignore;
            bufferSource[bufferSource.start ? "start" : "noteOn"](0);
            this.source = bufferSource;
            bufferSource.onended = () => {
              if (this.stopType) {
              } else {
                this.musicConfig.ended && this.musicConfig.ended();
              }
            };
            this.resetLatestPlayTime && (this.latestPlayTime = MusicVisualizer.ac.currentTime);
          });
        });
      } else {
        this.$audio.src = path;
      }


    }
  };

  // 主音量控制方法
  changeVolume(percent: number) {
    // @ts-ignore;
    this.musicConfig.volume.main = percent;
  };

  // 左右声道控制方法
  setVolume() {
    const {musicConfig} = this;
    const {main,} = musicConfig.volume;

    this.$audio.volume = main;
    const {panner} = this;

    const {x, y, w, h} = musicConfig.mouseMoveConf;

    const _x = (x-w/2)/w;
    const _y = -(y-h/2)/h;

    if (panner.positionX) {
      panner.positionX.value = _x;
      panner.positionY.value = _y;
    } else {
      panner.setPosition && panner.setPosition(_x,_y,0)
    }
  };

  visualize() {
    const realTimeData = new Uint8Array(this.analyser.frequencyBinCount);//数组长度是fftsize的一半
    const originData = new Uint8Array(this.analyserBefore.frequencyBinCount);//数组长度是fftsize的一半

    const requestAnimationFrame = window.requestAnimationFrame ||
      // @ts-ignore;
      window.webkitrequestAnimationFrame ||
      // @ts-ignore;
      window.mozrequestAnimationFrame;//兼容
    const fn = () => {
      // @ts-ignore;
      if (!window.hidden) {
        if (this.draw) {
          this.analyser.getByteFrequencyData(realTimeData);// 将音频频域数据复制到传入的Uint8Array数组
          this.analyserBefore.getByteFrequencyData(originData);// 将音频频域数据复制到传入的Uint8Array数组
          this.draw({realTimeData, originData});
        }
        this.setVolume();
      }
      requestAnimationFrame(fn);
    }
    requestAnimationFrame(fn);
  }
}


// 解决 Chrome 66之后高版本中AudioContext被强行suspend的问题
// @ts-ignore;
if (typeof AudioContext !== "undefined" || typeof webkitAudioContext !== "undefined") {
  const resumeAudio = function () {
    if (!MusicVisualizer.ac) return;
    MusicVisualizer.ac.state === "suspended" && MusicVisualizer.ac.resume();
    document.removeEventListener("click", resumeAudio);
  };
  document.addEventListener("click", resumeAudio);
}

