import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
const PaintingCard = ({ painting, isActive }) => {
    return (
        <View>
            <View style={styles.row}>
                <ImageBackground
                    source={{ uri: painting["imageLink"] }}
                    style={styles.imageBackground}
                >
                    {!isActive ? <View style={styles.innerContainer}>
                    </View> :
                        <View style={{ position: 'absolute', height: "100%", width: "100%", justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20, backgroundColor: 'rgba(0,0,0, 0.40)' }}>
                            <Text style={styles.text}>{painting["title"]}</Text>
                            <Text style={styles.text}>{painting["artistDisplayName"]}</Text>
                         
                        </View>
                    }

                </ImageBackground>
            </View>

        </View>
    );
};
const styles = StyleSheet.create({
    row: {
        padding: 10
    },

    imageBackground: {
        borderRadius: 20,
        width: 250,
        height: 444,
    },
    innerContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0, 0.80)'
    },
    text: {
        color: "white",
        fontSize: 20
    }


});
export default PaintingCard;