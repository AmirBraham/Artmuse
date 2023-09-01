import * as React from 'react';
import useFetchPaintings from '../hooks/useFetchPaintings';
import { StyleSheet, Text, View, ActivityIndicator, Alert, Image } from 'react-native';
import ManageWallpaper, { TYPE } from 'react-native-manage-wallpaper';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import { TinderCard } from 'rn-tinder-card';
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const storage = new MMKVLoader().initialize();

const Home = ({ navigation }) => {
    const [page, setPage] = useMMKVStorage('page', storage, 1);

    const [currentPainting, setCurrentPainting] = useMMKVStorage('current_painting', storage, null);

    const { data, isLoading, isError, hasNextPage, fetchNextPage } = useFetchPaintings(page);
    const [isLoadingWallpaper, setIsLoadingWallpaper] = React.useState(false)
    const [paintings, setPaintings] = React.useState([]);
    const [alreadyViewedPaintings, setAlreadyViewedPaintings] = useMMKVStorage('viewed_paintings', storage, []);
    const [favoritePaintings,setfavoritePaintings] = useMMKVStorage("favorite_paintings",storage,[])

    const addToFavorites = () => {
        setfavoritePaintings(prevFavoritePaintings=>[...prevFavoritePaintings,currentPainting])
    }

    const removeFromFavorites = () => {
        setfavoritePaintings(prevFavoritePaintings=>prevFavoritePaintings.filter(painting=>painting["id"] != currentPainting["id"]))
    }

    const isPaintingInFavorites = () => {
        return favoritePaintings.find(painting => painting["id"] == currentPainting["id"]) != null
    }

    const outOfFrame = (id) => {
        console.log(id + ' left the screen!')
        setPaintings((oldPaintings) => oldPaintings.filter((painting) => painting["id"] != id))
        setAlreadyViewedPaintings(prevAlreadyViewedPaintings => [...prevAlreadyViewedPaintings, id])
        console.log("updating currentWallpaper")

    }
    const [paintingCards, setPaintingsCards] = React.useState([])


    React.useEffect(() => {
    }, [currentPainting])

    React.useEffect(() => {
        if (data) {

            let newFetchedPaintings = data.pages[data.pages.length - 1]["data"]
            let uniquePaintings = [...newFetchedPaintings, ...paintings].filter((value, index, array) => array.indexOf(value) === index)
            setPaintings((oldPaintings) => {

                let newPaintings = uniquePaintings.filter(painting => alreadyViewedPaintings.indexOf(painting["id"]) === -1)
                return [...newPaintings]

            })
        }
    }, [data])

    React.useEffect(() => {

        if (paintings.length == 0) {
            loadNextPageData()
        } else {
            setCurrentPainting(paintings[paintings.length - 1])

        }
    }, [paintings])

    const loadNextPageData = () => {
        if (hasNextPage) {
            fetchNextPage().then(res => {
                setPage((prevPage) => prevPage + 1)
            });
        }
    };



    const callback = res => {
        setIsLoadingWallpaper(false)
        console.log("done")
    };

    const setWallpaper = () => {
        setIsLoadingWallpaper(true)
        ManageWallpaper.setWallpaper(
            {
                uri: currentPainting["imageLink"],
            },
            callback,
            TYPE.BOTH,
        );


    };

    const setPriority = (index) => {
        const l = paintings.length
        if (index / l > 0.75) {
            return FastImage.priority.high
        } else if (index / l > 0.7) {
            return FastImage.priority.normal
        }
        return FastImage.priority.low
    }
    console.log(favoritePaintings)
    React.useEffect(() => {
        let cards = []
        if (paintings.length != 0) {
            paintings.map((painting, index) => {
                cards.push({
                    "painting": painting,
                    "priority": setPriority(index)
                })
            })
        }
        setPaintingsCards(cards)
    }, [paintings])


    if (isLoading) return <Text>Loading...</Text>
    if (isError) return <Text>An error occurred while fetching data</Text>

    return (
        <GestureHandlerRootView style={styles.container}>
            {
                isLoadingWallpaper && <View style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    zIndex: 2,
                    backgroundColor: 'rgba(0,0,0,0.7)'
                }} >

                    <ActivityIndicator style={styles.cardContainer} size={'large'} color={'rgb(172,20,87)'}>

                    </ActivityIndicator>
                </View>

            }
            <View style={{position:"absolute",right:10,top:10,zIndex:2}}  >
            <Icon.Button name='settings' onPress={() => navigation.navigate("Settings")}  style={{paddingEnd:0}} backgroundColor='rgba(0, 0, 0, 0.09)' size={28} borderRadius={32} title={"Set as wallpaper"} />
            </View>

            <View style={styles.header} >
                <Text style={styles.logo} >ArtMuse</Text>

                <Text style={styles.logoSubtitle} >Discover your next favorite wallpaper</Text>

            </View>


            {
                paintingCards.length > 0 ?
                    <View style={styles.wrapper}>
                        {
                            paintingCards.map(card =>
                                <View style={styles.cardContainer}  key={card["painting"]["id"]}>
                                    <TinderCard
                                        cardWidth={350}
                                       

                                        cardHeight={650}

                                        cardStyle={styles.card}

                                        onSwipedRight={() => {
                                            outOfFrame(card["painting"]["id"])
                                        }}
                                        onSwipedTop={() => {
                                            outOfFrame(card["painting"]["id"])
                                        }}
                                        onSwipedLeft={() => {
                                            outOfFrame(card["painting"]["id"])
                                        }}
                                    >
                                        <View style={styles.card} >
                                            <FastImage
                                                key={card["painting"]["id"]}
                                                fallback={Platform.OS === 'android'}

                                                source={{ uri: card["painting"]["imageLink"], priority: card["priority"] }}
                                                defaultSource={require('../img/placeholder.png')}
                                                onLoadStart={() => {
                                                    console.log("started loading  :", card["painting"]["title"])
                                                    console.log("priority : ", card["priority"])

                                                }}

                                                imageStyle={styles.image}
                                                style={styles.cardImage}>
                                                <LinearGradient
                                                    // Button Linear Gradient
                                                    colors={['rgba(28,20,56,0.2)','rgba(28,20,56,0.3)', 'rgba(0,0,0,1)']}
                                                    style={{ width: "100%", height: "100%", paddingBottom: 60, justifyContent: 'flex-end', alignpaintings: 'center' }}>
                                                    <Text style={{ color: "white",fontFamily:"Jost",fontWeight:200,paddingLeft:15, fontSize: 30, textAlign: "left" }}>{card["painting"]["title"]} </Text>
                                                    <Text style={{ color: "white",fontFamily:"Jost",fontWeight:"thin",paddingLeft:20, fontSize: 21, textAlign: "left" }}>{card["painting"]["artistDisplayName"]}</Text>

                                                </LinearGradient>

                                            </FastImage>
                                            </View>



                                    </TinderCard>
                                </View>
                            )
                        }
                    </View>

                    : <ActivityIndicator style={styles.cardContainer} size={'large'} color={'rgb(172,20,87)'} />
            }
            <View style={styles.actions}>
                <Icon.Button name='wallpaper' onPress={setWallpaper} style={styles.wallpaperButton} backgroundColor='rgba(0, 0, 0, 0.09)' size={48} borderRadius={32} title={"Set as wallpaper"} />
                <Icon.Button color={isPaintingInFavorites() ? "red" : "white"} name={isPaintingInFavorites() ? 'favorite' : 'favorite-outline'} size={48} onPress={isPaintingInFavorites() ? removeFromFavorites : addToFavorites} style={styles.wallpaperButton} backgroundColor='rgba(0, 0, 0, 0.09)'  borderRadius={32} title={"Set as wallpaper"} />
                <Icon.Button name='read-more' onPress={setWallpaper} style={styles.wallpaperButton} backgroundColor='rgba(0, 0, 0, 0.09)' size={48} borderRadius={32} title={"Set as wallpaper"} />

            </View>



        </GestureHandlerRootView>


    )

}



const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#14110f"
    },
    header: {
        flex: 1,

        zIndex:-1,
        flexDirection: 'column',
    },
    logo: {
        color: "white",
        textAlign: "center",
        fontFamily: "Jost",
        fontSize: 45,
        width: "100%",

    },
    logoSubtitle:{
        color:"white",
        textAlign: "center",
        fontWeight:"200",
        fontFamily: "Jost",
        fontSize: 15,
        width: "100%",
    },
    settingsButton: {
        flex: 1,
        backgroundColor: "transparent"
    },
    wrapper: {
        flex: 9,
    },
    cardContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderRadius: 48,
    },

    cardImage: {
        width: '100%',
        height: '100%',
        borderRadius: 48,
    },
    actions: {
        display: "flex",
        position: "absolute",
        bottom: 10,
        right: 0,
        left: 0,

        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 10,
    },
    wallpaperButton: {
        paddingEnd: 0,

    },
    favoriteButton: {
        flex: 1

    }

});



export default Home
