import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image,YellowBox,BackHandler,Alert, SafeAreaView} from 'react-native';
import { AsyncStorage,Dimensions} from 'react-native';
import {ActivityIndicator, ScrollView,StyleSheet } from 'react-native';
import Modal from 'react-native-modalbox';
import Button from 'react-native-button';
import firebase from 'react-native-firebase';
const { width , height } = Dimensions.get('window')
import NetInfo from "@react-native-community/netinfo";
import Icon from 'react-native-vector-icons/FontAwesome';


class LoginScreen extends Component{

    constructor(props) {
        super(props);
        this.state={
          lang: '',
          mobile:'',
          emailLogin:'',
          password:'',
          flag_lang:1,
          fcmToken:'',
          fullname_from_server:''
        }
        this.handleFocusNextField =this.handleFocusNextField.bind(this);
         this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
        BackHandler.addEventListener('hardwareBackPress', this.onBackClicked)
        );
      }
     
   
      componentDidMount() {
        this._retrieveData();
        this.checkPermission();
        // YellowBox.ignoreWarnings(['Remote debugger']);
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.onBackClicked)
      );
      }
      _retrieveData = async () => {
        try {
          const lang = await AsyncStorage.getItem('lang');
          this.setState({lang})
        }catch(error){}
      }

      onBackClicked=()=>{
        if(this.props.navigation.state.routeName == 'Login'){
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

      _onRegisterPressed= async () => {
        this.props.navigation.navigate('Register');
      }
      _onSkipLoginPressed= async () => {
        if(this.state.lang.indexOf('ar') != -1 ){
          this.props.navigation.navigate('Home_ar');
        }
        else {
          this.props.navigation.navigate('Home');
        }
      }

      
      async checkPermission() {
        firebase.messaging().hasPermission()
       .then(enabled => {
         if (enabled) {
        //  alert('Yes')
         this.getToken();
         } else {
          this.requestPermission();
       } 
      });
      }
      
        //3
        
      async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken', 0);
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken){
                // user has a device token
                await AsyncStorage.setItem('fcmToken',fcmToken);
                this.setState({fcmToken})
               // alert(fcmToken)
            }
        }else{
          this.setState({fcmToken})
          console.log('key'+this.state.fcmToken);
        }
        // this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
        //   console.log(notif)
        // });
       
        firebase.notifications().onNotification(notification => {
       
          const localNotification = new firebase.notifications.Notification({
             show_in_foreground: true,
             local_notification: true,
             soundName: 'sound.mp3',
             popInitialNotification: true,
            requestPermissions: true,
            permissions: {
              alert: true,
              badge: true,
              sound: true
            },
          })
            .setNotificationId(notification.notificationId)
            .setTitle(notification.title)
            .setSubtitle(notification.subtitle)
            .setSound('default')
            .setBody(notification.body)
            .setData(notification.data)
            .android.setChannelId("channelId") // e.g. the id you chose above
             .android.setSmallIcon('../img/chat_logo.png') // create this icon in Android Studio
            // .android.setColor("#000000") // you can set a color here
            .android.setPriority(firebase.notifications.Android.Priority.High);
        
          firebase.notifications().displayNotification(localNotification);
         
        });
      
       
      }
      
      
      async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            alert('permission rejected');
        }
      }
      


      componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
        // Backendless.Messaging.removePushNotificationListener(this.localNotification);
      }
      _onLoginPressed=()=>{
        this.setState({flag_lang:0})
        const errors =this.validate(this.state.emailLogin,this.state.password);
        this.setState({errors});
        if(Object.keys(errors).length === 0){
            this.LoginFun();
        }
        else{
          this.setState({flag_lang:1})
          // this.btnLogin.reset();
        }
        }

      LoginFun = async ()=>{
        // this.setState({flag:0});
        //  alert('token == '+this.state.fcmToken);
        NetInfo.fetch().then(state => {
          if(state.isConnected) {
            fetch('http://134.209.178.237/api/user/login?val='+this.state.emailLogin+"&password="+this.state.password+"&userKey="+this.state.fcmToken)
           .then( (response) => response.json())
           .then(async (responseJson) => {
           try {
             if(responseJson.message){
               this.setState({flag_lang:1})
              if(responseJson.message == 'Authentication failed. User not found.'){
              if(this.state.lang.indexOf('ar') != -1){
                alert('عفوا هذا الايميل غير موجود');
              }
              else {
                alert('Sorry this Email not found');
              }
            
            }
           else if(responseJson.message == 'Authentication failed. Wrong password.'){
              
              if(this.state.lang.indexOf('ar') != -1 ){
                alert('عفوا كلمة المرور غير صحيحة');
              }
              else {
                alert('Sorry password worng');
              }
              }
           
              
          }
          else{
            this.setState({flag_lang:1})
          await AsyncStorage.setItem('loginDataKayan',JSON.stringify(responseJson));
           if(this.state.lang.indexOf('ar') != -1 ){

          alert('مرحبا  ' + responseJson.fullname);            
            this.props.navigation.navigate('Home_ar');
          }
          else {

            alert('Welcome '+  responseJson.fullname );
            this.props.navigation.navigate('Home');
          }
          
         
          }
        } catch (error) {
          this.setState({flag_lang:1})
          if(this.state.lang.indexOf('ar') != -1 ){

            alert('حدث خطا ما من فضلك حاول لاحقا' );
          }
          else {

            alert('Opps ! Please try again later' );
          }
        }
      })
      .catch((error) => {
        this.setState({flag_lang:1})
        console.error(error);
      });
    }else{
      this.setState({flag_lang:1})
      if(this.state.lang.indexOf('ar') != -1 ){

        alert('عذرا لا يوجد أتصال بالانترنت' );
      }
      else {

        alert('Sorry No Internet Connection');
      }
      }
    })
      }

      validate=(email,password)=>{
        const errors ={};
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(!email && !password){
          errors.email ='Enter email First'; 
          if(this.state.lang.indexOf('ar') != -1 ){
            alert('من فضلك أدخل الايميل  وكلمة المرور أولا');
          }
          else {
            alert('Please Enter email and password To make login');
          }
        }
       else if(!email){
          errors.email ='Enter email First'; 
          
          if(this.state.lang.indexOf('ar') != -1 ){
            alert('أدخل الايميل');
          }
          else {
            alert('enter your  Email');
          }
         }
       
          else if(!password){
            errors.password ='Enter Password First'; 
            if(this.state.lang.indexOf('ar') != -1 ){
              alert('يجب أدخال كلمة المرور');
            }
            else {
              alert('enter your password');
            }
           }
        return errors;
        }
        handleFocusNextField = (nextField) => {
          this.refs[nextField].focus();
          }

          renderOption(){
            return(
              <View style={{width:'100%',height:'8%',alignItems:'center',justifyContent:'center',}}>
             {this.state.lang.indexOf('ar')!=-1?
              <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',backgroundColor:'#C8972C'}}>
              <TouchableOpacity onPress={() =>{ this.props.navigation.goBack() }}
              style={{width:'8%'}}>
              {/* <Image resizeMode={'cover'} source={require('../img/w_arrow.png')}
              style={{width:25 , height:25,alignItems:'center'}} /> */}
       
             </TouchableOpacity>
             <Text style={{textAlign:'center',width:'80%',flex:1,fontSize:20,fontFamily:'segoe',color:"#fff", }}>
            {/* {strings("Home.barTitle")} */}
            {this.state.lang.indexOf('ar')!=-1?'تسجيل دخول':'Login'}
            </Text>
              <TouchableOpacity  onPress={() =>{
          this.props.navigation.goBack()
           }}
           style={{width:'8%'}}>
          {/* <Image resizeMode={'cover'} source={require('../img/w_arrow.png')} 
         style={{width:10 , height:18,alignItems:'center',margin:10}}/> */}
         </TouchableOpacity>
       
        
             
             
           </View>
             :
             <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row-reverse',backgroundColor:'#C8972C'}}>
               <TouchableOpacity onPress={() =>{ this.props.navigation.goBack() }}
                 style={{width:'8%'}}>
                 {/* <Image resizeMode={'cover'} source={require('../img/w_arrow.png')}
                 style={{width:25 , height:25,alignItems:'center'}} /> */}
          
                </TouchableOpacity>
                <Text style={{textAlign:'center',width:'80%',flex:1,fontSize:20,fontFamily:'segoe',color:"#fff", }}>
               {/* {strings("Home.barTitle")} */}
               {this.state.lang.indexOf('ar')!=-1?'تسجيل دخول':'Login'}
               </Text>
                 <TouchableOpacity  onPress={() =>{
             this.props.navigation.goBack()
              }}
              style={{width:'8%'}}>
             {/* <Image resizeMode={'cover'} source={require('../img/w_arrow.png')} 
            style={{width:10 , height:18,alignItems:'center',margin:10}}/> */}
            </TouchableOpacity>
          
            
                
                 
              </View>
            }
              </View>
            )
          }

    render(){
        return(
            <SafeAreaView  style={{width: '100%', height:height,alignItems:'center',backgroundColor:'#fff',}}>
              {this.renderOption()}
              {this.state.flag_lang==0?
                <ActivityIndicator 
                size="large"
                color='#C8972C'
                style={{left: 0,
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  zIndex: 1}} />
                :
                <View/>
              }
              <ScrollView style={{width:'100%',flex:1,marginBottom:5}}>
             <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
              <Image 
                resizeMode='stretch'
                source={require('../img/logo.png')} style={{width: width*0.7, height: height*0.12,marginTop:15}}>
              </Image>
              <TextInput
                 underlineColorAndroid='#fff' 
               placeholderTextColor='#D4D4D4'
                defaultValue={this.state.emailLogin}
                onChangeText={(emailLogin) => this.setState({ emailLogin  }) }
                 placeholder={this.state.lang.indexOf('ar') != -1 ?' البريد الاكتروني' :' Email address'}
               style={[{width: '80%',height:height*0.07,color:'#000',marginTop:height*0.13,fontSize:14,textAlign:'center',fontFamily:"segoe",backgroundColor:'#FFF',
              borderRadius:8,shadowColor: '#000', shadowOffset: { width: 0, height:0 },shadowRadius: 4,elevation:3,shadowOpacity:0.3}]}
               ></TextInput>
            <TextInput
               underlineColorAndroid='#fff' 
               placeholderTextColor='#D4D4D4'
              secureTextEntry
              defaultValue={this.state.password}
              placeholder='كلمة المرور'
              onChangeText={(password) => this.setState({ password  }) }
              style={[{width: '80%',height:height*0.07,color:'#000',marginTop:10,fontSize:14,textAlign:'center',fontFamily:"segoe",backgroundColor:'#FFF',
              borderRadius:8,shadowColor: '#000', shadowOffset: { width: 0, height:0 },shadowRadius: 4,elevation:3,shadowOpacity:0.3}]}
            ></TextInput>

           <TouchableOpacity 
             onPress={this._onLoginPressed.bind(this)}
             style={{width: '80%',backgroundColor:'#4B4B4B', marginTop:20,borderColor:'#343434',borderWidth:1,borderRadius:8,
             shadowColor: '#000', shadowOffset: { width: 0, height:3 },shadowRadius: 6,elevation:3,shadowOpacity:0.3,
             justifyContent:'center', alignItems:'center', height:height*0.07,
             }}>
              <Text style={{textAlign:'center',color:'#fff',fontSize:16,textAlignVertical:'center',fontFamily:"segoe", }}>
                {this.state.lang.indexOf('ar') != -1 ?'تسجيل الدخول' :'Login'}
              </Text>
            </TouchableOpacity>

             <TouchableOpacity 
             style={{width: '80%',height:45,marginTop:5}}
              onPress={() => this.refs.modal.open()} >
              <Text style={{width:'100%',textAlign:'center',textAlignVertical:'center',color:'#343434',fontSize:14,fontFamily:"segoe", }}>
                {this.state.lang.indexOf('ar') != -1 ?' فقدت كلمةالمرور؟' :'Forget Password?'}</Text>
            </TouchableOpacity>
           
            <TouchableOpacity 
            style={{width: '73%',height:height*0.07, justifyContent:'center', alignItems:'center', borderColor:'#343434',backgroundColor:'#FFFFFF',borderWidth:1,borderRadius:20,marginTop:20,
            shadowColor: '#474747', shadowOffset: { width: 0, height:3 },shadowRadius: 6,elevation:3,shadowOpacity:0.3}}
            onPress={this._onRegisterPressed.bind(this)  }> 
              <Text style={{ textAlign:'center',fontSize:16,color:'#040707',fontFamily:"segoe",}}>
                    {this.state.lang.indexOf('ar') != -1 ?'إنشاء حساب' :'Create account'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={{width: '40%',height:35,marginTop:10,marginBottom:10}}
              onPress={this._onSkipLoginPressed.bind(this)}>
              <Text style={{width: '100%',height:35,textAlign:'center',fontSize:16,color:'#343434',textAlignVertical:'center', }}>
                    {this.state.lang.indexOf('ar') != -1 ?'تخطي التسجيل' :'Skip login'}
              </Text>
            </TouchableOpacity>
             </View>
             </ScrollView>
             
             <Modal style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                backgroundColor: 'transparent'
              }} 
            position={"center"} ref={"modal"} >
                
                <View style={{
                      alignItems: 'center',
                      backgroundColor:'#eee',
                      borderRadius:2,
                      borderWidth:2,
                      borderColor:"#fff",
                      width: '90%'
                      
                  }} >
               <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,{width:'100%',alignItems:'center'}]}>
                <TouchableOpacity
                 onPress={()=>this.refs.modal.close()}>
               <Icon name="close" size={18} color="#707070" style={{margin:10}} />
               </TouchableOpacity>
            </View>
                    <Text 
                        style={{ marginTop:10,fontSize:20,width:'90%',textAlign:'center',textDecorationLine: 'underline'}}>
                     {this.state.lang.indexOf('ar') != -1 ?'نسيت كلمة المرور ' :' Forget Password'}
                    
                   </Text>
                      
                    <View style={{ width: '90%',  marginTop:20,justifyContent:'center',alignItems:'center'}} >
                    
                  
                         <TextInput
                         value={this.state.emailPass}
                         onChangeText={(text) => this.setState({emailPass:text})}                         
                         style={{ borderWidth:1,borderColor:'#ccc',width:'90%',height:35,fontSize:14,textAlign:'center'}} 
                         placeholder={this.state.lang.indexOf('ar') != -1 ?'   البريد الألكتروني  ' :'   Enter email'}
                         underlineColorAndroid='transparent'
                         ></TextInput>
                        
                    </View>

                  
          
          <Button
          style={{marginTop:30,paddingHorizontal:20,color:'#000',marginBottom:40,backgroundColor:'#fff',borderColor:'#fff',borderWidth:2,borderRadius:2}}
          //  onPress={this._onForgetPressed.bind(this)  } 
          onPress={() => {
            this.refs.modal.close()
               this.setState({flag_lang:0})
            if(this.state.emailPass){
              let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
              if(reg.test(this.state.emailPass) === false){
                this.setState({flag_lang:1})
                 return alert('عفوا هذا البريد الألكتروني غير صحيح')
               
                    }
                    NetInfo.fetch().then(state => {
                      if(state.isConnected) {
               
              fetch('http:///134.209.178.237/api/user/forgetPassword?email='+this.state.emailPass)
              .then( (response) => response.json())
            .then(async (responseJson) => {
                this.setState({flag_lang:1})
              try {
                if(responseJson.message){
                  if(responseJson.message == 'User not found.'){
                    if(this.state.lang.indexOf('ar') != -1 ){   
                      this.setState({flag_lang:1});             
                      alert('عفوا هذا البريد الألكتروني غير موجود')
                    }
                    else {   
                      this.setState({flag_lang:1});           
                      alert(' This Email Not Exist ');
                    }
                  }
                 else if(responseJson.message == 'DONE'){
                  if(this.state.lang.indexOf('ar') != -1 ){ 
                    this.setState({flag_lang:1});               
                    alert('تم أرسال كلمة المرور علي البريد الألكتروني' )
                  }
                  else {  
                    this.setState({flag_lang:1});            
                    alert(' Password Send To This Email');
                  }
                    this.refs.modal.close()
                    }
                    else{
                      this.setState({flag_lang:1});
                      if(this.state.lang.indexOf('ar') != -1 ){                
                        alert('حدث خطا ما من فضلك حاول لاحقا')
                      }
                      else {     
                        this.setState({flag_lang:1});         
                        alert(' Opps Error Occure');
                      }
                    }
                }
                else{
                  this.setState({emailPass:''})
                  if(this.state.lang.indexOf('ar') != -1 ){  
                    this.setState({flag_lang:1});              
                    alert('تم أرسال كلمة المرور علي البريد الألكتروني' )
                  }
                  else {       
                    this.setState({flag_lang:1});       
                    alert(' Password Send To This Email');
                  }
                  this.refs.modal.close()
                }
              } catch (error) {
                if(this.state.lang.indexOf('ar') != -1 ){   
                  this.setState({flag_lang:1});             
                  alert('حدث خطا ما من فضلك حاول لاحقا')
                }
                else {   
                  this.setState({flag_lang:1});           
                  alert(' Opps Error Occure');
                }
              }
            })
            .catch((error) => {
              this.setState({flag_lang:1})
              alert(''+error)
            });
          }else{
            if (this.state.lang.indexOf('ar')!=-1) {
              this.setState({flag_lang:1});
              alert('عذرا لا يوجد اتصال بالانترنت');
            }else{
              this.setState({flag_lang:1});
              alert('No internet connection!')
            }
            this.refs.modal.close()
            }
          })
        }else{
          if (this.state.lang.indexOf('ar')!=-1) {
            this.setState({flag_lang:1});
            alert('يجب أدخال البريد الألكتروني' );
          }else{
            this.setState({flag_lang:1});
            alert(' Enter Your Email Address!')
          }
        }
          }}
           >
          {this.state.lang.indexOf('ar') != -1 ?'تم  ' :' Done'}  
          </Button>
          </View>

            </Modal>
            
          </SafeAreaView>
        )
    }
}
export default LoginScreen;
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
  view:{
    width:width ,
    height:'10%',
    alignItems:'center',
    backgroundColor:'#C8972C'
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