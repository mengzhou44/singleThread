import ScanJob from './job-scan';
import { getLocation } from './gps';

import Tags from '../tags';
import Scan from '../scan';


export default class ReaderStub {

    constructor(jobType) {
        if (jobType === 'scan') {
            this.job = new ScanJob();
        }
    }

    async getRandomTagNumber(knownTags) {
        var result;
        var count = 0;

        for (var prop in knownTags) {
            if (Math.random() < 1 / ++count) {
                result = prop;
            }
        }

        return result;
    }

    start(onMatFound, onError) {
        this.job.onMatFound = onMatFound;
        this.job.onError = onError;

        this.timer = setInterval(async () => {
            const knownTags = await new Tags().getTags();
            const tagNumber = await this.getRandomTagNumber(knownTags);
            const location = await getLocation();
            this.job.knownTags = knownTags;
            this.job.processTag(tagNumber, location);
        }, 1000);

        this.job.start();
    }

    processBatch(data) {
        this.stop();
        this.job.processBatch(data);
        setTimeout(() => {
            this.timer = setInterval(async () => {
                const knownTags = await new Tags().getTags();
                const tagNumber = await this.getRandomTagNumber(knownTags);
                const location = await getLocation();
                this.job.knownTags = knownTags;
                await this.job.processTag(tagNumber, location);
            }, 1000);

            this.job.start();
        }, 500);
    }

    stop() {
        this.job.stop();
        clearInterval(this.timer);
        this.timer = null;
    }

    async stopScan(scan) {
        scan.mats = this.job.getData();
        await new Scan().addNewScan(scan);
        this.job.clearData();
        this.stop();
    }
}





