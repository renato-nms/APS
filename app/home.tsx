import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";

export default function HomeLider() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      {/* Perfil */}
      <Text style={styles.title}>Home do Líder</Text>
      
      {/* Link para cadastrar membro - CORRIGIDO */}
      <TouchableOpacity 
        style={styles.linkContainer} 
        onPress={() => router.push("/cadastro_membro")}
      >
        <Text style={styles.link}>Deseja cadastrar membro? Clique aqui!</Text>
      </TouchableOpacity>

      {/* Botões 
      <TouchableOpacity style={[styles.card, { backgroundColor: "#C3F8E4" }]}>
        <Ionicons name="microscope-outline" size={40} color="#0A2C5E" />
        <Text style={styles.textCard}>Exames</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { backgroundColor: "#C8E5FF" }]}>
        <Ionicons name="medkit-outline" size={40} color="#0A2C5E" />
        <Text style={styles.textCard}>Vacinas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { backgroundColor: "#E6D7FF" }]}>
        <Ionicons name="heart-outline" size={40} color="#0A2C5E" />
        <Text style={styles.textCard}>Laudos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { backgroundColor: "#FFF5C3" }]}>
        <Ionicons name="calendar-outline" size={40} color="#0A2C5E" />
        <Text style={styles.textCard}>Consultas</Text>
      </TouchableOpacity>
      */}
      
      {/* Barra inferior */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={28} color="#0A2C5E" />
          <Text style={styles.navText}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
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
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
  },
  perfil: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A2C5E",
  },
  cargo: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  card: {
    width: "80%",
    height: 90,
    borderRadius: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textCard: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A2C5E",
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  linkContainer: {
    padding: 15,
    backgroundColor: "#E6F2FF",
    borderRadius: 10,
    marginBottom: 20,
  },
  link: {
    fontSize: 16,
    color: "#0A2C5E",
    fontWeight: "bold",
  },
});