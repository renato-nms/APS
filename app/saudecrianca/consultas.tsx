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

export default function Lembrete() {
  const [lembretes, setLembretes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState("");
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchLembretes = async () => {
      console.log("=== INICIANDO BUSCA DE LEMBRETES ===");
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

        // 1. Primeiro, vamos ver TODOS os lembretes sem filtro
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
          console.log(`📄 Lembrete ID: ${doc.id}`, data);
        });

        // 2. Agora vamos buscar com o filtro
        console.log(
          `\n🔍 Buscando lembretes para paciente_uuid: ${currentUser.uid}`
        );
        const q = query(
          lembretesRef,
          where("paciente_uuid", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        console.log(
          `✅ Lembretes encontrados com filtro: ${querySnapshot.size}`
        );

        const lembretesFiltrados: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`🎯 Lembrete encontrado para usuário:`, {
            id: doc.id,
            ...data,
          });
          lembretesFiltrados.push({
            id: doc.id,
            tipo: data.tipo || "Evento",
            nome: data.nome || "Sem nome",
            data: data.data || "Sem data",
            horario: data.horario,
            membro: data.membro,
            criado_por_email: data.criado_por_email,
            membro_tipo: data.membro_tipo,
            // Todos os campos para debug
            ...data,
          });
        });

        // 3. Também buscar por "membro_id" se existir
        console.log(
          `\n🔍 Buscando lembretes para membro_id: ${currentUser.uid}`
        );
        const qMembro = query(
          lembretesRef,
          where("membro_id", "==", currentUser.uid)
        );
        const queryMembroSnap = await getDocs(qMembro);

        console.log(
          `✅ Lembretes encontrados por membro_id: ${queryMembroSnap.size}`
        );

        queryMembroSnap.forEach((doc) => {
          const data = doc.data();
          console.log(`🎯 Lembrete por membro_id:`, {
            id: doc.id,
            ...data,
          });

          // Adicionar se ainda não estiver na lista
          if (!lembretesFiltrados.find((l) => l.id === doc.id)) {
            lembretesFiltrados.push({
              id: doc.id,
              tipo: data.tipo || "Evento",
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

        // 4. Verificar se usuário está em alguma coleção
        console.log(
          `\n🔍 Verificando se usuário está nas coleções crianca/idoso/pet...`
        );

        const colecoes = ["crianca", "idoso", "pet"];
        for (const colecao of colecoes) {
          try {
            const ref = collection(db, colecao);
            const qUser = query(
              ref,
              where("criado_por", "==", currentUser.uid)
            );
            const snap = await getDocs(qUser);
            console.log(`📊 Usuário tem ${snap.size} documentos em ${colecao}`);

            snap.forEach((doc) => {
              console.log(`📄 ${colecao}: ${doc.id}`, doc.data());
            });
          } catch (error) {
            console.log(`⚠️ Erro ao buscar ${colecao}:`, error);
          }
        }

        console.log("\n=== RESULTADO FINAL ===");
        console.log(
          `Total de lembretes para exibição: ${lembretesFiltrados.length}`
        );

        setLembretes(lembretesFiltrados);
        setDebugInfo(
          `Total na coleção: ${todosDados.length}\n` +
            `Filtrados por paciente_uuid: ${querySnapshot.size}\n` +
            `Filtrados por membro_id: ${queryMembroSnap.size}\n` +
            `Para exibição: ${lembretesFiltrados.length}`
        );
      } catch (error: any) {
        console.error("❌ ERRO CRÍTICO:", error);
        setDebugInfo(`Erro: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLembretes();
  }, [currentUser]);

  // Renderizar o lembrete
  const renderLembrete = (lembrete: any) => (
    <View style={styles.lembreteItem}>
      <Text style={styles.tipo}>{lembrete.tipo}</Text>
      <Text style={styles.nome}>{lembrete.nome}</Text>
      <Text style={styles.data}>
        📅 {lembrete.data} {lembrete.horario ? `• ${lembrete.horario}` : ""}
      </Text>
      {lembrete.membro && (
        <Text style={styles.info}>👤 Para: {lembrete.membro}</Text>
      )}
      {lembrete.criado_por_email && (
        <Text style={styles.info}>📧 De: {lembrete.criado_por_email}</Text>
      )}
      {/* Mostrar todos os campos para debug */}
      <View style={styles.debugSection}>
        <Text style={styles.debugTitle}>DEBUG - Todos os campos:</Text>
        {Object.entries(lembrete).map(
          ([key, value]) =>
            key !== "id" && (
              <Text key={key} style={styles.debugText}>
                {key}: {JSON.stringify(value)}
              </Text>
            )
        )}
      </View>
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
        <Text style={styles.titulo}>Meus Lembretes</Text>
        <Text style={styles.subtitulo}>Visualização</Text>

        {/* Debug info */}
        <View style={styles.debugContainer}>
          <Text style={styles.debugInfoTitle}>Informações de Debug:</Text>
          <Text style={styles.debugInfoText}>{debugInfo}</Text>
          <Text style={styles.userInfo}>
            Usuário: {currentUser?.email} ({currentUser?.uid})
          </Text>
        </View>
      </View>

      {/* Conteúdo */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A2C5E" />
          <Text style={styles.loadingText}>Carregando...</Text>
          <Text style={styles.loadingSubtext}>
            Verifique o console para logs
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.conteudo}
          contentContainerStyle={styles.listaLembretes}
        >
          {lembretes.length > 0 ? (
            <>
              <Text style={styles.contador}>
                {lembretes.length} lembrete(s) encontrado(s)
              </Text>
              {lembretes.map((lembrete) => (
                <View key={lembrete.id}>{renderLembrete(lembrete)}</View>
              ))}
            </>
          ) : (
            <View style={styles.semLembretesContainer}>
              <Ionicons name="search" size={60} color="#999" />
              <Text style={styles.semLembretes}>
                Nenhum lembrete encontrado
              </Text>
              <Text style={styles.semLembretesSub}>
                Verifique os logs no console para mais informações
              </Text>
              <Text style={styles.semLembretesSub}>
                Usuário: {currentUser?.uid}
              </Text>
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

        <TouchableOpacity>
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
    marginBottom: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0A2C5E",
    marginTop: 5,
  },
  subtitulo: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  debugContainer: {
    backgroundColor: "#F0F8FF",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#0A2C5E",
    width: "90%",
  },
  debugInfoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0A2C5E",
    marginBottom: 5,
  },
  debugInfoText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  userInfo: {
    fontSize: 10,
    color: "#999",
    marginTop: 5,
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
  loadingSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  conteudo: {
    flex: 1,
    marginBottom: 70,
  },
  listaLembretes: {
    padding: 15,
  },
  contador: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
    fontStyle: "italic",
  },
  lembreteItem: {
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
  tipo: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0A2C5E",
    marginBottom: 5,
    backgroundColor: "#E6F2FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  data: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  info: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  debugSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#F9F9F9",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#999",
    marginBottom: 5,
  },
  debugText: {
    fontSize: 10,
    color: "#777",
    lineHeight: 14,
  },
  semLembretesContainer: {
    alignItems: "center",
    padding: 40,
    marginTop: 20,
  },
  semLembretes: {
    fontSize: 16,
    color: "#666",
    marginTop: 15,
    fontWeight: "500",
  },
  semLembretesSub: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    textAlign: "center",
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
