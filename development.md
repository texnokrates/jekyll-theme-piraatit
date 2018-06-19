# Development

This theme requires following prerequisites installed:

* Ruby (best installed using [rbenv](https://github.com/rbenv/rbenv))
* Node.js along with NPM (best installed using [nvm](https://github.com/creationix/nvm))

## Table of contents

- [Development](#development)
  - [Table of contents](#table-of-contents)
  - [Installing on Linux](#installing-on-linux)
    - [Install build dependencies](#install-build-dependencies)
      - [Ubuntu 18.04](#ubuntu-1804)
      - [Fedora 28](#fedora-28)
    - [Install rbenv and nvm](#install-rbenv-and-nvm)
    - [Installation](#installation)
  - [Launching the app](#launching-the-app)
  - [Using Docker](#using-docker)
  - [Conventions](#conventions)
  - [Getting help](#getting-help)

## Installing on Linux

The process is practically the same on any Linux. Only difference is build dependencies.

### Install build dependencies

First, install required development dependencies:

#### Ubuntu 18.04


```
sudo apt-get update
sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev software-properties-common libffi-dev
```

#### Fedora 28

```
sudo dnf install git-core zlib zlib-devel gcc-c++ patch readline readline-devel libyaml-devel libffi-devel openssl-devel make bzip2 autoconf automake libtool bison curl
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

### Installation

Once you have both Ruby and Node.js the installed, clone the `jekyll-theme-pirati` repository:

```
git clone https://github.com/pirati-web/jekyll-theme-pirati.git
```

Switch to the cloned repository:

```
cd jekyll-theme-pirati
```

Then, install Ruby gems and Node packages using followinf from *within the
repository directory*:

```
rbenv install         # Installs Ruby version required by jekyll-theme-pirati
nvm install           # Installs Node.js runtime and NPM version required by jekyll-theme-pirati

gem install bundler  # Installs bundler
bundle install       # Installs Ruby gems
npm install          # Installs build and frontend dependecies
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
theme-gem, please edit the regexp in `jekyll-theme-pirati.gemspec` accordingly.

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

## Getting help

In case you're stuck and helpless, try reaching us out on:

* [Pirate Party chat](https://chat.pirati.cz/channel/tech-weby): in case you're
  a Pirate Party member with access, this will be your best bet
* [Issues page](https://github.com/pirati-web/jekyll-theme-pirati/issues): add new issue if you think you've found a bug
