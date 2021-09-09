interface ISound {
    key: string,
    time: number
}
interface ISoundEl {
    element: HTMLAudioElement,
    key: string
}

class Drumkit {
    sounds: Array<HTMLAudioElement> = [];
    constructor() {
        document.querySelectorAll('audio').forEach((el) => {
            this.sounds.push(el);
        })
        console.log(this.sounds);
        new DrumkitUI(this.sounds);
    }
}

const CHANNELS_COUNT = 4;

class DrumkitUI {
    statsSection = document.getElementById('UI-section');
    channels: ISound[][] = [[]];
    sounds: ISoundEl[] = [];
    soundButtons: HTMLButtonElement[] = [];
    channelsDOMElements: {
        playBtn: HTMLButtonElement,
        recordBtn: HTMLButtonElement,
        progressBar: HTMLSpanElement
    }[] = [];
    activeChannel: number = null;
    constructor(sounds: HTMLAudioElement[]) {

        this.sounds = sounds.map((element) => ({
            element,
            key: element.dataset.key
        }));
        document.body.addEventListener('keypress', (ev) => this.onKeyDown(ev));

        this.renderButtons(sounds);
        this.createChannels();
    }

    renderButtons(sounds: HTMLAudioElement[]) {
        const container = document.getElementById('buttons');
        sounds.forEach(element => {
            const soundBtn = document.createElement('button');
            soundBtn.innerText = `${element.dataset.key}`;
            soundBtn.dataset.soundKey = element.dataset.key;
            soundBtn.addEventListener('click', (ev) => this.onClick(element.dataset.key, ev));
            this.soundButtons.push(soundBtn);
            container.appendChild(soundBtn);
        });
    }

    onClick(key: string, ev: MouseEvent) {
        const time = ev.timeStamp;
        if (this.activeChannel !== null) {
            this.channels[this.activeChannel].push({
                key: key,
                time: time
            });
        }
        this.playSound(key);
    }

    onKeyDown(ev: KeyboardEvent) {
        const key = ev.key;
        const time = ev.timeStamp;
        if (this.activeChannel !== null) {
            this.channels[this.activeChannel].push({
                key: key,
                time: time
            });
        }
        console.log(this.channels);
        this.playSound(key);
    }

    playSound(key: string = null) {
        if (key) {
            const btn = this.soundButtons.find((el) => el.dataset.soundKey === key);
            const element = this.sounds.find((v) => v.key === key).element;
            element.currentTime = 0;
            element.play();
            this.giveAnimation(btn);
        }
    }

    giveAnimation(btn: HTMLButtonElement) {
        const animSpan = document.createElement('span');
        btn.classList.add("playing");
        btn.appendChild(animSpan);
        setTimeout(() => {
            btn.classList.remove("playing");
        }, 100);
        animSpan.addEventListener('animationend', () => {
            animSpan.remove();
        })
    }

    createChannels() {
        const container = document.getElementById('channels');
        for (let i = 0; i < CHANNELS_COUNT; i++) {
            const channelContainer = document.createElement('div');
            channelContainer.classList.add("channelContainer");

            const recordBtn = document.createElement('button');
            recordBtn.className = `recordBtn`;
            recordBtn.addEventListener('click', (ev) => this.activateChannel(i, ev));
            channelContainer.appendChild(recordBtn);

            const playBtn = document.createElement('button');
            playBtn.className = `playBtn`;
            playBtn.disabled = true;
            const s = playBtn.addEventListener('click', (ev) => this.onPlayStopChannel(i));
            channelContainer.appendChild(playBtn);
 
            const progressBarContainer = document.createElement('div');
            progressBarContainer.className = `progressBar`;
            const progressBar = document.createElement('span');
            progressBar.addEventListener('animationend', () => {
                progressBar.style.animation = null;
                this.channelsDOMElements[i].playBtn.disabled = false;
            })
            progressBarContainer.appendChild(progressBar);
            channelContainer.appendChild(progressBarContainer);

            this.channelsDOMElements.push({
                playBtn,
                recordBtn,
                progressBar
            });
            container.appendChild(channelContainer);
        }
    }

    activateChannel(channelIndex: number, event: MouseEvent) {
 
        this.channels[channelIndex] = [{
            time: event.timeStamp,
            key: null
        }];
        this.activeChannel = channelIndex;
        this.channelsDOMElements.forEach(el => {
            el.recordBtn.disabled = true;
        })
        this.channelsDOMElements[channelIndex].playBtn.disabled = false;
        this.channelsDOMElements[channelIndex].playBtn.classList.add('stopBtn');
    }

    onPlayStopChannel(channelIndex: number) {
        if (this.activeChannel === channelIndex) {
            this.stopRecording(channelIndex);
        }
        else {
            
            const channel = this.channels[channelIndex];
            let prevTime = channel[0].time;
            this.initPlayingBehavior(channelIndex);

            channel.forEach((sound: ISound) => {
                const time = sound.time - prevTime;
                setTimeout(() => {
                    this.playSound(sound.key);
                }, time);
            })
        }
    }

    stopRecording(channelIndex: number) {
        this.channelsDOMElements[channelIndex].playBtn.classList.remove('stopBtn');
        const channel = this.channels[channelIndex];
        const recordingTime = channel[channel.length - 1].time - channel[0].time;
        this.channelsDOMElements[channelIndex].progressBar.parentElement.querySelectorAll('time').forEach(v => v.remove());
        this.channelsDOMElements.forEach(el => {
            el.recordBtn.disabled = false;
        })
        if (recordingTime) {
            channel.forEach((sound: ISound) => {
                const timeMoment = document.createElement('time');
                const percentageTime = (sound.time - channel[0].time) / recordingTime * 100;
                console.log(percentageTime)
                timeMoment.className = "timeMoment";
                timeMoment.style.left = `${percentageTime}%`;
                this.channelsDOMElements[channelIndex].progressBar.parentElement.appendChild(timeMoment);
            })
        } else {
            this.channelsDOMElements[channelIndex].playBtn.disabled = true;
        }
        this.activeChannel = null;
    }

    initPlayingBehavior(channelIndex: number) {
        this.channelsDOMElements[channelIndex].playBtn.disabled = true;


        const channel = this.channels[channelIndex];
        let prevTime = channel[0].time;
        const recordingTime = `${(channel[channel.length - 1].time - prevTime).toFixed()}ms`;
        this.channelsDOMElements[channelIndex].progressBar.style.animation = ``;
        this.channelsDOMElements[channelIndex].progressBar.style.animation = `progressBarAnim ${recordingTime} forwards linear`;
    }
}

const drumkit = new Drumkit();