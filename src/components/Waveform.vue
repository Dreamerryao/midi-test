 <template>
  <div>
    <el-row id="datasource">
      <el-col :span="24">
        <el-card
          class="box-card"
          style="text-align: left"
          :body-style="{ padding: '5px 20px' }"
        >
          <div
            slot="header"
            class="clearfix title"
            style="display: flex; align-items: center"
          >
            <!-- <span>正式任务</span> -->
            <el-tooltip
              class="item"
              effect="dark"
              content="音轨背景色"
              placement="bottom"
            >
              <el-color-picker
                v-model="wvBackgroundColor"
                show-alpha
                size="mini"
                @active-change="changeBackgroundColor"
              ></el-color-picker>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="未播放音轨颜色"
              placement="bottom"
            >
              <el-color-picker
                v-model="wvWaveColor"
                show-alpha
                size="mini"
                @active-change="changeWaveColor"
                style="margin-left: 15px"
              ></el-color-picker>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="已播放音轨颜色"
              placement="bottom"
            >
              <el-color-picker
                v-model="wvProgressColor"
                show-alpha
                size="mini"
                @active-change="changeProgressColor"
                style="margin-left: 15px"
              ></el-color-picker>
            </el-tooltip>
            <el-button
              type="primary"
              size="mini"
              @click="resetColor"
              style="margin-left: 30px"
              >重置</el-button
            >
            <!-- <el-button type="primary" size="mini" @click="test" style="margin-left: 30px;">seek</el-button> -->
            <span
              v-if="mode == 'STUDY_MODE' && taskIdShow"
              style="position: absolute; right: 20px"
              ><el-tag>任务Id {{ this.taskId }}</el-tag>
              <el-tag>itemId {{ this.itemId }}</el-tag>
              <el-tag
                >学习进度 {{ this.studyNumPass }} /
                {{ this.studyNumAll }}</el-tag
              >
            </span>
            <span
              v-if="taskIdShow && mode != 'STUDY_MODE' && mode != 'CHECK_MODE'"
              style="position: absolute; right: 20px"
              ><el-tag>任务uid:{{ this.uid }}</el-tag>
              <el-tag>taskId:{{ this.taskId }}</el-tag>
              <el-tag>{{ this.audioName }}</el-tag>
              <el-tag v-if="mode != 'LABEL_MODE '"
                >审核员:{{
                  checkUserName ? checkUserName : checkUserId
                }}</el-tag
              ></span
            >
            <span
              v-if="taskIdShow && mode == 'CHECK_MODE'"
              style="position: absolute; right: 20px"
              ><el-tag>任务uid:{{ this.uid }}</el-tag>
              <el-tag>taskId:{{ this.taskId }}</el-tag>
              <el-tag>{{ this.audioName }}</el-tag>
              <el-tag>标注员：{{ labelUserName }}</el-tag></span
            >
          </div>
          <div>
            <div id="waveform" ref="waveform">
              <!-- Here be the waveform -->
            </div>
            <div id="wave-timeline" ref="wave-timeline">
              <!-- 时间轴 -->
            </div>
          </div>
          <div class="ScrollArea" id="test">
            <div class="container" id="container">
              <!-- container -->
              <div class="piano">
                <piano />
              </div>
              <div class="roll">

                <roll
                  :track="showTrack"
                  :head="MidiHead"
                  :duration="duration"
                  :playing="playing"
                  :xAxis="value2 / 100 + 0.5"
                  v-if="update"
                />
              </div>
            </div>
          </div>
          <el-row>
            <el-switch
              v-model="value1"
              @change="changeMidi"
              active-text="YouveGotAFriend"
              inactive-text="IFeelTheEarthMove"
              style="margin: 10px 10px"
            >
            </el-switch>
            <el-button style="margin: 10px 10px" @click="handleChange">
              Playing:{{ playing }}
            </el-button>
            <el-select
              style="margin: 10px 10px"
              @change="onChange()"
              v-model="tmpvalue"
              placeholder="当前未选择"
            >
              <el-option
                v-for="item in tracks"
                :key="'track' + item.index"
                :label="
                  'Track:' + item.index + ' Instrument:' + item.instrument.name
                "
                :value="item.index"
              >
              </el-option>
            </el-select>
          </el-row>
          <el-slider
            v-model="value2"
            :step="10"
            :format-tooltip="formatTooltip"
            show-stops
          >
          </el-slider>
          <el-row style="margin-top: 20px">
            <el-button
              type="primary"
              size="small"
              @click="playMusic"
              style="margin-right: 10px"
            >
              <i class="el-icon-video-play"></i>
              播放 /
              <i class="el-icon-video-pausee"></i>
              暂停
            </el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="放大倍率"
              placement="bottom"
            >
              <el-input-number
                size="small"
                v-model="value"
                :precision="0"
                :step="20"
                :min="40"
                :max="1500"
                @change="changeZoom"
              />
            </el-tooltip>
            <el-button
              size="small"
              @click="changeLongHotKey"
              onfocus="this.blur()"
              style="margin-left: 10px"
              >一键放大</el-button
            >
            <el-button
              size="small"
              @click="changeShortHotKey"
              onfocus="this.blur()"
              >一键缩小</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="preview"
              onfocus="this.blur()"
              >预览</el-button
            >
            <!-- <el-button type="primary" size="small" @click="replay">重放</el-button> -->
            <el-tooltip
              class="item"
              effect="dark"
              content="预览时长"
              placement="bottom"
            >
              <el-popover
                placement="top"
                width="220"
                trigger="click"
                style="margin-left: 10px"
              >
                <el-input-number
                  v-model="previewTime"
                  width="180"
                  :precision="2"
                  :step="0.1"
                  :min="0.1"
                  :max="10"
                  @change="changeSpace"
                />
                <el-button slot="reference" size="small" round>
                  {{ previewTime + " s" }}
                </el-button>
              </el-popover>
            </el-tooltip>
            <el-button
              type="primary"
              size="small"
              @click="getTask"
              :disabled="getButtonAttr"
              onfocus="this.blur()"
              style="margin-left: 10px"
              >领取任务
            </el-button>

            <!-- <span v-if="!addButtonAttr" style="margin-left:20px;color:#aaa">下一句歌词：{{this.lyricsItems[this.labelData.length]}}</span> -->
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import WaveSurfer from "wavesurfer.js";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.js";
import Timeline from "wavesurfer.js/dist/plugin/wavesurfer.timeline.js";
import Regions from "wavesurfer.js/dist/plugin/wavesurfer.regions.js";
import piano from "./piano.vue";
import roll from "./roll.vue";
import { Midi } from "@tonejs/midi";
export default {
  //   name: "Table",
  //   mixins: [authorityCheck],
  components: {
    piano,
    roll,
  },
  props: {
    mode: {
      type: String,
      default: "LABEL_MODE", // "LABEL_MODE" // 标注权限  "CHECK_MODE" //  审核权限  "REVIEW_MODE" // 内部验收权限
    },
    taskId: {
      type: Number,
      //for debug
      default: 0,
    },
  },
  data() {
    return {
      tmpvalue: "",
      value2: 50,
      playing: false,
      tracks: [],
      showTrack: {},
      update: false,
      value1: true,
      MidiHead: {},
      duration:0,
      //以上是
      userToBeCheckedName: "",
      studyNumAll: 0,
      studyNumPass: 0,
      checkBtnAttr: true, // 审核通过和不通过按钮属性
      addButtonAttr: true, // 时间戳按钮属性
      // taskId: 205,
      checkUserId: "",
      checkUserName: "",
      audioName: "",
      getButtonAttr: false, // 获取任务按钮属性
      submitButtonAttr: true,
      abandonButtonAttr: true,
      labelDataOrigin: [],
      labelData: [], // 全部表格数据
      datetime: "", // 领取任务时间
      lyricsItems: [], // 歌词
      lyricsSaveItems: [], // 保存的数据
      tablePageLength: 6, // 表格每页显示数量
      currentPage: 1, // 当前显示页码
      uid: null, // 任务号
      itemId: null,
      wavesurfer: null,
      value: 400,
      appointTime: 1, // 指定播放功能的播放时间点
      rate: 1.0, // 播放倍速
      pixel: 20, //一秒内像素值
      getTaskTime: 0,
      submitTaskTime: "",
      taskIdShow: false,
      dialogVisible: false, // 弹出框显示与否
      errorDesOptions: [], // 错误原因描述选项
      errOptionObj: {},
      errorDes: null, // 错误原因描述
      fontSize: 14, // 标注字体大小
      fontSizeStyle: "fontSizeOne", // 默认样式
      previewTime: 0.5, // 预览时长
      trueResult: "",
      errThre: 0, // 每句允许时间误差
      errNumThre: 0, // 允许错误句数
      errData: [], // 错误标注结果数组
      errDataVisible: false,
      rePaintTable: true,
      flagArr: [], // 审核模式的标错控制锁数组
      errDescriptions: [], // 返回后端的err详情
      labelUserName: "",
      isModified: null, // 是否是返修题
      wvBackgroundColor: "rgba(48, 65, 86,1)",
      wvWaveColor: "rgba(192,196,204,1)",
      wvProgressColor: "rgba(190,237,199,1)",
      flashWaveColor: true,
      flashProgressColor: true,
      containerWidth: 0, // 容器宽度
      waveScrollLeft: 0,
      waveDuration: 0,
    };
  },
  computed: {
    containerTimeLength() {
      return this.containerWidth / this.value;
    },
    scrolledTime() {
      return this.waveScrollLeft / this.value;
    },
  },
  beforeMount() {
    this.readStorage();
  },
  mounted() {
    this.getMidi();
    const that = this;

    that.containerWidth = document.getElementById("waveform").offsetWidth;
    window.onresize = function () {
      that.containerWidth = document.getElementById("waveform").offsetWidth;
    };
    // 刷新页面也记录颜色配置：
    window.addEventListener("beforeunload", () => {
      this.writeStroage();
    });

    // 标注模式下，起始放大倍率低点，方便标注
    if (this.mode == "LABEL_MODE") {
      this.value = 100;
    }
    this.$nextTick(() => {
      this.wavesurfer = WaveSurfer.create({
        //容器
        container: this.$refs.waveform,
        autoCenter: false,
        partialRender: true,
        pixelRatio: 1,
        // 背景颜色
        backgroundColor: this.wvBackgroundColor,
        // 播放光标颜色
        cursorColor: "white",
        //未播放的波形填充颜色
        waveColor: this.wvWaveColor,
        //播放后的波形填充颜色
        progressColor: this.wvProgressColor,
        //基于的底层API，看浏览器支持情况
        backend: "MediaElement",
        //与backend配合使用
        mediaControls: false,
        // 播放音频的速度
        audioRate: "1",
        //给容器添加滚动条，否则将以固定宽度压缩在容器内部
        scrollParent: true,
        //填充满整个容器，否则采用一秒多少像素的方式呈现
        fillParent: false,
        //是否隐藏横向滚动条
        hideScrollbar: false,
        // minPxPerSec: this.value,
        //窗口响应式变化
        responsive: true,
        plugins: [
          // 光标插件
          CursorPlugin.create({
            showTime: true,
            color: "white",
            opacity: 1,
            customStyle: {
              width: "21px",
              top: "60px",
              //   bottom: "60px",
              bottom: "100px",
              "margin-left": "80px",
            },
            customShowTimeStyle: {
              "background-color": "#000",
              color: "#fff",
              padding: "2px",
              // 'width': '22px',
              "font-size": "10px",
              marginTop: "45px",
            },
          }),
          //使用时间轴插件
          Timeline.create({
            container: "#wave-timeline",
            // deferInit: true
          }),
          // regions插件
          Regions.create({
            regions: [],
            //wavesurfer对象最多能够有一个region
            maxRegions: 1,
            slop: 5,
          }),
        ],
      });
      this.wavesurfer.on("play", () => {
        this.waveDuration = this.wavesurfer.getDuration();
      });
      // 监听播放事件
      // this.wavesurfer.on('scroll',(e)=>{
      //   this.waveScrollLeft = e.target.scrollLeft;
      // })
      this.wavesurfer.on("audioprocess", (currentTime) => {
        // console.log(currentTime)
        this.waveScrollLeft = this.wavesurfer.drawer.wrapper.scrollLeft;
        if (
          this.scrolledTime + this.containerTimeLength < currentTime &&
          currentTime <= this.waveDuration - this.containerTimeLength
        ) {
          this.wavesurfer.drawer.wrapper.scrollLeft =
            this.waveScrollLeft + this.containerWidth;
        } else if (currentTime < this.scrolledTime) {
          this.wavesurfer.drawer.wrapper.scrollLeft = currentTime * this.value;
        } else if (currentTime > this.waveDuration - this.containerTimeLength) {
          this.wavesurfer.drawer.wrapper.scrollLeft =
            (this.waveDuration - this.containerTimeLength) * this.value;
        }
      });
      //绑定键盘事件
      var _this = this;
      document.fastKey = function () {
        var key = window.event.keyCode;
        if (key == 37) {
          _this.backward();
        } else if (key == 39) {
          _this.forward();
        } else if (key == 32) {
          _this.playMusic();
        } else if (key == 27) {
          _this.clearRegs();
        } else if (key == 13) {
          _this.playSelect();
        } else if (key == 65) {
          _this.pageUp();
        } else if (key == 68) {
          _this.pageDown();
        }
      };
      document.addEventListener("keydown", document.fastKey);
      //允许drag选择音频片段
      this.wavesurfer.enableDragSelection({
        id: 1,
        color: "rgba(55,188,201,0.5)",
        handleStyle: {
          // 默认样式：
          // cursor: 'col-resize',
          // position: 'absolute',
          // top: '0px',
          // width: '1%',
          // maxWidth: '4px',
          // height: '100%',
          // backgroundColor: 'rgba(0, 0, 0, 1)'
          left: {
            backgroundColor: "rgba(255,255,255,1)",
          },
          right: {
            backgroundColor: "rgba(255,255,255,1)",
          },
        },
      });
      this.wavesurfer.on("ready", () => {
        this.wavesurfer.zoom(this.value);
      });
    });
  },
  beforeDestroy() {
    document.removeEventListener("keydown", document.fastKey); // 组件销毁前移除绑定事件
    this.instance && this.instance.close();
    // 退出页面前保存颜色配置
    this.writeStroage();
  },

  //   created() {
  //     this.getMidi();
  //   },
  methods: {
    formatTooltip(val) {
      return val / 100 + 0.5;
    },
    handleChange() {
      this.playing = !this.playing;
    },
    onChange() {
      console.log(this.tmpvalue);
      for (let track of this.tracks) {
        track.index === this.tmpvalue && (this.showTrack = track);
      }
      // this.showTrack = this.tracks[parseInt(this.tmpvalue)];
      console.log(this.showTrack);
    },
    changeMidi() {
      this.tracks = [];
      // this.value1 = !this.value1;
      this.getMidi();
    },
    getMidi() {
      // console.log("!!!!!");
      // console.log(process.env.BASE_URL);
      Midi.fromUrl(
        this.value1
          ? `${process.env.BASE_URL}audio/YouveGotAFriend.mid`
          : `${process.env.BASE_URL}audio/IFeelTheEarthMove.mid`
      ).then((midi) => {
        this.duration = midi.duration;
        this.MidiHead = midi.header;
        console.log(midi);
        midi.tracks.forEach((track, index) => {
          if (track.notes.length !== 0) {
            let tmpTrack = track;
            tmpTrack.index = index;
            this.tracks.push(tmpTrack);
          }
        });
        if (this.tracks.length !== 0) {
          this.value = this.tracks[0].index;
          this.showTrack = this.tracks[0];
        }
        console.log(this.tracks);
        console.log(this.showTrack);

        this.update = true;
      });
    },
    abandonEventDone() {
      this.getButtonAttr = false;
      this.submitButtonAttr = true;
    },
    // 读取localStorage
    readStorage() {
      if (!window.localStorage) {
        this.$message({
          message: "您的浏览器不支持缓存，建议使用最新Chrome浏览器！",
          type: "warning",
        });
      } else {
        let storage = window.localStorage;
        this.wvBackgroundColor = storage.getItem("backgroundColor")
          ? storage.getItem("backgroundColor")
          : "rgba(48, 65, 86,1)";
        this.wvWaveColor = storage.getItem("waveColor")
          ? storage.getItem("waveColor")
          : "rgba(192,196,204,1)";
        this.wvProgressColor = storage.getItem("progressColor")
          ? storage.getItem("progressColor")
          : "rgba(190,237,199,1)";
      }
    },
    // 写入localStorage
    writeStroage() {
      if (!window.localStorage) {
        this.$message({
          message: "您的浏览器不支持缓存，建议使用最新Chrome浏览器！",
          type: "warning",
        });
      } else {
        let storage = window.localStorage;
        storage.setItem("backgroundColor", this.wvBackgroundColor);
        storage.setItem("waveColor", this.wvWaveColor);
        storage.setItem("progressColor", this.wvProgressColor);
      }
    },
    changeBackgroundColor(val) {
      this.wvBackgroundColor = val;
      this.wavesurfer.setBackgroundColor(this.wvBackgroundColor);
    },
    changeWaveColor(val) {
      this.wvWaveColor = val;
      this.wavesurfer.setWaveColor(this.wvWaveColor);
      this.flashWaveColor = !this.flashWaveColor;
      // 强制刷新
      if (this.flashWaveColor) {
        this.wavesurfer.zoom(this.value + 1);
      } else {
        this.wavesurfer.zoom(this.value - 1);
      }
    },
    changeProgressColor(val) {
      this.wvProgressColor = val;
      // console.log(this.wvProgressColor)
      this.wavesurfer.setProgressColor(this.wvProgressColor);
      // 强制刷新
      this.flashProgressColor = !this.flashProgressColor;
      if (this.flashProgressColor) {
        this.wavesurfer.zoom(this.value + 0.5);
      } else {
        this.wavesurfer.zoom(this.value - 0.5);
      }
    },
    resetColor() {
      this.changeBackgroundColor("rgba(48, 65, 86,1)");
      this.changeWaveColor("rgba(192,196,204,1)");
      this.changeProgressColor("rgba(190,237,199,1)");
    },
    playMusic() {
      // "播放/暂停"按钮的单击触发事件，暂停的话单击则播放，正在播放的话单击则暂停播放
      this.wavesurfer.playPause.bind(this.wavesurfer)();
    },
    changeZoom() {
      this.wavesurfer.zoom(this.value);
    },
    changeLong() {
      this.value = this.value + this.pixel;
      this.wavesurfer.zoom(this.value);
    },
    changeLongHotKey() {
      this.value = 400;
      this.wavesurfer.zoom(this.value);
    },
    changeShort() {
      if (this.value <= 40) {
        this.$message({
          message: "无法再缩小了!",
          type: "warning",
        });
        return;
      }
      this.value = this.value - this.pixel;
      this.wavesurfer.zoom(this.value);
    },
    changeShortHotKey() {
      this.value = 40;
      this.wavesurfer.zoom(this.value);
    },
    forward() {
      this.wavesurfer.skip(0.5);
    },
    backward() {
      this.wavesurfer.skip(-0.5);
    },
    clearRegs() {
      this.wavesurfer.clearRegions();
    },
    changeSpace() {
      this.wavesurfer.setPlaybackRate(this.rate);
    },
    // 播放选中选取
    playSelect() {
      if (Object.keys(this.wavesurfer.regions.list).length == 0) {
        this.$message({
          message: "请先选择一段音频",
          type: "warning",
        });
      } else {
        let start = 0;
        let end = 0;
        for (let key in this.wavesurfer.regions.list) {
          start = this.wavesurfer.regions.list[key].start.toFixed(2);
          end = this.wavesurfer.regions.list[key].end.toFixed(2);
        }
        this.wavesurfer.play(start, end);
      }
    },
    // 添加选中的region
    addSelect(row) {
      if (Object.keys(this.wavesurfer.regions.list).length == 0) {
        this.$message({
          message: "请先选择一段音频",
          type: "warning",
        });
      } else {
        let start = 0;
        let end = 0;
        for (let key in this.wavesurfer.regions.list) {
          start = this.wavesurfer.regions.list[key].start.toFixed(2);
          end = this.wavesurfer.regions.list[key].end.toFixed(2);
        }
        row.labelTimeStart = start;
        row.labelTimeEnd = end;
        // this.wavesurfer.clearRegions(); // 点击添加后清空regions
      }
    },
    preview() {
      // let preTime = this.previewTime;
      let timeNow = this.wavesurfer.getCurrentTime();
      this.wavesurfer.play(timeNow, timeNow + this.previewTime);
      // 预览结束返回开始播放位置
      let time = (1 / this.rate) * this.previewTime * 1000;
      setTimeout(() => {
        this.wavesurfer.play(timeNow, timeNow);
      }, time);
    },
    getTask() {
      // 修改模式默认有权限
      //   if(this.mode != 'CHANGE_MODE'){
      //     if (!this.authority) {
      //       this.checkAuthority()
      //       return ;
      //     }
      //   }
      this.currentPage = 1; // 领取任务前切换页面为1
      this.labelData = []; // 领取任务前先清空表格
      const aData = new Date();
      this.getTaskTime = Date.now(); // 获取领取任务时的时间点
      this.datetime =
        aData.getFullYear() +
        "-" +
        (aData.getMonth() + 1) +
        "-" +
        aData.getDate();
      this.wavesurfer.load("/audio/2.mp3");
      this.itemId = null;
      this.audioName = "/audio/2.mp3".split("/").slice(-1)[0];
      this.uid = 113889;
      if (this.mode == "LABEL_MODE") {
        this.lyricsSaveItems = [];
      }
      this.taskIdShow = true;
      this.getButtonAttr = true;
      this.submitButtonAttr = false;
      this.checkBtnAttr = false;
      this.abandonButtonAttr = false;
      this.clearRegs();
    },
  },
};
</script>
<style scoped>
.ScrollArea {
  margin: 10px auto;
  /* width: 1800px; */
  width: 100%;
  height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.container {
  /* background-color: antiquewhite; */
  display: flex;

  /* width: calc(100% - 80px); */
  height: 1500px;
  margin: auto auto;
}
.page {
  width: 100%;
  height: 100%;
}
.piano {
  /* background-color:azure; */
  width: 80px;
  height: 100%;
}
.roll {
  /* background-color: aquamarine; */
  width: calc(100% - 80px); 
  height: 100%;
}
#waveform {
  margin-left: 80px;
}
#wave-timeline {
  margin-left: 80px;
}
#datasource {
  margin: 10px;
}
#datalabel {
  margin: 10px;
}
#lyrics {
  margin: 20px;
}
.el-tag {
  cursor: pointer;
}
li {
  margin: 2px 0px;
}
.el-input--mini {
  font-size: 14px;
}
.fontSizeOne {
  font-size: 14 px;
}
.fontSizeTwo {
  font-size: 16px;
}
.fontSizeThree {
  font-size: 18px;
}
.fontSizeFour {
  font-size: 20px;
}
</style>
