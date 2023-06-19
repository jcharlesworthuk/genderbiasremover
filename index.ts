import { Configuration, OpenAIApi } from "openai";

type ProcessEnv = {
    OPENAI_KEY: string
}

const env: ProcessEnv = <ProcessEnv>process.env;

console.log(env.OPENAI_KEY);

const openai = new OpenAIApi(new Configuration({
    apiKey: env.OPENAI_KEY
}));
console.log('Hello world');
