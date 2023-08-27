import * as React from 'react';
import { FlashList } from "@shopify/flash-list";
import PaintingCard from '../components/PaintingCard';
import useFetchPaintings from '../hooks/useFetchPaintings';
import { Button, StyleSheet, Text, View, ImageBackground, SafeAreaView, Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
const Home = () => {

    const flashListRef = React.useRef(null);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const { data, isLoading, isError, hasNextPage, fetchNextPage } = useFetchPaintings();
    const [touchStart, setTouchStart] = React.useState(null)
    const [touchEnd, setTouchEnd] = React.useState(null)

    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 30

    const onTouchStart = (e) => {
        setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        console.log("skip")

        setTouchStart(e.nativeEvent.pageX)

    }

    const onTouchMove = (e) => setTouchEnd(e.nativeEvent.pageX)

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        console.log(isLeftSwipe ? "left" : null)
        console.log(isRightSwipe ? "right" : null)

        setCurrentIndex((index) => {
            let next_index = index
            if (isLeftSwipe) {
                next_index += 1
            } else if (isRightSwipe && index > 0) {
                next_index -= 1
            }
            if (flashListRef.current) {
                flashListRef.current.scrollToIndex({
                    index: next_index,
                    animated: true,
                });
            }
            return next_index;
        });


        // add your conditional logic here
    }


    const loadNextPageData = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    };



    return (

        <View style={{ flexDirection: "column", display: "flex", flex: 1, backgroundColor: "#14110f" }} >
            <Text style={{ color: "white", flex: 1, backgroundColor: "#1A120B", textAlign: "center", paddingTop: 20, fontSize: 25 }} >ArtMuse</Text>

            {isLoading ? <Text>Loading...</Text> : (isError ? <Text>An error occurred while fetching data</Text> :


                <SafeAreaView style={styles.wrapper}>
                    <FlashList
                        decelerationRate={0.95}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        data={data.pages.flatMap((page) => page.data)}
                        estimatedItemSize={270}
                        onEndReachedThreshold={0.3}
                        scrollEnabled={false}
                        ref={flashListRef}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        renderItem={({item,index}) => {
                            
                            return <PaintingCard isActive={currentIndex == index} painting={item}></PaintingCard>
                        }
                        }
                        onEndReached={loadNextPageData}

                    />
                </SafeAreaView>
            )}


            <View style={{ display: 'flex', flex: 1, flexDirection: "row", justifyContent: "center", padding: 10 }}>
                <Button styl title='Set as Wallpaper' />
                <Button title='Add to favorites' />
            </View>

        </View>
    )

}


const styles = StyleSheet.create({
    wrapper: {
        flex: 12,

    },
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