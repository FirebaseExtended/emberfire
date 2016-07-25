# Contributing | EmberFire

Thank you for contributing to the Firebase community!

 - [Have a usage question?](#question)
 - [Think you found a bug?](#issue)
 - [Have a feature request?](#feature)
 - [Want to submit a pull request?](#submit)
 - [Need to get set up locally?](#local-setup)

## <a name="question"></a> Have a usage question?

We get lots of those and we love helping you, but GitHub is not the best place for them. Issues
which just ask about usage will be closed. Here are some resources to get help:

- Start with the quickstart: https://www.firebase.com/docs/web/libraries/ember/quickstart.html
- Go through the tutorial: https://www.firebase.com/docs/web/libraries/ember/guide.html
- Read the full API reference: https://www.firebase.com/docs/web/libraries/ember/api.html
- See the example app: https://github.com/firebase/emberfire/tree/master/tests/dummy

If our docs and examples don't help, you can reach us through one of the following channels:

- Ask a question with the #firebase and #emberfire tags on Stack Overflow: https://stackoverflow.com/questions/ask?tags=emberfire,firebase
- Start a new thread on the Firebase Google Group: https://groups.google.com/forum/#!forum/firebase-talk
- Join the Firebase Slack community: https://firebase-community.slack.com

**Please avoid double posting across multiple channels!**


## <a name="issue"></a> Think you found a bug?

Yeah, we're definitely not perfect!

Search through [old issues](https://github.com/firebase/emberfire/issues) before submitting a new issue as your question
may have already been answered.

If your issue appears to be a bug, and hasn't been reported, [open a new issue](https://github.com/firebase/emberfire/issues/new).
Please use the provided bug report template and include a minimal repro.

If you are up to the challenge, [submit a Pull Request](#submit) with a fix!


## <a name="feature"></a> Have a feature request?

Great, we love hearing how we can improve our products! After making sure someone hasn't already
requested the feature in the [existing issues](https://github.com/firebase/emberfire/issues), go ahead and [open a new issue](https://github.com/firebase/emberfire/issues/new).
Feel free to remove the bug report template and instead provide an explanation of your feature
request. Provide code samples if applicable. Try to think about what it will allow you to do that
you can't do today? How will it make current workarounds straightforward? What potential bugs and
edge cases does it help to avoid?


## <a name="submit"></a> Want to submit a pull request?

Sweet, we'd love to accept your contribution! [Open a new pull request](https://github.com/firebase/emberfire/compare)
and fill out the provided form.

If you want to implement a new feature, please open an issue with a proposal first so that we can
figure out if the feature makes sense and how it will work.

Make sure your changes pass our linter and the tests all pass on your local machine. We've hooked
up this repo with continuous integration to double check those things for you.

Most non-trivial changes should include some extra test coverage. If you aren't sure how to add
tests, feel free to submit regardless and ask us for some advice.

Finally, you will need to sign our [Contributor License Agreement](https://cla.developers.google.com/about/google-individual)
before we can accept your pull request.


## <a name="local-setup"></a> Need to get set up locally?

If you'd like to contribute to EmberFire, run the following commands to get your environment set up:

### Setup

* `git clone` this repository
* `npm install -g ember-cli bower gulp`
* `npm install`
* `bower install`

### Running tests

* `ember test` OR
* `ember test --server`

##### Running tests against a specific version of ember-data

* `ember try:one <scenario>` where  `<scenario>` is one of the scenarios in `config/ember-try.js`

Example:

```
ember try:one ember-data-canary
```

### Running the FireBlog demo app

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Using your local EmberFire workdir in another local project

From your `emberfire` workdir

* `npm link`
* `npm prune --production` (removes dev dependencies, these can trip you up!)

From your *app* workdir

* `npm link emberfire`
* Update your `package.json` so that `emberfire` is in `devDependencies` and is set to version `0.0.0`

  ```
  "devDependencies": {
    "emberfire": "0.0.0"
  ```
