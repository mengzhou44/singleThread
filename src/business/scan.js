import uuid from 'uuid/v4';
import _ from 'lodash';
import axios from 'axios';

import File from './file';

export default class Scan {
    constructor() {

    }

    convertMatsToPortalFormat(mats) {
        return _.map(mats, (mat) => {
            const converted = {
                id: mat.matId,
                tags: mat.tags,
                gps: mat.gps,
                time: mat.timeStamp,
                contaminated: mat.contaminated,
                branded: mat.branded
            };
            return converted;
        });
    }

    convertScanToPortalFormat(scan) {
        const gps = scan.mats.length > 0 ? scan.mats[0].gps : [];
        const converted = {
            client: scan.clientName,
            clientid: scan.clientId,
            job: scan.jobName,
            jobid: scan.jobId,
            gps,
            time: scan.created,
            deviceid: scan.deviceId,
            mats: this.convertMatsToPortalFormat(scan.mats),
        }

        return converted;
    }

    async clearScans() {
        await new File().clearScans();
    }

    async addNewScan(scan) {
        if (scan.mats.length === 0) {
            return;
        }

        const converted = this.convertScanToPortalFormat(scan);
        await new File().saveScan(converted);
    }

    async backupUploaded(scan) {
        await new File().saveUploaded(scan);
    }

    async backupFailed(scan) {
        await new File().saveFailed(scan);
    }

    async uploadScans() {

        const { portalUrl } = new Settings().get();

        try {

            const scans = await new File().fetchScans();

            if (scans.length === 0) {
                return Promise.resolve({ success: true });
            }

            const promises = _.map(scans, (scan) => {
                scan.scanid = uuid();
                return axios.post(`${portalUrl}/field-data`, JSON.stringify(scan));
            })

            return Promise.all(promises).then(values => {

                const failedValues = _.filter(values, value => value.data !== "Success");
                const uploadedValues = _.filter(values, value => value.data === "Success");

                _.map(uploadedValues, (value) => {
                    const scan = _.find(scans, (scan) => scan.scanid === value.data.scanid);
                    this.backupUploaded(scan);
                });

                _.map(failedValues, (value) => {
                    const scan = _.find(scans, (scan) => scan.scanid === value.data.scanid);
                    this.backupFailed(scan);
                });

                if (failedValues.length > 0) {
                    throw `upload failed - ${failedValues[0].data.error}`;
                }

                return Promise.resolve({ success: true });

            }).catch(err => {
                return Promise.resolve({ success: false, error: err });
            })

        } catch (ex) {
            return Promise.resolve({ success: false, error: ex });
        }
    }

}



