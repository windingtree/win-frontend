# Stays Dapp

## Setup

This is a win dapp.
All dependencies have to be installed via `yarn` from the root of repository.

## Development

Create `.env` file in the root of repository with content like in the file `.env.example`. To start project locally please rum this command.

```bash
yarn start
```

## Storybook

Runs a storybook UI at http://localhost:6006/

```bash
yarn storybook
```

Create `.env` file in the root of repository with content like in the file `.env.example`. To start project locally please rum this command.

```bash
yarn start
```

## Commits

To commit to the repository after staging the commit:

```bash
yarn commit
```

Select the appropriate type of commit message, any issues to close, and note any breaking
changes.

## Production build

```bash
yarn build
```

## Development documentation

- [Custom react hooks](docs/hooks.md)
- [Combining reducers](docs/combineReducers.md)
- [Persistent state reducer](docs/localStorage.md)
- [Records reducer](docs/records.md)
- [Dapp routes](docs/routes.md)

## Commit messages

Husky forces us to commit messages in a certain format. The conventions of these messages can be found here: https://www.conventionalcommits.org/en/v1.0.0/
