module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { chrome: '18', firefox: '49' },
      },
    ],
  ],
};
