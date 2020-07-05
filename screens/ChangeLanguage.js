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


class ChangeLanguage extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
    constructor(props) {
        super(props);
        this.state={
          lang:'',
    
        }
       
      }
      componentDidMount() {
        this._retrieveData()
       
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

    setAppLanguage = async (lang) => {
      // this.setState({ Processing: true });
      setTimeout(() => {
         try {
                    //  this.setState({ Processing: false });
                     Alert.alert(
                      this.state.lang === 'ar' ? 'كيان' : 'Kayan' ,
                      this.state.lang === 'ar' ? 'يجب أعادة تشغيل التطبيق لتغير اللغه' : 'You need to restart app to change language' ,
                      [
                        {text: this.state.lang === 'ar' ? 'الغاء' : 'Cancel' ,
                        onPress: () => this.dismiss, style: 'cancel'},
                        {text:this.state.lang === 'ar' ? 'موافق' : 'ok' ,  onPress: () => {
                          try {
                            AsyncStorage.setItem('lang', lang);
                            RNRestart.Restart();
                          } catch (e){}
                         },
                       },
                      ],
                      { cancelable: true }
                    );
                     return true;
         } catch (error) {
            // this.setState({ Processing: false });
            alert(error);
         }
      }, 1000);
  };
    
  renderOption() {
    return (
      <View style={{width: width, height: '8%', alignItems: 'center', justifyContent: 'center',}}>
          <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:'100%',height:'100%',alignItems:'center',justifyContent:'center', 
          backgroundColor:'#C8972C',paddingHorizontal: 18 }]}>

         {this.state.lang ==='ar'?
             <TouchableOpacity  onPress={() =>{
                this.props.navigation.goBack()
              }}
             style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
            <Image resizeMode={'cover'} source={require('../img/w_arrow.png')} 
             style={{width:10 , height:18,alignItems:'center',}}/>
           </TouchableOpacity>
            :
            <TouchableOpacity  onPress={() =>{
                this.props.navigation.goBack()
              }}
             style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
            <Image resizeMode={'cover'} source={require('../img/r_back.png')} 
             style={{width:10 , height:18,alignItems:'center',}}/>
           </TouchableOpacity>
            }
         <Text style={{ textAlign: 'center',width:'85%', fontSize: 20,fontFamily:'segoe', color: "#fff",   }}>
              {this.state.lang ==='ar' ? 'تغير اللغة' : 'Change language'}
            </Text>
            <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}
              style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center',}}>
              <Image resizeMode={'contain'} source={require('../img/nav.png')}
                style={{ width: 25, height: 25, alignItems: 'center', }} />
            </TouchableOpacity>

          </View>
          
      </View>
    )
  }
          render(){
        return (
            <SafeAreaView style={{width: '100%', flex:1,alignItems:'center',backgroundColor:'#fff',}}>
            {this.renderOption()}
           {/* <ScrollView style={{width :'100%' , height:'100%' ,flex:1 , }}> */}
           <View style={{width: '100%', alignItems:'center',justifyContent:'center'}}>
          
              <Image 
                 resizeMode='stretch'
                  source={require('../img/logo.png')} style={{width: width*0.9, height: height*0.17,marginTop:10}}>
                </Image>
              
                   <View style={{width:'100%',height:'70%',alignItems:'center',justifyContent:'center'}}>
                   <Text style={{textAlign:'center', fontSize:16,alignItems:'center',width:'90%',color:'#000',fontFamily:"segoe",marginTop:height*0.1  }}>
                    {'أختر لغه التطبيق'}
                   </Text>    
                  <View style={{width:'90%' , flexDirection: 'row',alignItems:'center',marginTop:'5%'}}>
                     
                <TouchableOpacity
                    onPress={() => this.setAppLanguage('en')}
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
                    onPress={() => this.setAppLanguage('ar')}
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
                  </View>
                  {/* </ScrollView> */}
                
          </SafeAreaView>
        );
      }
    }
export default ChangeLanguage;
const styles = StyleSheet.create({
    flex: {
        flex: 0
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
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 0,
      },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
      backgroundColor:'#fff'
   },
   
  });
