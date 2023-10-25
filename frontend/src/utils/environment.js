const PROD_ENV_ORIGINS = ["https://que-manger.kao.cx"];

export const envType = (forceEnv = null, force = false) => {
    if (forceEnv !== null && force === true) {
        return forceEnv;
    }

    const origin = window.location.origin;

    if (PROD_ENV_ORIGINS.includes(origin)) {
        return "PROD";
    }

    return "LOCAL";
}

export const isProduction = () => envType() === "PROD";