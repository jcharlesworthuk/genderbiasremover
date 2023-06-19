# Gender Bias Remover

## Try It Live

[https://genderbiasremover.com](https://genderbiasremover.com)

## About

Our language use often subtly perpetuates 'gender-coding'. This is a reflection of societal norms which ascribe specific characteristics and behaviors to men and women, and inevitably, this bias finds its way into our verbal and written communications. Terms such as "bossy" and "feisty" serve as good examples, as they are rarely, if ever, used to depict men. This phenomenon of gender-coded language pervades even job adverts, and studies have revealed that it can discourage women from applying to positions that use masculine-coded language in their descriptions.

This tool extends the concept behind [https://github.com/lovedaybrooke/gender-decoder](https://github.com/lovedaybrooke/gender-decoder) and incorporates the capabilities of ChatGPT to actually rewrite your job advert to be less gender-coded. Learn more about the mechanism behind this phenomenon check out This tool was inspired by a research paper written by Danielle Gaucher, Justin Friesen, and Aaron C. Kay back in 2011, called [Evidence That Gendered Wording in Job Advertisements Exists and Sustains Gender Inequality](https://gender-decoder.katmatfield.com/static/documents/Gaucher-Friesen-Kay-JPSP-Gendered-Wording-in-Job-ads.pdf)

## Deploying This API

This repository contains the code for an AWS Lambda function that can be invoked over HTTPs.  The Lambda function takes in a job description as text, wraps it in a prompt and sends it off to OpenAI for analysis and correction.  The call to OpenAI uses [Function calling](https://openai.com/blog/function-calling-and-other-api-updates) to ensure a structured response.

To deploy the API you will need:
1. An AWS account and [configured credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
2. An OpenAI [API Key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key)

The function is deployed using [Serverless Framework](https://www.serverless.com/).  You can install it globally using.

```sh
npm install -g serverless
```

Then deploy this function to your AWS account with:

```sh
npm install

serverless deploy --region <ANY-REGION> --stage prod --param="openaikey=<YOUR-KEY>"
```

Follow [this guide](https://docs.aws.amazon.com/lambda/latest/dg/lambda-urls.html) to get the public URL of your newly deployed Lambda function.  You can call it like this...


```sh
    curl -d '{"text":"A job advert posting"}' -H "Content-Type: application/json" -X POST https://abcxxxabcxxxabcxxx.lambda-url.<REGION>.on.aws
```

## Test Data

There are some test job postings in the folder `./example-ads` in this repository

# License & Contributing

This backend API endpoint is licensed under the The [GNU General Public License v3](./LICENSE) to keep it forever free, open source and accessible to everyone.  Pull requests welcome.

