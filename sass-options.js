// Sass configuration to suppress Bootstrap deprecation warnings
module.exports = {
  quietDeps: true,
  silenceDeprecations: [
    'import',
    'global-builtin',
    'color-functions',
    'mixed-decls'
  ]
};
