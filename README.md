# Remote controller

This program is a remote control that allows you to control your computer from a Raspberry Pi or smartphone.

![](https://user-images.githubusercontent.com/59264002/78930144-91765080-7ade-11ea-89c1-a74e85b3ffc2.png)

## Requirement

- [Vue.js](https://vuejs.org/) (CDN)
- [Moment.js](https://momentjs.com/) (CDN)
- [Bulma](https://bulma.io/) (CDN)
- [Flask](https://flask.palletsprojects.com/en/1.1.x/)
- [pyautogui](https://pyautogui.readthedocs.io/en/latest/)
- [MusicBee](https://getmusicbee.com/)

## Details

### controller

Using Vue.js for the front-end, Flask for the back-end and Bulma for the CSS framework.

The currently playing music will be sent to the API of Flask by the NowPlayingPlugin and can be displayed.

Press the button and pyautogui will type the key.

### NowPlayingPlugin

This is a plugin for MusicBee. When the playing track changes, it sends the information of the song to the API of Flask.

## License

This program is licensed under the MIT license. See the [LICENSE](/LICENSE) for more information.

