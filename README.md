# jekyll-theme-pirati

Theme of Czech Pirate Party

## Installation

Add this line to your Jekyll site's `Gemfile`:

```ruby
gem "jekyll-theme-pirati"
```

And add this line to your Jekyll site's `_config.yml`:

```yaml
theme: jekyll-theme-pirati
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install jekyll-theme-pirati

## Usage

For usege see readme of  https://github.com/pirati-web/example.pirati.cz

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/jitka/jekyll-theme-pirati/. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## Development

This theme requires following prerequisites installed:

* Ruby (best installed using [rbenv](https://github.com/rbenv/rbenv))
* Node.js along with NPM (best installed using [nvm](https://github.com/creationix/nvm))

To install these, please follow guides on respective GitHub links.

Once you have both Ruby and Node.js the installed, clone the repository and run
following *within the repository directory*:

```
rbenv install         # Installs Ruby version required by jekyll-theme-pirati
nvm use               # Installs Node.js runtime and NPM version required by jekyll-theme-pirati
```

This will install required Ruby & Node.js versions. To set up your environment
to develop this theme, run:

```
gem install bundler  # Installs bundler
bundle install       # Installs Ruby gems
npm install          # Installs build and frontend dependecies
```

This will install theme Ruby gems and all build dependencies for the theme. Your
theme is setup just like a normal Jekyll site!

To test your theme, run:

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

## License

The theme is available as open source under the terms of the [MIT
License](https://opensource.org/licenses/MIT).

