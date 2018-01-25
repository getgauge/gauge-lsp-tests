# -*- encoding: utf-8 -*-
# stub: ruby-protocol-buffers 1.5.1 ruby lib

Gem::Specification.new do |s|
  s.name = "ruby-protocol-buffers".freeze
  s.version = "1.5.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Brian Palmer".freeze, "Benedikt B\u00F6hm".freeze, "Rob Marable".freeze, "Paulo Luis Franchini Casaretto".freeze]
  s.date = "2013-10-28"
  s.email = ["brian@codekitchen.net".freeze, "bb@xnull.de".freeze]
  s.executables = ["protoc-gen-ruby".freeze, "ruby-protoc".freeze]
  s.extra_rdoc_files = ["Changelog.md".freeze]
  s.files = ["Changelog.md".freeze, "bin/protoc-gen-ruby".freeze, "bin/ruby-protoc".freeze]
  s.homepage = "https://github.com/codekitchen/ruby-protocol-buffers".freeze
  s.licenses = ["BSD".freeze]
  s.rubygems_version = "2.6.13".freeze
  s.summary = "Ruby compiler and runtime for the google protocol buffers library.".freeze

  s.installed_by_version = "2.6.13" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<autotest-standalone>.freeze, [">= 0"])
      s.add_development_dependency(%q<autotest-growl>.freeze, [">= 0"])
      s.add_development_dependency(%q<rake>.freeze, [">= 0"])
      s.add_development_dependency(%q<rake-compiler>.freeze, [">= 0"])
      s.add_development_dependency(%q<simplecov>.freeze, [">= 0"])
      s.add_development_dependency(%q<rspec>.freeze, ["~> 2.5"])
      s.add_development_dependency(%q<yard>.freeze, [">= 0"])
    else
      s.add_dependency(%q<autotest-standalone>.freeze, [">= 0"])
      s.add_dependency(%q<autotest-growl>.freeze, [">= 0"])
      s.add_dependency(%q<rake>.freeze, [">= 0"])
      s.add_dependency(%q<rake-compiler>.freeze, [">= 0"])
      s.add_dependency(%q<simplecov>.freeze, [">= 0"])
      s.add_dependency(%q<rspec>.freeze, ["~> 2.5"])
      s.add_dependency(%q<yard>.freeze, [">= 0"])
    end
  else
    s.add_dependency(%q<autotest-standalone>.freeze, [">= 0"])
    s.add_dependency(%q<autotest-growl>.freeze, [">= 0"])
    s.add_dependency(%q<rake>.freeze, [">= 0"])
    s.add_dependency(%q<rake-compiler>.freeze, [">= 0"])
    s.add_dependency(%q<simplecov>.freeze, [">= 0"])
    s.add_dependency(%q<rspec>.freeze, ["~> 2.5"])
    s.add_dependency(%q<yard>.freeze, [">= 0"])
  end
end
