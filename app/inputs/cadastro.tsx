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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { auth, db } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function CadastroLider() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");

  // Opções fixas para sexo
  const opcoesSexo = [
    { id: "M", label: "Masculino" },
    { id: "F", label: "Feminino" },
    { id: "O", label: "Outro" },
    { id: "P", label: "Prefiro não dizer" },
  ];

  async function handleCadastro() {
    if (!nome || !email || !senha || !dataNascimento || !sexo) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "lider", uid), {
        nomeCompleto: nome,
        dataNascimento,
        sexo,
        email,
        uid,
        tipoUsuario: "lider",
        criadoEm: new Date(),
      });

      Alert.alert("Sucesso", "Líder cadastrado com sucesso!");
      router.push("/login");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Cadastro de Líder</Text>

        <View style={styles.formContainer}>
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

          {/* Seção Sexo com botões/abas */}
          <View style={styles.sexoSection}>
            <Text style={styles.sexoLabel}>Sexo:</Text>
            <View style={styles.sexoContainer}>
              {opcoesSexo.map((opcao) => (
                <TouchableOpacity
                  key={opcao.id}
                  style={[
                    styles.sexoButton,
                    sexo === opcao.id && styles.sexoButtonSelecionado,
                  ]}
                  onPress={() => setSexo(opcao.id)}
                >
                  <Text
                    style={[
                      styles.sexoButtonText,
                      sexo === opcao.id && styles.sexoButtonTextSelecionado,
                    ]}
                  >
                    {opcao.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

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
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
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
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
  },
  // Estilos para a seção de sexo
  sexoSection: {
    marginBottom: 20,
  },
  sexoLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  sexoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  sexoButton: {
    flex: 1,
    minWidth: "48%", // Para ter 2 botões por linha
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  sexoButtonSelecionado: {
    backgroundColor: "#0A2C5E",
    borderColor: "#0A2C5E",
  },
  sexoButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
  },
  sexoButtonTextSelecionado: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    width: "100%",
    backgroundColor: "#0A2C5E",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
