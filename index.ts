import { Configuration, OpenAIApi } from "openai";

const promptInstruction = "Edit the following job description to rephrase sentences that contain masculine or feminine coded words, in order to make the overall description less gender-coded."

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

const testJobDescription = `Job Title: Mechanical Engineer

Essential Functions

Challenge the status quo by creating superior product designs through the development and testing of specifications and methods.
Knowledge and Skills

Superior design skills
Exceptional conceptual skills
First-rate technical knowledge
Strong communication skills
Proven experience with production planning
Working Conditions

Tight deadlines and multiple priorities, requiring decisive decision making in a fast-paced environment.
Willing to work outside the standard 9-5 schedule, including early mornings, evenings, and weekends as required by tight project deadlines.
Ability to work independently in a competitive work environment.
Education & Experience Requirements

Bachelor’s degree
3-5 years of work experience`

async function main() {
    type ProcessEnv = {
        OPENAI_KEY: string
    }

    const env: ProcessEnv = <ProcessEnv>process.env;

    console.log(env.OPENAI_KEY);

    const openai = new OpenAIApi(new Configuration({
        apiKey: env.OPENAI_KEY
    }));
    console.log('Hello world');

    const prompt = promptBeginning + '\n' + wordsAsStrings
        + '\n' + promptInstruction + '\n```' + testJobDescription + '\n```';

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
                                        description: "The phrase we want to search for"
                                    },
                                    changeTo: {
                                        type: "string",
                                        description: "The new phrase to put in its place"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]
    });


    // finish_reason should be "function_call"
    console.log(gptResponse.data.choices[0].finish_reason)


    console.log(gptResponse);
}

main().then(() => {
    console.log('DONE');
}).catch(e => {
    console.error(e);
    console.error(e.response.data.error.message);
});
