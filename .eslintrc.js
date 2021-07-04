modulte.exports = {
    parse: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            impliedStrict: true
        }
    },
    env: {
        browser: true,
    }
}