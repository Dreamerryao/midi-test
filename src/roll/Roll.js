import {Score} from "./Score"
import { Transport } from "tone"
import {Scroll} from "./Scroll"
// var lookAhead = 0.05;

export class Roll {
    constructor() {

        this._element = document.getElementById("RollContainer");
        this._scrollContainer = document.getElementById("ScrollContainer");
        this._scrollElement = document.getElementById("PianoRoll");


        //display score
        this._score = new Score(this._scrollElement,this._scrollContainer.offsetHeight);

        //scroll handler
        this._scroll = new Scroll(this._scrollContainer, this._score.pixelsPerSecond);


        this._started = false;

        //the current notes on the screen
        this._currentNotes = [];

        //if the scroll has changed, redraw
        this._currentScroll = -1;

        //the time at the beginning of the piano roll
        this._computedStartTime = 0;

        //a binding of the loop
        this._bindedLoop = this._loop.bind(this);

        //start the loop
        this._loop();

        this._width = this._scrollContainer.offsetWidth;

        window.addEventListener("resize", this._resize.bind(this));
    }
    _resize() {
        this._width = this._scrollContainer.offsetWidth;
    }
    _computeStartTime() {
        // var width = this._scrollContainer.offsetWidth;
        this._computedStartTime = Transport.now() - (this._currentScroll) / this._score.pixelsPerSecond;
    }
    _onScreenNotes() {
        var width = this._width;
        this._score.showOnScreenNotes(this._currentScroll - width, this._currentScroll);
    }
    _loop() {
        requestAnimationFrame(this._bindedLoop);
        var scrollLeft = this._scrollContainer.scrollLeft;
        //loop
        if (scrollLeft + this._width >= this._score.width - 2) {
            this._currentScroll = -1;
            this._scroll.restart();
            this._computeStartTime();
            this._scrollContainer.scrollLeft = 0;
        }
        if (scrollLeft !== this._currentScroll) {
            this._currentScroll = scrollLeft;
            this._onScreenNotes();
        }
        //draw all of the notes
        this._score.draw(this._currentScroll - this._width);
    }
    /**
     * set the json score
     */
    setScore(track) {
        // Transport.bpm.value = json.header.tempo;
        // Transport.timeSignature = json.header.timeSignature;
        //set the notes
        this._score.setNotes(track.notes);
        //show the first notes initially
        var width = this._scrollContainer.offsetWidth;
        this._currentScroll = width - 30;
        // this._currentScroll = 0;
        this._scrollContainer.scrollLeft = this._currentScroll;
        this._onScreenNotes();
    }
    start() {
        this._computeStartTime();
        this._scroll.start();
    }
    stop() {
        this._scroll.stop();
        this.onstop();
    }
}










