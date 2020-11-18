<template>
  <div class="page">
    <h1>Here is a midi display demo by Molar~</h1>

    <div class="ScrollArea">
      <div class="container">
        <!-- container -->
        <div class="piano">
          <piano />
        </div>
        <div class="roll">
          <roll :track="showTrack" :playing="playing" :xAxis="value2/100+0.5" v-if="update" />
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
      <el-button style="margin: 10px 10px" @click="handleChange"
        >Playing:{{ playing }}</el-button
      >
      <el-select
        style="margin: 10px 10px"
        @change="onChange()"
        v-model="value"
        placeholder="当前未选择"
      >
        <el-option
          v-for="item in tracks"
          :key="'track' + item.index"
          :label="'Track:' + item.index + ' Instrument:' + item.instrument.name"
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
  </div>
</template>
<script>
import piano from "./piano.vue";
import roll from "./roll.vue";
import { Midi } from "@tonejs/midi";
export default {
  name: "MidiDemo",
  data() {
    return {
      value: "",
      value2: 50,
      playing: false,
      tracks: [],
      showTrack: {},
      update: false,
      value1: true,
    };
  },
  components: {
    piano,
    roll,
  },
  methods: {
    formatTooltip(val) {
      return val / 100 + 0.5;
    },
    handleChange() {
      this.playing = !this.playing;
    },
    onChange() {
      console.log(this.value);
      for (let track of this.tracks) {
        track.index === this.value && (this.showTrack = track);
      }
      // this.showTrack = this.tracks[parseInt(this.value)];
      console.log(this.showTrack);
    },
    changeMidi() {
      this.tracks = [];
      // this.value1 = !this.value1;
      this.getMidi();
    },
    getMidi() {
      Midi.fromUrl(
        this.value1
          ? "/audio/IFeelTheEarthMove.mid"
          : "/audio/YouveGotAFriend.mid"
      ).then((midi) => {
        console.log(midi);
        midi.tracks.forEach((track, index) => {
          if (track.notes.length !== 0) {
            let tmpTrack = track;
            tmpTrack.index = index;
            this.tracks.push(tmpTrack);
          }
          // if (index === 9) this.showTrack = track;
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
  },
  created() {
    this.getMidi();
  },
};
</script>

<style scoped>
.ScrollArea {
  margin: 10px auto;
  width: 1800px;
  height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.page {
  width: 100%;
  height: 100%;
}
.container {
  /* background-color: antiquewhite; */
  display: flex;

  width: 1800px;
  height: 1500px;
  margin: auto auto;
}
.piano {
  /* background-color:azure; */
  width: 80px;
  height: 100%;
}
.roll {
  /* background-color: aquamarine; */
  width: 1700px;
  height: 100%;
}
</style>
