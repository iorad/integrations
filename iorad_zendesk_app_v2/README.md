# iorad for Zendesk

launch the app from nav bar in the zendesk agent view.

Create step-by-step tutorial and post straight to your selected Zendesk Help Center section.

## Build instruction

**Requirements**

```
node version v10.16.3
npm version 6.11.2
yarn version 1.17.3
zat version 3.2.4

```

**buid script**

```
$ yarn install
$ yarn run build
$ cd dist
$ zat package
```

## Release Note

### Version 2.1.0
* Added the addToHelpCenterAsDraft App setting.
Users can now decide whether or not to save the tutorial as a draft in the navbar app view.

### Version 2.1.1
* Add missing localization string in app setting.

### Version 2.2.0
* Hotfix:
  When replying a comment with an iorad solution, there is https prefix in the comment url, this breaks the attached url.
* Add View Article button in the modal popup window in ticketing app view when an article is succesfully created.

### Version 2.2.1
* Makes the switch from zendesk agent view to iorad screen capture page smoother.

### Version 2.3.2
* Let's Celebrate the launch of new Iorad :D

### Version 3.0.0
* Mayor upgrade using ZAF v2
