import { Configuration, OpenAIApi } from "openai";

const promptBeginning = `Here is a list of feminine coded words (feminine_coded_words) and masculine coded words (masculine_coded_words)

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
]

For the following job description (enclosed in three backticks), tell me if it has more feminine coded words or masculine coded words and list out the frequency of those words.  Also give me a list of suggestions for how to rephrase parts of the job description that contain these words to make the overall description less gender-coded.
`


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

    const prompt = promptBeginning + '\n```' + testJobDescription + '\n```';

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0613",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ]
    });

    console.log(completion);
}

main().then(() => {
    console.log('DONE');
}).catch(e => {
    console.error(e);
});

