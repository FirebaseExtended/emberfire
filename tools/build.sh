if test $TAG_NAME; then
    npm version $(echo $TAG_NAME | sed 's/^v\(.*\)$/\1/')
else
    npm version $(npm version | head -n 1 |  sed "s/^.*: '\([^']*\).*/\1/")-canary.$SHORT_SHA
fi

npm install
npm run build
npm run reference