import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Importando Firebase
import { db } from "./firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

// Interface genérica para todos os tipos de membros
interface Membro {
  id: string;
  nomeCompleto: string;
  email: string;
  sexo: string;
  tipoUsuario: string;
  criadoEm?: any;
  dataNascimento?: string;
  // Campos específicos para cada tipo
  raca?: string;
  tipoAnimal?: string;
  escola?: string;
  serie?: string;
  condicoesMedicas?: string;
  medicamentos?: string;
}

export default function Cadastrados() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pets" | "criancas" | "idosos">(
    "pets"
  );
  const [pets, setPets] = useState<Membro[]>([]);
  const [criancas, setCriancas] = useState<Membro[]>([]);
  const [idosos, setIdosos] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar todos os membros do Firestore
  const fetchMembros = async () => {
    try {
      setLoading(true);

      // Buscar Pets
      const petsSnapshot = await getDocs(collection(db, "pet"));
      const petsData: Membro[] = [];
      petsSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        petsData.push({
          id: docSnap.id,
          nomeCompleto: data.nomeCompleto || data.nome || "Sem nome",
          email: data.email || "Sem email",
          sexo: data.sexo || "Não informado",
          tipoUsuario: "pet",
          dataNascimento:
            data.dataNascimento || data.datanascimento || "Não informada",
          raca: data.raca || "Não informada",
          tipoAnimal: data.tipoAnimal || data.tipoanimal || "Não informado",
          criadoEm: data.criadoEm || data.criadoem,
        });
      });
      setPets(petsData);

      // Buscar Crianças
      const criancasSnapshot = await getDocs(collection(db, "crianca"));
      const criancasData: Membro[] = [];
      criancasSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        criancasData.push({
          id: docSnap.id,
          nomeCompleto: data.nomeCompleto || data.nome || "Sem nome",
          email: data.email || "Sem email",
          sexo: data.sexo || "Não informado",
          tipoUsuario: "crianca",
          dataNascimento:
            data.dataNascimento || data.datanascimento || "Não informada",
          escola: data.escola || "Não informada",
          serie: data.serie || data.série || "Não informada",
          criadoEm: data.criadoEm || data.criadoem,
        });
      });
      setCriancas(criancasData);

      // Buscar Idosos
      const idososSnapshot = await getDocs(collection(db, "idoso"));
      const idososData: Membro[] = [];
      idososSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        idososData.push({
          id: docSnap.id,
          nomeCompleto: data.nomeCompleto || data.nome || "Sem nome",
          email: data.email || "Sem email",
          sexo: data.sexo || "Não informado",
          tipoUsuario: "idoso",
          dataNascimento:
            data.dataNascimento || data.datanascimento || "Não informada",
          condicoesMedicas:
            data.condicoesMedicas || data.condicoes || "Não informada",
          medicamentos: data.medicamentos || "Não informado",
          criadoEm: data.criadoEm || data.criadoem,
        });
      });
      setIdosos(idososData);
    } catch (error) {
      console.error("Erro ao buscar membros:", error);
      Alert.alert("Erro", "Não foi possível carregar os membros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembros();
  }, []);

  // Obter dados atuais baseado na aba selecionada
  const getCurrentData = () => {
    switch (activeTab) {
      case "pets":
        return pets;
      case "criancas":
        return criancas;
      case "idosos":
        return idosos;
      default:
        return [];
    }
  };

  // Obter nome da coleção para exclusão
  const getCollectionName = () => {
    switch (activeTab) {
      case "pets":
        return "pet";
      case "criancas":
        return "crianca";
      case "idosos":
        return "idoso";
      default:
        return "";
    }
  };

  // Obter mensagem para lista vazia
  const getEmptyMessage = () => {
    switch (activeTab) {
      case "pets":
        return "Nenhum pet cadastrado";
      case "criancas":
        return "Nenhuma criança cadastrada";
      case "idosos":
        return "Nenhum idoso cadastrado";
      default:
        return "Nenhum membro cadastrado";
    }
  };

  // Obter ícone para lista vazia
  const getEmptyIcon = () => {
    switch (activeTab) {
      case "pets":
        return "paw";
      case "criancas":
        return "heart";
      case "idosos":
        return "person";
      default:
        return "people";
    }
  };

  // 🔥🔥🔥 FUNÇÃO DE EXCLUSÃO DIRETA COM DIAGNÓSTICO COMPLETO
  const deletarMembroDireto = async (membroId: string, membroNome: string) => {
    console.log("🟡 INICIANDO EXCLUSÃO DIRETA");
    console.log("ID:", membroId);
    console.log("Nome:", membroNome);
    console.log("Aba ativa:", activeTab);
    console.log("Coleção:", getCollectionName());

    try {
      // 1. VALIDAR DADOS
      if (!membroId || membroId.trim() === "") {
        console.log("🔴 ERRO: ID vazio ou inválido");
        Alert.alert("Erro", "ID do membro inválido");
        return;
      }

      const collectionName = getCollectionName();
      if (!collectionName) {
        console.log("🔴 ERRO: Nome da coleção inválido");
        Alert.alert("Erro", "Tipo de membro inválido");
        return;
      }

      // 2. CRIAR REFERÊNCIA
      console.log(`📁 Criando referência: ${collectionName}/${membroId}`);
      const membroDocRef = doc(db, collectionName, membroId);
      console.log("✅ Referência criada:", membroDocRef.path);

      // 3. EXECUTAR EXCLUSÃO
      console.log("🗑️ Executando deleteDoc...");
      await deleteDoc(membroDocRef);
      console.log("✅ Documento excluído com sucesso no Firebase!");

      // 4. ATUALIZAR ESTADO LOCAL
      console.log("🔄 Atualizando estado local...");
      switch (activeTab) {
        case "pets":
          setPets((prev) => {
            const novosPets = prev.filter((membro) => membro.id !== membroId);
            console.log(`📊 Pets atualizados: ${novosPets.length} restantes`);
            return novosPets;
          });
          break;
        case "criancas":
          setCriancas((prev) => {
            const novasCriancas = prev.filter(
              (membro) => membro.id !== membroId
            );
            console.log(
              `📊 Crianças atualizadas: ${novasCriancas.length} restantes`
            );
            return novasCriancas;
          });
          break;
        case "idosos":
          setIdosos((prev) => {
            const novosIdosos = prev.filter((membro) => membro.id !== membroId);
            console.log(
              `📊 Idosos atualizados: ${novosIdosos.length} restantes`
            );
            return novosIdosos;
          });
          break;
      }

      // 5. FEEDBACK POSITIVO
      Alert.alert("Sucesso", `${membroNome} excluído com sucesso!`);
    } catch (error: any) {
      // 6. TRATAMENTO DETALHADO DE ERRO
      console.error("🔴 ERRO COMPLETO NA EXCLUSÃO:", error);
      console.log("🔴 Código do erro:", error.code);
      console.log("🔴 Mensagem do erro:", error.message);
      console.log("🔴 Stack:", error.stack);

      let mensagemErro = "Erro desconhecido";

      if (error.code === "permission-denied") {
        mensagemErro =
          "Sem permissão para excluir. Verifique as regras do Firebase.";
      } else if (error.code === "not-found") {
        mensagemErro = "Documento não encontrado. Pode já ter sido excluído.";
      } else if (error.code === "invalid-argument") {
        mensagemErro = "ID do documento inválido.";
      } else {
        mensagemErro = error.message || "Erro ao conectar com o Firebase";
      }

      Alert.alert("Erro na Exclusão", mensagemErro);
    }
  };

  // Renderizar detalhes específicos de cada tipo
  const renderDetalhesEspecificos = (membro: Membro) => {
    switch (membro.tipoUsuario) {
      case "pet":
        return (
          <>
            <Text style={styles.petDetails}>
              {membro.tipoAnimal} • {membro.raca}
            </Text>
            <Text style={styles.petDetails}>
              Nascimento: {membro.dataNascimento}
            </Text>
            <Text style={styles.petDetails}>Sexo: {membro.sexo}</Text>
          </>
        );
      case "crianca":
        return (
          <>
            <Text style={styles.petDetails}>
              Nascimento: {membro.dataNascimento}
            </Text>
            <Text style={styles.petDetails}>Sexo: {membro.sexo}</Text>
            <Text style={styles.petDetails}>Escola: {membro.escola}</Text>
            <Text style={styles.petDetails}>Série: {membro.serie}</Text>
          </>
        );
      case "idoso":
        return (
          <>
            <Text style={styles.petDetails}>
              Nascimento: {membro.dataNascimento}
            </Text>
            <Text style={styles.petDetails}>Sexo: {membro.sexo}</Text>
            <Text style={styles.petDetails}>
              Condições: {membro.condicoesMedicas}
            </Text>
            <Text style={styles.petDetails}>
              Medicamentos: {membro.medicamentos}
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A2C5E" />
        <Text style={styles.loadingText}>Carregando membros...</Text>
      </View>
    );
  }

  const currentData = getCurrentData();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#0A2C5E" />
        </TouchableOpacity>

        <Text style={styles.title}>Membros Cadastrados</Text>

        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "pets" && styles.activeTab]}
          onPress={() => setActiveTab("pets")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "pets" && styles.activeTabText,
            ]}
          >
            Pets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "criancas" && styles.activeTab]}
          onPress={() => setActiveTab("criancas")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "criancas" && styles.activeTabText,
            ]}
          >
            Crianças
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "idosos" && styles.activeTab]}
          onPress={() => setActiveTab("idosos")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "idosos" && styles.activeTabText,
            ]}
          >
            Idosos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Membros */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {currentData.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name={getEmptyIcon()} size={64} color="#CCCCCC" />
              <Text style={styles.emptyStateTitle}>{getEmptyMessage()}</Text>
              <Text style={styles.emptyStateText}>
                {activeTab === "pets"
                  ? "Você ainda não cadastrou nenhum pet na família"
                  : activeTab === "criancas"
                  ? "Você ainda não cadastrou nenhuma criança na família"
                  : "Você ainda não cadastrou nenhum idoso na família"}
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.subtitle}>
                {currentData.length}{" "}
                {activeTab === "pets"
                  ? "pet"
                  : activeTab === "criancas"
                  ? "criança"
                  : "idoso"}
                {currentData.length !== 1 ? "s" : ""} cadastrado
                {currentData.length !== 1 ? "s" : ""}
              </Text>

              {currentData.map((membro) => (
                <View key={membro.id} style={styles.petCard}>
                  <View style={styles.petInfo}>
                    <Text style={styles.petName}>{membro.nomeCompleto}</Text>
                    <Text style={styles.petDetails}>Email: {membro.email}</Text>
                    {renderDetalhesEspecificos(membro)}
                    <Text style={styles.petDetails}>ID: {membro.id}</Text>
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() =>
                        deletarMembroDireto(membro.id, membro.nomeCompleto)
                      }
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#FF3B30"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// Mantenha os mesmos estilos...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: { marginTop: 16, fontSize: 16, color: "#666666" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#F8F9FA",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  backButton: { padding: 8 },
  title: { fontSize: 20, fontWeight: "bold", color: "#0A2C5E" },
  placeholder: { width: 40 },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#0A2C5E",
  },
  tabText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#0A2C5E",
    fontWeight: "bold",
  },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 20 },
  subtitle: { fontSize: 16, color: "#666666", marginTop: 20, marginBottom: 16 },
  petCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  petInfo: { flex: 1, marginRight: 12 },
  petName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A2C5E",
    marginBottom: 4,
  },
  petDetails: { fontSize: 14, color: "#666666", marginBottom: 2 },
  actions: { flexDirection: "row" },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  deleteButton: { borderColor: "#FF3B30", backgroundColor: "#FFF0F0" },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    lineHeight: 20,
  },
});
