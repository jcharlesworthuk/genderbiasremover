
Add a `.env` file with the following:

```
OPENAI_KEY=<your key>
```

Deploy

```
serverless deploy --region eu-west-1 --stage prod --param="openaikey=<YOUR-KEY>"
```