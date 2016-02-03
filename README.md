    meteor --settings settings.json
    meteor deploy XXX.meteor.com --settings settings.json

`settings.json`:


    {
      "twitConfig": {
        "consumer_key":         "...",
        "consumer_secret":      "...",
        "access_token":         "...",
        "access_token_secret":  "..."
      },
      "listOwner": "Grognor",
      "listUrlName": "weird-sun-twitter"
    }
