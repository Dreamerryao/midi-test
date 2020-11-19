<template>
  <div class="page">
    <h1>Here is a midi display demo by Molar~</h1>
    <Waveform></Waveform>
    <!-- <div class="ScrollArea">
      <div class="container">
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
    </el-slider> -->
  </div>
</template>
<script>
// import piano from "./piano.vue";
// import roll from "./roll.vue";
// import { Midi } from "@tonejs/midi";
import Waveform from "./Waveform.vue";

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
      MidiHead:{},
    };
  },
  components: {
    // piano,
    // roll,
    Waveform
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
