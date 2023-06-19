
Add a `.env` file with the following:

```
OPENAI_KEY=<your key>
```

Deploy

```
serverless deploy --stage prod --param="openaikey=HELLO"

serverless deploy --region eu-west-1 --param="openaikey=<YOUR-KEY>"
```