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
import { collection, getDocs } from "firebase/firestore";

type Membro = {
  id: string;
  email?: string;
  nome?: string;
  tipo: string; // 'crianca', 'idoso', 'pet'
  // Adicionando informações básicas de saúde para pré-preenchimento
  idade?: number;
  condicoes?: string[];
  alergias?: string[];
};

type SaudeInfo = {
  // Informações gerais para todos os tipos
  condicoesClinicas?: string;
  alergias?: string;
  historicoCirurgias?: string;
  observacoesMedicas?: string;

  // Específico para cada tipo
  semanasGestacao?: string; // Para gestantes
  peso?: string; // Para crianças, adolescentes
  altura?: string;
  desenvolvimento?: string;
  medicamentosContinuos?: string; // Para idosos
  especie?: string; // Para pets
  vacinasObrigatorias?: string; // Para pets

  // Informações de exame/consulta
  tipoExame?: string;
  especialidade?: string;
  profissional?: string;
  local?: string;
  resultado?: string;

  // Vacina
  nomeVacina?: string;
  doseVacina?: string;
  statusVacina?: string;
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

  // Estado para informações de saúde
  const [saudeInfo, setSaudeInfo] = useState<SaudeInfo>({});

  const currentUser = auth.currentUser;

  useEffect(() => {
    const buscarMembrosFamilia = async () => {
      console.log("🔍 Iniciando busca de membros...");

      try {
        setLoadingMembros(true);
        const membros: Membro[] = [];

        // Buscar crianças
        const criancaRef = collection(db, "crianca");
        const criancaSnap = await getDocs(criancaRef);
        criancaSnap.forEach((doc) => {
          const data = doc.data();
          membros.push({
            id: doc.id,
            nome: data.nome || "Criança sem nome",
            email: data.email || data.responsavel_email || "Sem email",
            tipo: "criança",
            idade: data.idade,
            condicoes: data.condicoesClinicas,
            alergias: data.alergias,
          });
        });

        // Buscar idosos
        const idosoRef = collection(db, "idoso");
        const idosoSnap = await getDocs(idosoRef);
        idosoSnap.forEach((doc) => {
          const data = doc.data();
          membros.push({
            id: doc.id,
            nome: data.nome || "Idoso sem nome",
            email: data.email || "Sem email",
            tipo: "idoso",
            idade: data.idade,
            condicoes: data.doencasCronicas,
            alergias: data.alergias,
          });
        });

        // Buscar pets
        const petRef = collection(db, "pet");
        const petSnap = await getDocs(petRef);
        petSnap.forEach((doc) => {
          const data = doc.data();
          membros.push({
            id: doc.id,
            nome: data.nome || "Pet sem nome",
            email: data.email || data.responsavel_email || "Sem email",
            tipo: "pet",
            especie: data.especie,
          });
        });

        console.log("🎯 Total de membros encontrados:", membros.length);
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

  // Quando selecionar um membro, carrega informações prévias
  const handleSelectMembro = (membro: Membro) => {
    setMembroSelecionado(membro);
    setModalVisible(false);

    // Pré-preenche algumas informações baseadas no tipo
    if (membro.tipo === "criança" && membro.condicoes) {
      setSaudeInfo((prev) => ({
        ...prev,
        condicoesClinicas: Array.isArray(membro.condicoes)
          ? membro.condicoes.join(", ")
          : membro.condicoes,
        alergias: Array.isArray(membro.alergias)
          ? membro.alergias.join(", ")
          : membro.alergias,
      }));
    } else if (membro.tipo === "idoso" && membro.condicoes) {
      setSaudeInfo((prev) => ({
        ...prev,
        condicoesClinicas: Array.isArray(membro.condicoes)
          ? membro.condicoes.join(", ")
          : membro.condicoes,
        alergias: Array.isArray(membro.alergias)
          ? membro.alergias.join(", ")
          : membro.alergias,
      }));
    }
  };

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

        // Informações de saúde adicionadas
        informacoes_saude: saudeInfo,

        // Campos específicos baseados no tipo de evento
        ...(tipoEvento.includes("Consulta") && {
          especialidade: saudeInfo.especialidade,
          profissional: saudeInfo.profissional,
          local: saudeInfo.local,
        }),

        ...(tipoEvento.includes("Exame") && {
          tipo_exame: saudeInfo.tipoExame,
          resultado: saudeInfo.resultado,
        }),

        ...(tipoEvento.includes("Vacina") && {
          nome_vacina: saudeInfo.nomeVacina,
          dose_vacina: saudeInfo.doseVacina,
          status_vacina: saudeInfo.statusVacina,
        }),

        ...(membroSelecionado.tipo === "gestante" && {
          semanas_gestacao: saudeInfo.semanasGestacao,
        }),

        ...(membroSelecionado.tipo === "criança" && {
          peso: saudeInfo.peso,
          altura: saudeInfo.altura,
          desenvolvimento: saudeInfo.desenvolvimento,
        }),

        ...(membroSelecionado.tipo === "idoso" && {
          medicamentos_continuos: saudeInfo.medicamentosContinuos,
        }),

        ...(membroSelecionado.tipo === "pet" && {
          especie: saudeInfo.especie,
          vacinas_obrigatorias: saudeInfo.vacinasObrigatorias,
        }),
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

  // Renderiza campos específicos baseados no tipo de membro
  const renderCamposEspecificos = () => {
    if (!membroSelecionado) return null;

    switch (membroSelecionado.tipo) {
      case "criança":
        return (
          <View style={styles.secaoEspecifica}>
            <Text style={styles.secaoTitulo}>Informações da Criança</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Peso (kg)</Text>
              <TextInput
                style={styles.input}
                value={saudeInfo.peso || ""}
                onChangeText={(text) =>
                  setSaudeInfo({ ...saudeInfo, peso: text })
                }
                placeholder="Ex: 15.5"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Altura (cm)</Text>
              <TextInput
                style={styles.input}
                value={saudeInfo.altura || ""}
                onChangeText={(text) =>
                  setSaudeInfo({ ...saudeInfo, altura: text })
                }
                placeholder="Ex: 95"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Desenvolvimento</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={saudeInfo.desenvolvimento || ""}
                onChangeText={(text) =>
                  setSaudeInfo({ ...saudeInfo, desenvolvimento: text })
                }
                placeholder="Observações sobre desenvolvimento motor/cognitivo"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        );

      case "idoso":
        return (
          <View style={styles.secaoEspecifica}>
            <Text style={styles.secaoTitulo}>Informações do Idoso</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Medicamentos Contínuos</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={saudeInfo.medicamentosContinuos || ""}
                onChangeText={(text) =>
                  setSaudeInfo({ ...saudeInfo, medicamentosContinuos: text })
                }
                placeholder="Liste os medicamentos em uso"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        );

      case "pet":
        return (
          <View style={styles.secaoEspecifica}>
            <Text style={styles.secaoTitulo}>Informações do Pet</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Espécie</Text>
              <TextInput
                style={styles.input}
                value={saudeInfo.especie || ""}
                onChangeText={(text) =>
                  setSaudeInfo({ ...saudeInfo, especie: text })
                }
                placeholder="Cachorro, Gato, etc."
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Vacinas Obrigatórias</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={saudeInfo.vacinasObrigatorias || ""}
                onChangeText={(text) =>
                  setSaudeInfo({ ...saudeInfo, vacinasObrigatorias: text })
                }
                placeholder="Vacinas necessárias"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  // Renderiza campos baseados no tipo de evento
  const renderCamposPorTipoEvento = () => {
    switch (tipoEvento) {
      case "Consulta":
        return (
          <View style={styles.secaoEspecifica}>
            <Text style={styles.secaoTitulo}>Detalhes da Consulta</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Especialidade</Text>
              <TextInput
                style={styles.input}
                value={saudeInfo.especialidade || ""}
                onChangeText={(text) =>
                  setSaudeInfo({ ...saudeInfo, especialidade: text })
                }
                placeholder="Ex: Pediatria, Clínica Geral"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Profissional</Text>
              <TextInput
                style={styles.input}
                value={saudeInfo.profissional || ""}
                onChangeText={(text) =>
                  setSaudeInfo({ ...saudeInfo, profissional: text })
                }
                placeholder="Nome do médico"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Local</Text>
              <TextInput
                style={styles.input}
                value={saudeInfo.local || ""}
                onChangeText={(text) =>
                  setSaudeInfo({ ...saudeInfo, local: text })
                }
                placeholder="Clínica, Hospital"
              />
            </View>
          </View>
        );

      case "Exame":
        return (
          <View style={styles.secaoEspecifica}>
            <Text style={styles.secaoTitulo}>Detalhes do Exame</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tipo de Exame</Text>
              <TextInput
                style={styles.input}
                value={saudeInfo.tipoExame || ""}
                onChangeText={(text) =>
                  setSaudeInfo({ ...saudeInfo, tipoExame: text })
                }
                placeholder="Ex: Hemograma, Raio-X"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Resultado/Acompanhamento</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={saudeInfo.resultado || ""}
                onChangeText={(text) =>
                  setSaudeInfo({ ...saudeInfo, resultado: text })
                }
                placeholder="Observações ou resultados"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        );

      case "Vacina":
        return (
          <View style={styles.secaoEspecifica}>
            <Text style={styles.secaoTitulo}>Detalhes da Vacina</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome da Vacina</Text>
              <TextInput
                style={styles.input}
                value={saudeInfo.nomeVacina || ""}
                onChangeText={(text) =>
                  setSaudeInfo({ ...saudeInfo, nomeVacina: text })
                }
                placeholder="Ex: Hepatite B, Influenza"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Dose</Text>
              <TextInput
                style={styles.input}
                value={saudeInfo.doseVacina || ""}
                onChangeText={(text) =>
                  setSaudeInfo({ ...saudeInfo, doseVacina: text })
                }
                placeholder="Ex: 1ª dose, Reforço"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusContainer}>
                {["Pendente", "Aplicada", "Atrasada"].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusOption,
                      saudeInfo.statusVacina === status &&
                        styles.statusOptionSelected,
                    ]}
                    onPress={() =>
                      setSaudeInfo({ ...saudeInfo, statusVacina: status })
                    }
                  >
                    <Text
                      style={[
                        styles.statusText,
                        saudeInfo.statusVacina === status &&
                          styles.statusTextSelected,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      default:
        return null;
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
      onPress={() => handleSelectMembro(item)}
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
        {item.idade && (
          <Text style={styles.membroInfoExtra}>Idade: {item.idade} anos</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Topo centralizado */}
      <View style={styles.topo}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.titulo}>Agendar Evento</Text>
        <Text style={styles.subtitulo}>
          Preencha os dados para seu evento de saúde
        </Text>
      </View>

      {/* Formulário */}
      <ScrollView
        style={styles.conteudo}
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Informações Básicas do Evento */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Informações Básicas</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome do Evento *</Text>
            <TextInput
              style={styles.input}
              value={nomeEvento}
              onChangeText={setNomeEvento}
              placeholder="Digite o nome do evento"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo do Evento *</Text>
            <View style={styles.tipoContainer}>
              {["Consulta", "Exame", "Vacina", "Medicamento"].map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={[
                    styles.tipoOption,
                    tipoEvento === tipo && styles.tipoOptionSelected,
                  ]}
                  onPress={() => setTipoEvento(tipo)}
                >
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

          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={styles.label}>Data *</Text>
              <TextInput
                style={styles.input}
                value={data}
                onChangeText={setData}
                placeholder="DD/MM/AAAA"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={styles.label}>Horário *</Text>
              <TextInput
                style={styles.input}
                value={horario}
                onChangeText={setHorario}
                placeholder="HH:MM"
              />
            </View>
          </View>

          {/* Campo Membro da Família */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Membro da Família *</Text>
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
          </View>
        </View>

        {/* Informações Gerais de Saúde (para todos) */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Informações de Saúde</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Condições Clínicas</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={saudeInfo.condicoesClinicas || ""}
              onChangeText={(text) =>
                setSaudeInfo({ ...saudeInfo, condicoesClinicas: text })
              }
              placeholder="Doenças crônicas, deficiências, etc."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Alergias</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={saudeInfo.alergias || ""}
              onChangeText={(text) =>
                setSaudeInfo({ ...saudeInfo, alergias: text })
              }
              placeholder="Alergias conhecidas"
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Histórico de Cirurgias</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={saudeInfo.historicoCirurgias || ""}
              onChangeText={(text) =>
                setSaudeInfo({ ...saudeInfo, historicoCirurgias: text })
              }
              placeholder="Cirurgias anteriores"
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Observações Médicas</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={saudeInfo.observacoesMedicas || ""}
              onChangeText={(text) =>
                setSaudeInfo({ ...saudeInfo, observacoesMedicas: text })
              }
              placeholder="Observações importantes"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Campos específicos por tipo de evento */}
        {renderCamposPorTipoEvento()}

        {/* Campos específicos por tipo de membro */}
        {renderCamposEspecificos()}

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
    </KeyboardAvoidingView>
  );
}

// ESTILOS ATUALIZADOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  secao: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  secaoEspecifica: {
    backgroundColor: "#f0f7ff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#d0e4ff",
  },
  secaoTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A2C5E",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  halfInput: {
    width: "48%",
  },
  label: {
    fontSize: 16,
    color: "#0A2C5E",
    marginBottom: 8,
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
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  tipoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tipoOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#e8e8e8",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tipoOptionSelected: {
    backgroundColor: "#0A2C5E",
    borderColor: "#0A2C5E",
  },
  tipoText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  tipoTextSelected: {
    color: "#fff",
  },
  statusContainer: {
    flexDirection: "row",
    gap: 8,
  },
  statusOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  statusOptionSelected: {
    backgroundColor: "#0A2C5E",
    borderColor: "#0A2C5E",
  },
  statusText: {
    fontSize: 14,
    color: "#333",
  },
  statusTextSelected: {
    color: "#fff",
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
  botaoAgendar: {
    backgroundColor: "#194c83",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
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
    marginTop: 2,
  },
  membroInfoExtra: {
    fontSize: 12,
    color: "#888",
    marginLeft: 34,
    marginTop: 2,
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
  navbar: {
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
