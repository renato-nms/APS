import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image, 
  ScrollView,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  
  const handleButtonPress = (buttonName: string) => {
    Alert.alert("Funcionalidade não implementada", `${buttonName} - Funcionalidade ainda não aplicada`);
  };

  return (
    <ImageBackground 
      source={require("../assets/images/fundo_home.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Image source={require("../assets/images/logo.png")} style={styles.logo} />

          {/* Saudação */}
          <View style={styles.greetingContainer}>
            <Text style={styles.headerTitle}>Olá! cuide da saúde da sua família aqui</Text>
          </View>

          {/* Conteúdo com Scroll */}
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Grid de Botões */}
            <View style={styles.buttonsGrid}>
              <TouchableOpacity 
                style={[styles.button, styles.examesButton]} 
                onPress={() => handleButtonPress("Exames")}
              >
                  <Image source={require("../assets/images/Gota.png")} style={styles.icone} />
                <Text style={styles.buttonText}>Exames</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.vacinasButton]} 
                onPress={() => handleButtonPress("Vacinas")}
              >
                  <Image source={require("../assets/images/Gota.png")} style={styles.icone} />
                <Text style={styles.buttonText}>Vacinas</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.remediosButton]} 
                onPress={() => handleButtonPress("Remédios")}
              >
                  <Image source={require("../assets/images/Gota.png")} style={styles.icone} />
                <Text style={styles.buttonText}>Remédios</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.consultasButton]} 
                onPress={() => handleButtonPress("Consultas")}
              >
                  <Image source={require("../assets/images/Gota.png")} style={styles.icone} />
                <Text style={styles.buttonText}>Consultas</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Barra inferior FIXA */}
          <View style={styles.navbar}>
            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="home" size={28} color="#00ff55" />
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
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent', // ← TRANSPARENTE
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent', // ← TRANSPARENTE
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent', // ← TRANSPARENTE
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
    backgroundColor: 'transparent', // ← TRANSPARENTE
  },
  logo: {
    width: 246,
    height: 94,
    marginTop: 24,
    resizeMode: "contain",
    alignSelf: "center",
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#142850",
    letterSpacing: 1,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  greetingContainer: {
    padding: 15,
    alignItems: "center",
    backgroundColor: 'transparent', // ← TRANSPARENTE
  },
  buttonsGrid: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'transparent', // ← TRANSPARENTE
  },
  button: {
    width: "100%",
    maxWidth: 354,
    height: 100,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  buttonText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#0A2C5E",
    left: 40
  },
  navbar: {
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