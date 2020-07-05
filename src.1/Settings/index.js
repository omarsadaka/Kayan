import React from 'react';
// import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import hnav from '../../screens/TabBar_ar'
const ss=hnav;

//Issue: the tab navigator needs to be wrapped inside a stack navigator
export default createStackNavigator({ ss }, { headerMode: "none" });