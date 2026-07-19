import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'original-*']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // These patterns drive deliberate UI transitions and one-shot reveals.
      // They are reviewed case-by-case rather than banned project-wide.
      'react-hooks/set-state-in-effect': 'off',
      // The custom <model-viewer> element augments React's JSX namespace.
      '@typescript-eslint/no-namespace': 'off',
      // ModeContext intentionally exports both its provider and consumer hook.
      'react-refresh/only-export-components': 'off',
      // Drag state is stored in a ref so pointer movement does not rerender.
      'react-hooks/refs': 'off',
    },
  },
])
