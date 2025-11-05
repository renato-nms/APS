import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
export default function Home() {
  const router = useRouter();
  const handleButtonPress = (buttonName: string) => {
    Alert.alert("Funcionalidade não implementada", `${buttonName} - Funcionalidade ainda não aplicada`);
  };

  return (
    
    <View style={styles.container}>
      <StatusBar backgroundColor="#0A2C5E" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CADERNETA</Text>
        <Text style={styles.headerSubtitle}>DIGITAL DE FAMÍLIA</Text>
      </View>

      {/* Saudação */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>Olá, João</Text>
        <Text style={styles.subGreeting}>cuide da saúde da sua família aqui</Text>
      </View>

      {/* Grid de Botões */}
      <View style={styles.buttonsGrid}>
        <TouchableOpacity 
          style={[styles.button, styles.examesButton]} 
          onPress={() => handleButtonPress("Exames")}
        >
          <Text style={styles.buttonText}>Exames</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.vacinasButton]} 
          onPress={() => handleButtonPress("Vacinas")}
        >
          <Text style={styles.buttonText}>Vacinas</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.remediosButton]} 
          onPress={() => handleButtonPress("Remédios")}
        >
          <Text style={styles.buttonText}>Remédios</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.consultasButton]} 
          onPress={() => handleButtonPress("Consultas")}
        >
          <Text style={styles.buttonText}>Consultas</Text>
        </TouchableOpacity>
      </View>

      {/* Barra inferior */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={28} color="#0A2C5E" />
          <Text style={styles.navText}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/homeFamilia')}>
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
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#0A2C5E",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    letterSpacing: 1,
    marginTop: 2,
  },
  greetingContainer: {
    padding: 20,
    alignItems: "center",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0A2C5E",
    marginBottom: 5,
  },
  subGreeting: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
  buttonsGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    justifyContent: "space-between",
  },
  button: {
    width: "48%",
    height: 120,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  examesButton: {
    backgroundColor: "#E6F2FF", // Azul claro
  },
  vacinasButton: {
    backgroundColor: "#E6FFE6", // Verde claro
  },
  remediosButton: {
    backgroundColor: "#FFF5E6", // Laranja claro
  },
  consultasButton: {
    backgroundColor: "#F2E6FF", // Roxo claro
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A2C5E",
  },
  footer: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#DDDDDD",
  },
  footerText: {
    fontSize: 16,
    color: "#666666",
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