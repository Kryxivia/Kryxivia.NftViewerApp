import { ErrorResponse } from "./error";
import AuthRequest from "./requests/auth";
import AuthResponse from "./responses/auth";
import { MintResponse } from "./responses/mint";
import { RegisterAlpha } from "./responses/register_alpha";
import {CHAIN_INFO} from "../constants/chain";

export default class ManagerProvider {
    public static baseUrl(chainId: number) {
        return CHAIN_INFO[chainId].apiURL
    }

    public static authRequest(chainId: number, authRequest: AuthRequest): Promise<AuthResponse> {
        return new Promise<AuthResponse>((resolve, reject) => {
            fetch(`${this.baseUrl(chainId)}/api/v1/login`, {
                method: "post",
                body: JSON.stringify(authRequest),
                headers: { "Content-Type": "application/json" },
            })
                .then((res: any) => {
                    res.status === 200 ? resolve(res.json() as AuthResponse) : reject(res.json() as ErrorResponse);
                })
                .catch((error: any) => reject(error));
        });
    }

    public static claimRewardRequest(chainId: number, accessToken: string): Promise<MintResponse> {
        return new Promise<MintResponse>((resolve, reject) => {
            fetch(`${this.baseUrl(chainId)}/api/v1/alpha/claim`, {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((res: any) => {
                    res.status === 200 ? resolve(res.json() as MintResponse) : reject(res.text() as string);
                })
                .catch((error: any) => {
                    reject(error)
                });
        });
    }

    
    public static claimPublicAlphaAccessRequest(chainId: number, accessToken: string): Promise<MintResponse> {
        return new Promise<MintResponse>((resolve, reject) => {
            fetch(`${this.baseUrl(chainId)}/api/v1/alpha/claim-public-alpha`, {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((res: any) => {
                    res.status === 200 ? resolve(res.json() as MintResponse) : reject(res.text() as string);
                })
                .catch((error: any) => {
                    reject(error)
                });
        });
    }

    public static registerAlphaRequest(
        chainId: number,
        accessToken: string,
        contactDiscord: string,
        contactTelegram: string,
        contactEmail: string,
    ): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            fetch(`${this.baseUrl(chainId)}/api/v1/alpha/infos`, {
                method: "post",
                body: JSON.stringify({
                   discord: contactDiscord,
                   telegram: contactTelegram,
                   email: contactEmail,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((res: any) => {
                    res.status === 200 || res.status === 304 ? resolve(true) : reject(res.text() as string);
                })
                .catch((error: any) => {
                    reject(error)
                });
        });
    }

    public static getRegisterAlphaRequest(chainId: number, accessToken: string): Promise<RegisterAlpha> {
        return new Promise<RegisterAlpha>((resolve, reject) => {
            fetch(`${this.baseUrl(chainId)}/api/v1/alpha/infos`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((res: any) => {
                    res.status === 200 ? resolve(res.json() as RegisterAlpha) : reject(res.text() as string);
                })
                .catch((error: any) => {
                    reject(error)
                });
        });
    }
}
