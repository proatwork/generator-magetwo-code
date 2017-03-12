# README #

### Get started developing ###
`git clone <%= context.git_remote %>` into `app/code/<%= context.vendor %>/`

#### Updating the code ####
`git commit -m "Version bump to X.X.X"`
`git tag X.X.X`
`git push origin <%= context.branch %> --tags`
- Your tag should be the same as your `composer.json` version.
- You can find current tagged version in **Commits**

### Install with composer ###

`composer config repositories.<%= context.vendor_lc %><%= context.module_lc %> vcs <%= context.git_remote %>`
`composer require --prefer-source '<%= context.vendor_lc %>/<%= context.module_lc %>:*'`

### Edit modules installed with composer ###

`cd vendor/<%= context.vendor_lc %>/<%= context.module_lc %>`
Your HEAD will be detached so checkout to `<%= context.git_branch %>`
`git checkout <%= context.git_branch %>`
Make your changes, update `composer.json` with the new version and then follow the "Updating the code" section above.