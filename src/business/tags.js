
import axios from 'axios';
import _ from 'lodash';
import { get, save, exists } from './storage';

import Settings from './settings';

export default class Tags {

    constructor() {
    }

    async getTags() {
        let tags = await get('tags');

        if (tags === null) {
            await this.downloadTags();
            tags = await get('tags');
        }
        return tags;
    }

    findMatId(table, tagNumber) {
        if (table[tagNumber]) {
            return table[tagNumber];
        }
        return "-1";
    }

    async downloadTags() {
        const settings = new Settings().get();
        const tagsUrl = `${settings.portalUrl}/tags`;
        try {
            const res = await axios.get(tagsUrl);
            let temp = {};

            _.map(res.data, (item) => {
                temp[item[0]] = item[1];
            });

            await save('tags', temp);

            return { success: true };
        } catch (error) {
            return { success: false };
        }
    }
}
