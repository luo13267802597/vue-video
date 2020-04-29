<template>
  <div>
    <div class="main-player" >
      <div class="play-wrap" ref="myplay">
        <div class="play-container">
          <div class="film">
            <video
              ref="v"
              width="100%"
              height="100%"
              @canplay="getTotalTime"
              @timeupdate="timeUpdate"
              @ended="ended"
            >
              <source :src="videoSrc" />
            </video>
          </div>
          <div class="content">
            <div class="region">
              <div class="zt">
                <div class="play iconfont icon-bofang1" v-if="isPaused" @click="play"></div>
              </div>
              <div class="controls">
                <div class="slieder" @click="sliederJump" ref="slieder">
                  <div class="buffer" ref="buffer" :class="[isHidden?'visible':'']">{{currentTime}}</div>
                  <div class="processor">
                    <div class="elapse" ref="elapse"></div>
                  </div>
                  <div class="controller" ref="controller" @mousedown="Drag" @touchstart="touch" >
                    <div class="box" :class="[isHidden?'hidden':'']"></div>
                  </div>
                </div>
                <div class="function">
                  <div class="controls-left">
                    <div class="start" @click="play">
                      <span class="middle iconfont icon-bofang" v-if="isPaused"></span>
                      <span class="middle iconfont icon-zantingtingzhi1" v-else></span>
                    </div>
                    <div class="time">
                      <span class="curtime">{{currentTime}}</span>
                      <span>/</span>
                      <span class="duration">{{duration}}</span>
                    </div>
                  </div>
                  <div class="controls-right">
                    <div class="volume">
                      <div class="volumebig" @click="toggleMuted">
                        <span class="middle iconfont icon-yinliang" v-if="isvolume"></span>
                        <span class="middle iconfont icon-jingyin" v-else></span>
                      </div>
                      <div class="vo-slieder" @click="vosliederJump" ref="voSlieder">
                        <div class="vo-processor" ref="voProcessor">
                          <div class="vo-controller" ref="voController" @mousedown="voDrag" @touchstart="voTouch"></div>
                          <div class="vo-elapse" ref="voElapse"></div>
                        </div>
                      </div>
                    </div>
                    <div class="speed">
                      <span class="title">倍速</span>
                      <div class="options">
                        <div
                          class="choose statpid"
                          :class="{active:index==current}"
                          v-for="(lable, index) in lable"
                          :key="index"
                          @click="chooseSelect(index,$event)"
                          ref="choose"
                        >{{lable.lable}}</div>
                      </div>
                    </div>
                    <div class="full middle iconfont icon-quanping" @click=" toggleFullScreen"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      video: null,
      isPaused: true,
      videoSrc:'',
      currentTime: "00:00:00",
      duration: "00:00:00",
      isHidden: false,
      isvolume: true,
      isActive: true,
      isInFullScreen: true,
      current: 0,
      lable: [{ lable: 1.0 }, { lable: 1.25 }, { lable: 1.5 }, { lable: 2.0 }]
    };
  },
  mounted() {
    this.video = this.$refs.v;
    this.myplay = this.$refs.myplay;
    this.elapse = this.$refs.elapse;
    this.controller = this.$refs.controller;
    this.buffer = this.$refs.buffer;
    this.slieder = this.$refs.slieder;
    this.voController = this.$refs.voController;
    this.voElapse = this.$refs.voElapse;
    this.voProcessor = this.$refs.voProcessor;
    this.voSlieder = this.$refs.voSlieder;
    this.choose = this.$refs.choose;
  },
  methods: {
    play() {// 播放暂停
      if (this.video.paused) {
        this.isPaused = false;
        this.video.play();
      } else {
        this.isPaused = true;
        this.video.pause();
      }
    },
    getResult(time) {//时间格式化
      var hour = Math.floor(time / 3600);
      hour = hour < 10 ? "0" + hour : hour;
      var minute = Math.floor((time % 3600) / 60);
      minute = minute < 10 ? "0" + minute : minute;
      var second = Math.floor(time % 60);
      second = second < 10 ? "0" + second : second;
      // 返回结果
      var Timer = hour + ":" + minute + ":" + second;
      return Timer;
    },
    getTotalTime() {//获取当前时间和总时间
      this.currentTime = this.getResult(this.video.currentTime);
      this.duration = this.getResult(this.video.duration);
    },
    timeUpdate() {//设置当前播放进度条样式
      this.currentTime = this.getResult(this.video.currentTime);
      var X = this.video.currentTime /this.video.duration;
      this.elapse.style.transform = "scaleX(" + X + ")";
      var Left =  X*(this.slieder.offsetWidth-this.controller.offsetWidth/2)   
      this.controller.style.left = Left +'px';
      this.buffer.style.left = Left+'px';
    },
    toggleFullScreen(event) {//实现全屏切换
      if (
        (document.fullScreenElement !== undefined &&document.fullScreenElement === null) ||
        (document.msFullscreenElement !== undefined &&document.msFullscreenElement === null) ||
        (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
        (document.webkitIsFullScreen !== undefined &&
          !document.webkitIsFullScreen)
      ) {
        this.isInFullScreen = false
        if (this.myplay.requestFullScreen) {
          this.myplay.requestFullScreen();
        } else if (this.myplay.mozRequestFullScreen) {
          this.myplay.mozRequestFullScreen();
        } else if (this.myplay.webkitRequestFullScreen) {
          this.myplay.webkitRequestFullScreen();
        } else if (dthis.myplay.msRequestFullscreen) {
          this.myplay.msRequestFullscreen();
        }
      } else {
        this.isInFullScreen = true
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    },
    sliederJump(e) {//点击跳转进度条
      var width = this.slieder.offsetWidth;
      var clientX = e.clientX;
      var parcent = clientX / width;
      var currentTime = parcent * this.video.duration;
      this.video.currentTime = currentTime;
    },
    Drag(e) {//进度条拖拽
      e = e || window.event;
      document.onmousemove = (e)=>{
        this.isHidden = true;
        e = e || window.event;
        var pointX = e.clientX;
        if (pointX >this.slieder.offsetWidth) {
          pointX = this.slieder.offsetWidth;
        }
        if (pointX < 0) {
          pointX = 0;
        }        
        var parcent = pointX/ (this.slieder.offsetWidth);
        var currentTime = parcent * this.video.duration;
        this.video.currentTime = currentTime
        currentTime = this.getResult(currentTime);
        this.elapse.style.transform = "scaleX(" + parcent + ")";
        var Left = pointX -this.controller.offsetWidth
        this.controller.style.left = Left+'px';    
        this.buffer.style.left = Left+'px';
      }     
      document.onmouseup = (e) => {
        this.isHidden = false;
        document.onmousemove = null;
      }
    },
    touch(e) {//移动端进度条拖拽
      this.isHidden = true;
      this.controller.addEventListener("touchmove", (e) => {
        e = e || window.event;
        var moveX = e.touches[0].clientX;
        if (moveX > this.slieder.offsetWidth) {
           moveX = this.slieder.offsetWidth;
        }
        if (moveX < 0) {
          moveX = 0;
        }
        var parcent = moveX/ this.slieder.offsetWidth;
        var currentTime = parcent * this.video.duration;
        this.video.currentTime = currentTime
        currentTime = this.getResult(currentTime);
        this.elapse.style.transform = "scaleX(" + parcent + ")";
        var Left = moveX -this.controller.offsetWidth
        this.controller.style.left = Left +'px';
        this.buffer.style.left = Left+ 'px';
        this.controller.addEventListener("touchend", e => {
          this.isHidden = false;
        });
      });
    },
    toggleMuted() {//音量静音切换
      if (this.isvolume) {
        this.isvolume = false;
        this.video.volume = 0;
        this.voElapse.style.width = 0;
        this.voController.style.left = 0;
      } else {
        this.isvolume = true;
        this.video.volume = 0.5;
        var width =
          this.video.volume *
          (this.voProcessor.offsetWidth - this.voController.offsetWidth);
        this.voElapse.style.width = width + "px";
        this.voController.style.left = width + "px";
      }
    },
    vosliederJump(e) {//点击跳转音量条
      var domToLeft = this.voSlieder.getBoundingClientRect().left;
      var disX = e.clientX;
      var parcent = disX - domToLeft;
      if (parcent > this.voProcessor.offsetWidth - this.voController.offsetWidth) {
        parcent = this.voProcessor.offsetWidth - this.voController.offsetWidth;
      }
      if (parcent < 4) {
        parcent = 0;
      }
      this.voController.style.left = parcent + "px";
      this.voElapse.style.width = parcent + "px";
      var vo =parcent /(this.voProcessor.offsetWidth - this.voController.offsetWidth);
      this.video.volume = vo;
      if (this.video.volume > 0) {
        this.isvolume = true;
      } else {
        this.isvolume = false;
      }
    },
    voDrag(e){//音量条拖拽
        e = e || window.event;
       var startX = e.clientX;
       var voControllerLeft = this.voController.offsetLeft
       document.onmousemove=(e)=>{
         e = e || window.event;
        var moveX  = e.clientX
        var disX = moveX - startX + voControllerLeft
        if(disX < 0){
          disX = 0
        }
        if(disX >= this.voSlieder.offsetWidth -this.voController.offsetWidth){
          disX = this.voSlieder.offsetWidth -this.voController.offsetWidth
        }
        console.log(disX );
        if(disX == 0){
          this.isvolume = false;
        }else{
          this.isvolume = true;
        }
        var scale = disX / (this.voSlieder.offsetWidth -this.voController.offsetWidth)
        this.video.volume = scale
        this.voElapse.style.width = disX+'px'
        this.voController.style.left =disX+'px'
       },
       document.onmouseup=(e)=>{
           document.onmousemove = null;
       }
    },
    voTouch(e){
      e = e || window.event;
      console.log(this.voSlieder.offsetWidth);
      var startX = e.touches[0].clientX;
      var voControllerLeft = this.voController.offsetLeft
      this.voController.addEventListener('touchmove', (e) =>{
        var moveX = e.touches[0].clientX
        var disX = moveX - startX + voControllerLeft
         if(disX < 0){
          disX = 0
        }
        if(disX >= this.voSlieder.offsetWidth -this.voController.offsetWidth){
          disX = this.voSlieder.offsetWidth -this.voController.offsetWidth
        }
        if(disX == 0){
          this.isvolume = false;
        }else{
          this.isvolume = true;
        }
        var scale = disX / (this.voSlieder.offsetWidth -this.voController.offsetWidth);
        this.video.volume = scale
        this.voElapse.style.width = disX+'px'
        this.voController.style.left =disX+'px'
      })
    },
    chooseSelect(index, $event) {//倍速播放
      this.current = index;
      var lable = event.currentTarget.innerHTML;
      this.video.playbackRate = lable;
    },
    ended(){
      this.isPaused = true;
    }
  }
};
</script>

<style lang="" scoped>
.main-player {
  position: relative;
  padding-top: 50%;
}
.main-player .play-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.play-wrap .play-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  box-sizing: border-box;
}
.play-container .film {
  width: 100%;
  height: calc(100% - 57px);
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}
.play-container .content {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 200px;
  width: 100%;
  height: 100%;
}
.play-container .content:hover .controls {
  -webkit-transform: translateY(0);
  transform: translateY(0);
}
.show {
  -webkit-transform: translateY(0);
  transform: translateY(0);
}
.content .region {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
  color: #666;
  overflow: hidden;
}

