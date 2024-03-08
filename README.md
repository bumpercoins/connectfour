This project implements the AlphaZero algorithm in TypeScript for the game Connect Four
It uses TensorFlowJS both to train and run the bot's neural net. The net is a very simple CNN with 2 CNN layers, flattening, and 2 Hidden Dense Layers, and policy and value output heads.

I trained it for a week to the the current model on my MacBookAir.

If you wish to train your own Connect Four bot from scratch, here's what you'll need to do:
Preconditions: you have the TypeScript comipler (tsc) installed and you have Node installed
1) Run npm install to instal tensorflowJS locally
2) First delete the existing model. Rm -rf the existing model subdirectory.
3) Go to Net.ts and replace this import "import * as tf from '@tensorflow/tfjs';" with "import * as tf from '@tensorflow/tfjs-node-gpu';" so that training will use your GPU
3) Go to Net.ts and and examine createModel. If you wish, you can specify your own custom architecture here. Then uncomment out it's invocation (directly below its definition)
3) Next compile the code by running "tsc". This creates a Net.js file from the Net.ts file.
4) Run "node Net.js". Now you should have a new model subdirectory for your untrained bot.
5) Examine MCTS.ts and Train.ts. Feel free to change any of the numerical contants. The ones to look out for are numMCTSSims in MCTS.ts and both numIterations and numGamesPerIteration in Train.ts. And if you desire, make a few tweaks.
6) If you made any changes, compile the code again, running "tsc". Changes will reflect in Train.js and MCTS.js
7) Commence the training! Run "node Train.js". This command may take a while. It currently takes me 100min on my M1 MacBook Air for the current settings (A single iteration of 200 self-play games, each turn 1000 MCTS simulations)

If you wish to play locally and have Node and TypeScript installed,
1) If you do not have browserify installed (https://browserify.org/) install it ("npm install -g browserify")
2) Run nmp install
3) Give the run.sh file approriate permissions and execute it. ("./run.sh"). This starts a local http server (https://www.npmjs.com/package/http-server) serving the game and model files
4) Go to localhost, port 8080 and play the game! (http://127.0.0.1:8080/)

To play this locally without using NodeJS or don't want to install tensorflowJS locally, you simply need to serve a directory with the following:
game.html, game.css, min.js, and the model subdirectory containing model.json and weights.bin and go to localhost, port 8080 (http://127.0.0.1:8080/)
