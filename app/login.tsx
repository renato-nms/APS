import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase/firebaseConfig";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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
      // Login com Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const uid = userCredential.user.uid;

      // Busca tipoUsuario no Firestore
      const userDoc = await getDoc(doc(db, "lider", uid));

      if (!userDoc.exists()) {
        Alert.alert("Erro", "Usuário não encontrado no banco de dados.");
        return;
      }

      const userData = userDoc.data();

      if (userData.tipoUsuario === "lider") {
        Alert.alert("Sucesso", "Bem-vindo, líder!");
        router.push("/home"); // Tela do líder (pode conter botão de cadastrar membros)
      } else {
        Alert.alert("Acesso negado", "Somente líderes podem acessar este login.");
      }

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

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={30} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={30} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

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
    width: 353,
    height: 134,
    resizeMode: "contain",
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#142850",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    textAlign: "center",
    color: "#0A2C5E",
    marginBottom: 25,
  },
  inputContainer: {
    width: "100%",
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
    width: 33,
    height: 25
  },
  input: {
    flex: 1,
    fontSize: 24,
  },
  button: {
    width: 353,
    height: 86,
    backgroundColor: "#072441",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    borderRadius: 60,
  },
  forgot: {
    fontSize: 24,
    color: "#142850",
    fontWeight: "bold",
    marginBottom: 15,
  },
  register: {
    fontSize: 24,
    color: "#072441",
    fontWeight: "semibold",
  },
});