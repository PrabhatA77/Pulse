import "dotenv/config";

function requiredEnv(name:string,fallback?:string):string{
    const value = process.env[name] ?? fallback;
    if(value === undefined) throw new Error(`Missing env var : ${name}`);
    return value;
}

export const env = {
    port:Number(requiredEnv("PORT","4000")),
};