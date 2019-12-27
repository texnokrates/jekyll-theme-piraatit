# Development

This theme requires following prerequisites installed:

* Ruby (best installed using [rbenv](https://github.com/rbenv/rbenv))
* Node.js along with NPM (best installed using [nvm](https://github.com/creationix/nvm))

## Table of contents

- [Development](#development)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
    - [Install build dependencies](#install-build-dependencies)
      - [Ubuntu 18.04](#ubuntu-1804)
      - [Fedora 28](#fedora-28)
    - [Install rbenv and nvm](#install-rbenv-and-nvm)
    - [Install rbenv and nvm on macOS](#install-rbenv-and-nvm-on-macos)
    - [Installing the app](#installing-the-app)
  - [Launching the app](#launching-the-app)
  - [Using Docker](#using-docker)
  - [Conventions](#conventions)
  - [Versioning](#versioning)
  - [Creating new releases and publishing them](#creating-new-releases-and-publishing-them)
  - [Trying out locally](#trying-out-locally)
  - [Missing some JavaScript fanciness?](#missing-some-javascript-fanciness)
  - [Getting help](#getting-help)

## Installation

The process is practically the same on any Linux. Only difference is build dependencies.

### Install build dependencies

First, install required development dependencies:

#### Ubuntu 18.04

```
sudo apt-get update
sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev software-properties-common libffi-dev imagemagick
```

#### Fedora 28

```
sudo dnf install git-core zlib zlib-devel gcc-c++ patch readline readline-devel libyaml-devel libffi-devel openssl-devel make bzip2 autoconf automake libtool bison curl ImageMagick
```

### Install rbenv and nvm

Next, install Ruby using rbenv:

```
cd
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec $SHELL

git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
exec $SHELL

rbenv install 2.5.1
rbenv global 2.5.1
ruby -v # Verify ruby@2.5.1 is installed
```

Next, install nvm to manage Node.js versions:

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
exec $SHELL
```

### Install rbenv and nvm on macOS

```
brew install rbenv
rbenv init
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec $SHELL
rbenv install 2.5.1
ruby -v # Verify ruby@2.5.1 is installed
```

### Installing the app

Once you have both Ruby and Node.js the installed, clone the `jekyll-theme-piraatit` repository:

```
git clone https://github.com/texnokrates/jekyll-theme-piraatit.git
```

Switch to the cloned repository:

```
cd jekyll-theme-piraatit
```

Then, install Ruby gems and Node packages using followinf from *within the
repository directory*:

```
rbenv install         # Installs Ruby version required by jekyll-theme-piraatit
nvm install           # Installs Node.js runtime and NPM version required by jekyll-theme-piraatit

gem install bundle          # Installs bundler
bundle install              # Installs Ruby gems
npm install                 # Installs build and frontend dependecies
```

## Launching the app

Start the application using:

```
npm start
```

Testing site will be available at `http://localhost:4000`.

This starts a Jekyll server using your theme. Add pages, documents, data, etc.
like normal to test your theme's contents. As you make modifications to your
theme and to your content, your site will regenerate and you should see the
changes in the browser after a refresh, just like normal.

When the theme is released, only the files in `_layouts`, `_includes`, `_sass`
and `assets` tracked with Git will be bundled. To add a custom directory to your
theme-gem, please edit the regexp in `jekyll-theme-piraatit.gemspec` accordingly.

## Using Docker

This theme has built-in Docker support. For many users, it's the easiest option
to get things up and running.

First, make sure you have Docker along with `docker-comopose` installed. To do
so, please follow a guide according to you OS of choice:

* [Windows](https://docs.docker.com/docker-for-windows/install/)
* [macOS](https://docs.docker.com/docker-for-mac/install/)
* [Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
* [Fedora](https://docs.docker.com/install/linux/docker-ce/fedora/)

`docker-compose` can be installed by following
[official resources](https://docs.docker.com/compose/install/).


**Note for Fedora**: It's better to run docker-compose without `sudo`. Please
follow [this guide](https://bluntinstrumentsoftesting.com/2016/12/03/run-docker-without-sudo-in-fedora-25/)
to allow running without it.

Once you have Docker deamon running, just navigate to a cloned repository and
run:

```
docker-compose up
```

First boot might take some time, but you should be presented with a running
app after a while.

## Conventions

Use English for everything except parts of url and example texts.

* filenames are written in *kebab-case*: `jakub-pirat.md` `komunalni-volby/index.md`
* URLs are written in *kebab-case*: `komunalni-volby`
* variables are written in *lowerCamelCase*: `citiCandidatePosition`
* uid: `jakub.pirat`

## Versioning

This package adheres to [semver](https://semver.org/). Given a version number
MAJOR.MINOR.PATCH, increment the:

1. MAJOR version when you make incompatible API changes,
2. MINOR version when you add functionality in a backwards-compatible manner, and
3. PATCH version when you make backwards-compatible bug fixes.

## Creating new releases and publishing them

First, make sure you have [Gulp CLI](https://www.npmjs.com/package/gulp-cli)
installed. If not, run `npm install -g gulp-cli`.

To release a new Gem version, run `npm version [new version]` and `npm run publish`.

Make sure you also push the created tag to GitHub: `git push --tags`.

To be able to finish the process, you will need to have proper rights to push the
Gem in the end. If you see something like:

```
Enter your RubyGems.org credentials.
Don't have an account yet? Create one at https://rubygems.org/sign_up

HTTP Basic: Access denied.
```

... you probably do not have the RubyGems access yet.

The `npm run publish` command will do all the heavy lifting behind the scenes.
See [gulpfile.js](gulpfile.js) for the detailed run down of the process.

**Notes:**

  - Always use `npm run publish` and nothing else.
  - Do not modify `pacakge.json` version directly, use `npm version [new version]` for this task.

## Trying out locally

You can use the theme locally when developing your site using it. This is handy
when building up new features or updating the build pipeline.

To try it, you can take advantage of Bundler's
[local config](https://bundler.io/v1.16/bundle_config.html) feature. First, make
sure you have [Gulp CLI](https://www.npmjs.com/package/gulp-cli) installed or
install it with `npm install -g gulp-cli`. Then, follow these steps:

1. In the `jekyll-theme-piraatit` folder, run `gulp build && gulp prepareGem`
2. Update gemfile in your site to use GitHub as a source for the theme:
    * Comment out your current `jekyll-theme-piraatit` gem dependency
    * Use `gem "jekyll-theme-piraatit", github: "texnokrates/jekyll-theme-piraatit", branch: "master"` instead
3. In your site's directory, run: `bundle config local.jekyll-theme-piraatit [path to your jekyll-theme-piraatit]/.gembuild`

Now, when you launch your site, it will use your local `jekyll-theme-piraatit`
code. Whenever you update it, you should run `gulp build && gulp prepareGem`
again and rebuild the site.

## Missing some JavaScript fanciness?

If you're missing any JavaScript features that you think others could benefit
from too, you should consider contributing the code to the theme package
itself.

All JS shall be written in [Vue.js](https://vuejs.org/), bundling is provided
by [Webpack](https://webpack.js.org/). See [JS assets directory](./assets/js)
for further reference.

## Getting help

In case you're stuck and helpless, try reaching us out on:

* [Pirate Party chat](https://chat.pirati.cz/channel/tech-weby): in case you're
  a Pirate Party member with access, this will be your best bet
* [Issues page](https://github.com/texnokrates/jekyll-theme-piraatit/issues): add new issue if you think you've found a bug

## FAQ

```
Liquid Exception: no implicit conversion of nil into String in /_layouts/default.html
```
Check that version in `Gemfile` and `_config.yml` are the same. Check `asset/css/`.
