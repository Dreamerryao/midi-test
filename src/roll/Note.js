import {Transport} from "tone"

export class Note {
    constructor(noteDescription, displayOptions) {
        this.noteOn = Transport.toSeconds(noteDescription.time);
        this.duration = Transport.toSeconds(noteDescription.duration);
        this.noteOff = this.noteOn + this.duration;
        this.color = "#ff0000";
        this.note = noteDescription.note;
        this.velocity = noteDescription.velocity;
        this.midiNote = noteDescription.midiNote;
        this._triggered = false;
        var top = (displayOptions.max - displayOptions.min) * (1 - (this.midiNote - displayOptions.min) / (displayOptions.max - displayOptions.min));
        top *= displayOptions.noteHeight - 2;
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







