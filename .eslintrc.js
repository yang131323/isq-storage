module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: ['airbnb-typescript'],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            impliedStrict: true
        },
        project: './tsconfig.json',
    },
    env: {
        browser: true,
    },
    rules: {
        'no-var': 'error',
        '@typescript-eslint/indent': ['error', 4],
        'no-underscore-dangle': 'off',
        'max-len': 'off',
    }
}