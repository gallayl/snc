import * as React from "react";
import { Button, FlatList, Modal, Text, TextInput, View } from "react-native";
import { connect } from "react-redux";
import { rootStateType } from "../store";
import { removeRepository, setRepository } from "../store/Repositories";

const mapStateToProps = (state: rootStateType) => ({
  repositories: state.repositories,
});

const mapDispatchToProps = {
  setRepository,
  removeRepository,
};

interface IRepositoriesState {
  addRepoUrl: string;
  loginRepoUrl: string;
}

class RepositoriesComponent extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  IRepositoriesState
> {

    public state = {addRepoUrl: "", loginRepoUrl: ""};

  public render() {
    return (
      <View>
        <TextInput onChangeText={(text) => {this.setState({addRepoUrl: text}); }} />
        <Button title="add" onPress={() => this.props.setRepository(this.state.addRepoUrl)}/>
        <FlatList
          data={Object.keys(this.props.repositories).map((k) => this.props.repositories[k])}
          renderItem={(key) => <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", borderRadius: 3, shadowColor: "#000000", shadowRadius: 5, margin: 5, padding: 5}}>
            <View style={{display: "flex", flexDirection: "column"}}>
                <Text style={{fontSize: 14}}>{key.item.Url}</Text>
                <Text style={{fontSize: 10}}>{key.item.CurrentUser && key.item.CurrentUser.Name}</Text>
            </View>
            <View style={{display: "flex", flexDirection: "row"}}>
              <Button color="#0044cc" title="Login" onPress={() => { this.setState({loginRepoUrl: key.item.Url}); }}/>
              <Button color="#aa0000" title="X" onPress={() => {this.props.removeRepository(key.item.Url); }}/>
            </View>

          </View>}
        />
        {this.state.loginRepoUrl.length ?
                <Modal
                animationType="slide"
                visible={this.state.loginRepoUrl.length > 0}
                transparent={false}
                >
                <Button title="x" onPress={() => this.setState({loginRepoUrl: ""})} />
                <View>
                  <Text>Alma</Text>
                </View>
              </Modal>

          : null}
      </View>
    );
  }
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RepositoriesComponent);

export { connectedComponent as Repositories };
