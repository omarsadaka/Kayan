/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';
import MyNavigate from './myNavigate';
import  { Notification, NotificationOpen } from 'react-native-firebase';
import firebase from 'react-native-firebase';




const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props>{




  async componentDidMount() {

    const ReactNative = require('react-native');
    try{
          ReactNative.I18nManager.allowRTL(false)
    }catch(e){
      alert('error'+e)
    }
    // this.checkPermission();
    const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const action = notificationOpen.action;
        const notification: Notification = notificationOpen.notification;
        var seen = [];
        // alert('background'+JSON.stringify(notification.data));
    } 
    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
            .setDescription('My apps test channel');
// Create the channel
    firebase.notifications().android.createChannel(channel);
    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
        // Process your notification as required
        notification
            .android.setChannelId('test-channel')
            .android.setSmallIcon('ic_launcher');
            notification.android.setAutoCancel(true);
        firebase.notifications()
            .displayNotification(notification);

    });
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification: Notification = notificationOpen.notification;
        var seen = [];
        const { title, body } = notificationOpen.notification;
        alert(title+ body);
        // alert('helmi'+JSON.stringify(notification.data));
        // firebase.notifications().removeDeliveredNotification(notification.notificationId);
        firebase.notifications().removeAllDeliveredNotifications(notification.notificationId)
    });
}


componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
}

    //1
    
  // async checkPermission() {
  //   const enabled = await firebase.messaging().hasPermission();

  //   if (enabled) {
  //       this.getToken();
  //   } else {
  //       this.requestPermission();
  //   }
  // }

   //2

  //  async requestPermission() {
  //   try {
  //       await firebase.messaging().requestPermission();
  //       // User has authorised
  //       this.getToken();
  //   } catch (error) {
  //       // User has rejected permissions
  //       // console.log('permission rejected');
  //   }
  // }

    //3
  // async getToken() {
  //   let fcmToken = await AsyncStorage.getItem('fcmToken');

  //   if (!fcmToken) {
  //       fcmToken = await firebase.messaging().getToken();
  //       if (fcmToken) {
  //           // user has a device token
  //           await AsyncStorage.setItem('fcmToken', fcmToken);
  //           this.refreshtoken(fcmToken)

  //       }
  //   }else{
  //     this.refreshtoken(fcmToken)
  //   }
  // }
  
   
  // async refreshtoken(fcmToken){
  //   const url =  Config.API_URL+'/api/user/refreshtoken';
  //   const  details = {
  //     deviceType:Platform.OS,
  //     deviceToken:fcmToken
  //  };
  //   const user = await AsyncStorage.getItem('user');
  //   if(user)
  //   {
  //     const token =JSON.parse(user).api_token
  //     const url =  Config.API_URL+'/api/user/refreshtoken';
  //     const  fdata = new FormData();
  //     fdata.append('deviceType', Platform.OS)
  //     fdata.append('deviceToken', fcmToken)
  //     fetch(url, {
  //     method: 'POST',
  //     headers: {
  //             'Accept': 'application/json',
  //             'Content-Type': 'multipart/form-data',
  //             'Authorization': 'Bearer ${token}'

  //     },
  //           body:fdata, 
  //     })  
  //     .then(res => res.json())
  //     .then(res => {
  //       if(res.code==200){
  //           AsyncStorage.setItem('notification', res.notification+'');
  //       }
       
  //     })
  //     .catch(error => {
  //     });
     
  //   }else{
  //  fetch(url, {
  //    method: 'POST',
  //    headers: {
  //     'Accept': 'application/json',
  //                'Content-Type': 'application/json',
  //   },
  //              body: JSON.stringify(details),
  //   })  
  //   .then(res => res.json())
  //    .then(res => {   
  //     if(res.code==200){
  //       AsyncStorage.setItem('notification', '0');
  //    }
  //     // Alert.alert('',JSON.stringify(res)+fcmToken,[{text: 'موافق', style: 'cancel'},],{ cancelable: false })
  //   })
  //    .catch(error => {    });
  //   }
  // }
  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
}
  
  render() {
    
    const ReactNative = require('react-native');
    try{
          ReactNative.I18nManager.allowRTL(false);
    }catch(e){
      alert('error'+e)
    }
    
    return (
     <MyNavigate/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
