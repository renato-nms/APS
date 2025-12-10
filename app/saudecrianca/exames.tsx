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

export default function MeusExames() {
  const [exames, setExames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState("");
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchExames = async () => {
      console.log("=== INICIANDO BUSCA DE EXAMES ===");
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

        // Buscar EXAMES para o usuário atual
        console.log(
          `\n🔍 Buscando EXAMES para paciente_uuid: ${currentUser.uid}`
        );

        // Query 1: Buscar por paciente_uuid E tipo "Exame"
        const q1 = query(
          lembretesRef,
          where("paciente_uuid", "==", currentUser.uid),
          where("tipo", "==", "Exame")
        );

        // Query 2: Buscar por membro_id E tipo "Exame" (backup)
        const q2 = query(
          lembretesRef,
          where("membro_id", "==", currentUser.uid),
          where("tipo", "==", "Exame")
        );

        const [querySnapshot1, querySnapshot2] = await Promise.all([
          getDocs(q1),
          getDocs(q2),
        ]);

        console.log(
          `✅ Exames encontrados por paciente_uuid: ${querySnapshot1.size}`
        );
        console.log(
          `✅ Exames encontrados por membro_id: ${querySnapshot2.size}`
        );

        const examesFiltrados: any[] = [];

        // Adicionar exames da primeira query
        querySnapshot1.forEach((doc) => {
          const data = doc.data();
          console.log(`🎯 Exame encontrado (paciente_uuid):`, {
            id: doc.id,
            ...data,
          });

          if (data.tipo === "Exame") {
            examesFiltrados.push({
              id: doc.id,
              tipo: data.tipo,
              nome: data.nome || "Sem nome",
              data: data.data || "Sem data",
              horario: data.horario,
              membro: data.membro,
              criado_por_email: data.criado_por_email,
              membro_tipo: data.membro_tipo,
              ...data,
            });
          }
        });

        // Adicionar exames da segunda query (evitando duplicados)
        querySnapshot2.forEach((doc) => {
          if (!examesFiltrados.find((e) => e.id === doc.id)) {
            const data = doc.data();
            console.log(`🎯 Exame encontrado (membro_id):`, {
              id: doc.id,
              ...data,
            });

            if (data.tipo === "Exame") {
              examesFiltrados.push({
                id: doc.id,
                tipo: data.tipo,
                nome: data.nome || "Sem nome",
                data: data.data || "Sem data",
                horario: data.horario,
                membro: data.membro,
                criado_por_email: data.criado_por_email,
                membro_tipo: data.membro_tipo,
                ...data,
              });
            }
          }
        });

        // Também filtrar por tipo "Exame" em português (caso exista)
        const q3 = query(
          lembretesRef,
          where("paciente_uuid", "==", currentUser.uid),
          where("tipo", "==", "exame") // lowercase
        );

        const querySnapshot3 = await getDocs(q3);
        console.log(
          `✅ Exames encontrados (lowercase): ${querySnapshot3.size}`
        );

        querySnapshot3.forEach((doc) => {
          if (!examesFiltrados.find((e) => e.id === doc.id)) {
            const data = doc.data();
            if (data.tipo?.toLowerCase() === "exame") {
              examesFiltrados.push({
                id: doc.id,
                tipo: data.tipo,
                nome: data.nome || "Sem nome",
                data: data.data || "Sem data",
                horario: data.horario,
                membro: data.membro,
                criado_por_email: data.criado_por_email,
                membro_tipo: data.membro_tipo,
                ...data,
              });
            }
          }
        });

        console.log("\n=== RESULTADO FINAL ===");
        console.log(`Total de exames para exibição: ${examesFiltrados.length}`);

        // Ordenar por data (mais recente primeiro)
        examesFiltrados.sort((a, b) => {
          try {
            const dateA = new Date(a.data.split("/").reverse().join("-"));
            const dateB = new Date(b.data.split("/").reverse().join("-"));
            return dateB.getTime() - dateA.getTime();
          } catch {
            return 0;
          }
        });

        setExames(examesFiltrados);
        setDebugInfo(
          `Total na coleção: ${todosDados.length}\n` +
            `Exames encontrados: ${examesFiltrados.length}\n` +
            `Filtro: tipo = "Exame"`
        );
      } catch (error: any) {
        console.error("❌ ERRO CRÍTICO:", error);
        setDebugInfo(`Erro: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchExames();
  }, [currentUser]);

  // Função para verificar se o exame é para hoje
  const isParaHoje = (dataString: string) => {
    try {
      const hoje = new Date().toLocaleDateString("pt-BR");
      return dataString === hoje;
    } catch {
      return false;
    }
  };

  // Renderizar o exame
  const renderExame = (exame: any) => (
    <View
      style={[styles.exameItem, isParaHoje(exame.data) && styles.exameHoje]}
    >
      {/* Cabeçalho com tipo e data */}
      <View style={styles.exameHeader}>
        <View style={styles.tipoContainer}>
          <Ionicons name="flask-outline" size={20} color="#0A2C5E" />
          <Text style={styles.tipo}>EXAME</Text>
        </View>
        {isParaHoje(exame.data) && (
          <View style={styles.hojeBadge}>
            <Ionicons name="alert-circle" size={14} color="#FF3B30" />
            <Text style={styles.hojeText}>HOJE</Text>
          </View>
        )}
      </View>

      {/* Nome do exame */}
      <Text style={styles.nome}>{exame.nome}</Text>

      {/* Data e horário */}
      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color="#666" />
        <Text style={styles.data}>
          {exame.data} {exame.horario ? `• ${exame.horario}` : ""}
        </Text>
      </View>

      {/* Informações do remetente */}
      {exame.criado_por_email && (
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color="#666" />
          <Text style={styles.info}>
            Solicitado por: {exame.criado_por_email}
          </Text>
        </View>
      )}

      {/* Destinatário (se for diferente do usuário) */}
      {exame.membro && (
        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.info}>Para: {exame.membro}</Text>
        </View>
      )}

      {/* Observações/Detalhes */}
      {exame.observacoes && (
        <View style={styles.observacoesContainer}>
          <Text style={styles.observacoesTitle}>Observações:</Text>
          <Text style={styles.observacoesText}>{exame.observacoes}</Text>
        </View>
      )}

      {/* Local/Clínica */}
      {exame.local && (
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.info}>Local: {exame.local}</Text>
        </View>
      )}
    </View>
  );

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

        <Text style={styles.titulo}>Meus Exames</Text>
        <Text style={styles.subtitulo}>Histórico e agendamentos</Text>
      </View>

      {/* Conteúdo */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A2C5E" />
          <Text style={styles.loadingText}>Buscando seus exames...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.conteudo}
          contentContainerStyle={styles.listaExames}
        >
          {exames.length > 0 ? (
            <>
              <View style={styles.resumoContainer}>
                <View style={styles.resumoItem}>
                  <Ionicons name="flask" size={24} color="#0A2C5E" />
                  <Text style={styles.resumoNumero}>{exames.length}</Text>
                  <Text style={styles.resumoTexto}>Exames</Text>
                </View>

                <View style={styles.resumoItem}>
                  <Ionicons name="today" size={24} color="#FF3B30" />
                  <Text style={styles.resumoNumero}>
                    {exames.filter((e) => isParaHoje(e.data)).length}
                  </Text>
                  <Text style={styles.resumoTexto}>Hoje</Text>
                </View>
              </View>

              {exames.map((exame) => (
                <View key={exame.id}>{renderExame(exame)}</View>
              ))}
            </>
          ) : (
            <View style={styles.semExamesContainer}>
              <Ionicons name="flask-outline" size={80} color="#CCCCCC" />
              <Text style={styles.semExames}>Nenhum exame agendado</Text>
              <Text style={styles.semExamesSub}>
                Quando alguém agendar um exame para você, ele aparecerá aqui
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
    paddingHorizontal: 20,
  },
  resumoItem: {
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    padding: 15,
    borderRadius: 10,
    minWidth: 100,
  },
  resumoNumero: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A2C5E",
    marginTop: 5,
  },
  resumoTexto: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
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
  listaExames: {
    padding: 15,
  },
  exameItem: {
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
  exameHoje: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
    backgroundColor: "#FFF5F5",
  },
  exameHeader: {
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
  hojeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hojeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FF3B30",
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
  semExamesContainer: {
    alignItems: "center",
    padding: 40,
    marginTop: 20,
  },
  semExames: {
    fontSize: 18,
    color: "#666",
    marginTop: 15,
    fontWeight: "500",
  },
  semExamesSub: {
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
