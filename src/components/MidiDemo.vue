<template>
  <div class="page">
    <h1>Hi,Here is a midi display demo by dreamerryao</h1>
    <div class="container">
      <!-- container -->
      <div class="piano">
          <piano/>
      </div>
      <div class="roll">
        <roll :track="testTrack" v-if="update"/>
      </div>
    </div>
  </div>
</template>
<script>
import piano from "./piano.vue"
// import {Roll} from "../roll/Roll.js";
import roll from "./roll.vue"
import {Midi} from "@tonejs/midi"
// import pre from "./preludeInC.json";
// import Tone, { Buffer, Sequence, Transport, Event, Draw, context } from "tone"
// import {Transport} from "tone"
export default {
  name: "MidiDemo",
  data(){
    return {
      playing:false,
      tracks:[],
      testTrack:{},
      update:false,
      // roll:null
    }
  },
  // watch: {
  //   testTrack(newV,old) {
  //       // this.actualTrack = this.track;
  //       console.log('props',newV);
  //       console.log('props',old);
  //   }
  // },
  components:{
      piano,
      roll
  },
  methods:{
    // togglePlayback(){
    //   this.playing?Transport.pause():Transport.start();
    //   this.playing = !this.playing;
    // },
    reload() {
            this.$forceUpdate()
    }
  },
  created(){
    // this.roll = new Roll(document.body);
    // this.roll.setScore(pre);
    // console.log(pre);
    // this.reload();

    // const now = Tone.now() + 0.5;
    Midi.fromUrl("/audio/IFeelTheEarthMove.mid")
    .then(midi=>{
      console.log(midi);
      midi.tracks.forEach((track,index) =>{
        this.tracks.push(track);
        if(index===9)this.testTrack = track;
        // console.log(`track${index}:`);
        // console.log(track);
      })
      console.log(this.tracks);
      console.log(this.testTrack)
      this.update = true;


    })
  },
  mounted(){
    // var wow = document.getElementById("root");
    // wow.style.width = "200px";

    // this.roll = new Roll(document.getElementById("root"));

    // this.roll.setScore(pre);
    // console.log(pre);
    // this.roll.start();
  }
};
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
.container {
  background-color: antiquewhite;
  display: flex;
  width: 1800px;
  height: 1920px;
  margin: auto auto;
}
.piano {
    background-color:azure;
    width:200px;
    height:100%;
}
.roll{
  background-color: aquamarine;
  width:1600px;
  height:100%;
}


</style>
