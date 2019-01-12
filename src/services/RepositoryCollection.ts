import { Injectable } from "@furystack/inject";
import { Repository } from "@sensenet/client-core";
import { ObservableValue } from "@sensenet/client-utils";
import { AsyncStorage } from "react-native";
import { FormsAuthentication } from "./FormsAuthentication";

@Injectable()
export class RepositoryCollection {
    public isInitialized: boolean = false;
    public onInitialized = new ObservableValue<string[]>([]);
    private repositories: Map<string, Repository> = new Map();
    private readonly storageKey: string = "SNC_REPOSITORY_STORAGE";

    constructor() {
        this.init();
    }

    public keys() {
        return Array.from(this.repositories.keys());
    }

    public set(repositoryUrl: string) {
        const repo = new Repository({repositoryUrl});
        FormsAuthentication.Setup(repo);
        this.repositories.set(repositoryUrl, repo);
        const urls = Array.from(new Set(this.repositories.keys()));
        AsyncStorage.setItem(this.storageKey, JSON.stringify(urls));
        return repo;
    }

    public get(repositoryName: string) {
        return this.repositories.get(repositoryName);
    }

    public remove(repositoryName: string) {
        if (this.repositories.has(repositoryName)) {
            (this.get(repositoryName) as Repository).dispose();
            this.repositories.delete(repositoryName);
            const urls = Array.from(new Set(this.repositories.keys()));
            AsyncStorage.setItem(this.storageKey, JSON.stringify(urls));
        }

    }

    private async init() {
        try {
            const value = await AsyncStorage.getItem(this.storageKey);
            if (value) {
                const repos: string[] = JSON.parse(value);
                for (const repo of repos) {
                    this.set(repo);
                }
            }
            this.isInitialized = true;
            this.onInitialized.setValue(this.keys());
        } catch (error) {
            /** :'( */
        }
    }
}
