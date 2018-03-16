import { get, set } from './storage';

export default class File {
    constructor() {
    }

    async saveScan(scan) {
        await this.save(scan, 'scans');
    }


    async saveUploaded(scan) {
        await this.save(scan, 'uploaded');
    }

    async saveFailed(scan) {
        await this.save(scan, 'failed');
    }

    async save(scan, folder) {
        let scans = await get(folder);
        if (scans === null) {
            scans = [];
        }
        scans.push({
            scan
        });
        await set(folder, scans);
    }

    async fetchUploaded() {
        return await this.fetch('uploaded');
    }

    async fetchFailed() {
        return await this.fetch('failed');
    }

    async fetchScans() {
        return await this.fetch('scans');
    }

    async fetch(folder) {
        let scans = await get(folder);
        if (scans === null) {
            scans = [];
        }
        return scans;
    }

    async clearScans() {
        await set(null, 'scans');
    }
}