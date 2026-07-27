# CLAUDE.md

## Project Stack
- React 19
- Next.js 15 (App Router)
- Tailwind CSS v4
- TypeScript (strict mode)

## Conventions
- All components go in `/components` folder
- Pages go in `/app` directory (Next.js App Router)
- Use arrow functions for all components
- No `any` types in TypeScript — ever
- Class names use Tailwind only — no inline styles
- All API calls go in `/lib` folder

## Commit Format
This project uses Conventional Commits:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting, no logic change
- `refactor:` code restructure
- `chore:` setup, config, tooling

## AI Assistant Rules
- Always explain your reasoning before writing code
- Prefer simple solutions over clever ones
- Flag anything that could cause a performance issue
- Never use `any` in TypeScript

## Rules Learned from FE-02

1. Forms must use React Hook Form and Zod — never uncontrolled inputs.
   Bad: `<input onChange={e => setState(e.target.value)} />`
   Good: `const { register } = useForm(); <input {...register('name')} />`

2. Email fields must enforce lowercase via Zod transform — never trust
   raw user input.
   Good: `email: z.string().email().transform(val => val.toLowerCase())`

3. Test files go in `__tests__/` at the project root — never inside
   component folders. A test file inside `components/` will be treated
   as a component by the bundler.