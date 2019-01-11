import * as React from "react";
import { Alert, Button, Text, View } from "react-native";

export const App = () => (
  <View style={{ margin: 50 }}>
    <Text>Hello Zoli! alma 2</Text>
    <Button
      title="e"
      onPress={() => {
        Alert.alert("Nemáá", "ééé2");
      }}
    />
  </View>
);
