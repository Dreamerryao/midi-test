import {Score} from "./Score"
import { Transport } from "tone"
import {Scroll} from "./Scroll"
// var lookAhead = 0.05;


export class Roll {
    constructor(container) {

        /**
         *  The scroll container
         */
        this._element = document.createElement("div");
        this._element.id = "RollContainer";
        container.appendChild(this._element);

        // The trigger line that sits in the center
        // var triggerLine = document.createElement("div");
        // triggerLine.id = "TriggerLine";
        // this._element.appendChild(triggerLine);

        /**
         *  The scrolling container
         */
        this._scrollContainer = document.createElement("div");
        this._scrollContainer.id = "ScrollContainer";
        this._element.appendChild(this._scrollContainer);


        this._scrollElement = document.createElement("div");
        this._scrollElement.id = "PianoRoll";
        this._scrollContainer.appendChild(this._scrollElement);

        //THE SCORE DISPLAY
        this._score = new Score(this._element, this._scrollElement,this._scrollContainer.offsetHeight);

        //the scroll handler
        this._scroll = new Scroll(this._scrollContainer, this._score.pixelsPerSecond);
        // this._scroll.scrubstart = this._scrubStarted.bind(this);
        // this._scroll.scrubend = this._scrubEnd.bind(this);

        // if it's scrubbing
        this._scrubbing = false;

        this._started = false;

        //the current notes on the screen
        this._currentNotes = [];

        //if the scroll has changed, redraw
        this._currentScroll = -1;

        //the time at the beginning of the piano roll
        this._computedStartTime = 0;

        //callback when a note is triggered
        this.onnote = function () { };
        this.onstop = function () { };

        //a binding of the loop
        this._bindedLoop = this._loop.bind(this);

        //start the loop
        this._loop();

        this._width = this._scrollContainer.offsetWidth;

        window.addEventListener("resize", this._resize.bind(this));

        //set the lookahead to match the other one
        // Transport._clock.lookAhead = lookAhead;
    }
    _resize() {
        this._width = this._scrollContainer.offsetWidth;
    }
    _computeStartTime() {
        // var width = this._scrollContainer.offsetWidth;
        this._computedStartTime = Transport.now() - (this._currentScroll) / this._score.pixelsPerSecond;
    }
    // _scrubStarted() {
    //     this._scrubbing = true;
    //     //release all the current notes
    //     for (var i = 0; i < this._currentNotes.length; i++) {
    //         this._currentNotes[i].triggerRelease();
    //     }
    //     this.onstop();
    // }
    // _scrubEnd() {
    //     this._scrubbing = false;
    //     this._computeStartTime();
    // }
    /**
     * Draw the currently on screen notes
     */
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
    setScore(json) {
        Transport.bpm.value = json.header.tempo;
        Transport.timeSignature = json.header.timeSignature;
        //set the notes
        this._score.setNotes(json.notes);
        //show the first notes initially
        var width = this._scrollContainer.offsetWidth;
        this._currentScroll = width / 2 - 3;
        this._scrollContainer.scrollLeft = this._currentScroll;
        this._onScreenNotes();
    }
    start() {
        this._computeStartTime();
        this._scroll.start();
    }
    stop() {
        this._scroll.stop();
        for (var i = 0; i < this._currentNotes.length; i++) {
            this._currentNotes[i].triggerRelease();
        }
        this.onstop();
    }
}










