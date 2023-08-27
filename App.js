import * as React from 'react';
import {  Button, StyleSheet, Text, View,ImageBackground } from 'react-native';
import { TinderCard } from 'rn-tinder-card';
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function App() {
  const [data,setData] = React.useState( [
    {src:'https://images.unsplash.com/photo-1681896616404-6568bf13b022?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1335&q=80',key:1}
    ,
    {
      src:'https://images.unsplash.com/photo-1681871197336-0250ed2fe23d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
      key:2
    },
    {
      src:'https://images.unsplash.com/photo-1681871197336-0250ed2fe23d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
      key:3
    },
  ])

  const loadData = (index) => {
    console.log(index)
    if(index == 1) {
      console.log("loading data")
      setData([
      {src:'https://images.unsplash.com/photo-1681238091934-10fbb34b497a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1282&q=80',key:3},
      ])
    }
  }
  return (
    <View style={{ flexDirection: "column", display: "flex", flex: 1, backgroundColor: "#14110f" }} >
      <Text style={{color:"white",flex:1,backgroundColor:"#1A120B",textAlign:"center",paddingTop:20,fontSize:25}} >ArtMuse</Text>
      <GestureHandlerRootView style={styles.wrapper} >
        {data.map((item, index) => {
          console.log(item)
          return (
            <View
              style={styles.cardContainer}
              pointerEvents="box-none"
              key={item["key"]}
            >
              <TinderCard
                cardWidth={338}
                cardHeight={600}
                cardStyle={styles.card}
                onSwipedRight={() => {
                  loadData(item["key"])
                }}
                onSwipedLeft={() => {
                  loadData(item["key"])
                }}
                
              >
                <ImageBackground source={{ uri: item["src"] }} style={styles.image} >
                  <View style={{ position: 'absolute',height:"100%",width:"100%",  justifyContent:'flex-end', alignItems: 'center',paddingBottom:20, backgroundColor: 'rgba(0,0,0, 0.40)' }}>
                    <Text>Title goes here</Text>
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
