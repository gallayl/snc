import * as React from "react";
import { Alert, Button, Text, View } from "react-native";

export const App = () => (
  <View style={{ marginTop: 50 }}>
    <Text>Hello Expo! alma</Text>
    <Button
      title="e"
      onPress={() => {
        Alert.alert("Nemáá", "ééé2");
      }}
      color="black"
    />
  </View>
);
