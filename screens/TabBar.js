import React , {Component} from 'react';
import {Text , View , TouchableOpacity , ImageBackground , TextInput , Image ,NetInfo , FlatList} from 'react-native';
import {createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import Notification from './Notification';
import Home from './HomeScreen';
import AddCarScreen from './AddCarScreen';
import CarListScreen from './CarListScreen';
import MyCarScreen from './MyCarScreen';
import MyProfileScreen from './MyProfileScreen';
import ContactUsScreen from './ContactUsScreen';
import NewMsgScreen from './NewMsgScreen';
import MsgDetails from './MsgDetails';
import CarDetailsScreen from './CarDetailsScreen';
import MyCarDetails from './MyCarDetails';
import MyCarRentRequest from './MyCarRentRequest';
import RentRequest from './RentRequest';
import RentReqDetails from './RentReqDetails';
import MyCarReqDetails from './MyCarReqDetails';
import CarOrderDetails from './CarOrderDetails';
import EditMyCar from './EditMyCar';
import ReceiveBill from './ReceiveBill';
import Home2 from './Home2';
import Additions from './Additions';
import Summary from './Summary';
import Data from './Data';
import ChooseCar from './ChooseCar';
import ChangeLanguage from './ChangeLanguage';
import Maps from './Maps'
import AboutApp from './AboutApp';
import Terms from './Terms';









const hom = createStackNavigator({
  Homee: { screen: Home ,
     navigationOptions:{
      header:null
  }
  
  },
  CarListScreen:{ screen:CarListScreen ,
     navigationOptions:{
      header:null
  }
   
    },
    CarDetailsScreen: { screen: CarDetailsScreen , 
      navigationOptions:{
        header:null
      }
    }, 
    MyCarRentRequest: { screen: MyCarRentRequest , 
      navigationOptions:{
        header:null
    }
    }, 
    RentRequest: { screen: RentRequest , 
      navigationOptions:{
        header:null
    }
    }, 
    RentReqDetails: { screen: RentReqDetails , 
      navigationOptions:{
        header:null
    }
    }, 
    MyCarReqDetails: { screen: MyCarReqDetails , 
      navigationOptions:{
        header:null
    }
    }, 
    ReceiveBill: { screen: ReceiveBill , 
      navigationOptions:{
        header:null
    }
    }, 
    MyCarScreen: { screen: MyCarScreen , 
      navigationOptions:{
        header:null
    }
    }, 
    MyProfileScreen: { screen: MyProfileScreen , 
      navigationOptions:{
        header:null
    }
    }, 
    ContactUsScreen: { screen: ContactUsScreen , 
      navigationOptions:{
        header:null
    }
    }, 
    NewMsgScreen: { screen: NewMsgScreen , 
      navigationOptions:{
        header:null
    }
    }, 
    MsgDetails: { screen: MsgDetails , 
      navigationOptions:{
        header:null
    }
    }, 
   
    MyCarDetails: { screen: MyCarDetails , 
      navigationOptions:{
        header:null
    }
    }, 
    CarOrderDetails: { screen: CarOrderDetails , 
      navigationOptions:{
        header:null
    }
    },
    EditMyCar: { screen: EditMyCar , 
      navigationOptions:{
        header:null
    }
    },
    Notification: { screen: Notification , 
      navigationOptions:{
        header:null
    }
    }, 
    Additions: {
      screen: Additions,
      navigationOptions: {
        header: null
      }
    },
    Summary: {
      screen: Summary,
      navigationOptions: {
        header: null
      }
    },
    Data: {
      screen: Data,
      navigationOptions: {
        header: null
      }
    },
    AddCarScreen: {
      screen: AddCarScreen,
      navigationOptions: {
        header: null
      }
    },
    ChangeLanguage: {
      screen: ChangeLanguage,
      navigationOptions: {
        header: null
      }
    },
    AboutApp: {
      screen: AboutApp,
      navigationOptions: {
        header: null
      }
    },
    Terms: {
      screen: Terms,
      navigationOptions: {
        header: null
      }
    },
  
})   

 
const addCar = createStackNavigator({
  Home2: { screen: Home2 , 
    navigationOptions:{
      header:null
  }
  }, 
  ChooseCar: {
    screen: ChooseCar,
    navigationOptions: {
      header: null
    }
  },
  Maps: {
    screen: Maps,
    navigationOptions: {
      header: null
    }
  },
})   


export default createBottomTabNavigator({ 
  Home2: {screen: addCar,
    navigationOptions: () => ({
     //tabBarLabel:false,
      // tabBarVisible: false,
      // header: null,
     tabBarLabel:'Home',
     
      
    tabBarIcon:  ({ focused }) => {
      const image = focused 
      ? require('../img/car_icon.png') 
      : require('../img/car_icon2.png')
      return (
          <Image 
              source={image}
              style={{ width: 0, height: 0 }}
              />
       )}
  }),
  },
  home:{screen: hom,
        navigationOptions: () => ({
         //tabBarLabel:false,
         tabBarLabel:'Cars',
         tabBarIcon:  ({ focused }) => {
          const image = focused 
          ? require('../img/b_home.png') 
          : require('../img/w_home.png')
          return (
              <Image 
                  source={image}
                  style={{ width: 0, height: 0 }}
                  />
           )}
            
      }),
    },


    },
    {
      tabBarPosition: 'bottom',
      initialRouteName: 'home',
      
      tabBarOptions: {
        activeTintColor: 'transparent',
        inactiveTintColor: 'transparent',
        upperCaseLabel: false,
        inactiveBackgroundColor:'#transparent',
        labelPosition:'beside-icon',
          style: {
              backgroundColor: '#transparent',
              height:0,
          },
          swipEnabled: true,
          showIcon: true,
            showLabel:true,
           indicatorStyle: {
              borderBottomWidth: 0,
              height:0,
          },
          tabStyle: {
            flexDirection: 'row',
            borderColor:'#C8972C',
            alignItems: 'center',
            // justifyContent: 'space-evenly'
        },
        labelStyle: {
          fontSize: 20,
          fontFamily:'segoe',
          margin:'8%'
        },
        },  
      }
  );