.region .zt {
  width: 100%;
  height: calc(100% - 57px);
  background-color: rgba(255, 0, 0, 0);
}
.zt .play {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 80px;
  color: #fff;
}
.zt .play:hover {
  color: #ff9600;
}
.region .controls {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 44px;
  background: rgba(34, 34, 34, 0.8);
  box-sizing: border-box;
  border-bottom: 1px solid #efefef;
  font-size: 12px;
  -webkit-transform: translateY(44px);
  transform: translateY(44px);
  transition: -webkit-transform 0.2s;
  transition: transform 0.2s;
}

.controls .slieder {
  cursor: pointer;
  position: absolute;
  top: -4px;
  height: 4px;
  width: 100%;
  background: rgba(255, 255, 255, 0.7);
}
.controls .buffer {
  visibility: hidden;
  min-width: 40px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  background-color: #b3b3b3;
  border-radius: 2px;
  color: #555;
  font-size: 12px;
  position: absolute;
  top: -27px;
  left: -10px;
}
.visible {
  visibility: visible !important;
}
.controls .slieder:hover .box {
  transform: scale(1);
  -webkit-transform: scale(1);
}
.controls .slieder:hover .buffer {
  visibility: visible;
}
.slieder .processor {
  background: rgba(255, 255, 255, 0.7);
  height: 100%;
  position: relative;
}
.processor .elapse {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #ff9600;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  transform: scaleX(0.0068);
  z-index: 3;
}
.slieder .controller {
  display: block;
  top: -3px;
  position: absolute;
  left: 0px;
  z-index: 10000;
}
.controller .box {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  border: 1px solid #cfcfcf;
  transition: transform 0.1s, -webkit-transform 0.1s;
  -webkit-transform: scale(0);
  transform: scale(0);
  background-color: #fff;
}
.hidden {
  transform: scale(1) !important;
  -webkit-transform: scale(1) !important;
}
.controls .function {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.function .controls-left {
  height: 100%;
  font-size: 0;
}
.controls-left .start {
  height: 100%;
  width: 30px;
  display: inline-block;
  line-height: 40px;
}
.time {
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
  line-height: 43px;
  font-size: 12px;
  color: #acadaa;
}
.controls-left .time .curtime {
  z-index: 0;
}
.controls-right {
  height: 100%;
  font-size: 0;
}
.controls-right .volume {
  position: relative;
  vertical-align: middle;
  font-size: 0;
  line-height: 43px;
  display: inline-block;
  margin-right: 4px;
}
.controls-right .volume .volumebig {
  width: 30px;
  height: 100%;
  display: inline-block;
}
.vo-slieder {
  display: inline-block;
}
.vo-slieder .vo-processor {
  position: relative;
  width: 90px;
  height: 8px;
  overflow: hidden;
  cursor: pointer;
  display: inline-block;
  top: 4px;
  border-radius: 4px;
  background-color: #999;
}
.vo-slieder .vo-processor .vo-elapse {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #ff9600;
  z-index: 3;
}
.vo-processor .vo-controller {
  width: 8px;
  height: 8px;
  background: #fff;
  border: 1px solid #cfcfcf;
  box-sizing: border-box;
  border-radius: 50%;
  position: absolute;
  display: block;
  left: 82px;
  top: 0px;
  z-index: 5;
}
.controls-right .speed {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  height: 100%;
  white-space: nowrap;
  font-size: 12px;
  color: #ccc;
  line-height: 43px;
  margin-right: 4px;
}
.speed::after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 11px;
  top: -2px;
}
.speed .title {
  color: #c6c6c6;
  display: inline-block;
  width: 62px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  background: #555;
  border-radius: 12px;
}
.speed .options {
  position: absolute;
  width: 76px;
  background: #222;
  background: rgba(34, 34, 34, 0.95);
  border: 1px solid #222;
  border-radius: 3px;
  top: -131px;
  left: -8px;
  display: none;
}
.speed:hover .options {
  display: block;
}
.options .choose:first-child {
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.options .choose {
  width: 100%;
  height: 31px;
  line-height: 31px;
  text-align: center;
  border-bottom: 1px solid #222;
  color: gray;
  cursor: pointer;
}
.options .active {
  cursor: default;
}
.options .choose:last-child {
  border-bottom: 0;
}
.options .choose:hover,
.options .active {
  background: #222;
  background: rgba(34, 34, 34, 0.95);
  color: #ff9600;
}
.title {
  color: #c6c6c6;
  display: inline-block;
  width: 62px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  background: #555;
  border-radius: 12px;
}
.controls-right .full {
  width: 30px;
  height: 100%;
  display: inline-block;
  line-height: 43px;
}

.middle,
.middle:focus {
  vertical-align: middle;
  cursor: pointer;
}
.middle:hover {
  color: #ff9600;
}
</style>