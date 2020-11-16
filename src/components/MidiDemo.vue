<template>
  <div class="page">
    <h1>Hi,Here is a midi display demo by dreamerryao</h1>
    <button @click="handleChange">{{playing}}</button>
    <div class="container">
      <!-- container -->
      <div class="piano">
          <piano/>
      </div>
      <div class="roll">
        <roll :track="testTrack" :playing="playing" v-if="update"/>
      </div>
    </div>
  </div>
</template>
<script>
import piano from "./piano.vue"
import roll from "./roll.vue"
import {Midi} from "@tonejs/midi"
export default {
  name: "MidiDemo",
  data(){
    return {
      playing:false,
      tracks:[],
      testTrack:{},
      update:false,
    }
  },
  components:{
      piano,
      roll
  },
  methods:{
    handleChange(){
      this.playing = !this.playing;
    }
  },
  created(){
    Midi.fromUrl("/audio/IFeelTheEarthMove.mid")
    .then(midi=>{
      console.log(midi);
      midi.tracks.forEach((track,index) =>{
        this.tracks.push(track);
        if(index===9)this.testTrack = track;

      })
      console.log(this.tracks);
      console.log(this.testTrack)
      this.update = true;


    })
  },
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
  height: 1500px;
  margin: auto auto;
}
.piano {
    background-color:azure;
    width:80px;
    height:100%;
}
.roll{
  background-color: aquamarine;
  width:1500px;
  height:100%;
}


</style>
