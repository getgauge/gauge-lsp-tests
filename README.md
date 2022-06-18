# Gauge tests for Gauge LSP features

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v1.4%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

[Subcutaneous](https://www.martinfowler.com/bliki/SubcutaneousTest.html) tests. 
Gauge is supported on multiple IDEs. But when the team decided to invest in [Visual studio code](https://code.visualstudio.com/) using [LSP](https://microsoft.github.io/language-server-protocol/). Writing UI tests via Visual studio code was one option, but there were several challenges with it. These test the IDE workflow using the LSP APIs without having to bring up the Visual studio code IDE. Hence these are the subcutaneous tests. 

Linux - [![Travis Build Status](https://travis-ci.org/getgauge/gauge-lsp-tests.svg?branch=master)](https://travis-ci.org/getgauge/gauge-lsp-tests)

# Pre-requisites
* Node-js
* [Gauge](https://docs.getgauge.io/installing.html)
* Install Gauge-js
```
gauge install js
```

# Execution
* npm install
* gauge run specs --env=js-wd
> Change the environment parameter as per the requirement
