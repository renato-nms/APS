import { router } from "expo-router";
import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";

export default function HomeCrianca() {
  const handleButtonPress = (tipo) => {
    console.log(`Botão pressionado: ${tipo}`);
    // aqui você pode adicionar navegação ou lógica
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg-crianca.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>
        Oi! Vamos brincar de cuidar da sua saúde?
      </Text>

      <View style={styles.buttonsGrid}>
        <TouchableOpacity
          style={[styles.button, styles.examesButton]}
          onPress={() => router.push("./saudecrianca/consultas")}
        >
          <Image
            source={require("../assets/images/Urso.png")}
            style={styles.icone}
          />
          <Text style={styles.buttonText}>Meus cuidados</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.vacinasButton]}
          onPress={() => handleButtonPress("Minhas gotinhas")}
        >
          <Image
            source={require("../assets/images/Gota.png")}
            style={styles.icone}
          />
          <Text style={styles.buttonText}>Minhas gotinhas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.remediosButton]}
          onPress={() => handleButtonPress("Minhas vitaminas")}
        >
          <Image
            source={require("../assets/images/Vitamina.png")}
            style={styles.icone}
          />
          <Text style={styles.buttonText}>Minhas vitaminas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.VisitasButton]}
          onPress={() => handleButtonPress("Minhas visitas")}
        >
          <Image
            source={require("../assets/images/Visita.png")}
            style={styles.icone}
          />
          <Text style={styles.buttonText}>Visitas ao doutor</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  logo: {
    width: 246,
    height: 94,
    marginTop: 23,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginVertical: 20,
  },
  buttonsGrid: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  button: {
    flexDirection: "row", // imagem + texto lado a lado
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    maxWidth: 354,
    height: 100,
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  icone: {
    width: 60,
    height: 60,
    marginRight: 15, // espaço entre o urso e o texto
  },
  examesButton: {
    backgroundColor: "#B8FDDE",
  },
  vacinasButton: {
    backgroundColor: "#BFF5FF",
  },
  remediosButton: {
    backgroundColor: "#EEDEFE",
  },
  consultasButton: {
    backgroundColor: "#FFFDBE",
  },
  VisitasButton: {
    backgroundColor: "#FFFDBE",
  },
  buttonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0A2C5E",
  },
});
