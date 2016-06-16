# Deploying to Firebase Hosting

We're ready to deploy our Ember app! Using Firebase Hosting, we can deploy our application's static files (HTML, CSS, JavaScript, etc) to the web with a single command. To get started, we'll download `firebase-tools` via npm:

```
$ npm install -g firebase-tools
```

[Read through our hosting quickstart](https://firebase.google.com/docs/hosting/quickstart) to get your site up and running in minutes. Firebase Hosting is a production-grade service, with security, reliability, and scalability baked-in. We host your content on a global CDN and even provision an SSL certificate automatically for you.

For `ember-cli` apps, run the following commands:

```
$ ember build
$ firebase init
```

Then choose the name of the Firebase app you're deploying and enter `dist` when prompted for your public directory. This will generate a `firebase.json` file. Update the file to include the following `rewrites` configuration:

```json
{
  "hosting": {
    "firebase": "my-ember-cli-app",
    "public": "dist",
    "rewrites": [{
      "source": "**",
      "destination": "/index.html"
    }]
  }
}
```

Deploy your app by running the command:

```
$ firebase deploy
```

Note that you can use any hosting service you'd like to deploy your Ember app, you don't need to use Firebase Hosting.
