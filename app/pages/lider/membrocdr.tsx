import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function MembroCDR() {
  const navigation = useNavigation();
    return (
        <View>
            <Text> Tela de cadastro do membro</Text>
            <TouchableOpacity onPress = {() => navigation.navigate('Home')}>
                <Text> Ir para Home do lider</Text>
            </TouchableOpacity>


        </View>
    )
}