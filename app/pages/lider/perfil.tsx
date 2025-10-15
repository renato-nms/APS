import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';

export default function Familia() {
  const navigation = useNavigation();
  return (
    <View>
      <Text> Tela de perfil</Text>
    </View>
  );
}