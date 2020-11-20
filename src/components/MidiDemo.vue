<template>
  <div class="page">
    <h1>Here is a midi display demo by Molar~</h1>
    <Waveform></Waveform>
  </div>
</template>
<script>
import Waveform from "./Waveform.vue";

export default {
  name: "MidiDemo",
  data() {
    return {
    };
  },
  components: {
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
