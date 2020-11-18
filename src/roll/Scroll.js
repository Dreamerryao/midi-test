export class Scroll {
    constructor(container, pixelsPerSecond) {

        this.element = container;
        this.currentScroll = -1;
        //scroll rate
        this.pixelsPerSecond = pixelsPerSecond;
        this.lastUpdate = -1;

        /**
         *  whether or not the element is autoadvancing
         */
        this.autoAdvance = false;
        this.scrollDifference = 0;
        this.restStart = -1;
        this._boundloop = this.loop.bind(this);
        this.loop();


        // // //scroll back to the top if the page was reloaded
        // window.addEventListener("beforeunload", function () {
        //     this.element.scrollLeft = 0;
        // }.bind(this));
    }
    /**
     *  The update loop
     */
    loop() {
        var currentTime = Date.now();
        requestAnimationFrame(this._boundloop);
        if (this.lastUpdate !== -1 && this.autoAdvance) {
            var delta = currentTime - this.lastUpdate;
            this.currentScroll += (delta / 1000) * this.pixelsPerSecond;
            this.element.scrollLeft = Math.round(this.currentScroll);
        }
        this.lastUpdate = currentTime;
    }
    /**
     *  start auto advancing
     */
    start() {
        this.currentScroll = this.element.scrollLeft;
        this.autoAdvance = true;
    }
    /**
     *  stop auto advancing
     */
    stop() {
        this.autoAdvance = false;
    }
    /**
     *  restart from the beginning
     */
    restart() {
        // var startOffset = this.element.offsetWidth / 2;
        this.element.scrollLeft = 0;
        this.currentScroll = 0;
    }
    changePixelsPerSecond(newV){
        this.pixelsPerSecond = newV;
    }
}








