import ManagerProvider from "../providers/manager"
import AuthResponse from "../providers/responses/auth"

export default class WalletService {
    public static async authWallet(chainId: number, addr: string, sign: string): Promise<boolean> {
        try {
            const result: AuthResponse = await ManagerProvider.authRequest(chainId, {
                publicKey: addr,
                signature: sign
            })
        
            if (result) {
                const threeDays = 60 * 60 * 24 * 3 * 1000
                localStorage.setItem('session-' + addr.toLowerCase(),
                    JSON.stringify({
                        token: result.token,
                        addr: addr,
                        expiration: Date.now() + threeDays
                    }))
            }
            return result.auth;
        }
        catch (error) {
            console.error(error)
            return false;
        }
    }

    public static verifySessionIntegrity(currAcc: string): boolean {
        const sessionKey = "session-" + currAcc.toLowerCase()
        const sessionData = localStorage.getItem(sessionKey)
        if (sessionData !== null) {
            const session = JSON.parse(sessionData)
            if (session.expiration && session.expiration > Date.now()) {
                return true
            } else {
                // session is expired. remove local storage.
                localStorage.removeItem(sessionKey)
            }
          }
        return false
    }
}
