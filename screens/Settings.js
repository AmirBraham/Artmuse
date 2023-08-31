import * as React from 'react';
import { StyleSheet, Text, View,Button } from 'react-native';


const Settings = ({navigation}) => {


    return (
        <View style={styles.container}>
            <Text>Hello from settings !</Text>
            <Button title="Go back" onPress={() => navigation.goBack()} />
        </View>


    )

}


const styles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: "#14110f"
    },


});


export default Settings

