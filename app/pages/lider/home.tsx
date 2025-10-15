import { useNavigation } from "@react-navigation/native";
import React from 'react';
import { Text, View } from 'react-native';

export default function Home() {
    const navigation = useNavigation();
    return (
        <View>
            <Text> Tela inicial do líder</Text>
        </View>

    )
}