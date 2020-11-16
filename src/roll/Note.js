import { Transport } from "tone"

export class Note {
    constructor(noteDescription, displayOptions) {
        this.noteOn = Transport.toSeconds(noteDescription.time);
        this.duration = Transport.toSeconds(noteDescription.duration);
        this.noteOff = this.noteOn + this.duration;
        this.strokeColor = "#217230";
        this.fillColor = "#A2F0B1";
        this.note = noteDescription.name;
        this.velocity = noteDescription.velocity;
        this.midiNote = noteDescription.midi;
        this._triggered = false;
        var top = this.midiNote;
        top *= displayOptions.noteHeight;
        this.top = top;
        this.left = this.noteOn * displayOptions.pixelsPerSecond*4;
        this.width = (this.duration * displayOptions.pixelsPerSecond*4);
        // this.width = Math.max(3,this.width);
        this.height = displayOptions.noteHeight;
    }
    /**
     *  Display the element
     */
    draw(context) {
        
        context.beginPath();
        if (this._triggered) {
            context.fillStyle = "black";
        } else {
            context.fillStyle = this.fillColor;
        }
        context.fillStyle = this.strokeColor;
        context.strokeStyle = this.fillColor;
        context.fillRect(this.left * 2, this.top * 2, this.width * 2, this.height * 2);
        let padding = Math.min(Math.min(this.width, 6), Math.min(this.height, 6));
        let lineWidth = this.height*2 - padding *2;
        context.lineWidth = lineWidth;
        context.beginPath();
        context.moveTo(this.left*2+padding+lineWidth/2,this.top*2+padding+lineWidth/2);
        context.lineTo(this.left*2+this.width*2-padding-lineWidth/2,this.top*2+padding+lineWidth/2);
        context.closePath();
        context.lineJoin = "round";
        context.stroke();

    }
    /**
     *  trigger the release
     */
    dispose() {
        // Transport.cancel(this.noteOnId);
        // Transport.cancel(this.noteOffId);
        this.element.remove();
        this.element = null;
    }
}







