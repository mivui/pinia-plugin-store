import { globalIgnores } from 'eslint/config';
import { defineConfig } from 'typescript-eslint-standard';

export default defineConfig({ extends: [globalIgnores(['dist'])] });
