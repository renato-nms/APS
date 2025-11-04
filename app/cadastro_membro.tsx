import { useRouter } from "expo-router";
import React, { useState } from "react";
import { 
  Image, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Alert,
  ScrollView
} from "react-native";
import { auth, db } from "./firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function CadastroMembro() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");

  async function handleCadastro() {
    if (!nome || !email || !senha || !dataNascimento || !sexo || !tipoUsuario) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      // Para TODOS os tipos: criar conta no Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = userCredential.user.uid;

      const liderUid = auth.currentUser?.uid;

      await setDoc(doc(db, tipoUsuario.toLowerCase(), uid), {
        nomeCompleto: nome,
        dataNascimento,
        sexo,
        tipoUsuario: tipoUsuario.toLowerCase(),
        email,
        criadoPor: liderUid,
        criadoEm: new Date(),
        uid,
      });

      Alert.alert("Sucesso", "Membro cadastrado com sucesso!");
      router.back();
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Cadastrar Membro</Text>

      <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <TextInput style={styles.input} placeholder="Data de nascimento" value={dataNascimento} onChangeText={setDataNascimento} />
      <TextInput style={styles.input} placeholder="Sexo" value={sexo} onChangeText={setSexo} />
      <TextInput style={styles.input} placeholder="Tipo (crianca, idoso, pet)" value={tipoUsuario} onChangeText={setTipoUsuario} />

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center", 
    padding: 20,
    paddingTop: 40,
  },
  logo: { 
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 30,
    textAlign: "center",
  },
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