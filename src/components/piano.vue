<template>
  <div class="keyboard" :style="style">
    <ul>
      <li
        v-for="(key, index) in keys"
        :key="index"
        :style="key.style"
        :class="[...key.class]"
      >
        <!-- @click="toggleActive(key.name)" -->
        <span
          v-if="key.name.indexOf('C') != -1 && key.name.indexOf('#') === -1"
          >{{ key.name }}</span
        >
      </li>
    </ul>
  </div>
</template>

<script>
const WHITE_KEYS = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_KEYS = ["C#", "D#", null, "F#", "G#", "A#", null];
const NUM_WHITE_KEYS_PER_OCTAVE = 7;
const NUM_BLACK_KEYS_PER_OCTAVE = 5;
const MIN_OCTAVE = -2;
const MAX_OCTAVE = 8;
const MIN_NOTE = 0;
const MAX_NOTE = 6;

const clamp = (num, min, max) => {
  return Math.max(min, Math.min(max, num));
};
export default {
  data() {
    return {
      offsets: {
        octaveStart: -2,
        octaveEnd: 8,
        noteStart: 0,
        noteEnd: 4,
      },
    };
  },

  methods: {
    calculateOctave(n) {
      return (
        Math.floor(n / NUM_WHITE_KEYS_PER_OCTAVE) +
        Math.max(MIN_OCTAVE, this.offsets.octaveStart)
      );
    },
  },

  computed: {
    offsetStart() {
      return clamp(this.offsets.noteStart, MIN_NOTE, MAX_NOTE);
    },

    offsetEnd() {
      return clamp(this.offsets.noteEnd, MIN_NOTE, MAX_NOTE);
    },

    totalWhiteKeys() {
      return (
        this.numOctaves * NUM_WHITE_KEYS_PER_OCTAVE -
        this.offsets.noteStart -
        (NUM_WHITE_KEYS_PER_OCTAVE - (this.offsets.noteEnd + 1))
      );
    },

    totalBlackKeys() {
      return (
        this.numOctaves * NUM_BLACK_KEYS_PER_OCTAVE -
        this.offsets.noteStart -
        (NUM_BLACK_KEYS_PER_OCTAVE - (this.offsets.noteEnd + 1))
      );
    },

    totalKeys() {
      return this.totalWhiteKeys + this.totalBlackKeys;
    },

    numOctaves() {
      return (
        1 +
        (Math.min(MAX_OCTAVE, this.offsets.octaveEnd) -
          Math.max(MIN_OCTAVE, this.offsets.octaveStart))
      );
    },

    style() {
      return {
        "--keys": this.totalWhiteKeys,
        "--octaves": this.numOctaves,
      };
    },

    keys() {
      const keys = [];

      // White keys.
      let nowNum = 1; //记录当前跨度
      for (let i = this.offsetStart, j = 0; j < this.totalWhiteKeys; i++, j++) {
        const octave = this.calculateOctave(i);
        const keyName = WHITE_KEYS[i % 7];

        // Skip < A0
        // if (octave === 0 && WHITE_KEYS.indexOf(keyName) < 5) {
        //   continue
        // }
        let step = 3;
        // console.log(i%7)
        if (i % 7 === 1 || i % 7 === 4 || i % 7 === 5) step = 4;
        const key = {
          name: `${keyName}${octave}`,
          class: ["white"],
          style: {
            "grid-row": `${nowNum} / span ${step}`,
          },
        };
        nowNum += step;

        keys.push(key);
      }

      // Black keys.
      nowNum = 0;
      for (let i = this.offsetStart, j = 0; j < this.totalWhiteKeys; i++, j++) {
        let step = 3;
        // console.log(i%7)
        if (i % 7 === 1 || i % 7 === 4 || i % 7 === 5) step = 4;
        nowNum +=step;
        const octave = this.calculateOctave(i);
        const keyName = BLACK_KEYS[i % 7];

        // Skip E♯ (F) or B♯ (C).
        if (!keyName) {
          continue;
        }

        // Skip > C8.
        if (octave >= 9) {
          continue;
        }
        if (octave === 8 && i % 7 === 4) continue;

        // const keyNameClass = keyName.replace("#", "s");

        const key = {
          name: `${keyName}${octave}`,
          class: ["black"],
          style: {
            "grid-row": `${nowNum} / span 2`,
          },
        };

        keys.push(key);
      }

      return keys;
    },
  },
};
</script>

<style scoped>
body,
ul {
  margin: 0;
  padding: 0;
}

.keyboard {
  width: 100%;
  /* height: calc(260px - calc(var(--octaves) * 10px)); */
  height: 100%;
  /* overflow-x: hidden; */
}

.keyboard ul {
  height: 100%;
  width: 100%;
  list-style-type: none;
  display: grid;
  grid-template-rows: repeat(256, 1fr);
  grid-template-columns: repeat(3, 1fr);
}

li {
  text-align: end;
  background-color: white;
  border: 1px solid black;
  /* display: flex; */
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 0.25rem;
  font-weight: bold;
  border-radius: 0 3px 3px 0;
}

li.black span {
  /* transform: rotate(90deg); */
  text-align: center;
  transform-origin: center 50%;
  /* margin-bottom: 0.75rem; */
}

.white {
  grid-column: 1 / span 3;
  z-index: 2;
}

.black {
  grid-column: 1 / span 2;
  background-color: black;
  color: white;
  z-index: 3;
}

.blank {
  border-width: 0;
  grid-column: 1 / span 2;
}
</style>
