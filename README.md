# Angular 12, NgRx and Angular Material Starter

by [@tomastrajan](https://twitter.com/tomastrajan)

<a href="https://www.buymeacoffee.com/tomastrajan" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" height="34" ></a>

[![license](https://img.shields.io/github/license/tomastrajan/al-baytar.svg)](https://github.com/tomastrajan/al-baytar/blob/master/LICENSE) [![All Contributors](https://img.shields.io/badge/all_contributors-37-orange.svg?style=flat-square)](#contributors) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![Build Status](https://travis-ci.org/tomastrajan/al-baytar.svg?branch=master)](https://travis-ci.org/tomastrajan/al-baytar)
[![Codecov](https://img.shields.io/codecov/c/github/tomastrajan/al-baytar.svg)](https://codecov.io/gh/tomastrajan/al-baytar)
[![Twitter Follow](https://img.shields.io/twitter/follow/tomastrajan.svg?style=social&label=Follow)](https://twitter.com/tomastrajan)

![intro](https://raw.githubusercontent.com/tomastrajan/al-baytar/master/meta-assets/intro.png)
![themes](https://raw.githubusercontent.com/tomastrajan/al-baytar/master/meta-assets/themes.png)

## Table of Content

- [Live Demo](https://webcraftacademy.github.io/al-baytar)
- [Getting Started](#getting-started)
- [Useful Commands](#useful-commands)
- [Learning Materials](#learning-materials)
- [Features](#features)

## Getting started

```bash
git clone https://github.com/tomastrajan/al-baytar.git new-project
cd new-project
npm install
npm start
```

## Useful Commands

- `npm start` - starts a dev server and opens browser with running app
- `npm run start:prod` - runs full prod build and serves prod bundle
- `npm run test` - runs lint and tests
- `npm run e2e` - runs end-to-end tests
- `npm run watch` - runs tests in watch mode
- `npm run format:write` - runs prettier to format whole code base (`.ts` and `.scss`)
- `npm run analyze` - runs full prod build and `webpack-bundle-analyzer` to visualize how much code is shipped (dependencies & application)

![analzye](https://raw.githubusercontent.com/tomastrajan/al-baytar/master/meta-assets/analyze.png)

## Features

- custom themes support (4 themes included)
- lazy-loading of feature modules
- lazy reducers
- localStorage ui state persistence
- `@ngrx/effects` for API requests
- fully responsive design
- angular-material and custom components in `SharedModule`

## Stack

- Angular
- ngrx (or try [ngx-model](https://github.com/tomastrajan/ngx-model) if you prefer less boilerplate)
- Angular Material
- Bootstrap 5 (only reset, utils and grids)
