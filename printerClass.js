
class Printer {

    constructor(options) {
        this.$printDest = options.printDestination;
        this.songText = options.songText;
        if (options.audioName == null)
            this.audio = null;
        else this.audio = new Audio(options.audioName);
        this.animMode = options.animMode;
        this.$scrollElement = options.scrollElement;
        this.startHidden = options.startHidden;
        this.intervalTickSpeed = options.intervalTickSpeed ?? 50;


        this.currentInterval = 0;
        this.lastTimestamp = 0;
        this.currentTime = 0;
        this.currentSpans = [];
        this.stopTick = false;
    }

    play() {
        if (this.audio != null) {
            this.audio.addEventListener("canplaythrough", event => {
                this.audio.play();
                this.currentInterval = setInterval(() => this.doTick(), this.intervalTickSpeed);
            });
        } else {
            this.currentInterval = setInterval(() => this.doTick(), this.intervalTickSpeed);
        }
        this.lastTimestamp = Date.now();
    }

    doTick() {
        // console.log("doing printer tick");

        this.currentTimestamp = Date.now();
        this.currentTime += this.currentTimestamp - this.lastTimestamp;
        this.lastTimestamp = this.currentTimestamp;

        // find if we're in the middle of a lyric
        let lyric = this.songText.find(elem => elem.startTime < this.currentTime && elem.endTime > this.currentTime);
        if (lyric !== undefined) {
            // if this lyric is <clear>, then clear the span array and do nothing
            if (lyric.text == "<clear>") {
                this.currentSpans = [];
            } else {
                if (this.animMode != "appear") {
                    // check if we have a span for this lyric
                    let span = this.currentSpans.find(span => span.id == lyric.id);
                    // if we don't, create one
                    if (span === undefined) {
                        this.currentSpans.push({
                            id: lyric.id,
                            startTime: lyric.startTime,
                            endTime: lyric.endTime,
                            text: lyric.text,
                            animPos: 0,
                            completed: false
                        });
                    } else {
                        // calculate the current animation position on it
                        span.animPos =
                            (this.currentTime - span.startTime) /
                            (span.endTime - span.startTime);
                    }
                } else {
                    this.currentSpans = [{
                        id: Date.now(),
                        startTime: lyric.startTime,
                        endTime: lyric.endTime,
                        text: lyric.text,
                        animPos: 0,
                        completed: true
                    }];
                }
            }
        }
        // mark all passed lyrics as passed
        this.currentSpans = this.currentSpans.map(span => {
            if (span.endTime < this.currentTime)
                span.completed = true;
            return span;
        });
        // if we're past the end of the song
        if (this.currentTime > this.songText[this.songText.length - 1].endTime)
        this.stopTick = true;

        this.updateDOM();

        clearInterval(this.currentInterval);
        if (!this.stopTick)
            this.currentInterval = setInterval(() => this.doTick(), this.intervalTickSpeed);
    }

    updateDOM() {
        if (this.startHidden !== false) {
            if (this.currentSpans.length == 0)
                this.startHidden.addClass("d-none");
            else this.startHidden.removeClass("d-none");
        }

        this.$printDest.html("");

        for (let span of this.currentSpans) {
            if (this.animMode == "typewrite" || this.animMode == "appear") {
                let partialTextCount = parseInt(span.text.length * span.animPos);
                let partialText = span.text.substring(0, partialTextCount);
                let finalText = span.completed ? span.text : partialText;
                this.$printDest.append(
                    `<span>${finalText
                        .replaceAll('<', '&lt;')
                        .replaceAll('>', '&gt;')
                        .replaceAll('\r\n', '<br>')
                        .replaceAll('\n', '<br>')
                    }</span>` // removed <br> here
                );
            } else if (this.animMode == "fade") {
                if (span.completed) {
                    this.$printDest.append(
                        `<span>${span.text.replaceAll('\n', '<br> ')}</span><br>`
                    );
                } else {
                    // calculate current word position
                    let words = span.text.split(/ /);
                    let currentWord = Math.floor(
                        (this.currentTime - span.startTime) /
                        (span.endTime - span.startTime) *
                        words.length
                    );
                    let classThis = this;
                    words.forEach(function(word, index) {
                        if (index < currentWord) {
                            classThis.$printDest.append(
                                `<span>${word.replaceAll('\n', '<br> ')}</span> `
                            );
                        } else if (index > currentWord) {
                            //
                        } else {
                            let wordStartTime =
                                (span.endTime - span.startTime) *
                                currentWord / 
                                words.length +
                                span.startTime;
                            let wordEndTime =
                                (span.endTime - span.startTime) *
                                (currentWord + 1) / 
                                words.length +
                                span.startTime;
                            let wordOpacity =
                                (classThis.currentTime - wordStartTime) /
                                (wordEndTime - wordStartTime);
                            classThis.$printDest.append(
                                `<span style="opacity: ${wordOpacity};">${word.replaceAll('\n', '<br> ')}</span> `
                            );
                        }
                    });
                    this.$printDest.append(
                        `<br> `
                    );
                }
            }
        }
        // scroll to bottom
        if (this.$scrollElement)
            this.$scrollElement[0].scrollIntoView(/*{behavior: "smooth"}*/);
    }

}