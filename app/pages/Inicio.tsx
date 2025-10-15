import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
export default function Inicio() {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Tela de inicio, quem é você?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text>Ir para Cadastro</Text>
      </TouchableOpacity>
    </View>
  )
}