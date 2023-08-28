import * as React from 'react';
import useFetchPaintings from '../hooks/useFetchPaintings';
import { StyleSheet, Text, View, ImageBackground, ActivityIndicator } from 'react-native';
import ManageWallpaper, { TYPE } from 'react-native-manage-wallpaper';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import { LinearGradient } from 'expo-linear-gradient';
import TinderCard from 'react-tinder-card'
import { Button } from '@rneui/base';

const storage = new MMKVLoader().initialize();

const Home = () => {

    const [page, setPage] = useMMKVStorage('page', storage, 1);

    const [currentPainting, setCurrentPainting] = useMMKVStorage('current_painting', storage, null);

    const { data, isLoading, isError, hasNextPage, fetchNextPage } = useFetchPaintings(page);
    const [isLoadingWallpaper,setIsLoadingWallpaper] = React.useState(false)
    const [paintings, setPaintings] = React.useState([]);
    const [alreadyViewedPaintings, setAlreadyViewedPaintings] = useMMKVStorage('viewed_paintings', storage, []);
    const swiped = (direction, nameToDelete) => {
        console.log('removing: ' + nameToDelete)
    }


    const outOfFrame = (id) => {
        console.log(id + ' left the screen!')
        setPaintings((oldPaintings) => oldPaintings.filter((painting) => painting["id"] != id))
        setAlreadyViewedPaintings(prevAlreadyViewedPaintings => [...prevAlreadyViewedPaintings, id])
        console.log("updating currentWallpaper")

    }
    React.useEffect(() => {
        console.log("current painting : ")
        console.log(currentPainting)
    }, [currentPainting])

    React.useEffect(() => {
        if (data) {
            let newFetchedPaintings = data.pages[data.pages.length - 1]["data"]

            setPaintings((oldPaintings) => {
                let uniquePaintings = [...newFetchedPaintings, ...oldPaintings].filter((value, index, array) => array.indexOf(value) === index) // making sure key is unique
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


    if (isLoading) return <Text>Loading...</Text>
    if (isError) return <Text>An error occurred while fetching data</Text>
    return (
        <View style={styles.container}>
            {
            isLoadingWallpaper && <View style={{
                width:"100%",
                height:"100%",
                position:"absolute",
                zIndex:100,
                backgroundColor:'rgba(0,0,0,0.7)'
            }} >
                
                <ActivityIndicator style={styles.cardContainer} size={'large'} color={'rgb(172,20,87)'}>

                </ActivityIndicator>
            </View>

                }
            <Text style={styles.header} >ArtMuse</Text>
            {
                paintings.length != 0 ? (<View style={styles.cardContainer}>
                    {paintings.map(painting => {
                        return (
                            <TinderCard
                                key={painting["id"]}
                                onSwipe={(dir) => swiped(dir, painting["title"])}
                                onCardLeftScreen={() => outOfFrame(painting["id"])}>
                                <View style={styles.card}>
                                    <ImageBackground
                                        source={{ uri: painting["imageLink"] }}
                                        defaultSource={require('../img/placeholder.png')}
                                        imageStyle={styles.image}
                                        style={styles.cardImage}>
                                        <LinearGradient
                                            // Button Linear Gradient
                                            colors={['rgba(28,20,56,0)', 'rgba(0,0,0,0.9)']}
                                            style={{ width: "100%", height: "100%", paddingBottom: 20, justifyContent: 'flex-end', alignpaintings: 'center' }}>
                                            <Text style={{ color: "white", fontSize: 15, textAlign: "center" }}>{painting["title"]} - {painting["artistDisplayName"]}</Text>

                                        </LinearGradient>

                                    </ImageBackground>

                                </View>

                            </TinderCard>)
                    }

                    )}

                </View>)
                    : <ActivityIndicator style={styles.cardContainer} size={'large'} color={'rgb(172,20,87)'} />
            }
            <Button color={"secondary"} onPress={setWallpaper} buttonStyle={styles.wallpaperButton} title={"Set as wallpaper"}></Button>



        </View>


    )

}



const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        height: "100%",
        backgroundColor: "#14110f"
    },
    header: {
        color: "white",
        backgroundColor: "#1A120B",
        textAlign: "center",
        paddingTop: 20,
        fontSize: 25,
        paddingBottom: 30
    },
    cardContainer: {
        width: '100%',
        alignSelf: "center",
        maxWidth: 350,
        height: 620,
    },
    card: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '100%',
        maxWidth: 350,
        height: 620,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowRadius: 20,
        borderRadius: 20,
        resizeMode: 'contain',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 20,
    },
    wallpaperButton: {
        marginBottom: 40,
        marginTop: 10,


    }

});



export default Home


/*
 <>
            <Text style={{ color: "white", flex: 1, backgroundColor: "#1A120B", textAlign: "center", paddingTop: 20, fontSize: 25 }} >ArtMuse</Text>
            {data.pages.flatMap((page) => page.data).map((painting) => {
                return (
                    <View
                        style={styles.cardContainer}
                        pointerEvents="box-none"
                        key={painting["id"]}
                    >
                        <TinderCard
                            cardWidth={300}
                            cardHeight={600}
                            cardStyle={styles.card}
                            onSwipedRight={() => {
                                setCount(count + 1)
                            }}
                            onSwipedTop={() => {
                                setCount(count + 1)
                            }}
                            onSwipedLeft={() => {
                                setCount(count + 1)
                            }}
                        >
                           
                        </TinderCard>
                    </View>
                );
            })}
        </>

*/