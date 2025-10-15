import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';

export default function Laudos_Crianca() {
    const navigation = useNavigation();

    return (
        <View>
            <Text>Tela de laudos da crianca</Text>
        </View>
    );
}