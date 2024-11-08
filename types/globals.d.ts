export {};

declare global {
    interface CustomJWTSessionClaims {
        metadate: {
            role?: "admin";
        }
    }
}