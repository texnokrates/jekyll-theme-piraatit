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
    - [Install application](#install-application)
  - [Starting the app](#starting-the-app)

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

### Install application

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

## Starting the app

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

## Convenctions

Use English for everything except parts of url and example texts.

* filenames: `jakub-pirat.md` `komunalni-volby/index.md`
* url: `komunalni-volby`
* variables: `citiCandidatePosition`
* uid: `jakub.pirat`

