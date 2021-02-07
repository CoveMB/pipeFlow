module.exports = {
  out: './docs',

  includes: './',
  exclude: [
      '**/__tests__/**/*',
      '**/index.*',
      '**/node_modules/**/*'
  ],
  excludeNotDocumented: true,


  // theme: "./node_modules/typedoc-neo-theme/bin/default"
};