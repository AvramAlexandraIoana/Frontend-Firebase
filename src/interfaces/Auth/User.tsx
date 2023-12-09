export interface User {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: number; 
    localId: string;
}