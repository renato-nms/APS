// FRONT END
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";

// BACK END
import { auth } from "./firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha o e-mail e a senha.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      Alert.alert("Sucesso", "Login realizado!");
      router.push("/home"); // depois você troca pela tela principal
    } catch (error: any) {
      Alert.alert("Erro ao entrar", error.message);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#E6F2FF", "#FFFFFF", "#E6FFE6"]} style={styles.card}>

        <Image source={require("../assets/images/logo.png")} style={styles.logo} />

        <Text style={styles.title}>Bem-vindo à Caderneta Digital da Família</Text>
        <Text style={styles.subtitle}>Organize a saúde da sua família com facilidade</Text>

        {/* Input de Login */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Login"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Input de Senha */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
        </View>

        {/* Botão Entrar */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {/* Esqueci senha */}
        <TouchableOpacity>
          <Text style={styles.forgot}>Esqueci minha senha</Text>
        </TouchableOpacity>

        {/* Cadastro */}
        <TouchableOpacity onPress={() => router.push("/cadastro")}>
          <Text style={styles.register}>
            Não tem cadastro? <Text style={{ fontWeight: "bold" }}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>

      </LinearGradient>
    </View>
  );
}
// ESTILIZAÇÃO

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
 flex: 1,
  width: "100%",
  borderRadius: 0,
  padding: 25,
  alignItems: "center",
  justifyContent: "flex-start",
  paddingTop: 60,
  },
  logo: {
    width: 180,
    height: 80,
    resizeMode: "contain",
    marginBottom: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0A2C5E",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    textAlign: "center",
    color: "#0A2C5E",
    marginBottom: 25,
  },
  inputContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  button: {
    width: "100%",
    backgroundColor: "#0A2C5E",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgot: {
    color: "#0A2C5E",
    fontSize: 14,
    marginBottom: 15,
  },
  register: {
    fontSize: 14,
    color: "#0A2C5E",
  },
});
