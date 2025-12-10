import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { auth, db } from "./firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from "firebase/firestore";

export default function Lembrete() {
  const [lembretes, setLembretes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchLembretes = async () => {
      if (!currentUser) {
        setError("Usuário não autenticado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const lembretesRef = collection(db, "lembretes");

        // Buscar lembretes do usuário atual como criador OU como membro
        const q = query(
          lembretesRef,
          where("criado_por", "==", currentUser.uid)
        );

        const querySnapshot = await getDocs(q);
        const lembretesData: any[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          lembretesData.push({
            id: doc.id,
            ...data,
            // Converter timestamp para data legível se necessário
            criado_em: data.criado_em?.toDate?.() || data.criado_em,
          });
        });

        // Buscar também lembretes onde o usuário é o membro
        const q2 = query(
          lembretesRef,
          where("membro_id", "==", currentUser.uid)
        );

        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc) => {
          if (!lembretesData.find((l) => l.id === doc.id)) {
            const data = doc.data();
            lembretesData.push({
              id: doc.id,
              ...data,
              criado_em: data.criado_em?.toDate?.() || data.criado_em,
            });
          }
        });

        // Ordenar por data mais próxima
        lembretesData.sort((a, b) => {
          try {
            const dateA = new Date(a.data.split("/").reverse().join("-"));
            const dateB = new Date(b.data.split("/").reverse().join("-"));
            return dateA.getTime() - dateB.getTime();
          } catch {
            return 0;
          }
        });

        setLembretes(lembretesData);
      } catch (error: any) {
        console.error("Erro ao buscar lembretes:", error);
        setError(`Erro: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLembretes();
  }, [currentUser]);

  // Função para verificar se o lembrete é para hoje
  const isParaHoje = (dataString: string) => {
    try {
      const hoje = new Date().toLocaleDateString("pt-BR");
      return dataString === hoje;
    } catch {
      return false;
    }
  };

  // Função para verificar se o lembrete é amanhã
  const isAmanha = (dataString: string) => {
    try {
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      const amanhaFormatado = amanha.toLocaleDateString("pt-BR");
      return dataString === amanhaFormatado;
    } catch {
      return false;
    }
  };

  // Função para verificar se o lembrete está atrasado
  const isAtrasado = (dataString: string) => {
    try {
      const hoje = new Date();
      const dataLembrete = new Date(dataString.split("/").reverse().join("-"));
      return dataLembrete < hoje;
    } catch {
      return false;
    }
  };

  // Função para obter cor baseada no tipo de evento
  const getTipoCor = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case "consulta":
        return "#0A2C5E";
      case "exame":
        return "#2196F3";
      case "vacina":
        return "#4CAF50";
      case "medicamento":
        return "#FF9800";
      default:
        return "#666";
    }
  };

  // Função para obter ícone baseado no tipo de evento
  const getTipoIcone = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case "consulta":
        return "medical-outline";
      case "exame":
        return "document-text-outline";
      case "vacina":
        return "shield-outline";
      case "medicamento":
        return "medkit-outline";
      default:
        return "calendar-outline";
    }
  };

  // Função para formatar data
  const formatarData = (dataString: string) => {
    try {
      const [dia, mes, ano] = dataString.split("/");
      return `${dia}/${mes}`;
    } catch {
      return dataString;
    }
  };

  // Função para obter status do lembrete
  const getStatusLembrete = (lembrete: any) => {
    if (lembrete.status === "concluida")
      return { text: "CONCLUÍDO", color: "#4CAF50" };
    if (lembrete.status === "cancelada")
      return { text: "CANCELADO", color: "#F44336" };
    if (isAtrasado(lembrete.data))
      return { text: "ATRASADO", color: "#F44336" };
    if (isParaHoje(lembrete.data)) return { text: "HOJE", color: "#FF9800" };
    if (isAmanha(lembrete.data)) return { text: "AMANHÃ", color: "#FFC107" };
    return { text: "AGENDADO", color: "#0A2C5E" };
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/fundo_home.png")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Topo centralizado */}
        <View style={styles.topo}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.tituloPrincipal}>CADERNETA DIGITAL</Text>
          <Text style={styles.subtituloPrincipal}>DA FAMÍLIA</Text>
          <Text style={styles.titulo}>Lembretes</Text>
          <Text style={styles.subtitulo}>Seus próximos eventos de saúde</Text>
        </View>

        {/* Botões de ação */}
        <View style={styles.botoesAcao}>
          <TouchableOpacity
            style={styles.botaoAcao}
            onPress={() => router.push("/AddLembrete")}
          >
            <Ionicons name="calendar-outline" size={24} color="#ffffff" />
            <Text style={styles.textoBotaoAcao}>Adicionar lembrete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoAcao, styles.botaoSecundario]}
            onPress={() => router.push("./inputs/AddLembrete2")}
          >
            <Ionicons name="notifications-outline" size={24} color="#ffffff" />
            <Text style={styles.textoBotaoAcao}>Agendar evento</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Lembretes */}
        <ScrollView
          style={styles.conteudo}
          contentContainerStyle={styles.listaLembretes}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0A2C5E" />
              <Text style={styles.loadingText}>Carregando lembretes...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={50} color="#F44336" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.tentarNovamenteBtn}
                onPress={() => {
                  setLoading(true);
                  setError("");
                }}
              >
                <Text style={styles.tentarNovamenteText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : lembretes.length > 0 ? (
            <>
              {/* Resumo */}
              <View style={styles.resumoContainer}>
                <View style={styles.resumoItem}>
                  <Text style={styles.resumoNumero}>{lembretes.length}</Text>
                  <Text style={styles.resumoTexto}>Total</Text>
                </View>
                <View style={styles.resumoItem}>
                  <Text style={styles.resumoNumero}>
                    {lembretes.filter((l) => isParaHoje(l.data)).length}
                  </Text>
                  <Text style={styles.resumoTexto}>Hoje</Text>
                </View>
                <View style={styles.resumoItem}>
                  <Text style={styles.resumoNumero}>
                    {lembretes.filter((l) => isAmanha(l.data)).length}
                  </Text>
                  <Text style={styles.resumoTexto}>Amanhã</Text>
                </View>
              </View>

              {/* Lista de lembretes */}
              {lembretes.map((lembrete) => {
                const status = getStatusLembrete(lembrete);
                const tipoCor = getTipoCor(lembrete.tipo);
                const tipoIcone = getTipoIcone(lembrete.tipo);

                return (
                  <TouchableOpacity
                    key={lembrete.id}
                    style={styles.lembreteItem}
                    onPress={() => {
                      // Navegar para detalhes do lembrete
                      router.push(`/detalhesLembrete?id=${lembrete.id}`);
                    }}
                  >
                    {/* Barra lateral colorida */}
                    <View
                      style={[
                        styles.lembreteSidebar,
                        { backgroundColor: tipoCor },
                      ]}
                    />

                    <View style={styles.lembreteContent}>
                      {/* Cabeçalho */}
                      <View style={styles.lembreteHeader}>
                        <View style={styles.lembreteTipoContainer}>
                          <Ionicons
                            name={tipoIcone}
                            size={20}
                            color={tipoCor}
                          />
                          <Text style={styles.lembreteTipo}>
                            {lembrete.tipo?.toUpperCase()}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: status.color },
                          ]}
                        >
                          <Text style={styles.statusText}>{status.text}</Text>
                        </View>
                      </View>

                      {/* Nome do evento */}
                      <Text style={styles.lembreteNome}>{lembrete.nome}</Text>

                      {/* Data e horário */}
                      <View style={styles.lembreteInfoRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color="#666"
                        />
                        <Text style={styles.lembreteData}>
                          {formatarData(lembrete.data)} •{" "}
                          {lembrete.horario || "Horário não informado"}
                        </Text>
                      </View>

                      {/* Membro */}
                      <View style={styles.lembreteInfoRow}>
                        <Ionicons
                          name="person-outline"
                          size={16}
                          color="#666"
                        />
                        <Text style={styles.lembreteMembro}>
                          {lembrete.membro_nome ||
                            lembrete.membro ||
                            "Para: Eu mesmo(a)"}
                        </Text>
                      </View>

                      {/* Detalhes (se existir) */}
                      {lembrete.detalhes && (
                        <View style={styles.lembreteDetalhesContainer}>
                          <Text
                            style={styles.lembreteDetalhes}
                            numberOfLines={2}
                          >
                            {lembrete.detalhes}
                          </Text>
                        </View>
                      )}

                      {/* Informações adicionais */}
                      {(lembrete.especialidade ||
                        lembrete.medico ||
                        lembrete.local) && (
                        <View style={styles.infoAdicionalContainer}>
                          {lembrete.especialidade && (
                            <View style={styles.infoAdicionalItem}>
                              <Ionicons
                                name="star-outline"
                                size={14}
                                color="#666"
                              />
                              <Text style={styles.infoAdicionalText}>
                                {lembrete.especialidade}
                              </Text>
                            </View>
                          )}
                          {lembrete.medico &&
                            lembrete.medico !== "Não informado" && (
                              <View style={styles.infoAdicionalItem}>
                                <Ionicons
                                  name="medical-outline"
                                  size={14}
                                  color="#666"
                                />
                                <Text style={styles.infoAdicionalText}>
                                  {lembrete.medico}
                                </Text>
                              </View>
                            )}
                          {lembrete.local &&
                            lembrete.local !== "Não informado" && (
                              <View style={styles.infoAdicionalItem}>
                                <Ionicons
                                  name="location-outline"
                                  size={14}
                                  color="#666"
                                />
                                <Text style={styles.infoAdicionalText}>
                                  {lembrete.local}
                                </Text>
                              </View>
                            )}
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          ) : (
            <View style={styles.semLembretesContainer}>
              <Ionicons name="calendar-outline" size={80} color="#CCCCCC" />
              <Text style={styles.semLembretesTitulo}>
                Nenhum lembrete encontrado
              </Text>
              <Text style={styles.semLembretesTexto}>
                Comece adicionando seus primeiros lembretes de saúde
              </Text>
              <View style={styles.botoesSemLembretes}>
                <TouchableOpacity
                  style={[
                    styles.botaoAcao,
                    { width: "auto", paddingHorizontal: 20 },
                  ]}
                  onPress={() => router.push("/AddLembrete")}
                >
                  <Text style={styles.textoBotaoAcao}>
                    Criar meu primeiro lembrete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

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

          <TouchableOpacity style={[styles.navItem, styles.navItemAtivo]}>
            <Ionicons name="notifications" size={28} color="#0A2C5E" />
            <Text style={[styles.navText, styles.navTextAtivo]}>Lembrete</Text>
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
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  topo: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "rgba(248, 248, 248, 0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
  tituloPrincipal: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A2C5E",
    textAlign: "center",
  },
  subtituloPrincipal: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A2C5E",
    textAlign: "center",
    marginBottom: 10,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0A2C5E",
    marginTop: 10,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#133a74",
    marginBottom: 10,
  },
  botoesAcao: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "rgba(248, 248, 248, 0.9)",
    gap: 10,
  },
  botaoAcao: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A2C5E",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#083060",
    gap: 8,
    flex: 1,
    justifyContent: "center",
  },
  botaoSecundario: {
    backgroundColor: "#194c83",
  },
  textoBotaoAcao: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500",
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 70,
  },
  listaLembretes: {
    paddingVertical: 20,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  tentarNovamenteBtn: {
    backgroundColor: "#0A2C5E",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  tentarNovamenteText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  resumoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  resumoItem: {
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    padding: 15,
    borderRadius: 10,
    minWidth: 90,
  },
  resumoNumero: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0A2C5E",
  },
  resumoTexto: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  lembreteItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    overflow: "hidden",
  },
  lembreteSidebar: {
    width: 6,
  },
  lembreteContent: {
    flex: 1,
    padding: 15,
  },
  lembreteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  lembreteTipoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lembreteTipo: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  lembreteNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  lembreteInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  lembreteData: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  lembreteMembro: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  lembreteDetalhesContainer: {
    backgroundColor: "#F9F9F9",
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    marginBottom: 8,
  },
  lembreteDetalhes: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  infoAdicionalContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  infoAdicionalItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  infoAdicionalText: {
    fontSize: 11,
    color: "#0A2C5E",
  },
  semLembretesContainer: {
    alignItems: "center",
    padding: 40,
    marginTop: 20,
  },
  semLembretesTitulo: {
    fontSize: 18,
    color: "#666",
    marginTop: 15,
    fontWeight: "500",
  },
  semLembretesTexto: {
    fontSize: 14,
    color: "#999",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 20,
    marginHorizontal: 20,
  },
  botoesSemLembretes: {
    marginTop: 20,
  },
  espacoSeguro: {
    height: 30,
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
  navItemAtivo: {
    opacity: 1,
  },
  navText: {
    fontSize: 14,
    color: "#0A2C5E",
  },
  navTextAtivo: {
    fontWeight: "bold",
  },
});
