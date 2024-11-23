import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import parserTs from '@typescript-eslint/parser'
import stylisticTs from '@stylistic/eslint-plugin-ts'

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['./src/**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: {
        globals: globals.node,
        sourceType: 'commonjs',
        parserOptions: {
            sourceType: 'commonjs'
        }
    } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    stylisticTs.configs['all-flat'],
    {
        languageOptions: { parser: parserTs },
        plugins: {
            '@stylistic/ts': stylisticTs
        },

        /** @type {import('@stylistic/eslint-plugin-ts').RuleOptions} */ 
        rules: {
            '@stylistic/ts/quotes': ['error', 'single'],
            '@stylistic/ts/quote-props': ['warn', 'as-needed'],
            '@stylistic/ts/space-before-function-paren': ['warn', { anonymous: 'always',
                named: 'never',
                asyncArrow: 'always' }],
            '@stylistic/ts/member-delimiter-style': ['error', {
                multiline: { delimiter: 'none',
                    requireLast: false },
                singleline: { delimiter: 'semi' }
            }],
            '@stylistic/ts/semi': ['error', 'never'],
            '@stylistic/ts/object-curly-spacing': ['error', 'always']
        }
    }
]