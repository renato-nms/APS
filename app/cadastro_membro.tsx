import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { db } from "./firebase/firebaseConfig";
import { doc, setDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function CadastroMembro() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");

  async function handleCadastro() {
    if (!nome || !email || !dataNascimento || !sexo || !tipoUsuario) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    const tipo = tipoUsuario.toLowerCase();
    if (!["crianca", "idoso", "pet"].includes(tipo)) {
      Alert.alert("Erro", "Tipo inválido. Use: crianca, idoso ou pet");
      return;
    }

    try {
      const auth = getAuth();
      const liderUid = auth.currentUser?.uid;

      if (!liderUid) {
        Alert.alert("Erro", "Apenas líderes logados podem cadastrar membros.");
        return;
      }

      const newUid = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`; // UID fake

      await setDoc(doc(collection(db, tipo), newUid), {
        nomeCompleto: nome,
        dataNascimento,
        sexo,
        tipoUsuario: tipo,
        email,
        criadoPor: liderUid,
        criadoEm: new Date(),
      });

      Alert.alert("Sucesso", `${tipo} cadastrado com sucesso!`);
      router.push("/home");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Cadastrar Membro</Text>

      <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Data de nascimento" value={dataNascimento} onChangeText={setDataNascimento} />
      <TextInput style={styles.input} placeholder="Sexo" value={sexo} onChangeText={setSexo} />
      <TextInput style={styles.input} placeholder="Tipo (crianca, idoso, pet)" value={tipoUsuario} onChangeText={setTipoUsuario} />
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} />

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f5f5f5" },
  logo: { width: 400, height: 400, resizeMode: "contain" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", height: 50, backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: "#ccc" },
  button: { width: "100%", backgroundColor: "#0A2C5E", paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
