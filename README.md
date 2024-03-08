This project implements the AlphaZero algorithm in TypeScript for the game Connect Four
It uses TensorFlowJS both to train and run the bot's neural net. The net is a very simple CNN with the following architecture: input is 2 binary image stacks ordered by whose turn it currently is being first and whose turn it is not being second, where each image stack corresponds to the respective player's placed chips, 2 conv2D layers, flattening, 2 hidden dense layers, and policy and value output heads.

I trained it for a week, resulting in the current model on my MacBookAir. Related Disclaimer: All commands below apply to MacOS (and probably Linux) so not Windows users.

To view this project in action hosted by GitHub Pages, visit https://bumpercoins.github.io/connectfour/ and play the Bot!

If you wish to train your own Connect Four bot from scratch, here's what you'll need to do:
Preconditions: you have the TypeScript compiler (tsc) and Node installed
1) Run npm install to install tensorflowJS locally
2) First delete the existing model. Rm -rf the existing model subdirectory.
3) Go to Net.ts and replace this import "import * as tf from '@tensorflow/tfjs';" with "import * as tf from '@tensorflow/tfjs-node-gpu';" so that training will use your GPU
4) Go to Net.ts and and examine createModel. If you wish, you can specify your own custom architecture here. Then uncomment out it's invocation (directly below its definition)
5) Next compile the code by running "tsc". This creates a Net.js file from the Net.ts file.
6) Run "node Net.js". Now you should have a new model subdirectory for your untrained bot. Now reverse the uncommenting from step 4) to stop createModel from being called again. (Yes, I know I should implement the TODO and replace createModel with something like getOrCreateModel...but I'm lazy and this is largely for educational and experimental purposes...)
6.5) Examine MCTS.ts and Train.ts. Feel free to change any of the numerical contants. The ones to look out for are numMCTSSims in MCTS.ts and both numIterations and numGamesPerIteration in Train.ts. And if you desire, make a few tweaks.
7) If you made any changes in those files, compile the code again, running "tsc". Changes will reflect in Train.js and MCTS.js
8) Commence the training! Run "node Train.js". This command may take a while. It currently takes me 100min on my M1 MacBook Air for the current settings (A single iteration of 200 self-play games, each turn 1000 MCTS simulations)

If you wish to play locally the exact same way I did and have Node and TypeScript installed,
1) If you do not have browserify installed (https://browserify.org/) install it ("npm install -g browserify")
2) Run npm install
2.5) If you modified Net.ts to use "import * as tf from '@tensorflow/tfjs-node-gpu';", make sure to undo that by shortening that line to "import * as tf from '@tensorflow/tfjs';".
3) Give the run.sh file approriate permissions and execute it. ("./run.sh"). This starts a local http server (https://www.npmjs.com/package/http-server) serving the game and model files
4) Go to localhost, port 8080, path game.html in your browser and play the game! (http://127.0.0.1:8080/game.html)

To play this locally without using NodeJS or don't want to install tensorflowJS locally, you simply need to serve a directory with the following:
game.html, game.css, min.js, and the model subdirectory containing model.json and weights.bin and then open up game.html in that directory in your browser.
