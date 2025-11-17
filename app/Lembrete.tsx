import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router"; // ou o seu gerenciador de rotas

export default function Historico() {
  return (
    <View style={styles.container}>
      {/* Topo centralizado */}
      <View style={styles.topo}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.titulo}>Lembrete</Text>
        <Text style={styles.subtitulo}> Seus próximos eventos de saúde</Text>
        <View style={styles.adicionar}>
          <TouchableOpacity
            style={styles.add}
            onPress={() => router.push("/AddLembrete")}
          >
            <Ionicons name="add-circle" size={28} color="#ffffff" />
            <Text style={styles.textoAdd}>Adicionar lembrete</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Conteúdo principal */}
      <View style={styles.conteudo}>
        <Text style={styles.textoDesenvolvimento}>Tela em desenvolvimento</Text>
      </View>
      Barra inferior FIXA
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/home")}
        >
          <Ionicons name="home" size={28} color="#0A2C5E" />
          <Text style={styles.navText}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="watch-outline" size={28} color="#00ff55" />
          <Text style={styles.navText}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="notifications" size={28} color="#0A2C5E" />
          <Text style={styles.navText}>Lembrete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/homeFamilia")}
        >
          <Ionicons name="people" size={28} color="#0A2C5E" />
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
    backgroundColor: "transparent",
  },
  topo: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
  titulo: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#0A2C5E",
  },
  subtitulo: {
    fontSize: 24,
    fontWeight: "600", // "semibold" não é suportado, use "600"
    color: "#133a74",
  },
  conteudo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textoDesenvolvimento: {
    fontSize: 18,
    color: "#666",
  },
  adicionar: {
    padding: 20,
    alignItems: "flex-end",
  },
  add: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#194c83",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0b2f64",
  },
  textoAdd: {
    marginLeft: 10,
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
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
  iconenavbar: {
    width: 28,
    height: 28,
    tintColor: "#0A2C5E",
  },
  historico: {
    color: "#00ff55",
  },
});
