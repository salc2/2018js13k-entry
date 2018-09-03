const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  //devtool: 'inline-source-map',
  mode: 'production',
  //mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.c$/,
        use: 'raw-loader'
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};

