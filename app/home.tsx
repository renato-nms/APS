import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Home() {
    return (
        <View>
            <Text style={styles.title}>Home</Text>
        </View>
    );
}

const styles = StyleSheet.create ({
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 50,
    }
})