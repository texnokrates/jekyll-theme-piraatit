# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = "jekyll-theme-pirati"
  spec.version       = "0.3.0"
  spec.authors       = ["Jitka Novotná"]
  spec.email         = ["jitka@ucw.cz"]

  spec.summary       = %q{Basic thene for Czech pirate party}
  spec.homepage      = "http://www.pirati.cz"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r{^(assets|_layouts|_includes|_sass|LICENSE|README)}i) }

  spec.add_runtime_dependency "jekyll", "~> 3.6"

  spec.add_development_dependency "bundler", "~> 1.12"
  spec.add_development_dependency "rake", "~> 10.0"
end
