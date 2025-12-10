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

export default function MeusRemedios() {
  const [remedios, setRemedios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState("");
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchRemedios = async () => {
      console.log("=== INICIANDO BUSCA DE REMÉDIOS ===");
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

        // Buscar REMÉDIOS para o usuário atual
        console.log(
          `\n🔍 Buscando REMÉDIOS para paciente_uuid: ${currentUser.uid}`
        );

        // Array para armazenar todos os remédios encontrados
        const remediosFiltrados: any[] = [];

        // Buscar por diferentes possibilidades de nome do tipo
        const tiposParaBuscar = [
          "Remédio",
          "Medicamento",
          "remedio",
          "medicamento",
        ];

        for (const tipo of tiposParaBuscar) {
          try {
            // Query 1: Buscar por paciente_uuid E tipo específico
            const q1 = query(
              lembretesRef,
              where("paciente_uuid", "==", currentUser.uid),
              where("tipo", "==", tipo)
            );

            // Query 2: Buscar por membro_id E tipo específico
            const q2 = query(
              lembretesRef,
              where("membro_id", "==", currentUser.uid),
              where("tipo", "==", tipo)
            );

            const [querySnapshot1, querySnapshot2] = await Promise.all([
              getDocs(q1),
              getDocs(q2),
            ]);

            console.log(
              `✅ '${tipo}' encontrados por paciente_uuid: ${querySnapshot1.size}`
            );
            console.log(
              `✅ '${tipo}' encontrados por membro_id: ${querySnapshot2.size}`
            );

            // Processar resultados da primeira query
            querySnapshot1.forEach((doc) => {
              if (!remediosFiltrados.find((r) => r.id === doc.id)) {
                const data = doc.data();
                remediosFiltrados.push({
                  id: doc.id,
                  tipo: data.tipo,
                  nome: data.nome || "Sem nome",
                  data: data.data || "Sem data",
                  horario: data.horario,
                  dosagem: data.dosagem || data.dose || "Não informada",
                  frequencia:
                    data.frequencia || data.intervalo || "Não informada",
                  membro: data.membro,
                  criado_por_email: data.criado_por_email,
                  membro_tipo: data.membro_tipo,
                  via: data.via || data.forma || "Oral",
                  ...data,
                });
              }
            });

            // Processar resultados da segunda query
            querySnapshot2.forEach((doc) => {
              if (!remediosFiltrados.find((r) => r.id === doc.id)) {
                const data = doc.data();
                remediosFiltrados.push({
                  id: doc.id,
                  tipo: data.tipo,
                  nome: data.nome || "Sem nome",
                  data: data.data || "Sem data",
                  horario: data.horario,
                  dosagem: data.dosagem || data.dose || "Não informada",
                  frequencia:
                    data.frequencia || data.intervalo || "Não informada",
                  membro: data.membro,
                  criado_por_email: data.criado_por_email,
                  membro_tipo: data.membro_tipo,
                  via: data.via || data.forma || "Oral",
                  ...data,
                });
              }
            });
          } catch (error) {
            console.log(`⚠️ Erro ao buscar tipo '${tipo}':`, error);
          }
        }

        console.log("\n=== RESULTADO FINAL ===");
        console.log(
          `Total de remédios para exibição: ${remediosFiltrados.length}`
        );

        // Ordenar por horário (se tiver) e data
        remediosFiltrados.sort((a, b) => {
          try {
            // Primeiro ordena por data
            const dateA = new Date(a.data.split("/").reverse().join("-"));
            const dateB = new Date(b.data.split("/").reverse().join("-"));

            if (dateA.getTime() !== dateB.getTime()) {
              return dateA.getTime() - dateB.getTime(); // Ordem cronológica
            }

            // Se for na mesma data, ordena por horário
            if (a.horario && b.horario) {
              return a.horario.localeCompare(b.horario);
            }

            return 0;
          } catch {
            return 0;
          }
        });

        setRemedios(remediosFiltrados);
        setDebugInfo(
          `Total na coleção: ${todosDados.length}\n` +
            `Remédios encontrados: ${remediosFiltrados.length}\n` +
            `Tipos buscados: Remédio, Medicamento`
        );
      } catch (error: any) {
        console.error("❌ ERRO CRÍTICO:", error);
        setDebugInfo(`Erro: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRemedios();
  }, [currentUser]);

  // Função para verificar se o remédio é para hoje
  const isParaHoje = (dataString: string) => {
    try {
      const hoje = new Date().toLocaleDateString("pt-BR");
      return dataString === hoje;
    } catch {
      return false;
    }
  };

  // Função para verificar se é hora de tomar o remédio (próximas 2 horas)
  const isHoraDeTomar = (dataString: string, horarioString?: string) => {
    if (!horarioString || !isParaHoje(dataString)) return false;

    try {
      const agora = new Date();
      const [hora, minuto] = horarioString.split(":").map(Number);
      const horaRemedio = new Date();
      horaRemedio.setHours(hora, minuto, 0, 0);

      const diffHoras =
        (horaRemedio.getTime() - agora.getTime()) / (1000 * 60 * 60);
      return diffHoras >= 0 && diffHoras <= 2; // Próximas 2 horas
    } catch {
      return false;
    }
  };

  // Renderizar o remédio
  const renderRemedio = (remedio: any) => {
    const hoje = isParaHoje(remedio.data);
    const horaDeTomar = hoje && isHoraDeTomar(remedio.data, remedio.horario);

    return (
      <View
        style={[
          styles.remedioItem,
          hoje && styles.remedioHoje,
          horaDeTomar && styles.remedioUrgente,
        ]}
      >
        {/* Cabeçalho com tipo e status */}
        <View style={styles.remedioHeader}>
          <View style={styles.tipoContainer}>
            <Ionicons name="medkit-outline" size={20} color="#0A2C5E" />
            <Text style={styles.tipo}>REMÉDIO</Text>
          </View>

          {horaDeTomar && (
            <View style={[styles.statusBadge, styles.urgenteBadge]}>
              <Ionicons name="alarm" size={14} color="#FF3B30" />
              <Text style={styles.statusText}>HORA DE TOMAR</Text>
            </View>
          )}

          {hoje && !horaDeTomar && (
            <View style={[styles.statusBadge, styles.hojeBadge]}>
              <Ionicons name="today" size={14} color="#34C759" />
              <Text style={styles.statusText}>HOJE</Text>
            </View>
          )}
        </View>

        {/* Nome do remédio */}
        <Text style={styles.nome}>{remedio.nome}</Text>

        {/* Dosagem */}
        {remedio.dosagem && (
          <View style={styles.infoRow}>
            <Ionicons name="medical" size={16} color="#666" />
            <Text style={styles.info}>
              Dosagem: <Text style={styles.destaque}>{remedio.dosagem}</Text>
            </Text>
          </View>
        )}

        {/* Via de administração */}
        <View style={styles.infoRow}>
          <Ionicons
            name="arrow-forward-circle-outline"
            size={16}
            color="#666"
          />
          <Text style={styles.info}>
            Via: <Text style={styles.destaque}>{remedio.via}</Text>
          </Text>
        </View>

        {/* Frequência */}
        {remedio.frequencia && (
          <View style={styles.infoRow}>
            <Ionicons name="repeat" size={16} color="#666" />
            <Text style={styles.info}>
              Frequência:{" "}
              <Text style={styles.destaque}>{remedio.frequencia}</Text>
            </Text>
          </View>
        )}

        {/* Data e horário */}
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.data}>
            {remedio.data} {remedio.horario ? `• ${remedio.horario}` : ""}
          </Text>
        </View>

        {/* Informações do remetente */}
        {remedio.criado_por_email && (
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.info}>
              Prescrito por: {remedio.criado_por_email}
            </Text>
          </View>
        )}

        {/* Destinatário (se for diferente do usuário) */}
        {remedio.membro && (
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.info}>Para: {remedio.membro}</Text>
          </View>
        )}

        {/* Observações/Instruções */}
        {remedio.observacoes && (
          <View style={styles.observacoesContainer}>
            <Text style={styles.observacoesTitle}>Instruções:</Text>
            <Text style={styles.observacoesText}>{remedio.observacoes}</Text>
          </View>
        )}

        {/* Duração do tratamento */}
        {remedio.duracao && (
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.info}>
              Duração: <Text style={styles.destaque}>{remedio.duracao}</Text>
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Calcular estatísticas
  const remediosHoje = remedios.filter((r) => isParaHoje(r.data)).length;
  const remediosUrgentes = remedios.filter((r) =>
    isHoraDeTomar(r.data, r.horario)
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

        <Text style={styles.titulo}>Meus Remédios</Text>
        <Text style={styles.subtitulo}>Controle de medicamentos</Text>
      </View>

      {/* Conteúdo */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A2C5E" />
          <Text style={styles.loadingText}>Buscando seus remédios...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.conteudo}
          contentContainerStyle={styles.listaRemedios}
        >
          {remedios.length > 0 ? (
            <>
              {/* Resumo estatístico */}
              <View style={styles.resumoContainer}>
                <View style={styles.resumoItem}>
                  <Ionicons name="medkit" size={24} color="#0A2C5E" />
                  <Text style={styles.resumoNumero}>{remedios.length}</Text>
                  <Text style={styles.resumoTexto}>Total</Text>
                </View>

                <View style={styles.resumoItem}>
                  <Ionicons name="today" size={24} color="#34C759" />
                  <Text style={styles.resumoNumero}>{remediosHoje}</Text>
                  <Text style={styles.resumoTexto}>Hoje</Text>
                </View>

                {remediosUrgentes > 0 && (
                  <View style={styles.resumoItem}>
                    <Ionicons name="alarm" size={24} color="#FF3B30" />
                    <Text style={styles.resumoNumero}>{remediosUrgentes}</Text>
                    <Text style={styles.resumoTexto}>Urgentes</Text>
                  </View>
                )}
              </View>

              {remediosUrgentes > 0 && (
                <View style={styles.urgentesAlert}>
                  <Ionicons name="alert-circle" size={20} color="#FF3B30" />
                  <Text style={styles.urgentesText}>
                    Você tem {remediosUrgentes} remédio(s) para tomar nas
                    próximas horas
                  </Text>
                </View>
              )}

              {remedios.map((remedio) => (
                <View key={remedio.id}>{renderRemedio(remedio)}</View>
              ))}
            </>
          ) : (
            <View style={styles.semRemediosContainer}>
              <Ionicons name="medkit-outline" size={80} color="#CCCCCC" />
              <Text style={styles.semRemedios}>Nenhum remédio agendado</Text>
              <Text style={styles.semRemediosSub}>
                Quando alguém prescrever um remédio para você, ele aparecerá
                aqui
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
  urgentesAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE5E5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#FFCCCC",
  },
  urgentesText: {
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
  listaRemedios: {
    padding: 15,
  },
  remedioItem: {
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
  remedioHoje: {
    borderLeftWidth: 4,
    borderLeftColor: "#34C759",
    backgroundColor: "#F0FFF4",
  },
  remedioUrgente: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
    backgroundColor: "#FFF5F5",
  },
  remedioHeader: {
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
  urgenteBadge: {
    backgroundColor: "#FFE5E5",
  },
  hojeBadge: {
    backgroundColor: "#E6FFEE",
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
  semRemediosContainer: {
    alignItems: "center",
    padding: 40,
    marginTop: 20,
  },
  semRemedios: {
    fontSize: 18,
    color: "#666",
    marginTop: 15,
    fontWeight: "500",
  },
  semRemediosSub: {
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
