import { applyMiddleware, combineReducers, createStore } from "redux";
import { ReduxDiMiddleware } from "redux-di-middleware";
import { RepositoryCollection } from "../services/RepositoryCollection";
import { initRepositories, repositories } from "./Repositories";

export const rootReducer = combineReducers({
    repositories,
});

export type rootStateType = ReturnType<typeof rootReducer>;

const diMiddleware = new ReduxDiMiddleware();
const repositoryCollection = diMiddleware.getInjectable(RepositoryCollection);

export const store = createStore(rootReducer, {}, applyMiddleware(diMiddleware.getMiddleware()));
repositoryCollection.onInitialized.subscribe(() => {
    store.dispatch(initRepositories());
});
