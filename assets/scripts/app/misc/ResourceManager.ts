import { Asset, AssetManager, assetManager, instantiate, Prefab, SpriteFrame, Node } from "cc";

export class ResourceManager {
    public static async loadRes<T extends Asset>(name:string) : Promise<T> {
        return new Promise((resolve, reject) => {
            assetManager.loadAny<T>(name, (err, resAsset) => {
                err && reject(err);
                resolve(resAsset);
            });
        });
    }

    public static async loadBundle(name:string) : Promise<AssetManager.Bundle> {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(name, (err, data) => {
                err && reject(err);
                resolve(data);
            });
        });
    }

    public static async loadSpriteFrame(bundleName:string, assetName:string) : Promise<SpriteFrame> {
        let bundle = assetManager.getBundle(bundleName);
        if (bundle == null) {
            bundle = await this.loadBundle(bundleName);
        }

        return new Promise((resolve, reject) => {
            bundle?.load(assetName, SpriteFrame, (err, data) => {
                err && reject(err);
                resolve(data);
            });
        });
    }

    public static async loadPrefab(bundleName:string, assetName:string) : Promise<Node> {
        let bundle = assetManager.getBundle(bundleName);
        if (bundle == null) {
            bundle = await this.loadBundle(bundleName);
        }

        return new Promise((resolve, reject) => {
            bundle?.load(assetName, Prefab, (err, data) => {
                err && reject(err);
                const node : Node = instantiate(data);
                resolve(node);
            });
        });
    }

    public static release(node:Node) :void {
        node.destroy();
    }
}
