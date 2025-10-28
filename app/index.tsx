
import { useRouter } from "expo-router";
import { TouchableOpacity, Text, View, Image, StyleSheet } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image 
      source={require("../assets/images/logo.png")}
       style={styles.logo} 
       resizeMode="contain"
       />
       <Text style={styles.title}>Bem</Text>

      <Text style={styles.title}>Quem é você? </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
        <Text style={styles.buttonText}>Lider</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Criança</Text>
      </TouchableOpacity>

         <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Pet</Text>
      </TouchableOpacity>

         <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Idoso</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
   logo: {
    width: 400,
    height: 400,
    marginBottom: 20,
  },
  button: {
     width: "100%",
    backgroundColor: "#0A2C5E",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 15,
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
})
