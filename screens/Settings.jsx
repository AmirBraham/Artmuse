import { Button, Image } from '@rneui/base';
import * as React from 'react';
import {
    StyleSheet, View, SafeAreaView, FlatList, Text, ImageBackground
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollPicker } from 'react-native-value-picker';

const storage = new MMKVLoader().initialize();


const textArray = ['Never', "15 mins", '30 mins', '1 hour', '3 hours', "1 day"]; // Replace with your text array

const Settings = ({ navigation }) => {
    const [favoritePaintings, setfavoritePaintings] = useMMKVStorage("favorite_paintings", storage, [])
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const nextText = () => {
        // Calculate the next index and wrap around if needed
        const nextIndex = (currentIndex + 1) % textArray.length;
        setCurrentIndex(nextIndex);
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.goBackButton}>
                <Icon.Button style={{ paddingEnd: 0 }} backgroundColor='rgba(0, 0, 0, 0)' name='arrow-back' size={32} onPress={() => { navigation.goBack() }} />
            </View>
            <View style={styles.header} >
                <Text style={styles.logo} >Settings</Text>
            </View>
            <View style={styles.settings}>
                <View style={{display:"flex",flexDirection:"column",height:"100%",flex:2,justifyContent:"space-evenly"}}>
                    <Text style={{
                        color: "white",
                        textAlignVertical: "center",
                        width: "100%",
                        textAlign: "center",
                        
                        fontSize: 19
                    }}>Pick only from Favorites</Text>
                    <Text style={{
                        color: "white",
                        textAlignVertical: "center",
                        width: "100%",
                        textAlign: "center",
                        fontSize: 19
                    }}>Change Wallpaper Every </Text>
                </View>
                <View style={{
                    display: "flex",
                    flexDirection: 'column',
                    height:"100%",
                    
                    justifyContent:"space-evenly",
                    alignItems:"center"
                }}>
                    <View>
                        <BouncyCheckbox
                            size={32}
                            fillColor="red"
                            unfillColor="#FFFFFF"
                            disableText
                            iconStyle={{ borderColor: "red" }}
                            innerIconStyle={{ borderWidth: 0 }}
                            onPress={(isChecked) => { }}
                        />
                    </View>
                    <Button buttonStyle={{ width: 80 }} color="rgba(50,50,50,0.1)" title={textArray[currentIndex]} onPress={nextText} />

                </View>




            </View>
            <View style={styles.paintingsListContainer}>

                <Text style={styles.favoriteWallpapersText}>Favorite Wallpapers</Text>
                {
                    [favoritePaintings].length > 0 ? <FlatList
                        data={favoritePaintings}
                        renderItem={({ index, item: painting }) =>
                            <ImageBackground resizeMode='cover' source={{ uri: painting["imageLink"] }} style={styles.paintingContainer}>
                                <Text style={styles.title}>{painting["title"]}</Text>

                            </ImageBackground>}
                        keyExtractor={item => item.id}
                    /> : null
                }
            </View>
            <View style={styles.credits}>
                <Text style={styles.aboutText}> - About ArtMuse - </Text>
            </View>

        </SafeAreaView>



    )

}


const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
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
    header: {
        flex: 1,
    },
    logo: {
        color: "white",
        textAlign: "center",
        fontFamily: "Jost",
        fontSize: 35,
        width: "100%",

    },
    settings: {
        flex: 2,
        flexDirection:"row",
        alignItems: "center",
        paddingHorizontal:10
    },

    paintingContainer: {
        display: "flex",
        height: 100,
        marginVertical: 8,
        width: "100%",
        flexDirection: "row",
        alignContent: "center"
    },
    paintingsListContainer: {
        flex: 6,
    },
    favoriteWallpapersText: {
        textAlign: "center",
        alignSelf: "center",
        fontSize: 19,
        fontFamily: "Jost",
        width: "100%",
        color: "white"
    },

    title: {
        textAlign: "center",
        alignSelf: "center",
        fontSize: 19,
        fontFamily: "Jost",
        width: "100%",
        color: "white"
    },

    credits: {
        flex: 1,
    },
    aboutText: {
        flex: 1,
        textAlign: "center",
        textAlignVertical: "center",
        height: "100%",
        fontSize: 19,
        fontFamily: "Jost",
        width: "100%",
        color: "white"
    }



});


export default Settings