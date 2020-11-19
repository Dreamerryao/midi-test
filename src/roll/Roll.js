
import { Score } from "./Score"
import { Scroll } from "./Scroll"

export class Roll {
    constructor(head) {

        this._element = document.getElementById("RollContainer");
        this._scrollContainer = document.getElementById("ScrollContainer");
        this._scrollElement = document.getElementById("PianoRoll");
        this._scrollTopArea = document.getElementById("test");
        // console.log(this._scrollTopArea);
        this._head = head;
        this._bpm = Math.round(this._head.tempos[0].bpm);
        console.log(this._bpm);
        //display score
        
        this._score = new Score(this._scrollElement,this._scrollContainer,this._bpm);

        //scroll handler
        this._scroll = new Scroll(this._scrollContainer, this._score.pixelsPerSecond);


        this._started = false;

        //the current notes on the screen
        this._currentNotes = [];

        //if the scroll has changed, redraw
        this._currentScroll = -1;

        //the time at the beginning of the piano roll
        // this._computedStartTime = 0;

        //set bpm

        //a binding of the loop
        this._bindedLoop = this._loop.bind(this);

        //start the loop
        this._loop();

        this._width = this._scrollContainer.offsetWidth;
        // this._currentScroll = this._scrollContainer.scrollLeft;
        // this._onScreenNotes();
        // this._score.draw(this._currentScroll);
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
            this._score.draw(this._currentScroll);
        }
    }
    /**
     * set the json score
     */
    setScore(track,duration) {
        // Transport.bpm.value = json.header.tempo;
        // Transport.timeSignature = json.header.timeSignature;
        //set the notes
        let scrollTop = this._score.setNotes(track.notes,duration);
        // scrollTop = 100;
        // console.log(scrollTop);
        this._scrollTopArea.scrollTop = scrollTop;
        console.log(this._scrollTopArea.scrollTop);
        //show the first notes initially
        // var width = this._scrollContainer.offsetWidth;
        // this._currentScroll = width;
        this._currentScroll = 0;
        this._scrollContainer.scrollLeft = this._currentScroll;
        // console.log(this._scrollContainer.scrollLeft);
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
    update(track,duration,head) {
        // this._score.dispose();
        
        this._head = head;
        let scrollTop = this._score.setNotes(track.notes,duration);
        this._scrollTopArea.scrollTop = scrollTop;
        console.log(this._scrollTopArea.scrollTop);
        // this._computeStartTime();
        this._onScreenNotes();
        this._score.draw(this._currentScroll);
    }
    changeXAxis(value, oldV) {
        this._score.pixelsPerSecond = 200 * value;
        // this._currentScroll -=this._width;
        this._currentScroll *= value / oldV;
        this._scrollContainer.scrollLeft *= value / oldV;
        this._scroll.changePixelsPerSecond(200 * value, this._width);
    }
}










