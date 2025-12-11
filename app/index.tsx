import { useRouter } from "expo-router";
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Bem vindo</Text>
      <Text style={styles.title}>Quem é você?</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>Lider</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/loginCrianca")}
        >
          <Text style={styles.buttonText}>Criança</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/loginPet")}
        >
          <Text style={styles.buttonText}>Pet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/loginIdoso")}
        >
          <Text style={styles.buttonText}>Idoso</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  logo: {
    width: 400,
    height: 400,
    marginBottom: 20,
  },
  button: {
    width: 300,
    backgroundColor: "#0A2C5E",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#142850",
    marginBottom: 5,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
});
