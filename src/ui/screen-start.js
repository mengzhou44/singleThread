import React, { Component } from 'react';

import { View, Text } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import { colors } from '../constants';

export default class StartScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            clientName: '',
            clientId: -1,
            jobName: '',
            jobId: -1,
        }
    }

    renderSelectClient() {
        return (
            <View style={styles.itemStyle}>
                <Text style={{ fontSize: 18, fontWeight: '600' }} > Client </Text>
                <View style={styles.itemContentStyle}>
                    <Text>Icon </Text>
                    <Icon
                        size={20}
                        style={{ color: colors.gray }}
                        name={'angle-right'}
                    />
                </View>

            </View>
        );
    }
    render() {
        return (
            <View style={styles.containerStyle}>
                <Text style={styles.titleStyle} > Start Scan </Text>
                <View style={styles.contentStyle}>
                    {this.renderSelectClient()}

                </View>

            </View>
        );
    }

}

const styles = {
    containerStyle: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 30
    },

    titleStyle: {
        fontSize: 24,
        textAlign: 'center'
    },
    contentStyle: {
        flex: 1,
        borderWidth: 2,
        borderColor: colors.gray,
        padding: 10,
        margin: 10
    },
    itemStyle: {
        paddingBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray
    },
    itemContentStyle: {

        flexDirection: 'row',
        justifyContent: 'flex-end'
    },

}