import * as React from "react";
import { Alert, Button, Text, View } from "react-native";
import { Provider } from "react-redux";
import { Repositories } from "./screens/Reposiories";
import { store } from "./store";

export const App = () => (
  <Provider store={store}>
  <View style={{ margin: 50 }}>
    <Text>Hello Zoli! alma 2</Text>
    <Button
      title="e"
      onPress={() => {
        Alert.alert("Nemáá", "ééé2");
      }}
    />
    <Repositories></Repositories>
  </View>
  </Provider>
);
