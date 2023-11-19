import config from '@fisker/prettier-config'

export default {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: ['test.js'],
      options: {
        printWidth: 160,
      },
    },
  ],
}
