import ScanJob from './job-scan';
import { getLocation } from './gps';

const Tags = require('./tags');


export default class ReaderStub {

    constructor(jobType) {
        if (jobType === 'scan') {
            this.job = new ScanJob();
        }

    }

    getRandomTagNumber() {
        var result;
        var count = 0;
        const knownTags = new Tags().getTags();
        for (var prop in knownTags)
            if (Math.random() < 1 / ++count)
                result = prop;
        return result;
    }

    start(onMatFound, onError) {
        this.job.onMatFound = onMatFound;
        this.job.onError = onError;

        this.timer = setInterval(async () => {
            const tagNumber = this.getRandomTagNumber();
            const location = await getLocation();
            this.job.processTag(tagNumber, location);
        }, 1000);

        this.job.start();
    }

    processBatch(data) {
        this.stop();
        this.job.processBatch(data);
        setTimeout(() => {
            this.timer = setInterval(async () => {
                const tagNumber = this.getRandomTagNumber();
                const location = await getLocation();
                await this.job.processTag(tagNumber, location);
            }, 1000);

            this.job.start();
        }, 500);
    }

    getData() {
        return this.job.getData();
    }

    clearData() {
        this.job.clearData();
    }

    stop() {
        this.job.stop();
        clearInterval(this.timer);
        this.timer = null;
    }
}



