import ManagerProvider from "../providers/manager"
import { MintResponse } from "../providers/responses/mint";


export default class MintService {
    public static async claimReward(chainId: number, account: string): Promise<MintResponse>  {
        try  {
            const session = JSON.parse(localStorage.getItem("session-" + (account || "").toLowerCase()) as string);
            if (!session) {
                // eslint-disable-next-line
                throw "Sign-in to the website by signing the message from your wallet."
            }
            const result: MintResponse = await ManagerProvider.claimRewardRequest(chainId, session.token);
            return result;
        }
        catch (error)  {
            return await error as any;
        }
    }

    public static async claimNftAlphaAccess(chainId: number, account: string): Promise<MintResponse>  {
        try  {
            const session = JSON.parse(localStorage.getItem("session-" + (account || "").toLowerCase()) as string);
            if (!session) {
                // eslint-disable-next-line
                throw "Sign-in to the website by signing the message from your wallet."
            }
            const result: MintResponse = await ManagerProvider.claimPublicAlphaAccessRequest(chainId, session.token);
            return result;
        }
        catch (error)  {
            return await error as any;
        }
    }
}