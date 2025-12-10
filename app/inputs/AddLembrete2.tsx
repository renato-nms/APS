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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

type Membro = {
  id: string;
  nome: string;
  tipo: string; // 'crianca', 'idoso', 'pet', 'adulto', 'gestante'
  email?: string;
};

export default function AgendarLembrete() {
  const [nomeEvento, setNomeEvento] = useState("");
  const [tipoEvento, setTipoEvento] = useState("Consulta");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [membrosFamilia, setMembrosFamilia] = useState<Membro[]>([]);
  const [membroSelecionado, setMembroSelecionado] = useState<Membro | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detalhesAdicionais, setDetalhesAdicionais] = useState("");

  const currentUser = auth.currentUser;

  // Buscar membros da família do banco de dados
  useEffect(() => {
    const buscarMembrosFamilia = async () => {
      try {
        setLoading(true);
        const membros: Membro[] = [];

        // Buscar em todas as coleções de membros
        const colecoes = ["crianca", "idoso", "pet", "adulto", "gestante"];

        for (const colecao of colecoes) {
          try {
            const ref = collection(db, colecao);
            const snap = await getDocs(ref);

            snap.forEach((doc) => {
              const data = doc.data();
              membros.push({
                id: doc.id,
                nome: data.nome || `Membro ${colecao}`,
                tipo: colecao,
                email: data.email || data.responsavel_email,
              });
            });
          } catch (error) {
            console.log(`Coleção ${colecao} não encontrada ou vazia`);
          }
        }

        // Adicionar o próprio usuário como opção
        if (currentUser?.email) {
          membros.push({
            id: currentUser.uid,
            nome: "Eu mesmo(a)",
            tipo: "adulto",
            email: currentUser.email,
          });
        }

        setMembrosFamilia(membros);
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
      } finally {
        setLoading(false);
      }
    };

    buscarMembrosFamilia();
  }, []);

  const handleAgendar = async () => {
    // Validações
    if (!nomeEvento.trim()) {
      Alert.alert("Erro", "Por favor, informe o nome do evento");
      return;
    }

    if (!data.trim()) {
      Alert.alert("Erro", "Por favor, informe a data do evento");
      return;
    }

    if (!horario.trim()) {
      Alert.alert("Erro", "Por favor, informe o horário do evento");
      return;
    }

    if (!membroSelecionado) {
      Alert.alert("Erro", "Por favor, selecione um membro da família");
      return;
    }

    try {
      setLoading(true);
      const lembretesRef = collection(db, "lembretes");

      const novoLembrete = {
        // Dados básicos obrigatórios
        tipo: tipoEvento,
        nome: nomeEvento.trim(),
        data: data.trim(),
        horario: horario.trim(),
        detalhes: detalhesAdicionais.trim(),

        // Informações do membro
        membro_id: membroSelecionado.id,
        membro_nome: membroSelecionado.nome,
        membro_tipo: membroSelecionado.tipo,
        membro_email: membroSelecionado.email || "",

        // Informações do criador
        criado_por: currentUser?.uid || "",
        criado_por_email: currentUser?.email || "",
        criado_em: new Date(),

        // Status e notificações
        status: "agendado",
        notificado: false,
        lembrado: false,

        // Metadados
        prioridade: "media",
        recorrente: false,
      };

      await addDoc(lembretesRef, novoLembrete);

      Alert.alert(
        "Sucesso!",
        `Lembrete "${nomeEvento}" agendado para ${membroSelecionado.nome} com sucesso!`,
        [
          {
            text: "OK",
            onPress: () => {
              // Limpar formulário
              setNomeEvento("");
              setData("");
              setHorario("");
              setDetalhesAdicionais("");
              setMembroSelecionado(null);
              // Voltar para tela de lembretes
              router.push("/Lembrete");
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Erro ao agendar:", error);
      Alert.alert(
        "Erro",
        `Não foi possível agendar o lembrete: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const formatarDataExemplo = () => {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, "0");
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = hoje.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const formatarHorarioExemplo = () => {
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, "0");
    const minutos = String(agora.getMinutes()).padStart(2, "0");
    return `${horas}:${minutos}`;
  };

  const getIconeTipo = (tipo: string) => {
    switch (tipo) {
      case "Consulta":
        return "medical-outline";
      case "Exame":
        return "document-text-outline";
      case "Vacina":
        return "shield-outline";
      case "Medicamento":
        return "medkit-outline";
      default:
        return "calendar-outline";
    }
  };

  const getIconeMembro = (tipo: string) => {
    switch (tipo) {
      case "crianca":
        return "👶";
      case "idoso":
        return "👴";
      case "pet":
        return "🐾";
      case "gestante":
        return "🤰";
      default:
        return "👤";
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#0A2C5E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Novo Lembrete</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Card Principal */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Informações do Evento</Text>

          {/* Campo: Nome do Evento */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="pencil-outline" size={16} color="#0A2C5E" /> Nome
              do Evento *
            </Text>
            <TextInput
              style={styles.input}
              value={nomeEvento}
              onChangeText={setNomeEvento}
              placeholder="Ex: Consulta com cardiologista, Vacina H1N1, Exame de sangue"
              placeholderTextColor="#999"
            />
          </View>

          {/* Campo: Tipo de Evento */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="list-outline" size={16} color="#0A2C5E" /> Tipo de
              Evento *
            </Text>
            <View style={styles.tipoContainer}>
              {["Consulta", "Exame", "Vacina", "Medicamento"].map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={[
                    styles.tipoButton,
                    tipoEvento === tipo && styles.tipoButtonSelected,
                  ]}
                  onPress={() => setTipoEvento(tipo)}
                >
                  <Ionicons
                    name={getIconeTipo(tipo)}
                    size={20}
                    color={tipoEvento === tipo ? "#FFFFFF" : "#0A2C5E"}
                  />
                  <Text
                    style={[
                      styles.tipoText,
                      tipoEvento === tipo && styles.tipoTextSelected,
                    ]}
                  >
                    {tipo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Campos: Data e Horário */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>
                <Ionicons name="calendar-outline" size={16} color="#0A2C5E" />{" "}
                Data *
              </Text>
              <TextInput
                style={styles.input}
                value={data}
                onChangeText={setData}
                placeholder={`Ex: ${formatarDataExemplo()}`}
                placeholderTextColor="#999"
              />
              <Text style={styles.hint}>Formato: DD/MM/AAAA</Text>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>
                <Ionicons name="time-outline" size={16} color="#0A2C5E" />{" "}
                Horário *
              </Text>
              <TextInput
                style={styles.input}
                value={horario}
                onChangeText={setHorario}
                placeholder={`Ex: ${formatarHorarioExemplo()}`}
                placeholderTextColor="#999"
              />
              <Text style={styles.hint}>Formato: HH:MM</Text>
            </View>
          </View>

          {/* Campo: Membro da Família */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="people-outline" size={16} color="#0A2C5E" /> Para
              quem é o evento? *
            </Text>

            <TouchableOpacity
              style={styles.membroSelector}
              onPress={() => setModalVisible(true)}
            >
              {membroSelecionado ? (
                <View style={styles.membroSelecionadoContainer}>
                  <Text style={styles.membroIcon}>
                    {getIconeMembro(membroSelecionado.tipo)}
                  </Text>
                  <View style={styles.membroInfo}>
                    <Text style={styles.membroNome}>
                      {membroSelecionado.nome}
                    </Text>
                    <Text style={styles.membroTipo}>
                      {membroSelecionado.tipo.charAt(0).toUpperCase() +
                        membroSelecionado.tipo.slice(1)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </View>
              ) : (
                <View style={styles.membroPlaceholderContainer}>
                  <Ionicons name="person-add-outline" size={20} color="#999" />
                  <Text style={styles.membroPlaceholder}>
                    Selecione um membro
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#999" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Campo: Detalhes Adicionais */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#0A2C5E"
              />{" "}
              Detalhes Adicionais (Opcional)
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={detalhesAdicionais}
              onChangeText={setDetalhesAdicionais}
              placeholder="Observações, instruções, endereço, nome do médico, etc."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Informações sobre notificações */}
          <View style={styles.infoBox}>
            <Ionicons name="notifications-outline" size={20} color="#0A2C5E" />
            <Text style={styles.infoText}>
              Você receberá notificações automáticas antes do evento.
            </Text>
          </View>
        </View>

        {/* Botão de Agendar */}
        <TouchableOpacity
          style={[
            styles.agendarButton,
            loading && styles.agendarButtonDisabled,
          ]}
          onPress={handleAgendar}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
              <Text style={styles.agendarButtonText}>Processando...</Text>
            </View>
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.agendarButtonText}>Agendar Evento</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.spacer} />
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
              <Text style={styles.modalTitle}>Selecione um Membro</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#0A2C5E" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={membrosFamilia}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.membroItem,
                    membroSelecionado?.id === item.id &&
                      styles.membroItemSelected,
                  ]}
                  onPress={() => {
                    setMembroSelecionado(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.membroItemIcon}>
                    {getIconeMembro(item.tipo)}
                  </Text>
                  <View style={styles.membroItemInfo}>
                    <Text style={styles.membroItemName}>{item.nome}</Text>
                    <Text style={styles.membroItemType}>
                      {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                    </Text>
                  </View>
                  {membroSelecionado?.id === item.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#0A2C5E"
                    />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Ionicons name="people-outline" size={50} color="#CCC" />
                  <Text style={styles.emptyText}>Nenhum membro cadastrado</Text>
                  <Text style={styles.emptySubtext}>
                    Cadastre membros na seção "Família"
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A2C5E",
  },
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A2C5E",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  hint: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    marginLeft: 4,
  },
  row: {
    flexDirection: "row",
  },
  tipoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tipoButton: {
    flex: 1,
    minWidth: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0A2C5E",
    gap: 8,
  },
  tipoButtonSelected: {
    backgroundColor: "#0A2C5E",
    borderColor: "#0A2C5E",
  },
  tipoText: {
    fontSize: 14,
    color: "#0A2C5E",
    fontWeight: "500",
  },
  tipoTextSelected: {
    color: "#FFFFFF",
  },
  membroSelector: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
  },
  membroSelecionadoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  membroPlaceholderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  membroIcon: {
    fontSize: 24,
  },
  membroInfo: {
    flex: 1,
    marginLeft: 12,
  },
  membroNome: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  membroTipo: {
    fontSize: 14,
    color: "#666",
  },
  membroPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: "#999",
    marginLeft: 12,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F2FF",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#0A2C5E",
  },
  agendarButton: {
    backgroundColor: "#0A2C5E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,
    gap: 10,
  },
  agendarButtonDisabled: {
    backgroundColor: "#666",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  agendarButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  spacer: {
    height: 20,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A2C5E",
  },
  membroItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  membroItemSelected: {
    backgroundColor: "#F0F8FF",
  },
  membroItemIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  membroItemInfo: {
    flex: 1,
  },
  membroItemName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  membroItemType: {
    fontSize: 14,
    color: "#666",
  },
  emptyList: {
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
});
