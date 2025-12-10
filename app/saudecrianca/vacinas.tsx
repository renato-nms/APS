import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function MinhasVacinas() {
  const [vacinas, setVacinas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState("");
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchVacinas = async () => {
      console.log("=== INICIANDO BUSCA DE VACINAS ===");
      console.log("Usuário atual UID:", currentUser?.uid);
      console.log("Usuário atual email:", currentUser?.email);

      if (!currentUser) {
        console.log("❌ Usuário não autenticado");
        setDebugInfo("Usuário não autenticado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Buscar TODOS os lembretes
        console.log("\n🔍 Buscando TODOS os lembretes da coleção...");
        const lembretesRef = collection(db, "lembretes");
        const todosLembretes = await getDocs(lembretesRef);

        console.log(`📊 Total de lembretes na coleção: ${todosLembretes.size}`);

        const todosDados: any[] = [];
        todosLembretes.forEach((doc) => {
          const data = doc.data();
          todosDados.push({
            id: doc.id,
            ...data,
          });
        });

        // Buscar VACINAS para o usuário atual
        console.log(
          `\n🔍 Buscando VACINAS para paciente_uuid: ${currentUser.uid}`
        );

        // Query 1: Buscar por paciente_uuid E tipo "Vacina"
        const q1 = query(
          lembretesRef,
          where("paciente_uuid", "==", currentUser.uid),
          where("tipo", "==", "Vacina")
        );

        // Query 2: Buscar por membro_id E tipo "Vacina" (backup)
        const q2 = query(
          lembretesRef,
          where("membro_id", "==", currentUser.uid),
          where("tipo", "==", "Vacina")
        );

        const [querySnapshot1, querySnapshot2] = await Promise.all([
          getDocs(q1),
          getDocs(q2),
        ]);

        console.log(
          `✅ Vacinas encontradas por paciente_uuid: ${querySnapshot1.size}`
        );
        console.log(
          `✅ Vacinas encontradas por membro_id: ${querySnapshot2.size}`
        );

        const vacinasFiltradas: any[] = [];

        // Adicionar vacinas da primeira query
        querySnapshot1.forEach((doc) => {
          const data = doc.data();
          console.log(`🎯 Vacina encontrada (paciente_uuid):`, {
            id: doc.id,
            ...data,
          });

          if (data.tipo === "Vacina") {
            vacinasFiltradas.push({
              id: doc.id,
              tipo: data.tipo,
              nome: data.nome || "Sem nome",
              data: data.data || "Sem data",
              horario: data.horario,
              membro: data.membro,
              criado_por_email: data.criado_por_email,
              membro_tipo: data.membro_tipo,
              dose: data.dose || data.dosagem || "Não informada",
              ...data,
            });
          }
        });

        // Adicionar vacinas da segunda query (evitando duplicados)
        querySnapshot2.forEach((doc) => {
          if (!vacinasFiltradas.find((v) => v.id === doc.id)) {
            const data = doc.data();
            console.log(`🎯 Vacina encontrada (membro_id):`, {
              id: doc.id,
              ...data,
            });

            if (data.tipo === "Vacina") {
              vacinasFiltradas.push({
                id: doc.id,
                tipo: data.tipo,
                nome: data.nome || "Sem nome",
                data: data.data || "Sem data",
                horario: data.horario,
                membro: data.membro,
                criado_por_email: data.criado_por_email,
                membro_tipo: data.membro_tipo,
                dose: data.dose || data.dosagem || "Não informada",
                ...data,
              });
            }
          }
        });

        // Também filtrar por tipo "Vacina" em português (caso exista)
        const q3 = query(
          lembretesRef,
          where("paciente_uuid", "==", currentUser.uid),
          where("tipo", "==", "vacina") // lowercase
        );

        const querySnapshot3 = await getDocs(q3);
        console.log(
          `✅ Vacinas encontradas (lowercase): ${querySnapshot3.size}`
        );

        querySnapshot3.forEach((doc) => {
          if (!vacinasFiltradas.find((v) => v.id === doc.id)) {
            const data = doc.data();
            if (data.tipo?.toLowerCase() === "vacina") {
              vacinasFiltradas.push({
                id: doc.id,
                tipo: data.tipo,
                nome: data.nome || "Sem nome",
                data: data.data || "Sem data",
                horario: data.horario,
                membro: data.membro,
                criado_por_email: data.criado_por_email,
                membro_tipo: data.membro_tipo,
                dose: data.dose || data.dosagem || "Não informada",
                ...data,
              });
            }
          }
        });

        console.log("\n=== RESULTADO FINAL ===");
        console.log(
          `Total de vacinas para exibição: ${vacinasFiltradas.length}`
        );

        // Ordenar por data (mais próxima primeiro)
        vacinasFiltradas.sort((a, b) => {
          try {
            const dateA = new Date(a.data.split("/").reverse().join("-"));
            const dateB = new Date(b.data.split("/").reverse().join("-"));
            return dateA.getTime() - dateB.getTime(); // Ordem cronológica
          } catch {
            return 0;
          }
        });

        setVacinas(vacinasFiltradas);
        setDebugInfo(
          `Total na coleção: ${todosDados.length}\n` +
            `Vacinas encontradas: ${vacinasFiltradas.length}\n` +
            `Filtro: tipo = "Vacina"`
        );
      } catch (error: any) {
        console.error("❌ ERRO CRÍTICO:", error);
        setDebugInfo(`Erro: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchVacinas();
  }, [currentUser]);

  // Função para verificar se a vacina é para hoje
  const isParaHoje = (dataString: string) => {
    try {
      const hoje = new Date().toLocaleDateString("pt-BR");
      return dataString === hoje;
    } catch {
      return false;
    }
  };

  // Função para verificar se a vacina é próxima (próximos 7 dias)
  const isProxima = (dataString: string) => {
    try {
      const hoje = new Date();
      const dataVacina = new Date(dataString.split("/").reverse().join("-"));
      const diffTime = dataVacina.getTime() - hoje.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 7; // Próximos 7 dias
    } catch {
      return false;
    }
  };

  // Função para verificar se a vacina está atrasada
  const isAtrasada = (dataString: string) => {
    try {
      const hoje = new Date();
      const dataVacina = new Date(dataString.split("/").reverse().join("-"));
      return dataVacina < hoje;
    } catch {
      return false;
    }
  };

  // Renderizar a vacina
  const renderVacina = (vacina: any) => {
    const hoje = isParaHoje(vacina.data);
    const proxima = isProxima(vacina.data);
    const atrasada = isAtrasada(vacina.data);

    return (
      <View
        style={[
          styles.vacinaItem,
          hoje && styles.vacinaHoje,
          proxima && styles.vacinaProxima,
          atrasada && styles.vacinaAtrasada,
        ]}
      >
        {/* Cabeçalho com tipo e status */}
        <View style={styles.vacinaHeader}>
          <View style={styles.tipoContainer}>
            <Ionicons name="shield-outline" size={20} color="#0A2C5E" />
            <Text style={styles.tipo}>VACINA</Text>
          </View>

          {hoje && (
            <View style={[styles.statusBadge, styles.hojeBadge]}>
              <Ionicons name="alert-circle" size={14} color="#FF3B30" />
              <Text style={styles.statusText}>HOJE</Text>
            </View>
          )}

          {proxima && !hoje && (
            <View style={[styles.statusBadge, styles.proximaBadge]}>
              <Ionicons name="time-outline" size={14} color="#FF9500" />
              <Text style={styles.statusText}>PRÓXIMA</Text>
            </View>
          )}

          {atrasada && !hoje && (
            <View style={[styles.statusBadge, styles.atrasadaBadge]}>
              <Ionicons name="warning-outline" size={14} color="#FF3B30" />
              <Text style={styles.statusText}>ATRASADA</Text>
            </View>
          )}
        </View>

        {/* Nome da vacina */}
        <Text style={styles.nome}>{vacina.nome}</Text>

        {/* Dose da vacina */}
        {vacina.dose && (
          <View style={styles.infoRow}>
            <Ionicons name="medical-outline" size={16} color="#666" />
            <Text style={styles.info}>
              Dose: <Text style={styles.destaque}>{vacina.dose}</Text>
            </Text>
          </View>
        )}

        {/* Data e horário */}
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.data}>
            {vacina.data} {vacina.horario ? `• ${vacina.horario}` : ""}
          </Text>
        </View>

        {/* Informações do remetente */}
        {vacina.criado_por_email && (
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.info}>
              Agendada por: {vacina.criado_por_email}
            </Text>
          </View>
        )}

        {/* Destinatário (se for diferente do usuário) */}
        {vacina.membro && (
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.info}>Para: {vacina.membro}</Text>
          </View>
        )}

        {/* Observações/Detalhes */}
        {vacina.observacoes && (
          <View style={styles.observacoesContainer}>
            <Text style={styles.observacoesTitle}>Observações:</Text>
            <Text style={styles.observacoesText}>{vacina.observacoes}</Text>
          </View>
        )}

        {/* Local/Clínica */}
        {vacina.local && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.info}>Local: {vacina.local}</Text>
          </View>
        )}

        {/* Lote (se existir) */}
        {vacina.lote && (
          <View style={styles.infoRow}>
            <Ionicons name="barcode-outline" size={16} color="#666" />
            <Text style={styles.info}>Lote: {vacina.lote}</Text>
          </View>
        )}
      </View>
    );
  };

  // Calcular estatísticas
  const vacinasHoje = vacinas.filter((v) => isParaHoje(v.data)).length;
  const vacinasProximas = vacinas.filter(
    (v) => isProxima(v.data) && !isParaHoje(v.data)
  ).length;
  const vacinasAtrasadas = vacinas.filter(
    (v) => isAtrasada(v.data) && !isParaHoje(v.data)
  ).length;

  return (
    <View style={styles.container}>
      {/* Topo */}
      <View style={styles.topo}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.tituloPrincipal}>CADERNETA DIGITAL</Text>
        <Text style={styles.subtituloPrincipal}>DA FAMÍLIA</Text>

        {/* Informações do usuário */}
        <View style={styles.userInfoContainer}>
          <Ionicons name="person-circle" size={40} color="#0A2C5E" />
          <Text style={styles.userName}>{currentUser?.email}</Text>
        </View>

        <Text style={styles.titulo}>Minhas Vacinas</Text>
        <Text style={styles.subtitulo}>Carteira de vacinação digital</Text>
      </View>

      {/* Conteúdo */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A2C5E" />
          <Text style={styles.loadingText}>Buscando suas vacinas...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.conteudo}
          contentContainerStyle={styles.listaVacinas}
        >
          {vacinas.length > 0 ? (
            <>
              {/* Resumo estatístico */}
              <View style={styles.resumoContainer}>
                <View style={styles.resumoItem}>
                  <Ionicons name="shield" size={24} color="#0A2C5E" />
                  <Text style={styles.resumoNumero}>{vacinas.length}</Text>
                  <Text style={styles.resumoTexto}>Total</Text>
                </View>

                <View style={styles.resumoItem}>
                  <Ionicons name="today" size={24} color="#FF3B30" />
                  <Text style={styles.resumoNumero}>{vacinasHoje}</Text>
                  <Text style={styles.resumoTexto}>Hoje</Text>
                </View>

                <View style={styles.resumoItem}>
                  <Ionicons name="calendar" size={24} color="#FF9500" />
                  <Text style={styles.resumoNumero}>{vacinasProximas}</Text>
                  <Text style={styles.resumoTexto}>Próximas</Text>
                </View>
              </View>

              {vacinasAtrasadas > 0 && (
                <View style={styles.atrasadasAlert}>
                  <Ionicons name="warning" size={20} color="#FF3B30" />
                  <Text style={styles.atrasadasText}>
                    Você tem {vacinasAtrasadas} vacina(s) atrasada(s)
                  </Text>
                </View>
              )}

              {vacinas.map((vacina) => (
                <View key={vacina.id}>{renderVacina(vacina)}</View>
              ))}
            </>
          ) : (
            <View style={styles.semVacinasContainer}>
              <Ionicons name="shield-outline" size={80} color="#CCCCCC" />
              <Text style={styles.semVacinas}>Nenhuma vacina agendada</Text>
              <Text style={styles.semVacinasSub}>
                Quando alguém agendar uma vacina para você, ela aparecerá aqui
              </Text>

              {/* Debug info */}
              <View style={styles.debugContainer}>
                <Text style={styles.debugInfoTitle}>Informações de Debug:</Text>
                <Text style={styles.debugInfoText}>{debugInfo}</Text>
              </View>
            </View>
          )}

          <View style={styles.espacoSeguro} />
        </ScrollView>
      )}

      {/* Navbar */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topo: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },
  tituloPrincipal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A2C5E",
    textAlign: "center",
  },
  subtituloPrincipal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A2C5E",
    textAlign: "center",
    marginBottom: 15,
  },
  userInfoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  userName: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0A2C5E",
    marginTop: 5,
  },
  subtitulo: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
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
    marginTop: 5,
  },
  resumoTexto: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  atrasadasAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE5E5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#FFCCCC",
  },
  atrasadasText: {
    fontSize: 14,
    color: "#FF3B30",
    marginLeft: 8,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 70,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  conteudo: {
    flex: 1,
    marginBottom: 70,
  },
  listaVacinas: {
    padding: 15,
  },
  vacinaItem: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  vacinaHoje: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
    backgroundColor: "#FFF5F5",
  },
  vacinaProxima: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF9500",
    backgroundColor: "#FFF9F0",
  },
  vacinaAtrasada: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
    backgroundColor: "#FFF0F0",
  },
  vacinaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  tipoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tipo: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0A2C5E",
    marginLeft: 5,
    backgroundColor: "#E6F2FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hojeBadge: {
    backgroundColor: "#FFE5E5",
  },
  proximaBadge: {
    backgroundColor: "#FFEBD6",
  },
  atrasadaBadge: {
    backgroundColor: "#FFE5E5",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  data: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },
  info: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },
  destaque: {
    fontWeight: "bold",
    color: "#0A2C5E",
  },
  observacoesContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#F9F9F9",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  observacoesTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 5,
  },
  observacoesText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  semVacinasContainer: {
    alignItems: "center",
    padding: 40,
    marginTop: 20,
  },
  semVacinas: {
    fontSize: 18,
    color: "#666",
    marginTop: 15,
    fontWeight: "500",
  },
  semVacinasSub: {
    fontSize: 14,
    color: "#999",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 20,
    marginHorizontal: 20,
  },
  debugContainer: {
    backgroundColor: "#F0F8FF",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#0A2C5E",
    width: "100%",
  },
  debugInfoTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0A2C5E",
    marginBottom: 5,
  },
  debugInfoText: {
    fontSize: 11,
    color: "#666",
    lineHeight: 16,
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
  navText: {
    fontSize: 14,
    color: "#0A2C5E",
  },
});
