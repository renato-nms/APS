import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLembretes } from "../context/LembreteContext";

export default function Lembrete() {
  const { lembretes } = useLembretes();

  return (
    <View style={styles.container}>
      {/* Topo centralizado */}
      <View style={styles.topo}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.tituloPrincipal}>CADERNETA DIGITAL</Text>
        <Text style={styles.subtituloPrincipal}>DA FAMÍLIA</Text>
        <Text style={styles.titulo}>Lembretes</Text>
        <Text style={styles.subtitulo}>Seus próximos eventos de saúde</Text>
      </View>

      {/* Lista de Lembretes */}
      <ScrollView
        style={styles.conteudo}
        contentContainerStyle={styles.listaLembretes}
      >
        {lembretes.length > 0 ? (
          lembretes.map((lembrete) => (
            <View key={lembrete.id} style={styles.lembreteItem}>
              <View style={styles.lembreteHeader}>
                <Text style={styles.lembreteTitulo}>
                  {lembrete.tipo}: {lembrete.nome}
                </Text>
              </View>

              {lembrete.dosagem ? (
                <Text style={styles.lembreteDetalhe}>{lembrete.dosagem}</Text>
              ) : null}

              {lembrete.membro ? (
                <Text style={styles.lembreteDetalhe}>{lembrete.membro}</Text>
              ) : null}

              <Text style={styles.lembreteData}>
                {lembrete.horario
                  ? `${lembrete.data}, ${lembrete.horario}`
                  : lembrete.data}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.semLembretes}>Nenhum lembrete agendado</Text>
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
  },
  adicionar: {
    padding: 20,
    alignItems: "flex-end",
  },
  add: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#194c83",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0b2f64",
  },
  textoAdd: {
    marginLeft: 10,
    fontSize: 16,
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
  lembreteItem: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#0A2C5E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lembreteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  lembreteTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A2C5E",
  },
  lembreteDetalhe: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  lembreteData: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginTop: 5,
  },
  semLembretes: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 50,
    fontStyle: "italic",
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
