import { Score } from "./Score"
import { Scroll } from "./Scroll"

export class Roll {
    constructor() {

        this._element = document.getElementById("RollContainer");
        this._scrollContainer = document.getElementById("ScrollContainer");
        this._scrollElement = document.getElementById("PianoRoll");


        //display score
        this._score = new Score(this._scrollElement, this._scrollContainer.offsetHeight);

        //scroll handler
        this._scroll = new Scroll(this._scrollContainer, this._score.pixelsPerSecond);


        this._started = false;

        //the current notes on the screen
        this._currentNotes = [];

        //if the scroll has changed, redraw
        this._currentScroll = -1;

        //the time at the beginning of the piano roll
        // this._computedStartTime = 0;

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
    _onScreenNotes() {
        var width = this._width;
        // this._score.showOnScreenNotes(this._currentScroll - width, this._currentScroll);
        this._score.showOnScreenNotes(this._currentScroll, this._currentScroll + width);
    }
    _loop() {
        requestAnimationFrame(this._bindedLoop);
        var scrollLeft = this._scrollContainer.scrollLeft;

        if (scrollLeft !== this._currentScroll) {
            this._currentScroll = scrollLeft;
            this._onScreenNotes();
        }
        //draw all of the notes
        // this._score.draw(this._currentScroll - this._width);
        this._score.draw(this._currentScroll);
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
        // var width = this._scrollContainer.offsetWidth;
        // this._currentScroll = width;
        this._currentScroll = 0;
        this._scrollContainer.scrollLeft = this._currentScroll;
        this._onScreenNotes();
    }
    start() {
        // this._computeStartTime();
        this._scroll.start();
    }
    stop() {
        this._scroll.stop();
        // this.onstop();
    }
    update(track) {
        // this._score.dispose();
        this._score.setNotes(track.notes);
        // this._computeStartTime();
        this._onScreenNotes();
    }
    changeXAxis(value,oldV) {
        this._score.pixelsPerSecond = 200 * value;
        // this._currentScroll -=this._width;
        this._currentScroll *=value/oldV;
        this._scrollContainer.scrollLeft *=value/oldV;
        this._scroll.changePixelsPerSecond(200 * value,this._width);
    }
}










