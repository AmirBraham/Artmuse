import * as React from 'react';
import { Button, StyleSheet, Text, View, ImageBackground } from 'react-native';
import { TinderCard } from 'rn-tinder-card';
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function App() {

  const [data, setData] = React.useState([])

 
  const getPaintingsFromApi = async (page = 1, limit = 3, collection_name = "") => {
    response = await fetch(`https://artmuse-617f4c1e3849.herokuapp.com/api/paintings_app/?limit=${limit}&page=${page}`, {
      method: 'GET',
      timeout: 30,
    })
    response = await response.json()
    res = response["paintings"]
    paintings = []
    res.forEach(p => {
      const painting = {
        id: p["id"],
        resourceLink: p["resourceLink"],
        objectBeginDate: p["objectBeginDate"],
        objectEndDate: p["objectEndDate"],
        artistDisplayName: p["artistDisplayName"],
        title: p["title"],
        imageLink: p["imageLink"],
        collection: collection_name,
      }
      paintings.push(painting)
    });
    console.log(paintings)
    return paintings

  }

  React.useEffect(() => {
    getPaintingsFromApi().then(res => setData(paintings))
  }, [])



  return (
    <View style={{ flexDirection: "column", display: "flex", flex: 1, backgroundColor: "#14110f" }} >
      <Text style={{ color: "white", flex: 1, backgroundColor: "#1A120B", textAlign: "center", paddingTop: 20, fontSize: 25 }} >ArtMuse</Text>
      <GestureHandlerRootView style={styles.wrapper} >
        {data.map((item, index) => {
          console.log(item)
          return (
            <View
              style={styles.cardContainer}
              pointerEvents="box-none"
              key={item["id"]}
            >
              <TinderCard
                cardWidth={338}
                cardHeight={600}
                cardStyle={styles.card}
                onSwipedRight={() => {
                  return
                }}
                onSwipedLeft={() => {
                  return
                }}

              >
                <ImageBackground source={{ uri: item["imageLink"] }} style={styles.image} >
                  <View style={{ position: 'absolute', height: "100%", width: "100%", justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20, backgroundColor: 'rgba(0,0,0, 0.40)' }}>
                    <Text>{item["title"]}</Text>
                    <Text>{item["artistDisplayName"]}</Text>

                  </View>
                </ImageBackground>
              </TinderCard>
            </View>
          );
        })}
      </GestureHandlerRootView>
      <View style={{ display: 'flex', flex: 1, flexDirection: "row", justifyContent: "center", padding: 10 }}>
        <Button styl title='Set as Wallpaper' />
        <Button title='Add to favorites' />
      </View>

    </View>


  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 12,
    justifyContent: "center",
    alignItems: "center",

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
