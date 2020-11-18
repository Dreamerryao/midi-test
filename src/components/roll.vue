<template>
  <div id="root">
    <div id="RollContainer">
      <div id="ScrollContainer">
        <div id="PianoRoll"></div>
      </div>
      <canvas id="ScoreCanvas"></canvas>
    </div>
  </div>
</template>

<script>
// import createIntervalTree from "interval-tree-1d"
import { Roll } from "../roll/Roll.js";
export default {
  props: {
    track: Object,
    playing: Boolean,
    xAxis:Number
  },
  data() {
    return {
      notes: [],
      roll: null,
    };
  },
  watch: {
    xAxis(newV,oldV){
      this.roll.changeXAxis(newV,oldV);
      this.roll.update(this.track);
    },
    track(newV) {
      console.log("new track");
      console.log(newV);
      console.log("update");
      this.roll.update(newV);
      // this.reload();
    },
    playing(newV) {
      if (newV) {
        console.log("wow");
        this.roll.start();
      } else {
        console.log("wuwu");
        this.roll.stop();
      }
    },
  },
  computed: {},
  methods: {},
  created() {},
  mounted() {
    if (this.roll !== null) {
      console.log("update");
      this.roll.update(this.track);
    } else {
      console.log("new");
      this.roll = new Roll();
      this.roll.setScore(this.track);
    }
    if (this.playing) this.roll.start();
  },
  updated() {},
};
</script>

<style>
#root {
  width: 100%;
  height: 100%;
}
#RollContainer {
  position: relative;
  width: 100%;
  /* height: calc(100% - 25px); */
  height: 100%;
  /* left: 0px; */
  /* top: 0px; */
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
  /* height: calc(100% - 25px); */
}
#ScrollContainer {
  height: calc(100% + 25px);
  /* height: 100%; */
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