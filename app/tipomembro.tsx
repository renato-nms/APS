import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AdicionarMembro() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/fundo_home.png")}
        style={styles.background}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.Title}>Adicionar Membro</Text>

        <Text style={styles.Subtitle}>Selecione o tipo de membro para adicionar a sua família!</Text>

        <View style={styles.choices}>
          <TouchableOpacity onPress = {() =>router.push("/cadastro_membro")}>
            <Image
              source={require("../assets/images/pessoa.png")}
              style={styles.tipo}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress = {() =>router.push("/cadastro_membro")}>
            <Image
              source={require("../assets/images/pet.png")}
              style={styles.tipo}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      
      {/* Barra inferior - FORA do ImageBackground */}
      <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push("/home")}
        >
          <Ionicons name="home" size={28} color="#0A2C5E" />
          <Text style={styles.navText}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="people" size={28} color="#00ff55" />
          <Text style={styles.navText}>Família</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-circle" size={28} color="#0A2C5E" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative", // ⭐ Importante para o position absolute da navbar
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
    paddingBottom: 70, // ⭐ Espaço para a navbar não sobrepor conteúdo
  },
  logo: {
    width: 246,
    height: 94,
    marginTop: 24,
    resizeMode: "contain",
    alignSelf: "center",
  },
  tipo: {
    width: 178,
    height: 240,
    marginHorizontal: 20,
    borderRadius: 20,
    marginTop: 24,
  },
  choices: {
    flexDirection: "row",
    justifyContent: "center",
  },
  Title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#142850",
    marginBottom: 8,
    textAlign: "center",
    marginTop: 20,
  },
  Subtitle: {
    color: "#142850",
    fontSize: 25,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    height: 70,
    backgroundColor: "#E6F2FF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 14,
    color: "#0A2C5E",
  },
});