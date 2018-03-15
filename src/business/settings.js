import { get, exists, save } from './storage';

export default class Settings {
    async get() {
        const settings = await get('settings');

        if (settings) {
            return settings;
        }
        return {
            portalUrl: 'https://portal.easyexpresssoft.com',
            readers: {
                current: 'speedway',
                speedway: {
                    'host': 'speedwayr-xx-xx-xx.local',
                    'port': 14250
                }
            }
        };
    }

    save(settings) {
        save('settings', settings);
    }
}
