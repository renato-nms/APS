import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";

export default function ConsultasLider() {
  return (
    <View>
      <ImageBackground
        source={require("../../assets/images/fundo_home.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <Text>Consultas Lider</Text>
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
