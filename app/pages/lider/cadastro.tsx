import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Cadastro({ navigation }: { navigation: any }) {
  return (
    <View>
      <Text>Tela de cadastro de líder</Text>
      <TouchableOpacity onPress={() => navigation.navigate('membrocdr')}>
        <Text>Ir para Membro CDR</Text>
      </TouchableOpacity>
    </View>
  );
}