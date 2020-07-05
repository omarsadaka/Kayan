import React, { Component } from 'react';
import { View,YellowBox, Text,BackHandler, StyleSheet, TouchableOpacity, TextInput, Image ,Alert} from 'react-native';
import { AsyncStorage, SafeAreaView,Dimensions,ScrollView } from 'react-native';
const { width , height } = Dimensions.get('window')
import RNRestart from 'react-native-restart';
//import DeviceInfo from 'react-native-device-info';
//import I18n from 'react-native-i18n'
//import Toast from 'react-native-simple-toast';
//import RNRestart from 'react-native-restart';  
//import VersionNumber from 'react-native-version-number';
//import CodePush from 'react-native-code-push';


class LanguageScreen extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
    constructor(props) {
        super(props);
        this.state={
          lang:'',
    
        }
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
        BackHandler.addEventListener('hardwareBackPress', this.onBackClicked)
        );
      }
      componentDidMount() {
        this._retrieveData()
        YellowBox.ignoreWarnings(['Class RCTCxxModule']);
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.onBackClicked)
      );
      }
      componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
      }
      onBackClicked=()=>{
        if(this.props.navigation.state.routeName == 'Language'){
         //  Toast.show(this.props.navigation.state.routeName);
         Alert.alert(
          this.state.lang.indexOf('ar') != -1 ?'كيان' :'Kayan',
          this.state.lang.indexOf('ar') != -1 ?'هل أنت متأكد من أنك تريد الخروج؟' :'Are you sure you want to exit?',
           [
             {text:this.state.lang.indexOf('ar') != -1 ?'إلغاء' :' Cancel'
             , onPress: () => this.dismiss, style: 'cancel'},
             {text: this.state.lang.indexOf('ar') != -1 ?'موافق' :'Ok'
             , onPress: () => BackHandler.exitApp()},
           ],
           { cancelable: true }
          
         )
          return true;
       }
          else{return false;}
        }
      _onArabicPressed = async () => {
        //  await syncStorage.removeItem('lang');
        await AsyncStorage.setItem("lang", "ar")
        const value = await AsyncStorage.getItem('loginDataKayan');
        const data = JSON.parse(value);
        if(data){
          this.props.navigation.navigate('Home_ar');
        }else{
          this.props.navigation.push('Login');
        }

      
      }
     
      _onEnglishPressed = async () => {
        //  await syncStorage.removeItem('lang');
        await AsyncStorage.setItem("lang", "en")
        const value = await AsyncStorage.getItem('loginDataKayan');
        const data = JSON.parse(value);
        if(data){
          this.props.navigation.navigate('Home');
        }else{
          this.props.navigation.push('Login_En');
        }

        
    } 

    _retrieveData = async () => {
      try {
        const lang = await AsyncStorage.getItem('lang');
        if (lang){
          this.setState({lang});
        }
        // this.setState({Processing:true});
      } catch (error){}
    }

    
          render(){
        return (
            <SafeAreaView style={{width: '100%', flex:1,alignItems:'center',backgroundColor:'#fff',}}>
           {/* <ScrollView style={{width :'100%' ,flex:1 , }}> */}
           <View style={{width: '100%', alignItems:'center',}}>
           <Image 
                resizeMode='stretch'
                source={require('../img/img.png')} style={{width: width, height: height*0.33,}}>
              </Image>
           
             {/* <View style={{width: '70%', height: '28%',alignItems:'center',justifyContent:'center'}}> */}
              <Image 
                 resizeMode='stretch'
                  source={require('../img/logo.png')} style={{width: width*0.9, height: height*0.15,}}>
                </Image>
             {/* </View> */}
              
                   
                  </View>
                  {/* </ScrollView> */}
                  <View style={{width:'100%',alignItems:'center',marginTop:height*0.15}}>
                   <Text style={{textAlign:'center', fontSize:16,alignItems:'center',width:'90%',color:'#000',fontFamily:"segoe",}}>
                    {'أختر لغه التطبيق'}
                   </Text>    
                  <View style={{width:'90%' , flexDirection: 'row',alignItems:'center',marginTop:'10%'}}>
                     
                <TouchableOpacity
                     onPress={this._onEnglishPressed.bind(this)  }
                    style={{width: '33%',backgroundColor:'#fff', height:45,
                    flex:1,borderColor:'#707070',borderWidth:1,borderRadius:20,
                    shadowColor: '#313131', shadowOffset: { width: 0, height:6 },shadowRadius: 6,shadowOpacity:0.3,elevation:5,
                    justifyContent:'center', alignItems:'center'
                  }}
                  >
                  <Text style={{textAlign:'center',textAlignVertical:'center',
                  fontSize:16,color:'#343434',fontFamily:"segoe" }}>
                    English
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                     onPress={this._onArabicPressed.bind(this)  }
                    style={{width: '33%', height:45, backgroundColor:'#343434',
                    flex:1,borderColor:'#707070',borderWidth:1,borderRadius:20,marginStart:5,
                    shadowColor: '#313131', shadowOffset: { width: 0, height:6 },shadowRadius: 6,shadowOpacity:0.3,elevation:5,
                    justifyContent:'center', alignItems:'center'
                  }}
                  >
                  <Text style={{textAlign:'center',textAlignVertical:'center',
                  fontSize:16,color:'#fff',fontFamily:"segoe" }}>
                    العربية
                  </Text>
                </TouchableOpacity> 
                  </View>
                  </View>
                
          </SafeAreaView>
        );
      }
    }
export default LanguageScreen;