module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'avoid',
  overrides: [
    {
      files: '*.md',
      options: {
        parser: 'markdown',
      },
    },
  ],
};
