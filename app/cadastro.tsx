
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
// Firebase
import { auth } from "./firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";


export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  //BACK END

  // Função chamada ao clicar no botão "cadastrar"
  async function handleCadastro() {
    if(!nome || !email || !senha || !dataNascimento || !sexo) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    try {
      // Aqui cria o usuario, quando os dados forem digitados
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);

      const uid = userCredential.user.uid;
      //Pega o uid unico do usuario criado

      await setDoc(doc(db, "users", uid), {
        nome: nome,
        dataNascimento: dataNascimento,
        sexo: sexo,
        email: email,
      });

      Alert.alert("Sucesso", "Usuário cadastrado");

      router.push("/login");
    } catch (error: any) {
      //Se algo der errado, como dados ja usados
      Alert.alert("Erro", error.message);
    }
  }

    //FRONT END
  return (
    <View style={styles.container}>
      
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Insira seus dados</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Data de nascimento (DD/MM/AAAA)"
        value={dataNascimento}
        onChangeText={setDataNascimento}
      />

      <TextInput
        style={styles.input}
        placeholder="Sexo"
        value={sexo}
        onChangeText={setSexo}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleCadastro}
      >
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.push("/login")}
      >
      </TouchableOpacity>
    </View>
  );
}


// ESTILIZAÇÃO
const styles = StyleSheet.create({
  logo: {
    width: 400,
    height: 400,
    marginBottom: 20,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
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
  linkButton: {
    alignItems: "center",
  },
});
