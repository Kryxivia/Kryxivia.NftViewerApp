import ManagerProvider from "../providers/manager"
import { RegisterAlpha } from "../providers/responses/register_alpha";

export default class RegisterAlphaService {
    public static async register(chainId: number, contactDiscord: string, contactTelegram: string, contactEmail: string, account: string | null | undefined): Promise<Boolean> {
        try {
            const session = JSON.parse(localStorage.getItem("session-" + (account || "").toLowerCase()) as string);
            if (!session) {
                // eslint-disable-next-line
                throw "Sign-in to the website by signing the message from your wallet."
            }
            const result = await ManagerProvider.registerAlphaRequest(
                chainId,
                session.token,
                contactDiscord,
                contactTelegram,
                contactEmail
            );
            return result;
        }
        catch (error) {
            return await error as any;
        }
    }

    public static async get(chainId: number, account: string): Promise<RegisterAlpha> {
        try {
            const session = JSON.parse(localStorage.getItem("session-" + (account || "").toLowerCase()) as string);
            if (session) {
                let result: RegisterAlpha = await ManagerProvider.getRegisterAlphaRequest(chainId, session.token);
                return result;
            } else {
                return { discord: "", telegram: "", email: "" } as RegisterAlpha
            }
        }
        catch (error) {
            return await error as any;
        }
    }
}
