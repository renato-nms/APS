import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { auth, db } from "./firebase//firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

type Membro = {
  id: string;
  email?: string;
  nome?: string;
  tipo: string; // 'crianca', 'idoso', 'pet'
};

export default function AgendarEvento() {
  const [nomeEvento, setNomeEvento] = useState("");
  const [tipoEvento, setTipoEvento] = useState("Consulta");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [membrosFamilia, setMembrosFamilia] = useState<Membro[]>([]);
  const [membroSelecionado, setMembroSelecionado] = useState<Membro | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingMembros, setLoadingMembros] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const buscarMembrosFamilia = async () => {
      console.log("🔍 Iniciando busca de membros...");

      try {
        setLoadingMembros(true);
        const membros: Membro[] = [];

        // 1. Buscar TUDO da coleção 'crianca'
        console.log("📋 Buscando coleção 'crianca'...");
        const criancaRef = collection(db, "crianca");
        const criancaSnap = await getDocs(criancaRef);
        console.log(
          `✅ Encontrados ${criancaSnap.size} documentos em 'crianca'`
        );

        criancaSnap.forEach((doc) => {
          console.log("📄 Documento crianca:", doc.id, doc.data());
          const data = doc.data();
          membros.push({
            id: doc.id,
            nome: data.nome || "Criança sem nome",
            email: data.email || data.responsavel_email || "Sem email",
            tipo: "crianca",
          });
        });

        // 2. Buscar TUDO da coleção 'idoso'
        console.log("📋 Buscando coleção 'idoso'...");
        const idosoRef = collection(db, "idoso");
        const idosoSnap = await getDocs(idosoRef);
        console.log(`✅ Encontrados ${idosoSnap.size} documentos em 'idoso'`);

        idosoSnap.forEach((doc) => {
          console.log("📄 Documento idoso:", doc.id, doc.data());
          const data = doc.data();
          membros.push({
            id: doc.id,
            nome: data.nome || "Idoso sem nome",
            email: data.email || "Sem email",
            tipo: "idoso",
          });
        });

        // 3. Buscar TUDO da coleção 'pet'
        console.log("📋 Buscando coleção 'pet'...");
        const petRef = collection(db, "pet");
        const petSnap = await getDocs(petRef);
        console.log(`✅ Encontrados ${petSnap.size} documentos em 'pet'`);

        petSnap.forEach((doc) => {
          console.log("📄 Documento pet:", doc.id, doc.data());
          const data = doc.data();
          membros.push({
            id: doc.id,
            nome: data.nome || "Pet sem nome",
            email: data.email || data.responsavel_email || "Sem email",
            tipo: "pet",
          });
        });

        console.log("🎯 Total de membros encontrados:", membros.length);
        console.log("📝 Lista de membros:", membros);

        setMembrosFamilia(membros);
      } catch (error) {
        console.error("❌ Erro ao buscar membros:", error);
        Alert.alert("Erro", "Não foi possível carregar os membros da família");
      } finally {
        setLoadingMembros(false);
      }
    };

    buscarMembrosFamilia();
  }, []);

  const handleAgendar = async () => {
    if (!nomeEvento || !data || !horario) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha pelo menos nome, data e horário do evento."
      );
      return;
    }

    if (!membroSelecionado) {
      Alert.alert(
        "Selecione um membro",
        "Por favor, selecione um membro da família para enviar o lembrete."
      );
      return;
    }

    try {
      // Adicionar lembrete no Firestore
      const { addDoc } = await import("firebase/firestore");
      const lembretesRef = collection(db, "lembretes");

      await addDoc(lembretesRef, {
        tipo: tipoEvento,
        nome: nomeEvento,
        data: data,
        horario: horario,
        membro: membroSelecionado.nome,
        membro_email: membroSelecionado.email,
        membro_tipo: membroSelecionado.tipo,
        membro_id: membroSelecionado.id,
        paciente_uuid: membroSelecionado.id,
        criado_por: currentUser?.uid,
        criado_por_email: currentUser?.email,
        criado_em: new Date(),
        status: "pendente",
      });

      Alert.alert("Sucesso", "Lembrete agendado com sucesso!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error("Erro ao agendar:", error);
      Alert.alert(
        "Erro",
        "Não foi possível agendar o lembrete: " + error.message
      );
    }
  };

  const getTipoTexto = (tipo: string) => {
    switch (tipo) {
      case "crianca":
        return "👶 Criança";
      case "idoso":
        return "👴 Idoso";
      case "pet":
        return "🐾 Pet";
      default:
        return tipo;
    }
  };

  const renderItemMembro = ({ item }: { item: Membro }) => (
    <TouchableOpacity
      style={[
        styles.membroItem,
        membroSelecionado?.id === item.id && styles.membroItemSelecionado,
      ]}
      onPress={() => {
        setMembroSelecionado(item);
        setModalVisible(false);
      }}
    >
      <View style={styles.membroInfo}>
        <View style={styles.membroHeader}>
          <Ionicons
            name={
              membroSelecionado?.id === item.id ? "checkbox" : "square-outline"
            }
            size={24}
            color="#0A2C5E"
          />
          <Text style={styles.membroNome}>{item.nome}</Text>
          <Text style={styles.membroTipo}>{getTipoTexto(item.tipo)}</Text>
        </View>
        {item.email && item.email !== "Sem email" && (
          <Text style={styles.membroEmail}>{item.email}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

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
            <Text style={styles.label}>Tipo do Evento</Text>
          </View>
          <TextInput
            style={styles.input}
            value={tipoEvento}
            onChangeText={setTipoEvento}
            placeholder="Consulta, Exame, Medicamento, etc."
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

          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.selectContent}>
              {membroSelecionado ? (
                <View>
                  <Text style={styles.selectTextSelected}>
                    {membroSelecionado.nome}
                  </Text>
                  <Text style={styles.selectTextSubtitle}>
                    {getTipoTexto(membroSelecionado.tipo)}
                  </Text>
                </View>
              ) : (
                <Text style={styles.selectTextPlaceholder}>
                  Selecione um membro
                </Text>
              )}
            </View>
            <Ionicons name="chevron-down" size={20} color="#0A2C5E" />
          </TouchableOpacity>

          {loadingMembros && (
            <Text style={styles.loadingText}>Carregando membros...</Text>
          )}

          {/* Mostrar quantidade de membros encontrados */}
          {!loadingMembros && (
            <Text style={styles.debugText}>
              {membrosFamilia.length > 0
                ? `✅ ${membrosFamilia.length} membro(s) encontrado(s)`
                : "❌ Nenhum membro encontrado"}
            </Text>
          )}
        </View>

        {/* Botão Agendar */}
        <TouchableOpacity style={styles.botaoAgendar} onPress={handleAgendar}>
          <Text style={styles.textoBotao}>Agendar Lembrete</Text>
        </TouchableOpacity>

        <View style={styles.espacoSeguro} />
      </ScrollView>

      {/* Modal para selecionar membro */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Selecione um Membro ({membrosFamilia.length})
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#0A2C5E" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={membrosFamilia}
              renderItem={renderItemMembro}
              keyExtractor={(item) => `${item.tipo}-${item.id}`}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="people-outline" size={50} color="#999" />
                  <Text style={styles.emptyText}>Nenhum membro cadastrado</Text>
                  <Text style={styles.emptySubtext}>
                    Verifique o console para logs de busca
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

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
  selectButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#0A2C5E",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectContent: {
    flex: 1,
  },
  selectTextSelected: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  selectTextSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  selectTextPlaceholder: {
    fontSize: 16,
    color: "#999",
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    fontStyle: "italic",
  },
  debugText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    fontStyle: "italic",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A2C5E",
  },
  membroItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  membroItemSelecionado: {
    backgroundColor: "#E6F2FF",
  },
  membroInfo: {
    flex: 1,
  },
  membroHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  membroNome: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  membroTipo: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  membroEmail: {
    fontSize: 14,
    color: "#666",
    marginLeft: 34,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
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
  espacoSeguro: {
    height: 30,
  },
});
