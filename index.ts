import { Configuration, OpenAIApi } from "openai";


//const promptInstruction = "Edit the following job description to make it less gender coded."

// This prompt tends to replace single words but it does more of them...
const promptInstruction = "Edit the following job description to reword phrases that contain masculine or feminine coded words, in order to make the overall description less gender-coded."

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

const testJobDescriptionLonger = `Site Foreman

Since 1944 AD Construction Group has established itself as a well-regarded refurbishment contractor providing building maintenance services within the public sector, predominantly to local authority housing associations. Working as a close-knit team the organisation has successfully proven time and time again its ability to be a serious competitor in the construction industry.

We are looking for a foreperson to be working in and around London Bridge.

Main purpose of the role:

Plan and supervise the day-today activities at site level and ensure that work is carried out in a safe manner, in compliance with all H&S legislation.

Due to the variety of sites, driving is a fundamental part of the role, therefore applicants must have a full manual driving license.

Essential skills/knowledge:

Knowledge of fire stopping and fire works
Experience of managing a team of trade staff across multiple sites
Excellent communication skills
Ability to establish good working relationships with clients, the public and subcontractors
Ability to manage own time and prioritise workload
CSCS Card
Driving license
Desirable skills:

Basic IT knowledge
Scaffold inspection – training can be provided
First Aid – training can be provided
IPAF
PASMA
SSSTS/SMSTS
Package:

Salary - £40,000 to £47,000, based on experience
Hours – Monday to Friday, 8am to 5pm (1hr for lunch)
21 days of holiday + bank holidays and Christmas Closure
Birthday day off
Company van (tracked) and fuel card for business use
Phone for business use
Company branded Uniform and relevant PPE
Additional information:

DBS check will be carried out on your behalf at the companies expense
Eligible to work in the UK
Six Month Probationary Period
All applications are assessed in line with the Equal Opportunities Regulations and Data Protection Regulations. For more information please see our website www.theadgroup.co.uk

Job Types: Full-time, Permanent

Salary: £40,000.00-£47,000.00 per year

Benefits:

Company car
Referral programme
Schedule:

Monday to Friday
No weekends
Licence/Certification:

Driving Licence (required)
Work Location: On the road`

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
        + '\n' + promptInstruction + '\n```' + testJobDescriptionLonger + '\n```';

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
                                    },
                                    reason: {
                                        type: "string",
                                        description: "The reason for this replacement"
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
