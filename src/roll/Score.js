import createIntervalTree from "interval-tree-1d"
import {Note} from "./Note.js"
export class Score {
    constructor(scrollElement,scrollC,bpm) {

        /**
         *  all of the notes
         */
        this.notes = [];
        this.bpm = bpm;
        this.oneW = Score.prototype.pixelsPerSecond*60/bpm;
        /**
         *  the score container
         */

        this.element = scrollElement;

        /**
         *  the notes that are currently displayed
         */
        this.currentlyDisplayedNotes = [];

        /**
         *  the interval tree
         */
        this.intervalTree = null;

        /**
         * the width of the scroll container
         */
        this.width = 0;
        this.scrollC =scrollC;
        /**
         * The canvas which notes are drawn to
         * @type {Element}
         */
        this.canvas = document.getElementById("ScoreCanvas");

        /**
         * The canvas measurements
         */
        this.canvasWidth = 0;
        this.canvasHeight = 0;

        this.context = this.canvas.getContext("2d");

        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        this._currentNotes = null;

    }
    /**
     *  Set the array of notes
     */
    setNotes(notes,duration) {
        this._currentNotes = notes;
        this.clearNotes();
        var noteHeight = (this.scrollC.offsetHeight-25) / 128;
        var displayOptions = {
            "min": 0,
            "max": 127,
            "pixelsPerSecond": this.pixelsPerSecond,
            "noteHeight": noteHeight
        };
        this.intervalTree = new createIntervalTree();
        // var duration = -Infinity;
        var lowMidi = 127;
        // var maxMidi = 0;
        for (var i = 0; i < notes.length; i++) {
            var note = new Note(notes[i], displayOptions);
            // if (note.noteOff > duration) {
            //     duration = note.noteOff;
            // }
            (note.midiNote<lowMidi)&&(lowMidi = note.midiNote);
            // (note.midiNote>maxMidi)&&(maxMidi = note.midiNote);
            this.intervalTree.insert([note.noteOn, note.noteOff, note]);
        }
        //set the width
        console.log(duration * this.pixelsPerSecond)
        // console.log(this.element);
        // this.width = duration * this.pixelsPerSecond + window.innerWidth * 2;
        this.width = duration * this.pixelsPerSecond;

        this.element.style.width = this.width + "px";
        return Math.round(noteHeight*Math.min(100,Math.max(lowMidi-1,0)));
    }
    /**
     *  Resuze the drawing canvas
     */
    resize() {
        this.canvasWidth = this.canvas.offsetWidth * 2;
        this.canvasHeight = this.canvas.offsetHeight * 2;
        // this.canvasWidth = this.canvas.offsetWidth;
        // this.canvasHeight = this.canvas.offsetHeight;
        this.context.canvas.width = this.canvasWidth;
        this.context.canvas.height = this.canvasHeight;
        if (this._currentNotes) {
            this.setNotes(this._currentNotes);
        }
    }
    /**
     *  Returns the length of the score in seconds
     *  @return  {Number}
     */
    getDuration() {
        var lastOff = 0;
        //get the last noteOff
        for (var i = 0; i < this.notes.length; i++) {
            if (this.notes[i].noteOff > lastOff) {
                lastOff = this.notes[i].noteOff;
            }
        }
        return lastOff;
    }
    /**
     *  get the note attacks between 'from' and 'to' PIXELS!
     *  @return  {Array}
     */
    showOnScreenNotes(from, to) {
        var fromSeconds = from / this.pixelsPerSecond;
        var toSeconds = to / this.pixelsPerSecond;
        if (this.intervalTree !== null) {
            var notes = [];
            this.intervalTree.queryInterval(fromSeconds, toSeconds, function (res) {
                notes.push(res[2]);
            });
            this.currentlyDisplayedNotes = notes;
        }
    }
    /**
     *  clear all of the children
     */
    clearNotes() {
        for (var i = 0; i < this.notes.length; i++) {
            var notes = this.notes[i];
            notes.dispose();
        }
        this.notes = [];
    }
    /**
     *  clean up
     */
    dispose() {
        this.clearNotes();
        this.element.remove();
        this.element = null;
    }
    /**
     *  Draw all of the onscreen notes
     */
    draw(offset) {
        // console.log(offset);
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.context.save();
        this.drawBg();
        this.context.translate(-offset * 2, 0);
        
        var notes = this.currentlyDisplayedNotes;
        for (var i = 0; i < notes.length; i++) {
            var n = notes[i];
            n.draw(this.context);
        }
        this.context.restore();
    }
    drawBg(){
        const colors = ["#282828","#363636"];
        var oneHeight = (this.scrollC.offsetHeight-25) / 128*2;
        for(let i = 0;i<128;i++){
            this.context.strokeStyle = colors[i%2];
            this.context.fillStyle = colors[i%2];
            this.context.fillRect(0,i*oneHeight,this.canvasWidth,oneHeight);
        }
        var num = this.scrollC.offsetWidth/this.oneW*2;
        for(let i = 0;i<num;i++){
            this.context.strokeStyle = "#fff";
            this.context.beginPath();
            // this.context.moveTo(i*this.oneW*2,0);
            this.context.moveTo(i*this.oneW,0);
            this.context.lineTo(i*this.oneW,this.canvasHeight);
            this.context.closePath();
            this.context.stroke();
        }
    }
}

/**
 *  useful for drawing / scrubbing
 */
Score.prototype.pixelsPerSecond = 200;









