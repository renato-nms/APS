import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
} from "react-native";

export default function VacinasLider() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/fundo_home.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo no topo */}
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />

          {/* Cabeçalho principal - CADERNETA DIGITAL DA FAMÍLIA */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>CADERNETA</Text>
            <Text style={styles.headerSubtitle}>DIGITAL</Text>
            <Text style={styles.headerTitle}>DA FAMÍLIA</Text>
          </View>

          {/* Container branco com sombra */}
          <View style={styles.whiteContainer}>
            {/* Título "Lembretes" dentro do container branco */}
            <Text style={styles.sectionTitle}>Lembretes</Text>

            {/* Subtítulo */}
            <Text style={styles.subtitle}>Seus próximos eventos de saúde</Text>

            {/* Botão Adicionar Lembrete - CENTRALIZADO */}
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Adicionar Lembrete</Text>
            </TouchableOpacity>

            {/* Lembrete 1 - Remédio */}
            <View style={styles.reminderCard}>
              <View style={styles.reminderHeader}>
                <Text style={styles.reminderType}>Remédio:</Text>
                <Text style={styles.reminderName}>Dipirona</Text>
              </View>
              <Text style={styles.reminderDetails}>1 comprimido - 8h/8h</Text>
              <View style={styles.reminderFooter}>
                <Text style={styles.reminderTime}>Hoje, 19:00</Text>
              </View>
            </View>

            {/* Lembrete 2 - Vacina */}
            <View style={styles.reminderCard}>
              <View style={styles.reminderHeader}>
                <Text style={styles.reminderType}>Vacina:</Text>
                <Text style={styles.reminderName}>Tétano</Text>
              </View>
              <Text style={styles.reminderPerson}>Pedro (Filho)</Text>
              <View style={styles.reminderFooter}>
                <Text style={styles.reminderTime}>Amanhã, 10:00</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "center", // Centraliza tudo horizontalmente
  },
  logo: {
    width: 250,
    height: 100,
    marginTop: 10,
    resizeMode: "contain",
  },
  header: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#142850",
    letterSpacing: 1,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#142850",
    letterSpacing: 1,
    marginVertical: 2,
  },
  whiteContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 10,
    width: "100%", // Ocupa toda a largura disponível
    maxWidth: 400, // Limita a largura máxima
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#142850",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#142850",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 30,
    width: "100%", // Botão ocupa toda a largura do container
    maxWidth: 300, // Limita a largura máxima
    alignSelf: "center", // Centraliza horizontalmente
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  reminderCard: {
    backgroundColor: "#f0f8ff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: "#142850",
    width: "100%",
  },
  reminderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reminderType: {
    fontSize: 18,
    fontWeight: "600",
    color: "#142850",
    marginRight: 8,
  },
  reminderName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#142850",
  },
  reminderDetails: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  reminderPerson: {
    fontSize: 16,
    color: "#333",
    fontStyle: "italic",
    marginBottom: 10,
  },
  reminderFooter: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
  },
  reminderTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#142850",
  },
});
