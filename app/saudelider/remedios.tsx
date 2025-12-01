import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";

export default function RemediosLider() {
  return (
    <View>
      <ImageBackground
        source={require("../../assets/images/fundo_home.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <text>Remedios do lider</text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
