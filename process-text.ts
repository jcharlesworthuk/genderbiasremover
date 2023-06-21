import { APIGatewayEvent, APIGatewayEventRequestContext, Context } from "aws-lambda";
import { Configuration, OpenAIApi } from "openai";


// This prompt tends to replace single words but it does more of them...
const promptInstruction = "Edit the following job description to remove the masculine/feminine coded words from the previous lists, and replace them with a word or phrase that is less gender-coded. For each replacement, explain why you need to make that change."

const promptBeginning = "Here is a list of feminine coded words (feminine_coded_words) and masculine coded words (masculine_coded_words)";

const wordsAsStrings = `
feminine_coded_words = [
    "agree",
    "affectionate",
    "child",
    "cheer",
    "collab",
    "commit",
    "communal",
    "compassion",
    "connect",
    "considerate",
    "cooperat",
    "co-operat",
    "depend",
    "emotiona",
    "empath",
    "feel",
    "flatterable",
    "gentle",
    "honest",
    "interpersonal",
    "interdependen",
    "interpersona",
    "inter-personal",
    "inter-dependen",
    "inter-persona",
    "kind",
    "kinship",
    "loyal",
    "modesty",
    "nag",
    "nurtur",
    "pleasant",
    "polite",
    "quiet",
    "respon",
    "sensitiv",
    "submissive",
    "support",
    "sympath",
    "tender",
    "together",
    "trust",
    "understand",
    "warm",
    "whin",
    "enthusias",
    "inclusive",
    "yield",
    "share",
    "sharin"
]

masculine_coded_words = [
    "active",
    "adventurous",
    "aggress",
    "ambitio",
    "analy",
    "assert",
    "athlet",
    "autonom",
    "battle",
    "boast",
    "challeng",
    "champion",
    "compet",
    "confident",
    "courag",
    "decid",
    "decision",
    "decisive",
    "defend",
    "determin",
    "domina",
    "dominant",
    "driven",
    "fearless",
    "fight",
    "force",
    "greedy",
    "head-strong",
    "headstrong",
    "hierarch",
    "hostil",
    "impulsive",
    "independen",
    "individual",
    "intellect",
    "lead",
    "logic",
    "objective",
    "opinion",
    "outspoken",
    "persist",
    "principle",
    "reckless",
    "self-confiden",
    "self-relian",
    "self-sufficien",
    "selfconfiden",
    "selfrelian",
    "selfsufficien",
    "stubborn",
    "superior",
    "unreasonab"
]`;

const env = <{ OPENAI_KEY: string }>process.env;

type RequestBody = {
    text: string
};
interface IHttpResponse {
    statusCode: number,
    headers: { [name: string]: any },
    body: string
}
function buildResponse(statusCode: number, bodyString: string): IHttpResponse {
    return {
        statusCode: statusCode,
        headers: {
        },
        body: bodyString
    };
}

/**
 * POST process
 */
export async function main(event: APIGatewayEvent, context: Context) {
    const body = <RequestBody>JSON.parse(event.body!);
    if (!body || !body.text || body.text.length < 10) return buildResponse(400, JSON.stringify({ message: 'Invalid request'}));
    console.log(`Calling function with this text:`);
    console.log(body.text);

    try {
        const openai = new OpenAIApi(new Configuration({ apiKey: env.OPENAI_KEY }));
    
        const prompt = promptBeginning + '\n\n' + wordsAsStrings
            + '\n\n' + promptInstruction + '\n\n```' + body.text.replace(/```/g, '') + '\n```';
    
        console.log(`Calling ChatGPT with this prompt:`);
        console.log(prompt);
        const gptResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-0613",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            functions: [
                {
                    name: "edit_job_description",
                    description: "Edits the job description by replacing phrases",
                    parameters: {
                        type: "object",
                        properties: {
                            replacements: {
                                type: "array",
                                description: "Array of the phrases to replace",
                                items: {
                                    type: "object",
                                    properties: {
                                        changeFrom: {
                                            type: "string",
                                            description: "The word or phrase we want to search for"
                                        },
                                        changeTo: {
                                            type: "string",
                                            description: "The new word or phrase to replace it with"
                                        },
                                        reason: {
                                            type: "string",
                                            description: "The explanation for this replacement"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        });
    
        console.log(JSON.stringify(gptResponse.data?.choices[0], null, 4));
    
        if (!gptResponse.data?.choices[0]?.finish_reason 
            || gptResponse.data.choices[0].finish_reason !== "function_call") throw new Error(`ChatGPT did not return a function call`);

        const argumentsString = gptResponse.data.choices[0].message?.function_call?.arguments;
        if (!argumentsString) throw new Error(`No function arguments returned from ChatGPT`);

        console.log(argumentsString);
        return buildResponse(200, argumentsString);
    } catch (e) {
        console.error(e);
        return buildResponse(500, JSON.stringify({ message: 'An error occured procesing the text'}));
    }
}
