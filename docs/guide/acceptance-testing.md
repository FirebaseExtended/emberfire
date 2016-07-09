# Acceptance testing

Firebase backed Ember applications can be tested by:

 - Setting up a stubbed Firebase instance with initial fixture data
 - Defining ways in which a stubbed Firebase instance should respond to new data

## Loading fixture data

You can generate an example acceptance test from a blueprint by running

    ember generate emberfire-acceptance-test books

This will generate an example acceptance test which you can use to specify fixture data and
expectations.

The following example sets up a local Firebase instance with some test data and asserts that
they are rendered to the page.

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

  andThen(function() {
    assert.equal(find(('.book-panel')).length, 2);
  });
});

// tests/fixtures/firebase/books.js
export default {
  1 : {
    "section" : "information",
    "title" : "Water Colours with Ease"
  },
  2 : {
    "type" : "self-help",
    "job" : "Thoughts and Feelings"
  }
};

```

Note that the fixture data should match the format that Firebase uses for storing data. This can be
JSON data exported from a Firebase instance.
