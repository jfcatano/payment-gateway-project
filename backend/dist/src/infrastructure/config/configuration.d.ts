declare const _default: () => {
    nodeEnv: string | undefined;
    port: string | number;
    databaseUrl: string | undefined;
    payment_gateway: {
        apiUrl: string | undefined;
        publicKey: string | undefined;
        privateKey: string | undefined;
        eventsSecret: string | undefined;
    };
};
export default _default;
