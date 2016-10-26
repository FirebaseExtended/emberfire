# Testing

Firebase backed Ember applications can be tested by:

 - Setting up an offline Firebase reference with fixture data
 - Defining ways in which the app should respond to data changes

## Acceptance Testing

You can generate an example acceptance test by running

    ember generate emberfire-acceptance-test books

This will generate an example acceptance test which you can use to specify fixture data and expectations.

The provided `moduleForEmberFireAcceptance` creates a special offline Firebase reference which is initialized with the data provided in `fixtureData`. Using this method you can check that the data from Firebase is correctly rendered on the page.

```js
// tests/acceptance/books-test.js

import { test } from 'qunit';
import moduleForEmberfireAcceptance from 'book-store/tests/helpers/module-for-emberfire-acceptance';

import BOOK_FIXTURES from 'book-store/tests/fixtures/firebase/books';

moduleForEmberfireAcceptance('Acceptance | books', {
  fixtureData: {
    books: BOOK_FIXTURES
  }
});

test('visiting /books', function(assert) {
  visit('/books');

  andThen(() => {
    assert.equal(find(('.book-panel')).length, 2);
  });
});

// tests/fixtures/firebase/books.js
export default {
  "-KMQgixTre1RNk-q-doB": {
    "section" : "information",
    "title" : "Water Colours with Ease"
  },
  "-KMQglKpLM8vW3iQPnMR": {
    "type" : "self-help",
    "job" : "Thoughts and Feelings"
  }
};
```

Note that the fixture data should match the format that Firebase uses for storing data. This can be
JSON data exported from a Firebase instance.
