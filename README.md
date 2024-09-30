# gh_deploy
Comando para atualizar versao do package, criar tag e commit

## Instalação

`npm i -D github:heliomarpm/gh_deploy`

## Usage

Edit the package.json file and add the script for deploy
Eg.
```json
{
  ...
  "scripts": {
    ...
    "deploy": "node ./node_modules/gh_deploy/index.mjs"
  },
  ...
}
```

## Examples

- [Udeler](https://github.com/heliomarpm/udemy-downloader-gui)
- [Electron Quick Start - VanillaJS](https://github.com/heliomarpm/electron-quick-start)
