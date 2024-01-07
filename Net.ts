import * as tf from '@tensorflow/tfjs-node-gpu';
import { GameState } from "./GameState";


const input = tf.input({shape: [GameState.numRows, GameState.numCols, 2]})
const conv1 = tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu'}).apply(input);
const conv2 = tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu'}).apply(conv1);
const flat = tf.layers.flatten({}).apply(conv2);
const dense1 = tf.layers.dense({units: 16, activation: 'tanh'}).apply(flat);
const policyOutput = tf.layers.dense({units: GameState.numCols, activation: 'softmax'}).apply(dense1);
const valueOutput = tf.layers.dense({units: 1, activation: 'relu'}).apply(dense1);
const model = tf.model({inputs: input, outputs: [policyOutput as tf.SymbolicTensor, valueOutput as tf.SymbolicTensor]});
model.summary();

