import net from 'react-native-tcp';
import React, { Component } from 'react';

import {
    Platform,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';


import ReaderStub from '../business/reader/reader-stub';
import File from '../business/file';


export default class ScanScreen extends Component {

    constructor(props) {
        super(props);
        this.server = null;
        this.reader = new ReaderStub('scan');
        this.state = {
            found: 0,
            inRange: 0,
            contamination: {},
            tagsInRange: ''
        }
    }

    onMatFound(result) {
        this.setState({
            scans: [],
            found: result.found,
            inRange: result.inRange,
            contamination: result.contamination,
            tagsInRange: result.tagsInRange
        })
    }

    render() {
        return (
            <View style={styles.container}>

                <TouchableWithoutFeedback
                    onPress={() => {
                        let connected = this.reader.start(
                            this.onMatFound.bind(this),
                            () => this.setState({ data: 'error data.' })
                        );
                        if (connected === false) {
                            this.setState({ data: 'Can not connect to reader!' });
                        }
                    }
                    }
                ><View
                    style={{ borderColor: 'black', borderWidth: 1, padding: 10 }}
                >
                        <Text>
                            Connect
         </Text>
                    </View>
                </TouchableWithoutFeedback>
                <Text>Mats Found: {this.state.found} </Text>
                <Text>Decontaminated: {this.state.contamination.decontaminated} </Text>
                <Text>Contaminated: {this.state.contamination.contaminated} </Text>
                <View>
                    <Text>Mats In Range </Text>
                    <Text>{this.state.tagsInRange} </Text>
                </View>
                <View style={styles.buttonsContainer}>

                    <TouchableWithoutFeedback
                        onPress={() => this.reader.processBatch({ contaminated: true })
                        }
                    ><View
                        style={{ borderColor: 'black', borderWidth: 1, padding: 10 }}
                    >
                            <Text>
                                Contaminated
         </Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onPress={() => this.reader.processBatch({ contaminated: false })
                        }
                    ><View
                        style={{ borderColor: 'black', borderWidth: 1, padding: 10 }}
                    >
                            <Text>
                                Decontaminated
         </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                <TouchableWithoutFeedback
                    onPress={async () => {
                        await this.reader.stopScan({
                            clientId: 123,
                            jobId: 5,
                            clientName: 'Easy Express',
                            jobName: 'Install Mats'
                        });

                        const scans = await new File().fetchScans();
                        this.setState({
                            scans
                        });
                        console.log(JSON.stringify(scans, null, 4));
                    }}
                ><View
                    style={{ borderColor: 'black', borderWidth: 1, padding: 10 }}
                >
                        <Text>
                            Stop Scan
               </Text>
                    </View>
                </TouchableWithoutFeedback>

            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    buttonsContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    }
};
