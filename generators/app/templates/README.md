# README #

### Get started developing ###

`git clone <%= gitRemote %>` into `app/code/<%= modulePath %>`

#### Updating ####

`git push origin <% if(gitBranch.length > 0){ %><%= gitBranch %><% } %><% if(!gitBranch.length){ %><git_branch><% } %>`

`git tag version && git push --tags`

You can find current tagged version in **Commits**

### Install with composer ###

`composer config repositories.<%= lcVendor %><%= lcModule %> vcs <%= gitRemote %>`

`composer require --prefer-source '<%= lcVendor %>/<%= lcModule %>:*'`