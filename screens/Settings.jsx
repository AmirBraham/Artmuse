import { Button, Image } from '@rneui/base';
import * as React from 'react';
import {
    StyleSheet, View, SafeAreaView, FlatList, Text, ImageBackground, TouchableOpacity , Animated
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ManageWallpaper, { TYPE } from 'react-native-manage-wallpaper';
import notifee from '@notifee/react-native';
import BackgroundFetch from "react-native-background-fetch";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { RectButton } from 'react-native-gesture-handler';



const storage = new MMKVLoader().initialize();
const textArray = ['Never', "15 mins"];

const Settings = ({ navigation }) => {
    const [favoritePaintings, setfavoritePaintings] = useMMKVStorage("favorite_paintings", storage, [])
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [runningInBackground, setRunningInBackground] = useMMKVStorage("running_background", storage, false)

    const nextText = async () => {
        const channelId = await notifee.createChannel({
            id: 'artmuse',
            name: 'Artmuse Channel',
        });
        await notifee.requestPermission()
        if (runningInBackground) {
            await notifee.displayNotification({
                title: 'Wallpaper will change every 15 minutes',
                body: '',
                android: {
                    channelId
                },
            });
        } else {
            await notifee.cancelDisplayedNotifications()
        }

        const nextIndex = (currentIndex + 1) % textArray.length;
        setCurrentIndex(nextIndex);
        setRunningInBackground(prevRunningInBackground => {
            if (!prevRunningInBackground) {

                BackgroundFetch.configure(
                    {
                        minimumFetchInterval: 15,
                        // minimum interval in minutes
                        enableHeadless: true, // start when the device boots up
                        stopOnTerminate: false, // continue running after the app is terminated
                        startOnBoot: true,
                        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
                        periodic: true
                    },
                    async (taskId) => {
                        if (favoritePaintings.length > 0) {
                            const randomIndex = Math.floor(Math.random() * favoritePaintings.length)
                            const painting = favoritePaintings[randomIndex]
                            ManageWallpaper.setWallpaper(
                                {
                                    uri: painting["imageLink"],
                                },
                                (res) => { console.log(res) },
                                TYPE.BOTH,
                            );
                        }

                        BackgroundFetch.finish(taskId); // signal task completion
                    }, async (taskId) => {  // <-- Task timeout callback
                        // This task has exceeded its allowed running-time.
                        // You must stop what you're doing and immediately .finish(taskId)
                        BackgroundFetch.finish(taskId);
                    }
                );
            } else {
                BackgroundFetch.stop()
            }
            console.log(!prevRunningInBackground)
            return !prevRunningInBackground
        })



    };

    renderLeftActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-20, 0, 0, 1],
        });
        return (
            <RectButton style={styles.leftAction} onPress={close}>
                <Animated.Text
                    style={[
                        styles.actionText,
                        {
                            transform: [{ translateX: trans }],
                        },
                    ]}>
                    Remove
                </Animated.Text>
            </RectButton>
        );
    };

    const swipeableRow = React.useRef()

    const updateRef = (ref) => {
        swipeableRow.current = ref
    }

    const close = () => {
        swipeableRow?.current?.close()
    }

    const renderRightAction = (
        text,
        color,
        x,
        progress
    ) => {
        const trans = progress.interpolate({
            inputRange: [0,0.5, 1],
            outputRange: [x/2,5, 0],
        });
        const pressHandler = () => {
            close();
            // eslint-disable-next-line no-alert
            window.alert(text);
        };

        return (
            <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
                <RectButton
                    style={[styles.rightAction, { backgroundColor: color }]}
                    onPress={pressHandler}>
                    <Text style={styles.actionText}>{text}</Text>
                </RectButton>
            </Animated.View>
        );
    };
    /*
    const renderRightActions = (
        progress,
        _dragAnimatedValue
    ) => (
        <View
            style={{
                width: 124,
                flexDirection: 'row',
            }}>
            {renderRightAction('More', 'transparent', 32, progress)}
        </View>
    );
    */
    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.goBackButton}>
                <Icon.Button style={{ paddingEnd: 0 }} backgroundColor='rgba(0, 0, 0, 0)' name='arrow-back' size={32} onPress={() => { navigation.goBack() }} />
            </View>
            <View style={styles.header} >
                <Text style={styles.logo} >Settings</Text>
            </View>
            <View style={styles.settings}>
                <View style={{ display: "flex", flexDirection: "column", height: "100%", flex: 2, justifyContent: "space-evenly" }}>

                    <Text style={{
                        color: "white",
                        textAlignVertical: "center",
                        width: "100%",
                        textAlign: "center",
                        fontSize: 19
                    }}>Change Wallpaper Every </Text>
                    <Text style={{
                        color: "white",
                        textAlignVertical: "center",
                        width: "100%",
                        textAlign: "center",

                        fontSize: 19
                    }}>Pick only from Favorites</Text>
                </View>

                <View style={{
                    display: "flex",
                    flexDirection: 'column',
                    height: "100%",

                    justifyContent: "space-evenly",
                    alignItems: "center"
                }}>

                    <Button buttonStyle={{ width: 80 }} color="rgba(50,50,50,0.1)" title={textArray[currentIndex]} onPress={nextText} />
                    <View>
                        <BouncyCheckbox
                            size={36}
                            fillColor="rgba(22,20,18)"
                            unfillColor="rgba(100,100,100,0.6)"
                            disableText
                            isChecked={true}
                            disabled
                            iconStyle={{ borderColor: "red" }}
                            innerIconStyle={{ borderWidth: 0 }}
                            onPress={(isChecked) => { }}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.paintingsListContainer}>

                <Text style={styles.favoriteWallpapersText}>Favorite Wallpapers {favoritePaintings.length == 0 ? "will appear here" : null}</Text>
                {
                    favoritePaintings.length > 0 ? <FlatList
                        data={favoritePaintings}
                        renderItem={({ index, item: painting }) =>
                        <View style={{marginVertical:8}}>
                            <Swipeable
                                ref={updateRef}
                                friction={2}
                                enableTrackpadTwoFingerGesture
                                leftThreshold={30}
                                rightThreshold={40}
                                renderLeftActions={renderLeftActions}
                                onSwipeableOpen={(direction) => {
                                    console.log(`Opening swipeable from the ${direction}`);
                                    if(direction == "left") {
                                        console.log(`Removing painting from favorites : ${painting["title"]}`)
                                        setTimeout(() => {
                                            setfavoritePaintings(prevFavoritePaintings=>prevFavoritePaintings.filter(item=>item["id"] != painting["id"]))

                                        },1000)

                                    }
                                }}
                                onSwipeableClose={(direction) => {
                                    console.log(`Closing swipeable to the ${direction}`);
                                }}>
                                    <View>


                                <TouchableOpacity activeOpacity={0.9} onPress={() => {
                                    navigation.navigate("Painting", {
                                        painting
                                    }) 
                                }}>

                                    <ImageBackground resizeMode='cover' source={{ uri: painting["imageLink"] }} style={styles.paintingContainer}>
                                        <Text style={styles.title}>{painting["title"]}</Text>

                                    </ImageBackground>
                                </TouchableOpacity>
                                </View>

                            </Swipeable>
                            </View>

                        }
                        keyExtractor={item => item.id}
                    /> : null
                }
            </View>
            <View style={styles.credits}>
                <Text style={styles.aboutText}> - About ArtMuse -  </Text>

                <TouchableOpacity onPress={() => {
                    storage.clearStore()
                    storage.clearMemoryCache()
                }} >

                    <Text style={{
                        textAlign: "center",
                        textAlignVertical: "center",
                        fontSize: 18,
                        fontFamily: "Jost",
                        width: "100%",
                        color: "white"
                    }}>Clear Cache</Text>
                </TouchableOpacity>
            </View>

        </GestureHandlerRootView>



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
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10
    },

    paintingContainer: {
        display: "flex",
        height: 100,
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
        paddingBottom: 10
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
    },
    leftAction: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor:"red"
    },
    actionText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'transparent',
        padding: 10,
    },
    rightAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    }



});


export default Settings