import { Transport } from "tone"

export class Note {
    constructor(noteDescription, displayOptions) {
        this.noteOn = Transport.toSeconds(noteDescription.time);
        this.duration = Transport.toSeconds(noteDescription.duration);
        this.noteOff = this.noteOn + this.duration;
        this.strokeColor = "#A2F0B1";
        this.fillColor = "#217230";
        this.note = noteDescription.name;
        this.velocity = noteDescription.velocity;
        this.midiNote = noteDescription.midi;
        var top = this.midiNote;
        top *= displayOptions.noteHeight;
        this.top = top;
        this.left = this.noteOn * displayOptions.pixelsPerSecond;
        this.width = (this.duration * displayOptions.pixelsPerSecond);
        // this.width = Math.max(this.width,4);
        this.height = displayOptions.noteHeight;
    }
    draw(context) {
        context.beginPath();
        context.fillStyle = this.fillColor;
        context.strokeStyle = this.strokeColor;
        context.fillRect(this.left * 2, this.top * 2, this.width * 2, this.height * 2);
        let padding = Math.min(Math.min(this.width, 6), Math.min(this.height, 6));
        let lineWidth = this.height * 2 - padding * 2;
        //overflow -> don't display
        if (lineWidth >= this.width) {
            context.lineWidth = this.width;
        }
        else {
            context.lineWidth = lineWidth;
        }

        context.beginPath();
        context.moveTo(this.left * 2 + padding + lineWidth / 2, this.top * 2 + padding + lineWidth / 2);
        context.lineTo(this.left * 2 + this.width * 2 - padding - lineWidth / 2, this.top * 2 + padding + lineWidth / 2);
        context.closePath();
        context.lineJoin = "round";
        context.stroke();

    }
    dispose() {
        this.element.remove();
        this.element = null;
    }
}







