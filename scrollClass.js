
class Scroller {

    constructor(options) {
        this.settings = Object.assign({
            groups: [],
            intervalTickSpeed: 25,
            printDestination: $("body")
        }, options);

        this.lastTimestamp = 0;
        this.currentTime = 0;
        this.stopTick = false;
    }

    play() {
        this.currentInterval = setInterval(() => this.doTick(), this.settings.intervalTickSpeed);
        this.lastTimestamp = Date.now();
    }

    doTick() {
        console.log("doing scroller tick");

        this.currentTimestamp = Date.now();
        this.currentTime += this.currentTimestamp - this.lastTimestamp;
        this.lastTimestamp = this.currentTimestamp;

        // find groups that we need to print
        // there might be multiple at the same time
        let groups = this.settings.groups.filter((gr) => {
            return gr.startTime < this.currentTime && gr.endTime > this.currentTime;
        });
        // redraw the DOM
        this.settings.printDestination.html("");
        groups.forEach((group) => {

            let $pre = $("<pre>")
                .attr("id", group.startTime)
                .html(escapeHtml(group.content))
                .attr("style", "opacity: 0");
            
            this.settings.printDestination.append(
                $pre
            );
            
            let vh = this.settings.printDestination.height();
            let ph = $pre.height();

            let yPos = vh - (
                (this.currentTime - group.startTime) * (vh + ph + 100) /
                (group.endTime - group.startTime));

            $pre.attr("style", `position: absolute; top: ${yPos}px`);

        });
    }

}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\n/g, "<br>");
 }