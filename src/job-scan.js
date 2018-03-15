import _ from 'lodash';
import Tags from './tags';


export default class ScanJob {

    constructor() {
        this.onMatFound = null;
        this.onError = null;

        this.mats = [];
        this.matsInRange = [];
        this.knownTags = new Tags().getTags();
        this.matsInRangeTimer = null;
        this.contamination = { contaminated: 0, decontaminated: 0 };
    }

    start() {
        this.matsInRangeTimer = setInterval(
            this.renewMatsInRange.bind(this),
            1000);
    }

    addTag(tagNumber, mat) {
        const found = _.find(mat.tags, item => item === tagNumber);
        if (!found) {
            mat.tags.push(tagNumber);
        }
    }

    getTagsInRange() {
        let result = [];
        _.map(this.matsInRange, (mat) => {
            result.push(mat.tags.join());
        })
        return result.join();
    }

    updateMatsInRange(tagNumber) {
        const matId = new Tags().findMatId(this.knownTags, tagNumber);
        let matFound = _.find(this.matsInRange, (mat) => mat.matId === matId);
        if (matFound) {
            matFound.timeStamp = Math.floor(Date.now());  //update mat time stamp 
            this.addTag(tagNumber, matFound);
        } else {
            const timeStamp = Math.floor(Date.now());
            const mat = {
                matId,
                timeStamp,
                tags: [tagNumber]
            };
            this.matsInRange.push(mat);
        }
    }

    processTag(tagNumber, location) {
        const matId = new Tags().findMatId(this.knownTags, tagNumber);
        if (matId === "-1") return;

        this.updateMatsInRange(tagNumber);

        const timeStamp = Math.floor(Date.now());
        const mat = {
            matId,
            gps: [location.longitude, location.latitude],
            timeStamp
        };

        let found = _.find(this.mats, (mat) => mat.matId === matId);
        if (!found) {
            this.mats.push(mat);
            this.onMatFound(
                {
                    found: this.mats.length,
                    inRange: this.matsInRange.length,
                    contamination: this.contamination,
                    tagsInRange: this.getTagsInRange()
                }
            );
        } else {
            found.timeStamp = Math.floor(Date.now());
        }
    }


    processBatch(data) {
        _.map(this.matsInRange, mat => {
            const found = _.find(this.mats, (item) => item.matId === mat.matId);
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    found[prop] = data[prop];
                }
            }
        });

        this.matsInRange = [];
        this.contamination = { contaminated: 0, decontaminated: 0 };

        _.map(this.mats, mat => {

            if (mat.contaminated !== undefined) {
                if (mat.contaminated) {
                    this.contamination.contaminated++;
                } else {
                    this.contamination.decontaminated++;
                }

            }
        });

        console.log('mats', this.mats);

        const result = {
            found: this.mats.length,
            inRange: this.matsInRange.length,
            contamination: this.contamination
        };

        this.onMatFound(result);
    }


    renewMatsInRange() {
        this.matsInRange = _.filter(this.matsInRange, (mat) => {
            const timeStamp = Math.floor(Date.now());
            return timeStamp < (mat.timeStamp + 2000)
        });

        try {

            const result =
                {
                    found: this.mats.length,
                    inRange: this.matsInRange.length,
                    contamination: this.contamination,
                    tagsInRange: this.getTagsInRange()
                };

            this.onMatFound(result);

        } catch (err) {
            console.log("main window was destroyed!");
        }

    }

    getData() {
        return this.mats;
    }

    clearData() {
        this.mats = [];
        this.matsInRange = [];
        this.contamination = { contaminated: 0, decontaminated: 0 };
    }

    stop() {
        clearInterval(this.matsInRangeTimer);
        this.matsInRangeTimer = null;
    }
}


