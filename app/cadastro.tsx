import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { auth, db } from "./firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function CadastroLider() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");

  async function handleCadastro() {
    if (!nome || !email || !senha || !dataNascimento || !sexo) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "lider", uid), {
        nomeCompleto: nome,
        dataNascimento,
        sexo,
        email,
        uid,
        criadoEm: new Date(),
      });

      Alert.alert("Sucesso", "Líder cadastrado com sucesso!");
      router.push("/login");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Cadastro de Líder</Text>

      <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Data de nascimento (DD/MM/AAAA)" value={dataNascimento} onChangeText={setDataNascimento} />
      <TextInput style={styles.input} placeholder="Sexo" value={sexo} onChangeText={setSexo} />
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20, 
    backgroundColor: "#f5f5f5" 
  },
  logo: { 
    width: 400, 
    height: 400, 
    resizeMode: "contain" 
  },
  title: { 
    fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: { 
    width: "100%", 
    height: 50, 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: "#ccc" 
  },
  button: { 
    width: "100%", 
    backgroundColor: "#0A2C5E", 
    paddingVertical: 14, 
    borderRadius: 10, 
    alignItems: "center" 
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});
