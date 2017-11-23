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


 
