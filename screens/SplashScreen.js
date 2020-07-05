import React, { Component } from 'react';
import {Image,AsyncStorage,SafeAreaView ,Dimensions} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation'
const { width, height } = Dimensions.get('window')
class SplashScreen extends Component {
    constructor(props){
        super(props);
        this.state={ 
            loginType:0,
        }
        // YellowBox.ignoreWarnings(['Remote debugger']);
        setTimeout( async () => {
            const valueLang = await AsyncStorage.getItem('lang');   
            const valueData = await AsyncStorage.getItem('loginDataKayan');   
            
          
            if(valueLang){ 
                if (valueLang.indexOf('en') === 0) {
                    if(valueData){
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                               NavigationActions.navigate({ routeName: 'Home' })
                            ],
                         }))
                    }else{
                       
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                               NavigationActions.navigate({ routeName: 'Login_En' })
                            ],
                         }))
                    }
                    
                }else if (valueLang.indexOf('ar') === 0) {

                    if(valueData){
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                               NavigationActions.navigate({ routeName: 'Home_ar' })
                            ],
                         }))
                        //this.props.navigation.navigate('Home_ar');
                    }else{
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                               NavigationActions.navigate({ routeName: 'Login' })
                            ],
                         }))
                    }
                    
                }
               
            }
            else{
                this.props.navigation.push('Language');
             }
           
        },3000);
    }

  
    render() {
        return (
            <SafeAreaView style={{width: '100%', height: '100%', backgroundColor: '#FFFFFF',  alignItems:'center',justifyContent: 'center',}}>
            <Image 
             resizeMode='stretch'
            source={require('../img/splash.png')} style={{width: width, height: height}}
            >
            </Image>
          </SafeAreaView>
        );
    }
}

export default SplashScreen;
