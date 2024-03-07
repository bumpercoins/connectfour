tsc --lib "dom, es6" *.ts
browserify Game.js > min.js
./node_modules/.bin/http-server  -c1 --cors .
cp game.html index.html
