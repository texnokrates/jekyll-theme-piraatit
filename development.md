# Development

This theme requires following prerequisites installed:

* Ruby (best installed using [rbenv](https://github.com/rbenv/rbenv))
* Node.js along with NPM (best installed using [nvm](https://github.com/creationix/nvm))

## Ubuntu 18.04

First, install required development dependencies:

```
sudo apt-get update
sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev software-properties-common libffi-dev
```

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
ruby -v
```

Next, install Node.js runtime using nvm:

```
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh -o install_nvm.sh
bash install_nvm.sh
source ~/.profile
```

Next, clone the `jekyll-theme-pirati` repository:

```
git clone https://github.com/pirati-web/jekyll-theme-pirati.git
```

Once you have both Ruby and Node.js the installed, clone the repository and run
following *within the repository directory*:

```
cd jekyll-theme-pirati
rbenv install         # Installs Ruby version required by jekyll-theme-pirati
nvm install           # Installs Node.js runtime and NPM version required by jekyll-theme-pirati

gem install bundler  # Installs bundler
bundle install       # Installs Ruby gems
npm install          # Installs build and frontend dependecies
```

Finally, start the application:

```
npm start
```
