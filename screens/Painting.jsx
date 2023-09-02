import * as React from 'react';
import {
    StyleSheet, View, SafeAreaView, Image, Text, TouchableOpacity, ImageBackground, ScrollView
} from 'react-native';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const storage = new MMKVLoader().initialize();

const Painting = ({ navigation, route }) => {
    const { painting } = route.params
    if (painting == null) {
        navigation.goBack("Home")
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.goBackButton}>
                <Icon.Button style={{ paddingEnd: 0 }} backgroundColor='rgba(0, 0, 0, 0)' name='arrow-back' size={32} onPress={() => { navigation.goBack() }} />
            </View>
            <View style={{
                backgroundColor:"black",
                height:"100%"
            }}>


            <ImageBackground source={{ uri: painting["imageLink"] }} style={styles.paintingContainer}>

                <LinearGradient
                    // Button Linear Gradient
                    colors={['rgba(28,20,56,0.2)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,1)']}
                    style={{ width: "100%", height: "100%", paddingBottom: 40, justifyContent: 'flex-end' }}>
                    <Text style={styles.title}>{painting["title"]}</Text>
                    <Text style={styles.title}>{painting["artistDisplayName"]}</Text>
                    <Text style={styles.title}>{painting["collection"]}</Text>
                    <Text style={styles.title}>{painting["objectBeginDate"]} -{painting["objectEndDate"]} </Text>
                </LinearGradient>

            </ImageBackground>
            <Text style={{...styles.title,paddingBottom:5}}>Painting Description</Text>
            <ScrollView>


            <Text style={{
                    color:"white",
                    fontSize:18,
                    paddingHorizontal:5,
                    textAlign:"justify",
                    fontFamily:"Jost",
            }}>
                {painting["description"]}
                   </Text>
            </ScrollView>

            </View>


        </SafeAreaView>
    )

}


const styles = StyleSheet.create({
    container: {
        height: "100%",
        display: "flex",
        paddingTop: 10,
        flexDirection: "column",
        backgroundColor: "#14110f"
    },
    goBackButton: {
        position: "absolute",
        zIndex: 2,
        left: 10,
        top: 10
    },
    paintingContainer: {
        height: 500,
        width: "100%",
    },
    title: {
        textAlign: "center",
        color: "white",
        fontFamily: "Jost",
        fontSize: 21
    }





});


export default Painting