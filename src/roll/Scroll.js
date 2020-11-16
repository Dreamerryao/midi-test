export class Scroll {
    constructor(container, pixelsPerSecond) {

        /**
         *  The scrollable element
         */
        this.element = container;

        /**
         *  the current scroll position. Used to
         *  check if there's been an update.
         *  @type  {Number}
         */
        this.currentScroll = -1;

        /**
         *  the scrolling rate
         */
        this.pixelsPerSecond = pixelsPerSecond;

        /**
         *  the last update time
         */
        this.lastUpdate = -1;

        /**
         *  whether or not the element is autoadvancing
         */
        this.autoAdvance = false;

        /**
         *  manual override if the user is scrolling
         */
        this.manualOverride = false;

        /**
         *  the difference between the current and last scroll
         */
        this.scrollDifference = 0;

        /**
         *  the timeout for resumeAuto
         */
        this.restStart = -1;

        /**
         *  stop the clock when it's scrolling
         */
        // this.element.addEventListener("mousewheel", this.scrolling.bind(this));
        // this.element.addEventListener("DomMouseScroll", this.scrolling.bind(this));
        // $(this.element).on("mousewheel", this.scrolling.bind(this));
        // this.element.addEventListener("touchstart", this.touchstart.bind(this));
        // this.element.addEventListener("touchend", this.touchend.bind(this));

        /**
         * a prebound version of the loop function
         */
        this._boundloop = this.loop.bind(this);
        //start the loop
        this.loop();


        // //scroll back to the top if the page was reloaded
        window.addEventListener("beforeunload", function () {
            this.element.scrollLeft = 0;
        }.bind(this));
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
}








