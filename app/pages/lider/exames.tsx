import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';

export default function Exames() {
    const navigation = useNavigation();

    return (
        <View>
            <Text>Tela de exames</Text>

        </View>
    );
}