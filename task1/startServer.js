const hotClient = require('webpack-hot-client');
const middleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const config = require('./webpack.config');
const app = require('./stub');

const compiler = webpack(config);
const { publicPath } = config.output;
const options = { }; 

const client = hotClient(compiler, options);
const { server } = client;
server.on('listening', () => {
  app.use(middleware(compiler, { publicPath }));
});