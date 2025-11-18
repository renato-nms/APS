import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLembretes } from "./context/LembreteContext";

export default function AgendarEvento() {
  const { adicionarLembrete } = useLembretes();

  const [nomeEvento, setNomeEvento] = useState("");
  const [tipoEvento, setTipoEvento] = useState("Consulta");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [membroFamilia, setMembroFamilia] = useState("");

  const handleAgendar = () => {
    if (!nomeEvento || !data || !horario) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha pelo menos nome, data e horário do evento."
      );
      return;
    }

    const novoLembrete = {
      tipo: tipoEvento,
      nome: nomeEvento,
      dosagem: "", // Você pode adicionar um campo específico para dosagem se necessário
      data: data,
      horario: horario,
      membro: membroFamilia,
    };

    adicionarLembrete(novoLembrete);

    Alert.alert("Sucesso", "Lembrete agendado com sucesso!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Topo centralizado */}
      <View style={styles.topo}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.titulo}>Agendar Evento</Text>
        <Text style={styles.subtitulo}>
          Preencha os dados para seu lembrete de saúde
        </Text>
      </View>

      {/* Formulário */}
      <ScrollView
        style={styles.conteudo}
        contentContainerStyle={styles.formContainer}
      >
        {/* Campo Nome do Evento */}
        <View style={styles.inputContainer}>
          <View style={styles.checkboxContainer}>
            <Ionicons name="square-outline" size={24} color="#0A2C5E" />
            <Text style={styles.label}>Nome do evento</Text>
          </View>
          <TextInput
            style={styles.input}
            value={nomeEvento}
            onChangeText={setNomeEvento}
            placeholder="Digite o nome do evento"
          />
        </View>

        {/* Campo Tipo de Evento */}
        <View style={styles.inputContainer}>
          <View style={styles.checkboxContainer}>
            <Ionicons name="checkbox" size={24} color="#0A2C5E" />
            <Text style={styles.label}>Consulta, Exame, ...</Text>
          </View>
          <TextInput
            style={styles.input}
            value={tipoEvento}
            onChangeText={setTipoEvento}
          />
        </View>

        {/* Campo Data */}
        <View style={styles.inputContainer}>
          <View style={styles.checkboxContainer}>
            <Ionicons name="square-outline" size={24} color="#0A2C5E" />
            <Text style={styles.label}>Data</Text>
          </View>
          <TextInput
            style={styles.input}
            value={data}
            onChangeText={setData}
            placeholder="DD/MM/AAAA"
          />
        </View>

        {/* Campo Horário */}
        <View style={styles.inputContainer}>
          <View style={styles.checkboxContainer}>
            <Ionicons name="square-outline" size={24} color="#0A2C5E" />
            <Text style={styles.label}>Horário</Text>
          </View>
          <TextInput
            style={styles.input}
            value={horario}
            onChangeText={setHorario}
            placeholder="HH:MM"
          />
        </View>

        {/* Campo Membro da Família */}
        <View style={styles.inputContainer}>
          <View style={styles.checkboxContainer}>
            <Ionicons name="square-outline" size={24} color="#0A2C5E" />
            <Text style={styles.label}>Membro da Família</Text>
          </View>
          <TextInput
            style={styles.input}
            value={membroFamilia}
            onChangeText={setMembroFamilia}
            placeholder="Selecione o membro"
          />
        </View>

        {/* Botão Agendar */}
        <TouchableOpacity style={styles.botaoAgendar} onPress={handleAgendar}>
          <Text style={styles.textoBotao}>Agendar</Text>
        </TouchableOpacity>

        <View style={styles.espacoSeguro} />
      </ScrollView>

      {/* Barra inferior FIXA */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/home")}
        >
          <Ionicons name="home" size={28} color="#0A2C5E" />
          <Text style={styles.navText}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="watch-outline" size={28} color="#00ff55" />
          <Text style={styles.navText}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/Lembrete")}>
          <Ionicons name="notifications" size={28} color="#0A2C5E" />
          <Text style={styles.navText}>Lembrete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/homeFamilia")}
        >
          <Ionicons name="people" size={28} color="#0A2C5E" />
          <Text style={styles.navText}>Família</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-circle" size={28} color="#0A2C5E" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Manter os mesmos estilos...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  topo: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
  titulo: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#0A2C5E",
  },
  subtitulo: {
    fontSize: 24,
    fontWeight: "600",
    color: "#adc7ee",
    textAlign: "center",
    marginHorizontal: 20,
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formContainer: {
    paddingVertical: 30,
  },
  inputContainer: {
    marginBottom: 25,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    color: "#0A2C5E",
    marginLeft: 10,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#0A2C5E",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  botaoAgendar: {
    backgroundColor: "#194c83",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#0b2f64",
  },
  textoBotao: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  navbar: {
    position: "absolute",
    bottom: 0,
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
