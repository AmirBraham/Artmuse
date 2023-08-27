import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
const PaintingCard = ({ painting,isActive }) => {
  return (
    <View>
      <View style={styles.row}>
        <Image source={{ uri: painting["imageLink"] }} style={styles.pic} />
        <Text style={{color:"white"}}>{isActive ? "Hello , this is active ":null}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  row:{
    padding:10
  },
  pic: {
    borderRadius: 30,
    width:250,
    height: 444,
  },


});
export default PaintingCard;