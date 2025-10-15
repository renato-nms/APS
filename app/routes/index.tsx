import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet } from "react-native";

{/*LIDER*/}

import Inicio from "../pages/Inicio";
import Cadastro from "../pages/lider/cadastro";
import Consultas from "../pages/lider/consultas";
import Exames from "../pages/lider/exames";
import Familia from "../pages/lider/familia";
import Home from "../pages/lider/home";
import Laudos from "../pages/lider/laudos";
import MembroCDR from "../pages/lider/membrocdr";
import Perfil from "../pages/lider/perfil";
import r_consultas from "../pages/lider/r-consultas";
import r_exames from "../pages/lider/r-exames";
import r_laudos from "../pages/lider/r-laudos";
import Vacinas from "../pages/lider/vacinas";

{/*IDOSO*/}

import Carteira_Idoso from "../pages/idoso/carteira";
import Consultas_Idoso from "../pages/idoso/consultas";
import Exames_Idoso from "../pages/idoso/exames";
import Laudos_Idoso from "../pages/idoso/laudos";
import r_consultas_Idoso from "../pages/idoso/r-consultas";
import r_exames_Idoso from "../pages/idoso/r-exames";
import r_laudos_Idoso from "../pages/idoso/r-laudos";
import r_vacinas_Idoso from "../pages/idoso/r-vacinas";
import Vacinas_Idoso from "../pages/idoso/vacinas";

{/*PET*/}

import Carteira_Pet from "../pages/pet/carteira";
import Consultas_Pet from "../pages/pet/consultas";
import Exames_Pet from "../pages/pet/exames";
import Laudos_Pet from "../pages/pet/laudos";
import r_consultas_Pet from "../pages/pet/r-consultas";
import r_exames_Pet from "../pages/pet/r-exames";
import r_laudos_Pet from "../pages/pet/r-laudos";
import r_vacinas_Pet from "../pages/pet/r-vacinas";
import Vacinas_Pet from "../pages/pet/vacinas";

{/*CRIANCA*/}

import Consultas_Crianca from "../pages/crianca/consultas";
import Exames_Crianca from "../pages/crianca/exames";
import Laudos_Crianca from "../pages/crianca/laudos";
import r_consultas_Crianca from "../pages/crianca/r-consultas";
import r_exames_Crianca from "../pages/crianca/r-exames";
import r_laudos_Crianca from "../pages/crianca/r-laudos";
import r_vacinas_Crianca from "../pages/crianca/r-vacinas";
import Vacinas_Crianca from "../pages/crianca/vacinas";

const Stack = createNativeStackNavigator();

export default function Pages() {
  return (
    <Stack.Navigator>
      {/*Lider*/}
      <Stack.Screen name="Inicio" 
      component={Inicio} 
      />
      <Stack.Screen name="Cadastro"
        component={Cadastro}
      />
      <Stack.Screen name="MembroCDR"
      component={MembroCDR}
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
      <Stack.Screen name="Consultas"
      component={Consultas}
      />
      <Stack.Screen name="Exames"
      component={Exames}
      />
      <Stack.Screen name="Laudos"
      component={Laudos}
      />
      <Stack.Screen name="r_consultas"
      component={r_consultas}
      />
      <Stack.Screen name="r_exames"
      component={r_exames}
      />
      <Stack.Screen name="r_laudos"
      component={r_laudos}
      />
      <Stack.Screen name="Vacinas"
      component={Vacinas}
      />
      {/*Idoso*/}
      <Stack.Screen name="Carteira_Idoso"
      component={Carteira_Idoso}
      />
      <Stack.Screen name="Consultas_Idoso"
      component={Consultas_Idoso}
      />
      <Stack.Screen name="Exames_Idoso"
      component={Exames_Idoso}
      />
      <Stack.Screen name="Laudos_Idoso"
      component={Laudos_Idoso}
      />
      <Stack.Screen name="Vacinas_Idoso"
      component={Vacinas_Idoso}
      />
      <Stack.Screen name="r_consultas_Idoso"
      component={r_consultas_Idoso}
      />
      <Stack.Screen name="r_exames_Idoso"
      component={r_exames_Idoso}
      />
      <Stack.Screen name="r_laudos_Idoso"
      component={r_laudos_Idoso}
      />
      <Stack.Screen name="r_vacinas_Idoso"
      component={r_vacinas_Idoso}
      />
      {/*Pet*/}
      <Stack.Screen name="Carteira_Pet"
      component={Carteira_Pet}
      />
      <Stack.Screen name="Consultas_Pet"
      component={Consultas_Pet}
      />
      <Stack.Screen name="Exames_Pet"
      component={Exames_Pet}
      />
      <Stack.Screen name="Laudos_Pet"
      component={Laudos_Pet}
      />
      <Stack.Screen name="Vacinas_Pet"
      component={Vacinas_Pet}
      />
      <Stack.Screen name="r_consultas_Pet"
      component={r_consultas_Pet}
      />
      <Stack.Screen name="r_exames_Pet"
      component={r_exames_Pet}
      />
      <Stack.Screen name="r_laudos_Pet"
      component={r_laudos_Pet}
      />
      <Stack.Screen name="r_vacinas_Pet"
      component={r_vacinas_Pet}
      />
      {/*Crianca*/}
      <Stack.Screen name="Consultas_Crianca"
      component={Consultas_Crianca}
      />
      <Stack.Screen name="Exames_Crianca"
      component={Exames_Crianca}
      />
      <Stack.Screen name="Laudos_Crianca"
      component={Laudos_Crianca}
      />
      <Stack.Screen name="Vacinas_Crianca"
      component={Vacinas_Crianca}
      />
      <Stack.Screen name="r_consultas_Crianca"
      component={r_consultas_Crianca}
      />
      <Stack.Screen name="r_exames_Crianca"
      component={r_exames_Crianca}
      />
      <Stack.Screen name="r_laudos_Crianca"
      component={r_laudos_Crianca}
      />
      <Stack.Screen name="r_vacinas_Crianca"
      component={r_vacinas_Crianca}
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
