import {Transport} from "tone"

export class Note {
    constructor(noteDescription, displayOptions) {

        /**d
         *  Note stats
         */
        this.noteOn = Transport.toSeconds(noteDescription.time);
        this.duration = Transport.toSeconds(noteDescription.duration);
        this.noteOff = this.noteOn + this.duration;

        //parse the name from the octave, and add it as a class
        // var noteName = noteDescription.note.match(/^([a-g]{1}[b|#]{0,1})[0-9]+$/i)[1];
        /**
         * The notes color
         */
        this.color = "#ff0000";

        /**
         *  the note name
         */
        this.note = noteDescription.note;

        /**
         *  the note velocity
         */
        this.velocity = noteDescription.velocity;

        /**
         *  MIDI note number
         */
        this.midiNote = noteDescription.midiNote;

        /**
         * If the note is triggered or not
         */
        this._triggered = false;

        /**
         *  place it on the screen
         */
        var top = (displayOptions.max - displayOptions.min) * (1 - (this.midiNote - displayOptions.min) / (displayOptions.max - displayOptions.min));
        top *= displayOptions.noteHeight - 2;

        //dimensions
        this.top = top;
        this.left = this.noteOn * displayOptions.pixelsPerSecond;
        this.width = (this.duration * displayOptions.pixelsPerSecond) - 2;
        this.width = Math.max(this.width, 3);
        this.height = displayOptions.noteHeight - 2;
        // console.log()
    }
    /**
     *  trigger the attack
     */
    triggerAttack() {
        this._triggered = true;
    }
    /**
     *  trigger the release
     */
    triggerRelease() {
        this._triggered = false;
    }
    triggerAttackRelease(duration) {
        duration = Transport.toSeconds(duration);
        this.needsUpdate = true;
        this._triggered = true;
        setTimeout(function () {
            this._triggered = false;
            this.needsUpdate = true;
        }.bind(this), duration * 1000);
    }
    /**
     *  Display the element
     */
    draw(context) {
        context.beginPath();
        if (this._triggered) {
            context.fillStyle = "black";
        } else {
            context.fillStyle = this.color;
        }
        context.fillRect(this.left * 2, this.top * 2, this.width * 2, this.height * 2);
    }
    /**
     *  trigger the release
     */
    dispose() {
        Transport.cancel(this.noteOnId);
        Transport.cancel(this.noteOffId);
        this.element.remove();
        this.element = null;
    }
}






