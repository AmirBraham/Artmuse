/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import BackgroundFetch from "react-native-background-fetch";
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import ManageWallpaper, { TYPE } from 'react-native-manage-wallpaper';

let MyHeadlessTask = async (event) => {
    // Get task id from event {}:
    let taskId = event.taskId;
    let isTimeout = event.timeout;  // <-- true when your background-time has expired.
    if (isTimeout) {
      // This task has exceeded its allowed running-time.
      // You must stop what you're doing immediately finish(taskId)
      console.log('[BackgroundFetch] Headless TIMEOUT:', taskId);
      BackgroundFetch.finish(taskId);
      return;
    }
    console.log('[BackgroundFetch HeadlessTask] start: ', taskId);
    const storage = new MMKVLoader().initialize();

    const favoritePaintings = JSON.parse(storage.getString("favorite_paintings"))

    if (favoritePaintings.length > 0) {
        const randomIndex = Math.floor(Math.random() * favoritePaintings.length)
        const painting = favoritePaintings[randomIndex]
        ManageWallpaper.setWallpaper(
            {
                uri: painting["imageLink"],
            },
            (res) => { console.log(res) },
            TYPE.BOTH,
        );
    }
  
    // Required:  Signal to native code that your task is complete.
    // If you don't do this, your app could be terminated and/or assigned
    // battery-blame for consuming too much time in background.
    BackgroundFetch.finish(taskId);
  }
  

AppRegistry.registerComponent(appName, () => App);
BackgroundFetch.registerHeadlessTask(MyHeadlessTask);
