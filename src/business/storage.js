import { AsyncStorage } from 'react-native';
import _ from 'lodash';

export const save = async (key, obj) => {
    const temp = JSON.stringify(obj);
    await AsyncStorage.setItem(key, temp);
};

export const get = async (key) => {
    const found = exists(key);
    if (found === false) return null;

    const temp = await AsyncStorage.getItem(key);
    return JSON.parse(temp);
};


export const exists = async (key) => {
    const keys = AsyncStorage.getAllKeys();
    const found = _.find(keys, key);
    return (found !== null);
};


