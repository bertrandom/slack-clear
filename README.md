# slack-clear

Clear the screen with `/clear` in Slack workspaces

![example](https://raw.githubusercontent.com/bertrandom/slack-clear/master/static/img/clear-1600.png)

## Slack App Configuration

Create a new [Slack Workspace Token App](https://api.slack.com/apps/new_app_token).

Navigate to **Features** :: **Slash Commands**

Click **Create New Command**.

Key                 | Value            |
--------------------|------------------|
Command             | /clear           |
Request URL         | https://{DOMAIN}/command |
Short Description   | Clear the screen |

Hit **Save**.

Navigate to **Features** :: **OAuth & Permissions**

OAuth Settings :: Redirect URLs :: Add a new Redirect URL

```
https://{DOMAIN}/oauth
```

Hit **Add**.

## Installation

Copy `config/default.json5` to `config/local.json5` and fill in the values from **Settings** :: **Basic Information** in your Slack App Configuration.

Type `npm install`.

## License

This software is free to use under the ISC license. See the [LICENSE file][] file for license text and copyright information.

[LICENSE file]: https://github.com/bertrandom/slack-clear/blob/master/LICENSE.md