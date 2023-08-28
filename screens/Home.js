import * as React from 'react';
import useFetchPaintings from '../hooks/useFetchPaintings';
import { StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ManageWallpaper, { TYPE } from 'react-native-manage-wallpaper';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import { TinderCard } from 'rn-tinder-card';
import { Image } from '@rneui/themed';



const storage = new MMKVLoader().initialize();


const Home = () => {

    const { data, isLoading, isError, hasNextPage, fetchNextPage } = useFetchPaintings();
    const [currentIndex, setCurrentIndex] = useMMKVStorage('current_index', storage, 0);
    const [touchStart, setTouchStart] = React.useState(null)
    const [touchEnd, setTouchEnd] = React.useState(null)
    const [currentPainting, setCurrentPainting] = useMMKVStorage('current_painting', storage, null);
    const [page, setPage] = useMMKVStorage('current_page', storage, 0);
    const OverlayRight = () => {
        return (
            <View
                style={[
                    styles.overlayLabelContainer,
                    {
                        backgroundColor: 'green',
                    },
                ]}
            >
                <Text style={styles.overlayLabelText}>Like</Text>
            </View>
        );
    };
    const OverlayLeft = () => {
        return (
            <View
                style={[
                    styles.overlayLabelContainer,
                    {
                        backgroundColor: 'red',
                    },
                ]}
            >
                <Text style={styles.overlayLabelText}>Nope</Text>
            </View>
        );
    };
    const OverlayTop = () => {
        return (
            <View
                style={[
                    styles.overlayLabelContainer,
                    {
                        backgroundColor: 'blue',
                    },
                ]}
            >
                <Text style={styles.overlayLabelText}>Super Like</Text>
            </View>
        );
    };
    React.useEffect(() => {

        updateCurrentPainting(currentIndex)
    }, [currentIndex])

    const updateCurrentPainting = (index = 0) => {
        if (data) {
            const paintings = data.pages.flatMap((page) => page.data)
            setCurrentPainting(paintings[index])
        }
    }


    const loadNextPageData = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    };

    const callback = res => {
        console.log(res)
    };

    const setWallpaper = () => {


        ManageWallpaper.setWallpaper(
            {
                uri: currentPainting["imageLink"],
            },
            callback,
            TYPE.BOTH,
        );


    };

    const fetchMore = (id) => {
        let isLastItem = false

        let data_flatten = data.pages.flatMap((page) => page.data)
        console.log( data_flatten.findIndex(item => item["id"] == id))
        isLastItem = data_flatten.findIndex(item => item["id"] == id) %10 == 0
        if(isLastItem) {
            loadNextPageData()
        }

    }
    if (isLoading) return <Text>Loading...</Text>
    if (isError) return <Text>An error occurred while fetching data</Text>
    console.log(data.pages[data.pages.length - 1]["data"])
    return (
        <GestureHandlerRootView style={styles.wrapper}>
                    {data.pages[data.pages.length - 1]["data"].map((item) => {
                        return (
                            <View
                                style={styles.cardContainer}
                                pointerEvents="box-none"
                                key={item["id"]}
                            >
                                <TinderCard
                                    cardWidth={380}
                                    cardHeight={730}
                                    OverlayLabelRight={OverlayRight}
                                    OverlayLabelLeft={OverlayLeft}
                                    OverlayLabelTop={OverlayTop}
                                    cardStyle={styles.card}
                                    onSwipedRight={() => {
                                        fetchMore(item["id"])
                                    }}
                                    onSwipedTop={() => {
                                        return
                                    }}
                                    onSwipedLeft={() => {
                                        return
                                    }}
                                >
                                    <Image source={{ uri: item["imageLink"] }} style={styles.image} PlaceholderContent={<ActivityIndicator />} />
                                </TinderCard>
                            </View>
                        );
                    })}
        </GestureHandlerRootView>
    )

}



const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },

    cardContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderRadius: 48,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 48,
    },
    overlayLabelContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayLabelText: { color: 'white', fontSize: 32, fontWeight: 'bold' },
    cardContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderRadius: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    overlayLabelContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayLabelText: { color: 'white', fontSize: 32, fontWeight: 'bold' },
});



export default Home

/*

   <View style={{ flexDirection: "column", display: "flex", flex: 1, backgroundColor: "#14110f" }} >
                <Text style={{ color: "white", flex: 1, backgroundColor: "#1A120B", textAlign: "center", paddingTop: 20, fontSize: 25 }} >ArtMuse</Text>

*/