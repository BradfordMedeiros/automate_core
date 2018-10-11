# automate-core
Depends on automate_system.

This is the backend for automate_ui.
It copies in the ui bundle via CI (might eventually move to npm), and gets automate_system via npm package management.

Core base functionality of automate should be put into automate_system (see it's readme for a description).

Handles in this repo: 
- account system
- email alerts
- custom tile upload 
- multiple database management
- all http routes (aside from the http bridge to mqtt in automate_system)
- automate ui static content host
- system locking
- network info 


scheduler -c configfile

* * * * * /path/to/some/topic
2 * * * * /path/to/another/topic

sequencer -c config

- name: somesequence
  - type: topic
    topic: /path/to/some/topic
  - type: wait
    value: 1000
  - type: hold
    value: /path/to/some/topic
  - type: loop
    values:
      - number: 4
      - subtypes:
      		- type: topic
      		  topic: /sometopic

switch -i "(wet->dry):airdry;(dry->wet):rain" && rules -c config


rules:
- name: if_really_hot_turn_on_ac
  type: bash
  rule: somescript.sh
  frequency: 1m
  topics: 
  	- topic:
  		value: /path/to/here
  		alias: humidity  
    - topic:
        value: /another/path/here
        alias: temperature


