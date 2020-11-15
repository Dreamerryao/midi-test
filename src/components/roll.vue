<template>
  <div id="root">
    <!-- <button @click="wow"></button>
    <button @click="reload()">刷新当前组件</button> -->
  </div>
</template>

<script>
// import createIntervalTree from "interval-tree-1d"
import {Roll} from "../roll/Roll.js";
import pre from "./preludeInC.json";
export default {
  props: {
    track: Object,
  },
  data() {
    return {
      notes: [],
      intervalTree: null,
      canvasWidth: 0,
      canvasHeight: 0,
      currentlyDisplayedNotes: [],
      currentNotes: null,
      scrollWidth: 0,
      pixelsPerSecond: 100,
      context: null,
      playing:false,
      roll:null,
    };
  },

  computed: {},
  methods: {
      wow(){
          this.playing=true;
      },
      reload() {
            this.$forceUpdate()
        }
    // getAllNotes(notes) {
    //     console.log( document.getElementById("rollContainer"))
    //   var offsetH = document.getElementById("rollContainer").offsetHeight;
    //   console.log(offsetH)
    //   notes.forEach((note) => {
    //     var Note = note;
    //     Note.noteOn = note.time;
    //     Note.noteOff = note.time + note.duration;
    //     var top = 127 * (1 - Note.midi / 127);
    //     top *= offsetH - 2;
    //     Note.top = top;
    //     // var pixelsPerSecond = 100;
    //     Note.left = Note.noteOn*this.pixelsPerSecond;
    //     Note.width = Note.duration*this.pixelsPerSecond -2;
    //     Note.height = offsetH -2;
    //     this.notes.push(Note);
    //   });
    //   console.log(this.notes)
    //   this.scrollWidth = this.track.duration * this.pixelsPerSecond + window.innerWidth * 2;
    // document.getElementById("rollElement").style.width = this.scrollWidth;
    // this.intervalTree = new createIntervalTree();
    // },
    // setUpCanvas(canvas){
    //     this.context = canvas.getContext("2d");
    //     this.canvasWidth = canvas.offsetWidth *2;
    //     this.canvasHeight = canvas.offsetHeight *2;
    //     this.context.canvas.width = this.canvasWidth;
    //     this.context.canvas.height = this.canvasHeight;
    // },
    // showOnScreenNotes(from,to){
    //     var fromSeconds = from / this.pixelsPerSecond;
    // 	var toSeconds = to / this.pixelsPerSecond;
    // 	if (this.intervalTree !== null){
    // 		var notes = [];
    // 		this.intervalTree.queryInterval(fromSeconds, toSeconds, function(res){
    // 			notes.push(res[2]);
    // 		});
    // 		this.currentlyDisplayedNotes = notes;
    // 	}
    // },
    // draw(offset){
    // 	this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    // 	this.context.save();
    // 	this.context.translate(-offset * 2, 0);
    // 	var notes = this.currentlyDisplayedNotes;
    // 	for (var i = 0; i < notes.length; i++){
    // 		var n = notes[i];
    // 		n.draw(this.context);
    // 	}
    // 	this.context.restore();
    // }
  },
  created(){
   
  },
  mounted() {
    //   console.log(window.innerWidth)
    this.roll = new Roll(document.getElementById("root"));

    this.roll.setScore(pre);
    console.log(pre);
    this.roll.start();

  },
  updated() {
  },
};
</script>

<style>
#root {
  width: 100%;
  height: 100%;
}
#RollContainer {
  position: sticky;
  width: 100%;
  height: calc(100% - 25px);
  left: 0px;
  top: 0px;
  overflow: hidden;
}
#TriggerLine {
  position: absolute;
  left: calc(50% - 3px / 2);
  height: 100%;
  background-color: black;
  width: 3px;
  z-index: 2;
  opacity: 0.1;
  pointer-events: none;
}
#ScoreCanvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 0;
  height: calc(100% - 25px);
}
#ScrollContainer {
  height: calc(100% + 25px);
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  overflow-y: hidden;
  overflow-x: scroll;
}
#PianoRoll {
  display: inline;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 1;
  background-color: transparent;
}
</style>