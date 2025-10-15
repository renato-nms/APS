import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet } from "react-native";
import Inicio from "./pages/Inicio";
import Cadastro from "./pages/lider/cadastro";
import Familia from "./pages/lider/familia";
import Home from "./pages/lider/home";
import Perfil from "./pages/lider/perfil";

const Stack = createNativeStackNavigator();

export default function Pages() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Inicio" 
      component={Inicio} 
      />
      <Stack.Screen name="Cadastro"
      component={Cadastro}
      />
      <Stack.Screen name="Familia"
      component={Familia}
      />
      <Stack.Screen name="Perfil"
      component={Perfil}
      />
      <Stack.Screen name="Home"
      component={Home}
      />
    </Stack.Navigator>
  );
}

 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
