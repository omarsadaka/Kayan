import React, { Component } from 'react';
import {
  StyleSheet, Platform,
  ScrollView, AsyncStorage,Dimensions,
  View, Text, Image, Alert, ImageBackground, TouchableOpacity, YellowBox, RefreshControl, SafeAreaView
} from 'react-native';
import { StackActions, NavigationActions } from "react-navigation";
import { createDrawerNavigator  } from 'react-navigation-drawer';
import Settings from './Settings';  //Tab Nav
const { width, height } = Dimensions.get('window')
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";






class Custom_Side_Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag_lang: 0,
      Data: [],
      catId: '',
      lang: '',
      userData: {},
      userId: '',
      personImage: '',
      userName: '',
      flag_skip: 0,
      refreshing: false,
      userType:0
    }
  
  }

  componentDidMount() {
    this._retrieveData();
    this.setState({ refreshing: false })
  }

  signOut = async () => {

    Alert.alert(
      'كيان',
      'هل انت متاكد من تسجيل الخروج',
      [
        {
          text: 'الغاء',
          onPress: () => this.dismiss, style: 'cancel'
        },
        {
          text: 'خروج', onPress: () => {
            try {
              AsyncStorage.removeItem('loginDataKayan');
              AsyncStorage.removeItem('lang');
              const { navigation } = this.props;
              navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [
                   NavigationActions.navigate({ routeName: 'Language' })
                ],
             }))
              //navigation.navigate('Language');
            } catch (e) { }
          }

        },
      ],
      { cancelable: true }

    )
    return true;
  }
  _retrieveData = async () => {
    const value = await AsyncStorage.getItem('loginDataKayan');
    const lang = await AsyncStorage.getItem('lang');
    this.setState({ lang })
    if (value) {
      const data = JSON.parse(value);
      this.setState({ userId: data._id })
      this.getUserData()
    } else {
      this.setState({ flag_skip: 1 })
      var data2 = {
        _id: '1',
        fullname: 'أسم المستخدم'
      }
      this.setState({ userData: data2 })

    }
  }

  getUserData(){
    NetInfo.fetch().then(state =>{
      if (state.isConnected){
        try {
          axios.get('http://134.209.178.237/api/user/getUserByID',{
            params: {
              id:this.state.userId,
          },
          }).then(response => {
            const data = response.data;
            this.setState({ userData: data })
            this.setState({ userId: data._id })
            this.setState({ userName: data.fullname })
            this.setState({ personImage: data.personalImg })
            this.setState({userType:data.type})
          }).catch(function (error) {
             console.log(error);
          }).finally(function () {
             // always executed
          });
       } catch (error) {
          console.log(error);
       }
      } else {
        
        if (this.state.lang === 'ar'){
          alert('لا يوجد أتصال بالانترنت');
        } else {
          alert('No internet connection');
        }
      }
    });
  }

  changeLanguage = () => {
    this.props.navigation.closeDrawer();
    const { navigation } = this.props;
    navigation.navigate('ChangeLanguage');
  }
  onRefresh() {
    this.setState({ refreshing: true }, function () { this.componentDidMount() });
  }
  render() {
    return (
      <SafeAreaView style={{ backgroundColor:'#FFF', flex: 1,width: '100%', }}>
        <ScrollView howsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }>
       <View style={{ width: '100%',}}>
          <View style={[styles.view,{flexDirection:'row'}]}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Notification')}>
               <Image
                  resizeMode="contain"
                  style={{ width: 25, height: 25, justifyContent: 'center', alignItems: 'center',margin:7}}
                  source={require('../img/notification.png')}>
                </Image>
                </TouchableOpacity>
            <View style={{ flex:1,alignItems:'center',justifyContent:'center',}}>    
            {!this.state.personImage ?
              <TouchableOpacity>
                <Image
                  style={{ width: 70, height: 70, justifyContent: 'center', alignItems: 'center',}}
                  source={require('../img/user.png')}>
                </Image>
              </TouchableOpacity>
              :
              <TouchableOpacity>
                <Image
                  style={{ width: 70, height: 70, borderRadius: 70 / 2,}}
                  source={{ uri: this.state.personImage }}
                ></Image>
              </TouchableOpacity>

            }
            {!this.state.userName ?
              <Text style={{ color: '#FFFFFF', fontSize: 16, alignItems: 'center',fontFamily:"segoe" }}
              >اسم المستخدم</Text>
              :
              <Text style={{ color: '#FFFFFF', fontSize: 16,  alignItems: 'center',marginTop:3,fontFamily:"segoe"}}> {this.state.userName}</Text>
            }
            </View>
             <Text
              onPress={this.changeLanguage.bind(this)}
              style={[styles.shadow,{width:50,textAlign: 'center', color: '#343434',backgroundColor:'#F8F8F8',fontSize: 16,borderRadius:5,padding:5,margin:7}]}>EN</Text>
          </View>
        
          {this.state.flag_skip == 0 ?
            <View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('MyProfileScreen')}
                style={{ height: height*0.06, flexDirection: 'row-reverse', marginTop: 5, alignItems: 'center', marginStart: '8%', }}>
                <Image source={require('../img/profile.png')}
                  style={{ height: 30, width: 30 }}
                  resizeMode='stretch'
                ></Image>
                <Text style={{ paddingEnd: 0, color: '#343434', fontSize: 18,  marginEnd: 15,fontFamily:"segoe"   }}>
                  حسابي
                  </Text>
              </TouchableOpacity>

               <TouchableOpacity
                onPress={() => this.props.navigation.navigate('RentRequest')}
                style={{ height: height*0.06, flexDirection: 'row-reverse', marginTop: 5, alignItems: 'center', marginStart: '8%' }}>
                <Image source={require('../img/myorder.png')}
                  style={{ height: 30, width: 30 }}
                  resizeMode='stretch'
                ></Image>
                <Text style={{ paddingEnd: 0, color: '#343434', fontSize: 18,  marginEnd: 15, fontFamily:"segoe"  }}>
                  طلباتي
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('AddCarScreen')}
                style={{ height: height*0.06, flexDirection: 'row-reverse', marginTop: 5, alignItems: 'center',marginStart: '8%' }}>
                <Image source={require('../img/addcar.png')}
                  style={{ height: 30, width: 30 }}
                  resizeMode='stretch'
                ></Image>
                <Text style={{ paddingEnd: 0, color: '#343434', fontSize: 18,  marginEnd: 15, fontFamily:"segoe"  }}>
                 أضافه سيارة
                </Text>
              </TouchableOpacity>

              {this.state.userType !== 1?
              <View>
               {/* <TouchableOpacity
               onPress={() => this.props.navigation.navigate('MyCarRentRequest')}
               style={{ height: height*0.06, flexDirection: 'row-reverse', marginTop: 5, alignItems: 'center', marginStart: '8%' }}>
               <Image source={require('../img/rent2.png')}
                 style={{ height: 30, width: 30 }}
                 resizeMode='stretch'
               ></Image>
               <Text style={{ paddingEnd: 0, color: '#343434', fontSize: 18,  marginEnd: 15,fontFamily:"segoe"   }}>
                 طلبات واردة
                 </Text>
             </TouchableOpacity> */}
             <TouchableOpacity
               onPress={() => this.props.navigation.navigate('MyCarScreen')}
               style={{ height: height*0.06, flexDirection: 'row-reverse', marginTop: 5, alignItems: 'center', marginStart: '8%' }}>
               <Image source={require('../img/mycar.png')}
                 style={{ height: 30, width: 30 }}
                 resizeMode='stretch'
               ></Image>
               <Text style={{ paddingEnd: 0, color: '#343434', fontSize: 18,  marginEnd: 15,fontFamily:"segoe"   }}>
                 سياراتي
                 </Text>
             </TouchableOpacity>

             <TouchableOpacity
                onPress={() => this.props.navigation.navigate('ReceiveBill')}
               style={{ height: height*0.06, flexDirection: 'row-reverse', marginTop: 5, alignItems: 'center', marginStart: '8%' }}>
               <Image source={require('../img/bill.png')}
                 style={{ height: 30, width: 30 }}
                 resizeMode='stretch'
               ></Image>
               <Text style={{ paddingEnd: 0, color: '#343434', fontSize: 18,  marginEnd: 15, fontFamily:"segoe"  }}>
                الفواتير 
               </Text>
             </TouchableOpacity>
             </View>
              :
              <View style ={{display:'none'}}></View>
              }

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('ContactUsScreen')}
                style={{ height: height*0.06, flexDirection: 'row-reverse', marginTop: 5, alignItems: 'center', marginStart: '8%', }}>
                <Image source={require('../img/contact.png')}
                  style={{ height: 30, width: 30 }}
                  resizeMode='stretch'
                ></Image>
                <Text style={{ paddingEnd: 0, color: '#343434', fontSize: 18,  marginEnd: 15,fontFamily:"segoe"   }}>
                  تواصل معنا
                </Text>
              </TouchableOpacity>

             

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('AboutApp')}
                style={{ height: height*0.06, flexDirection: 'row-reverse', marginTop: 5, alignItems: 'center', marginStart: '8%' }}>
                <Image source={require('../img/about.png')}
                  style={{ height: 30, width: 30 }}
                  resizeMode='stretch'
                ></Image>
                <Text style={{ paddingEnd: 0, color: '#343434', fontSize: 18,  marginEnd: 15, fontFamily:"segoe"  }}>
                 عن التطبيق
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Terms')}
                style={{ height: height*0.06, flexDirection: 'row-reverse', marginTop: 5, alignItems: 'center', marginStart: '8%' }}>
                <Image source={require('../img/terms.png')}
                  style={{ height: 30, width: 30 }}
                  resizeMode='stretch'
                ></Image>
                <Text style={{ paddingEnd: 0, color: '#343434', fontSize: 18,  marginEnd: 15, fontFamily:"segoe"  }}>
                  الشروط والاحكام
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.signOut.bind(this)}
                style={{ height: height*0.06, flexDirection: 'row-reverse', marginTop: 5, alignItems: 'center', marginStart: '8%', marginBottom: 20 }}>
                <Image source={require('../img/logout.png')}
                  style={{ height: 30, width: 30 }}
                  resizeMode='stretch'
                ></Image>
                <Text style={{ paddingEnd: 0, color: '#343434', fontSize: 18,  marginEnd: 15, fontFamily:"segoe"  }}>
                  تسجيل خروج
                  </Text>
              </TouchableOpacity>
            </View>
            :
            <View>
              <TouchableOpacity
                // onPress={() => this.props.navigation.navigate('ReceiveBill')}
                style={{ height: height*0.06, flexDirection: 'row-reverse', marginTop: 5, alignItems: 'center', marginStart: '8%' }}>
                <Image source={require('../img/about.png')}
                  style={{ height: 30, width: 30 }}
                  resizeMode='stretch'
                ></Image>
                <Text style={{ paddingEnd: 0, color: '#343434', fontSize: 18,  marginEnd: 15, fontFamily:"segoe"  }}>
                 عن التطبيق
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={() => this.props.navigation.navigate('ReceiveBill')}
                style={{ height: height*0.06, flexDirection: 'row-reverse', marginTop: 5, alignItems: 'center', marginStart: '8%' }}>
                <Image source={require('../img/terms.png')}
                  style={{ height: 30, width: 30 }}
                  resizeMode='stretch'
                ></Image>
                <Text style={{ paddingEnd: 0, color: '#343434', fontSize: 18,  marginEnd: 15, fontFamily:"segoe"  }}>
                  الشروط والاحكام
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Login')}
                style={{ height: height*0.06, flexDirection: 'row-reverse', marginTop: 5, alignItems: 'center', marginStart: '8%', marginBottom: 10 }}>
                <Image source={require('../img/logout.png')}
                  style={{ height: 30, width: 30 }}
                  resizeMode='stretch'
                ></Image>
                <Text style={{ paddingEnd: 0, color: '#343434', fontSize: 18,  marginEnd: 15,fontFamily:"segoe"   }}>
                  تسجيل دخول
             </Text>
              </TouchableOpacity>
            </View>
          }
      </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
export default createDrawerNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: {
      drawerLabel: 'Settings',
    }
  },

}
  ,
  {
    contentComponent: Custom_Side_Menu,
    drawerPosition: 'right',
    drawerType :'front',
    hideStatusBar:false,
    

  }
);
const styles = StyleSheet.create({
  flex: {
      flex: 0
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
       width: 0,
       height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor:'#fff'
 },
  row: {
      flexDirection: 'row'
  },
  row_res:{
    flexDirection: 'row-reverse'
  },
  column: {
      flexDirection: 'column'
  },
  right:{
    textAlign:'right'
  },
  left:{
    textAlign:'left'
  },
  view:{
    width:'100%' ,
    height:120,
    alignItems:'center',
    backgroundColor:'#C8972C'
  },
});



