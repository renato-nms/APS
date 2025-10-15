import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';

export default function Perfil() {
  const navigation = useNavigation();
  return (
    <View>
      <Text> Tela de perfil</Text>
    </View>
  );
}