import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert, ImageBackground, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SuaFamilia() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/images/fundo_home.png")}
      style={styles.background}
      >
    <View style={styles.container}>
      <Image
      source={require("../assets/images/logo.png")}
      style={styles.logo}
      />

      {/* Header */}
      <View>
        <Text style={styles.Title}>Sua Família</Text>
        <Text style={styles.Subtitle}>
          Adicione os membros da sua família para organizar a saúde de todos
        </Text>
      </View>

      {/* Conteúdo Central */}
      <View style={styles.content}>
        <Image
          source={require("../assets/images/familia.png")}
          style={styles.familiaImage}
        />
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Sua família ainda não possui membros cadastrados
          </Text>
        </View>

        {/* Botão Adicionar Membro */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push("/tipomembro")}
        >
          <Text style={styles.addButtonIcon}>+</Text>
          <Text style={styles.addButtonText}>Adicionar membro</Text>
        </TouchableOpacity>
      </View>
      
      {/* Barra inferior */}
      <View style={styles.navbar}>
        <TouchableOpacity 
        style={styles.navItem}
        onPress = {() => router.push("/home")}>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
   background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  logo: {
    width: 246,
    height: 94,
    marginTop: 24,
    resizeMode: "contain",
    alignSelf: "center",
  },
  familiaImage: {
    resizeMode: "contain",
    alignContent: "center",
  },
  Title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#142850",
    marginBottom: 8,
    textAlign: "center",
  },
  Subtitle: {
    color: "#142850",
    fontSize: 25,
    textAlign: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: "center",
    marginBottom: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#999999",
    textAlign: "center",
    lineHeight: 24,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A2C5E",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonIcon: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
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