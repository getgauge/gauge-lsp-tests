# Gauge tests for Gauge LSP features

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v1.4%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

[Subcutaneous](https://www.martinfowler.com/bliki/SubcutaneousTest.html) tests. 
These test the IDE workflow using the LSP APIs without launching Visual studio code IDE. Hence these are the subcutaneous tests. 

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
