import { Repository } from "@sensenet/client-core";
import { GenericContent, User } from "@sensenet/default-content-types";
import { AnyAction, Reducer } from "redux";
import { InjectableAction } from "redux-di-middleware";
import { rootStateType } from ".";
import { RepositoryCollection } from "../services/RepositoryCollection";

export type ContentWithChildren<T extends GenericContent = GenericContent> = T & {Children: GenericContent[]};

export interface IRepositoryModel {
    Url: string;
    CurrentUser: User;
    CurrentContent: ContentWithChildren;
    IsLoading: boolean;
    Error?: any;
}

// tslint:disable-next-line:max-line-length
export const createInjectableAction = <TAction extends InjectableAction<rootStateType, AnyAction>>(action: TAction) => ({...action});

export const initRepositories = () => createInjectableAction({
    type: "INIT_REPOSITORIES",
    inject: async (options) => {
        const keys = options.getInjectable(RepositoryCollection).keys();
        for (const key of keys) {
            options.dispatch(setRepository(key));
        }
    },
});

export const setRepository = (repositoryUrl: string) => createInjectableAction({
    type: "SET_REPOSITORY",
    repositoryUrl,
    inject: async (options) => {
        const repositoryCollection = options.getInjectable(RepositoryCollection);
        const repository = repositoryCollection.set(repositoryUrl);
        options.dispatch(setRepositorySuccess(repositoryUrl));
        repository.authentication.currentUser.subscribe((u) => {
            options.dispatch(updateUser(repositoryUrl, u));
        }, true);

    },
});

export const removeRepository = (repositoryUrl: string) => createInjectableAction({
    type: "REMOVE_REPOSITORY",
    repositoryUrl,
    inject: async (options) => {
        const repositoryCollection = options.getInjectable(RepositoryCollection);
        repositoryCollection.remove(repositoryUrl);
        options.dispatch(removeRepositorySuccess(repositoryUrl));
    },
});

const setRepositorySuccess = (repositoryUrl: string) => ({
    type: "SET_REPOSITORY_SUCCESS",
    repositoryUrl,
});

const removeRepositorySuccess = (repositoryUrl: string) => ({
    type: "REMOVE_REPOSITORY_SUCCESS",
    repositoryUrl,
});

export const navigate = (repositoryUrl: string, idOrPath: string | number) => createInjectableAction({
    type: "NAVIGATE",
    inject: async (options) => {
        const repository = options.getInjectable(RepositoryCollection).get(repositoryUrl) as Repository;
        try {
            const currentContent = await repository.load<ContentWithChildren>({
                idOrPath,
                oDataOptions: {
                    select: "all",
                    expand: ["Children"],
                },
            });
            options.dispatch(updateCurrentContent(repositoryUrl, currentContent.d));
        } catch (error) {
            /** */
            options.dispatch(onError(repositoryUrl, error));
        }
    },
});

const updateCurrentContent = (repositoryUrl: string, currentContent: ContentWithChildren) => ({
    type: "UPDATE_CURRENT_CONTENT",
    repositoryUrl,
    currentContent,
});

const updateUser = (repositoryUrl: string, user: User) => ({
    type: "UPDATE_USER",
    user,
    repositoryUrl,
});

const startLoading = (repositoryUrl: string) => ({type: "START_LOADING", repositoryUrl});
const finishLoading = (repositoryUrl: string) => ({type: "FINISH_LOADING", repositoryUrl});
const onError = (repositoryUrl: string, error?: any) => ({type: "ON_ERROR", repositoryUrl, error});

export const repositories: Reducer<{[key: string]: IRepositoryModel}> = (state = {}, action: AnyAction) => {
    let updated: typeof state;
    switch (action.type) {
        case "SET_REPOSITORY_SUCCESS":
            const setRepositoryAction = action as ReturnType<typeof setRepositorySuccess>;
            updated = {...state};
            updated[setRepositoryAction.repositoryUrl] = {
                ...updated[setRepositoryAction.repositoryUrl],
                Url: setRepositoryAction.repositoryUrl,
            };
            return updated;
        case "REMOVE_REPOSITORY_SUCCESS":
            const removeSuccessAction = action as ReturnType<typeof removeRepositorySuccess>;
            updated = {...state};
            delete updated[removeSuccessAction.repositoryUrl];
            return updated;
        case "UPDATE_USER": {
            const updateUserAction = action as ReturnType<typeof updateUser>;
            updated = {...state};
            updated[updateUserAction.repositoryUrl as any].CurrentUser = updateUserAction.user;
            return updated;
        }
        case "UPDATE_CURRENT_CONTENT": {
            const updateCurrentContentAction = action as ReturnType<typeof updateCurrentContent>;
            updated = {...state};
            updated[updateCurrentContentAction.repositoryUrl as any].CurrentContent = updateCurrentContentAction.currentContent;
            return updated;
        }
        case "START_LOADING": {
            const startLoadingAction = action as ReturnType<typeof startLoading>;
            updated = {...state};
            updated[startLoadingAction.repositoryUrl as any].IsLoading = true;
            return updated;
        }
        case "FINISH_LOADING": {
            const finishLoadingAction = action as ReturnType<typeof finishLoading>;
            updated = {...state};
            updated[finishLoadingAction.repositoryUrl as any].IsLoading = false;
            return updated;
        }
        case "ERROR": {
            const errorAction = action as ReturnType<typeof onError>;
            updated = {...state};
            updated[errorAction.repositoryUrl as any].Error = errorAction.error;
            return updated;
        }
        default:
            return state;
    }
};
