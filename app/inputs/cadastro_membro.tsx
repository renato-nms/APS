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
  Modal, // Componente nativo para garantir a visualização
} from "react-native";
import { auth, db } from "../firebase/firebaseConfig";
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
  const [cadastroRealizado, setCadastroRealizado] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCadastro() {
    // 🚨 PASSO 1: LOG DE EXECUÇÃO
    console.log("1. FUNÇÃO HANDLECADASTRO CHAMADA!");

    // 🛑 PASSO 2: VALIDAÇÃO DE CAMPOS
    if (!nome || !email || !senha || !dataNascimento || !sexo || !tipoUsuario) {
      console.log("2. VALIDAÇÃO FALHOU: CAMPOS VAZIOS");
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      // 3. TENTAR CRIAR USUÁRIO NO AUTH
      console.log("3. TENTANDO CRIAR USUÁRIO NO FIREBASE AUTH...");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const uid = userCredential.user.uid;
      console.log("4. USUÁRIO CRIADO NO AUTH, UID:", uid);

      const liderUid = auth.currentUser?.uid;
      console.log("5. LÍDER ATUAL (criadoPor) UID:", liderUid);

      if (!liderUid) {
        console.warn(
          "AVISO: Usuário líder não logado. A escrita no Firestore pode falhar."
        );
      }

      // 6. SALVAR DADOS NO FIRESTORE
      const collectionName = tipoUsuario.toLowerCase();
      console.log(
        `6. SALVANDO DADOS NO FIRESTORE na coleção: ${collectionName}`
      );

      await setDoc(doc(db, collectionName, uid), {
        nomeCompleto: nome,
        dataNascimento,
        sexo,
        tipoUsuario: collectionName,
        email,
        criadoPor: liderUid,
        criadoEm: new Date(),
        uid,
      });

      // 7. SUCESSO
      console.log("7. CADASTRO CONCLUÍDO COM SUCESSO NO FIRESTORE!");

      // Limpar os campos
      setNome("");
      setEmail("");
      setSenha("");
      setDataNascimento("");
      setSexo("");
      setTipoUsuario("");

      // 8. ATIVAR MODAL DE SUCESSO
      console.log("8. ATIVANDO MODAL DE CONFIRMAÇÃO...");
      setCadastroRealizado(true);
    } catch (error: any) {
      // 9. CAPTURAR E MOSTRAR ERRO DO FIREBASE
      console.error("9. ERRO CRÍTICO NO CADASTRO:", error);
      Alert.alert(
        "Erro no Cadastro",
        `Não foi possível cadastrar. Detalhes: ${error.message}`
      );
    } finally {
      // 10. FINALIZAR LOADING
      setLoading(false);
      console.log("10. LOADING DESATIVADO.");
    }
  }

  function handleFecharConfirmacao() {
    console.log("Fechando confirmação e voltando...");
    setCadastroRealizado(false);
    router.back();
  }

  function handleNovoCadastro() {
    console.log("Iniciando novo cadastro...");
    setCadastroRealizado(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Cadastrar Membro</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Data de nascimento (DD/MM/AAAA)"
          value={dataNascimento}
          onChangeText={setDataNascimento}
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Sexo"
          value={sexo}
          onChangeText={setSexo}
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Tipo (crianca, idoso, pet)"
          value={tipoUsuario}
          onChangeText={setTipoUsuario}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCadastro}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 🚀 MODAL DE CONFIRMAÇÃO (Componente Nativo) */}
      <Modal
        visible={cadastroRealizado}
        transparent={true}
        animationType="fade"
        onRequestClose={handleFecharConfirmacao}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Text style={styles.modalIcon}>✓</Text>
            </View>
            <Text style={styles.modalTitle}>Cadastro Realizado!</Text>
            <Text style={styles.modalText}>
              O membro foi cadastrado com sucesso no sistema.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={handleNovoCadastro}
              >
                <Text style={styles.modalButtonTextSecondary}>
                  Novo Cadastro
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleFecharConfirmacao}
              >
                <Text style={styles.modalButtonText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    width: "100%",
    backgroundColor: "#0A2C5E",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: "#7A9BC7",
    opacity: 0.7,
  },
  backButton: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Estilos do modal de confirmação
  modalOverlay: {
    // Usado dentro do Modal nativo para criar o fundo transparente e centralizar
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    width: "85%",
    margin: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  modalIcon: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonPrimary: {
    backgroundColor: "#0A2C5E",
  },
  modalButtonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#0A2C5E",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalButtonTextSecondary: {
    color: "#0A2C5E",
    fontSize: 16,
    fontWeight: "600",
  },
});
