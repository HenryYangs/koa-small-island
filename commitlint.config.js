module.exports = {
  rules: {
    'header-min-length': [2, 'always'],
    'type-empty': [2, 'never'],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^(:.+:).+$/,
      headerCorrespondence: ['type'],
    },
  },
};
