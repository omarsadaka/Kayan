import React, { Component } from 'react';
import { View, Text,Dimensions, StyleSheet, TouchableOpacity, TextInput, Image ,ImageBackground} from 'react-native';
import { AsyncStorage} from 'react-native';
import {ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modalbox';
import DatePicker from 'react-native-datepicker'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import NetInfo from "@react-native-community/netinfo";
import { Container, Header, Content, Picker, Form } from "native-base";
const { width, height } = Dimensions.get('window')
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalDropdown from 'react-native-modal-dropdown';




class MyProfileScreen extends Component{
    constructor(props) {
        super(props);
        this.state={
          lang:'',
          flag_lang:0,
          flag_design:0,
          flag_secure:0,
          Data:[],
          userData:{},
          userId:'',
          userImg:'',
          userMobile:'',
          userEmail:'',
          userName:'',
          countryID:'',
          cityID:'',
          userPwd:'',
          licienceID:'',
          cities:[],
          countries:[],
          licenceImg:'',
          nationalImg:'',
          currentPass:'',
          newPass:'',
          repeatPass:'',
          password:'',
          dateBirth:'',
          codeID:'',
          con_codes:[],
        }
        
      }
    
      componentDidMount() {
        //NativeModules.ExceptionsManager = null; 
        this._retrieveData();
      }
      _retrieveData = async () => {
        try {
          const lang = await AsyncStorage.getItem('lang');
          this.setState({lang})
           this.setState({flag_lang:1})
          const value = await AsyncStorage.getItem('loginDataKayan');  
          if(value){
            const data =JSON.parse(value); 
          this.setState({userData:data})
          this.setState({userId:this.state.userData._id})
          this.setState({userMobile:data.mobile})
          this.setState({userEmail:data.email})
          this.setState({userName:data.fullname})
          this.setState({userImg:data.personalImg})
          this.setState({countryID:data.countryID})
          this.setState({cityID:data.cityID})
          this.setState({codeID:data.countryCode})
          this.setState({userPwd:data.password})
          this.setState({licenceImg:data.licenseWorkingImg})
          this.setState({nationalImg:data.nationalIdImg})
          this.setState({dateBirth:data.birthday})
         this.getCountry();
         this.getCity(data.countryID);
         this.getCodes();
       
          }else{
              var data2 ={
                _id:'1',
                fullname:'أسم المستخدم'
              }
              this.setState({userData:data2})
          }    
        }catch(error){}
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
                this.setState({userId:data._id})
                this.setState({userMobile:data.mobile})
                this.setState({userEmail:data.email})
                this.setState({userName:data.fullname})
                this.setState({userImg:data.personalImg})
                this.setState({countryID:data.countryID})
                this.setState({cityID:data.cityID})
                this.setState({codeID:data.countryCode})
                this.setState({userPwd:data.password})
                this.setState({licenceImg:data.licenseWorkingImg})
               this.setState({nationalImg:data.nationalIdImg})
              this.setState({dateBirth:data.birthday})
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

      getCountry=()=> {
        NetInfo.fetch().then(state => {
          if(state.isConnected){
        fetch('http://134.209.178.237/api/user/country')
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({flag_lang:1})
            const countries = responseJson;
             const countriesAr =[];
             
             if(this.state.lang.indexOf('ar') != -1){
               
             countries.forEach(element => {
               countriesAr.push({
                label:element.titleAr ,value:element._id,key:element._id
               })
             });
           
            }else{
              countries.forEach(element => {
                countriesAr.push({
                  label:element.titleEN ,value:element._id,key:element._id
                })
              });
           
            }
            this.setState({ countries :countriesAr});
            // this.setState({ countries :countriesAr});

            
          })
          .catch((error) => {
              alert('omaaaaar'+error)
          });
        }
          else{
            if(this.state.lang.indexOf('ar') != -1 ){
              this.setState({flag:1});
              alert('عذرا لا يوجد أتصال بالانترنت' );
            }
            else {
              this.setState({flag:1});
              alert('Sorry No Internet Connection');
            }
            }
          })
      }

      validate=(obj)=>{
        // this.setState({flag:0});
        const errors ={};
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(!obj.fullname){
          if(this.state.lang.indexOf('ar') != -1 ){
            // this.setState({flag:1});
            alert('يرجي إدخال الأسم كامل' );
          }
          else {
            // this.setState({flag:1});
            alert('fullname is requied' );
          }
          errors.fullname ="fullname is requied "; 
        }
      else if(obj.fullname.length < 6){
          if(this.state.lang.indexOf('ar') != -1 ){
            // this.setState({flag:1});
            alert('  الأسم كامل قصير جدآ' );
          }
          else {
            // this.setState({flag:1});
            alert('fullname is very short' );
          }
          errors.fullname ="fullname is very short ";
        }
       
        else if(!obj.mobile){
          if(this.state.lang.indexOf('ar') != -1 ){
            // this.setState({flag:1});
            alert('ادخل  رقم الموبايل');
          }
          else {
            // this.setState({flag:1});
            alert('Mobile Is Requied ');
          }
          errors.mobile ="mobile is requied ";
         }
          else if(reg.test(obj.email) === false){
            if(this.state.lang.indexOf('ar') != -1 ){
              // this.setState({flag:1});
              alert(' البريد الالكتروني غير صحيح');
            }
            else {
              // this.setState({flag:1});
              alert('Email Is invalied ');
            }
            errors.email ="email is invalied ";
          }
         
        return errors;
        }

      getCity=(countryID)=>{
        NetInfo.fetch().then(state => {
          if(state.isConnected){
            // alert("cityID"+this.state.cityID );
            fetch('http://134.209.178.237/api/user/city?id='+countryID)
                      .then((response) => response.json())
                      .then((responseJson) => {
                         const cities = responseJson;
                         const citiesAr =[];

                         if(this.state.lang.indexOf('ar') != -1){
               
                            cities.forEach(element => {
                              citiesAr.push({
                               label:element.titleAr ,value:element._id,key:element._id
                              })
                            });
                            // citiesAr.unshift({
                            //  label:'المدينة' ,value:'1',key:'1'
                            // })
                           //  citiesAr.unshift({
                           //   label:'المنطقة' ,value:'1',key:'1'
                           //  })
                           }else{
                             cities.forEach(element => {
                               citiesAr.push({
                                 label:element.titleEN ,value:element._id,key:element._id
                               })
                             });
                            //  citiesAr.unshift({
                            //    label:'Country' ,value:'1',key:'1'
                            //   })
                           //    citiesAr.unshift({
                           //     label:'City' ,value:'1',key:'1'
                           //    })
                           }
                         
                        this.setState({ cities:citiesAr});
                      })
                      .catch((error) => {
                      });
                    }else{
                        if(this.state.lang.indexOf('ar') != -1 ){
                            this.setState({flag:1});
                            alert('عذرا لا يوجد أتصال بالانترنت' );
                          }
                          else {
                            this.setState({flag:1});
                            alert('Sorry No Internet Connection');
                          }
                      }
                   })   
            }

            getCodes = () => {
              NetInfo.fetch().then(state => {
                if(state.isConnected)
                {
                  fetch('https://restcountries.eu/rest/v2/all')
                    .then((response) => response.json())
                    .then((responseJson) => {
                      const Data = responseJson;
                      
                      const codes = []
                      for (let index = 0; index < Data.length; index++) {
                          var obj = {
                             title:Data[index].callingCodes[0],
                          }
                       
                          codes.push(obj)
                      }
                      this.setState({ con_codes: codes });
          
                    })
                    .catch((error) => {
                      if (this.state.lang.indexOf('ar') != -1) {
                        this.setState({ flag: 1 });
                        alert('عذرا حدث خطأ ما حاول مره أخري ');
                      }
                      else {
                        this.setState({ flag: 1 });
                        alert('Sorry error happen try again');
                      }
                    });
                }
                else {
                  if (this.state.lang.indexOf('ar') != -1) {
                    this.setState({ flag: 1 });
                    alert('عذرا لا يوجد أتصال بالانترنت');
                  }
                  else {
                    this.setState({ flag: 1 });
                    alert('Sorry No Internet Connection');
                  }
                }
              })
            }      

            uploadImg=()=>{
              NetInfo.fetch().then(state => {
                if(state.isConnected){
                  const options = {
                    title: this.state.lang.indexOf('ar') != -1?'أختار الصور': 'Select photoes',
                    cancelButtonTitle:this.state.lang.indexOf('ar') != -1?'الغاء ': 'Cancel',
                    takePhotoButtonTitle:this.state.lang.indexOf('ar') != -1?'كاميرا ': 'Camera',
                    chooseFromLibraryButtonTitle:this.state.lang.indexOf('ar') != -1?'معرض الصور ': 'Gallery ',
                    storageOptions: {
                      skipBackup: true,
                      path: 'images',
                    },
                  };
                  ImagePicker.showImagePicker(options, (response) => {      
                    if (response.didCancel) {
                      if(this.state.lang.indexOf('ar') != -1 ){
                        alert('تم الغاء رفع الصورة');
                      }
                      else {
                       
                        alert('upload image cancel');
                      }
                    } else if (response.error) {
                      if(this.state.lang.indexOf('ar') != -1 ){
                        
                        alert("حدث خطأ ما");
                      }
                      else {
                        
                        alert("Opps !!");
                      }
                    } else if (response.customButton) {
                      if(this.state.lang.indexOf('ar') != -1 ){
                        
                        alert("حدث خطأ ما");
                      }
                      else {
                        
                        alert("Opps !!");
                      }
                    } else {
                      const source = { uri: response.uri };
                      const data = new FormData();
                      
                      data.append('name', 'testName'); // you can append anyone.
                      data.append('photo', {
                        uri: source.uri,
                        type: 'image/jpeg', // or photo.type
                        name: 'testPhotoName'
                      });
                    fetch('http://134.209.178.237/api/user/uploadFile', {
                      method: 'post',
                      body: data
                    }).then((res)=>{ 
                      return res.text() 
                    })
                    .then((text)=>{
                      this.setState({
                        userImg: text
                      });
                     
                      if(this.state.lang.indexOf('ar') != -1 ){
                        this.setState({flag:1});
                        alert("تم رفع الملف بنجاح");
                      }
                      else {
                        this.setState({flag:1});
                        alert("file added successfully ");
                      }
                      
                    });
                    }
                  });
                }else{
                  if(this.state.lang.indexOf('ar') != -1 ){
                    this.setState({flag:1});
                    alert('عذرا لا يوجد أتصال بالانترنت' );
                  }
                  else {
                    this.setState({flag:1});
                    alert('Sorry No Internet Connection');
                  }
                }
              })
                
              }

              uploadImg1=()=>{
                NetInfo.fetch().then(state => {
                  if(state.isConnected){
                    const options = {
                      title: this.state.lang.indexOf('ar') != -1?'أختار النوع': 'Select Avatar',
                      cancelButtonTitle:this.state.lang.indexOf('ar') != -1?'الغاء ': 'Cancel',
                      takePhotoButtonTitle:this.state.lang.indexOf('ar') != -1?'كاميرا ': 'Camera',
                      chooseFromLibraryButtonTitle:this.state.lang.indexOf('ar') != -1?'معرض الصور ': 'Gallery ',
                      storageOptions: {
                        skipBackup: true,
                        path: 'images',
                      },
                    };
                    ImagePicker.showImagePicker(options, (response) => {      
                      if (response.didCancel) {
                        if(this.state.lang.indexOf('ar') != -1 ){
                          alert('تم الغاء رفع الصورة');
                        }
                        else {
                         
                          alert('upload image cancel');
                        }
                      } else if (response.error) {
                        if(this.state.lang.indexOf('ar') != -1 ){
                          
                          alert("حدث خطأ ما");
                        }
                        else {
                          
                          alert("Opps !!");
                        }
                      } else if (response.customButton) {
                        if(this.state.lang.indexOf('ar') != -1 ){
                          
                          alert("حدث خطأ ما");
                        }
                        else {
                          
                          alert("Opps !!");
                        }
                      } else {
                        const source = { uri: response.uri };
                        const data = new FormData();
                        
                        data.append('name', 'testName'); // you can append anyone.
                        data.append('photo', {
                          uri: source.uri,
                          type: 'image/jpeg', // or photo.type
                          name: 'testPhotoName'
                        });
                      fetch('http://134.209.178.237/api/user/uploadFile', {
                        method: 'post',
                        body: data
                      }).then((res)=>{ 
                        return res.text() 
                      })
                      .then((text)=>{
                        this.setState({
                          nationalImg: text
                        });
                       
                        if(this.state.lang.indexOf('ar') != -1 ){
                          this.setState({flag:1});
                          alert("تم رفع الملف بنجاح");
                        }
                        else {
                          this.setState({flag:1});
                          alert("file added successfully ");
                        }
                        
                      });
                      }
                    });
                  }else{
                    if(this.state.lang.indexOf('ar') != -1 ){
                      this.setState({flag:1});
                      alert('عذرا لا يوجد أتصال بالانترنت' );
                    }
                    else {
                      this.setState({flag:1});
                      alert('Sorry No Internet Connection');
                    }
                  }
                })
               
              }

              uploadImg2=()=>{
                NetInfo.fetch().then(state => {
                  if(state.isConnected){
                    const options = {
                      title: this.state.lang.indexOf('ar') != -1?'أختار النوع': 'Select Avatar',
                      cancelButtonTitle:this.state.lang.indexOf('ar') != -1?'الغاء ': 'Cancel',
                      takePhotoButtonTitle:this.state.lang.indexOf('ar') != -1?'كاميرا ': 'Camera',
                      chooseFromLibraryButtonTitle:this.state.lang.indexOf('ar') != -1?'معرض الصور ': 'Gallery ',
                      storageOptions: {
                        skipBackup: true,
                        path: 'images',
                      },
                    };
                    ImagePicker.showImagePicker(options, (response) => {      
                      if (response.didCancel) {
                        if(this.state.lang.indexOf('ar') != -1 ){
                          alert('تم الغاء رفع الصورة');
                        }
                        else {
                         
                          alert('upload image cancel');
                        }
                      } else if (response.error) {
                        if(this.state.lang.indexOf('ar') != -1 ){
                          
                          alert("حدث خطأ ما");
                        }
                        else {
                          
                          alert("Opps !!");
                        }
                      } else if (response.customButton) {
                        if(this.state.lang.indexOf('ar') != -1 ){
                          
                          alert("حدث خطأ ما");
                        }
                        else {
                          
                          alert("Opps !!");
                        }
                      } else {
                        const source = { uri: response.uri };
                        const data = new FormData();
                       
                        data.append('name', 'testName'); // you can append anyone.
                        data.append('photo', {
                          uri: source.uri,
                          type: 'image/jpeg', // or photo.type
                          name: 'testPhotoName'
                        });
                      fetch('http://134.209.178.237/api/user/uploadFile', {
                        method: 'post',
                        body: data
                      }).then((res)=>{ 
                        return res.text() 
                      })
                      .then((text)=>{
                        this.setState({
                          licenceImg: text
                        });
                       
                        if(this.state.lang.indexOf('ar') != -1 ){
                          this.setState({flag:1});
                          alert("تم رفع الملف بنجاح");
                        }
                        else {
                          this.setState({flag:1});
                          alert("file added successfully ");
                        }
                        
                      });
                      }
                    });
                  }else{
                    if(this.state.lang.indexOf('ar') != -1 ){
                      this.setState({flag:1});
                      alert('عذرا لا يوجد أتصال بالانترنت' );
                    }
                    else {
                      this.setState({flag:1});
                      alert('Sorry No Internet Connection');
                    }
                  }
                })
                
              }

              updateUserData =async ()=>{
                this.setState({flag_lang : 0})
                var obj={
                  fullname:this.state.userName,
                  mobile: this.state.userMobile,
                  licenseWorkingNumber:this.state.licienceID,
                  countryID:this.state.countryID,
                  countryCode:this.state.codeID,
                  cityID:this.state.cityID,
                  email:this.state.userEmail,
                  birthday:this.state.dateBirth,
                  personalImg:this.state.userImg,
                  licenseWorkingImg:this.state.licenceImg,
                  nationalIdImg:this.state.nationalImg,
                }
                const errors =this.validate(obj);
                this.setState({errors});
                if(Object.keys(errors).length === 0){
                  fetch('http://134.209.178.237/api/user/user/'+this.state.userId, {
                    method: 'PUT',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body:  JSON.stringify(obj)
                })
                  
                  .then((response) => response.json())
                  .then((responseJson) => {
                    if (responseJson._id) {
                      AsyncStorage.removeItem('loginDataKayan');
                      AsyncStorage.setItem( 'loginDataKayan', JSON.stringify( responseJson ) );
                      if(this.state.lang.indexOf('ar') != -1 ){
                        this.setState({flag_lang:1})
                        alert("تم تعديل البيانات بنجاح");
                      }
                      else {
                        this.setState({flag_lang:1})
                        alert("your data uploaded successfully");
                      }
                // this.getUserData();
                    }
                    else{
                      if(this.state.lang.indexOf('ar') != -1 ){
                        this.setState({flag_lang:1});
                        alert("حدث خطأ ما");
                      }
                      else {
                        this.setState({flag_lang:1})
                        alert("Opps !!");
                      }
                    }
                  
                   
                  })
                  .catch((error) => {
                    // alert("error"+error);
                    if(this.state.lang.indexOf('ar') != -1 ){
                      this.setState({flag_lang:1})
                      alert("حدث خطأ ما");
    
                    }
                    else {
                      this.setState({flag_lang:1})
                      alert("Opps !!");
                    }
                  });
                } else{
               this.setState({flag_lang:1})
             }
                 
            }


            onSecureSave=()=>{
              this.setState({flag_lang : 0})
              NetInfo.fetch().then(state => {
                if(state.isConnected){
                  var obj={
                    password:this.state.newPass
  
                  };
               if(this.state.currentPass && this.state.newPass && this.state.repeatPass){
                  if(this.state.userPwd==this.state.currentPass){
                     if(this.state.newPass==this.state.repeatPass){
                       if(this.state.newPass >= 6){
                        fetch('http://134.209.178.237/api/user/user/'+this.state.userId, {
                          method: 'PUT',
                         headers: {
                        Accept: 'application/json',
                         'Content-Type': 'application/json',
                  },
                  body:  JSON.stringify(obj)
                })
                .then((response) => response.json())
                .then((responseJson) => {
                  if (responseJson._id) {
                    AsyncStorage.removeItem('loginDataKayan');
                    AsyncStorage.setItem( 'loginDataKayan', JSON.stringify( responseJson ) );
                    if(this.state.lang.indexOf('ar') != -1 ){
                      this.setState({flag_lang:1})
                      alert("تم تعديل الرقم السري بنجاح");
                      this.refs.modal.close()
                    }
                    else {
                      this.setState({flag_lang:1})
                      alert("your Password Updated successfully");
                      this.refs.modal.close()
                    }
              // this.getUserData();
                  }
                  else{
                    this.refs.modal.close()
                    if(this.state.lang.indexOf('ar') != -1 ){
                      this.setState({flag_lang:1});
                      alert("حدث خطأ ما");
                    }
                    else {
                      this.setState({flag_lang:1})
                      alert("Opps !!");
                    }
                  }
                })
                .catch((error) => {
                  this.refs.modal.close()
                    if(this.state.lang.indexOf('ar') != -1 ){
                  this.setState({flag_lang:1});
                  alert("حدث خطأ ما");
                }
                else {
                  this.setState({flag_lang:1})
                  alert("Opps !!");
                }
                });
                        
                      }else{
                        this.setState({flag_lang:1})
                        if(this.state.lang.indexOf('ar') != -1 ){
                          // this.setState({flag:1});
                          alert('  كلمة السر قصيرة');
                        }
                        else {
                          // this.setState({flag:1});
                          alert('password is very short ');
                        }
                      }
                      // alert('userId='+ this.state.userId);
                       
                     }else{
                      this.refs.modal.close()
                      if(this.state.lang.indexOf('ar') != -1 ){
                        this.setState({flag_lang:1});
                        alert('الرقم السري  غير متطابق' );
                      }
                      else {
                        this.setState({flag_lang:1})
                        alert("Passwords Not Match !!");
                      }
                     }
  
                  }else{
                    this.refs.modal.close()
                    if(this.state.lang.indexOf('ar') != -1 ){
                      this.setState({flag_lang:1});
                      alert('الرقم السري الحالي غير صحيح' );
                    }
                    else {
                      this.setState({flag_lang:1})
                      alert("Current Password Is Wrong");
                    }
                  }
                }else{   
                  
                  if(this.state.lang.indexOf('ar') != -1 ){
                    this.setState({flag_lang:1});
                    alert('   أدخل البيانات المطلوبه ' );
                  }
                  else {
                    this.setState({flag_lang:1})
                    alert("Enter All Data");
                  }
                }
                 }else{
                  this.refs.modal.close()
                   if(this.state.lang.indexOf('ar') != -1 ){
                     this.setState({flag_lang:1});
                     alert('عذرا لا يوجد أتصال بالانترنت' );
                    }
                    else {
                     this.setState({flag_lang:1})
                     alert("No Internet Connection");
                      }
                          }
                        })   
  
            }

            renderOption(){
              return(

                <View style={{width:'100%',height:'8%',alignItems:'center',justifyContent:'center',}}>
               {this.state.lang.indexOf('ar')!=-1?
                <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',backgroundColor:'#C8972C',elevation:8,shadowOpacity:0.3}}>
                <TouchableOpacity  onPress={() =>{
            this.props.navigation.goBack()
             }}
             style={{width:'13%',alignItems:'center',justifyContent:'center'}}>
            <Image resizeMode={'cover'} source={require('../img/w_arrow.png')} 
           style={{width:10 , height:20,alignItems:'center',}}/>
           </TouchableOpacity>
   
           <Text style={{textAlign:'center',width:'74%',fontSize:20,fontFamily:'segoe',color:"#fff", }}>
              {/* {strings("Profile.barTitle")} */}
              {this.state.lang.indexOf('ar')!=-1?'حسابي':'My profile'}
              </Text>
               
                <TouchableOpacity onPress={() =>{this.props.navigation.openDrawer() }}
                style={{width:'13%',alignItems:'center',justifyContent:'center'}}>
                <Image resizeMode={'cover'} source={require('../img/nav.png')}
                style={{width:25 , height:25,alignItems:'center',margin:3}} />
   
               </TouchableOpacity>
             </View>
               :
               <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row-reverse',backgroundColor:'#C8972C',elevation:8,shadowOpacity:0.3}}>
                   <TouchableOpacity  onPress={() =>{
               this.props.navigation.goBack()
                }}
                style={{width:'13%',alignItems:'center',justifyContent:'center'}}>
               <Image resizeMode={'cover'} source={require('../img/r_back.png')} 
              style={{width:10 , height:20,alignItems:'center',}}/>
              </TouchableOpacity>
      
              <Text style={{textAlign:'center',width:'74%',fontSize:20,fontFamily:'segoe',color:"#fff", }}>
                 {/* {strings("Profile.barTitle")} */}
                 {this.state.lang.indexOf('ar')!=-1?'حسابي':'My profile'}
                 </Text>
                  
                   <TouchableOpacity onPress={() =>{this.props.navigation.openDrawer() }}
                   style={{width:'13%',alignItems:'center',justifyContent:'center'}}>
                   <Image resizeMode={'cover'} source={require('../img/nav.png')}
                   style={{width:25 , height:25,alignItems:'center',margin:3}} />
      
                  </TouchableOpacity>
                </View>
              }
                </View>
              )
       }

    render(){
      
        return(
            <SafeAreaView style={{width: '100%', flex:1,alignItems:'center',}}>
              {this.renderOption()}
            {this.state.flag_lang == 0 ?
               <ActivityIndicator
               color='#C8972C'
               style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}/>
              :
               <ScrollView style={{width :'100%' , height:'100%' ,flex:1 , }}>
                <View style={{width:'100%', height:'100%',flex:1 ,alignItems:'center'}}>

                <View style={[styles.view,this.state.lang === 'ar'?styles.row:styles.row_res,{height:height*0.12}]}>
             
                <TouchableOpacity 
                 onPress={ ()=>{
                  this.refs.modal.open()
                  }}
                 style={[styles.shadow,{backgroundColor:'#F3F3F3',borderRadius:7,margin:5,height:30,}]}>
                 <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#4B4B4B',fontSize:14,fontFamily:'segoe',margin:'3%'}}>
                {this.state.lang.indexOf('ar') != -1 ?'  كلمه المرور' :' password'}
              </Text>
            </TouchableOpacity>
             <View style={{flex:1}}></View>

            {!this.state.userName ?
              <Text style={{color: '#FFFFFF', height:'100%',fontSize: 18, alignItems: 'center',fontFamily:"segoe",margin:'3%',textAlignVertical:'center' }}
              >اسم المستخدم</Text>
              :
              <Text style={{ color: '#FFFFFF', height:'100%',fontSize: 18,  alignItems: 'center',margin:'3%',fontFamily:"segoe",textAlignVertical:'center'}}> {this.state.userName}</Text>
            }
        
          </View>

          {!this.state.userImg ?
              <TouchableOpacity onPress={this.uploadImg}
              style={{alignItems:'center',justifyContent:'center',position:'absolute',top:height*0.05}}>
                <Image
                  style={{ width: 100, height: 100}}
                  source={require('../img/user.png')}></Image>
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={this.uploadImg}
              style={{alignItems:'center',justifyContent:'center',position:'absolute',top:height*0.05}}>
                <Image
                  style={{ width: 100, height: 100, borderRadius: 100 / 2}}
                  source={{ uri: this.state.userImg }}></Image>
              </TouchableOpacity>

            }

                <View style={{width:'97%', alignItems:'center' ,justifyContent:'center',marginTop:height*0.12,elevation:5,shadowOpacity:0.3,backgroundColor:'#F8F8F8'}}>
                <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'الأســم':'Name'}</Text>
                <TextInput  
                            placeholderTextColor='#DCDCDC'
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'الاسم بالكامل' :'FullName'} 
                            underlineColorAndroid="transparent"
                            defaultValue={this.state.userName}
                            onChangeText={(name) => this.setState({ userName:name  }) } 
                            style={[styles.shadow,this.state.lang==='ar'?styles.pRight:styles.pLeft,{width: '90%',height:height*0.07,borderRadius: 7,marginTop:10,color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput>
                 <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'رقم الجوال':'Mobile'}</Text>
                <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,styles.shadow,{ width: '90%',height:height*0.07,borderRadius: 7,marginTop:7,fontSize:14,alignItems:'center',justifyContent:'center'}]} >
               <View style={[{ width:'20%',height:'100%',alignItems:'center',flexDirection:'row',backgroundColor:'#F7F7F7',borderRadius:7}]}>
              <Icon name="angle-down" size={15} color="#707070" style={{margin:3}} />
               <View style={[{width: '90%',alignItems:'center'}]}>
               <ModalDropdown
                   options={this.state.con_codes} // data
                   defaultValue={this.state.codeID}
                   onSelect={(index, value) => { 
                     this.setState({ codeID: value.title }) 
                    }}
                   renderButtonText={(rowData) => (rowData.title)} // ba3d ma t5tar
                   style={{ width:'90%' }} // abl ma t5tar
                   textStyle={{  fontSize: 12, color: '#000' }}
                    dropdownStyle={{ width: 70, alignSelf: 'center', height: 200, borderColor: '#D7D7D7', borderWidth: 1, borderRadius: 3, }}
                   renderRow={function (rowData, rowID, highlighted) {
                    return (
                     <View style={[ { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 40, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                     <Text style={[{ fontSize: 12, color: '#000', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                      {rowData.title}
                       </Text>
                        </View>
                      );
                      }.bind(this)}
                      />
                  </View>
              </View>
              <TextInput  
                 placeholderTextColor='#DCDCDC'                  
                placeholder={this.state.lang.indexOf('ar') != -1 ?'رقم الموبايل ' :'Mobile'} 
                 defaultValue={this.state.userMobile}
                 underlineColorAndroid="transparent"
                 onChangeText={(mobile) => this.setState({ userMobile:mobile  }) } 
                 style={[this.state.lang==='ar'?styles.pRight:styles.pLeft,{width:'80%',height:'100%',color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                </TextInput> 
              </View>
                 <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'البريد الألكترونى':'Email'}</Text>

                          <TextInput  
                            placeholderTextColor='#DCDCDC'                  
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'الايميل ' :'ُEmail'} 
                            defaultValue={this.state.userEmail}
                            underlineColorAndroid="transparent"
                            onChangeText={(email) => this.setState({ userEmail:email  }) } 
                            style={[styles.shadow,this.state.lang==='ar'?styles.pRight:styles.pLeft,{width: '90%',height:height*0.07,borderRadius: 7,marginTop:7,color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput> 
                     <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                     {this.state.lang === 'ar'? 'تاريخ الميلاد':'Date of birth'}</Text>
              <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,styles.shadow,{ width: '90%',height:height*0.07 ,borderRadius: 7,marginTop:7,alignItems:'center',justifyContent:'center'}]} >
               {this.state.lang==='ar'?
               <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
                <DatePicker
                style={{
                  width:'100%', height: '100%',
                }}
                date={this.state.dateBirth}
                placeholder={this.state.lang.indexOf('ar') != -1 ? 'تاريخ الميلاد' : 'Birthday Date'}
                mode="date"
                format="YYYY-MM-DD"
                // minDate="2016-05-01"
                // maxDate="2016-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'relative',
                    display:'none',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                     borderWidth: 0, borderColor: '#707070', fontSize: 14,marginStart:'65%'
                  }
                }}
                onDateChange={(dateBirth) => { this.setState({ dateBirth }) }}
              />
              <Image 
              resizeMode='contain'
              source={require('../img/date.png')} style={{width: 27, height: 27,position:'absolute',left:5}}>
            </Image>
            </View>
               :
               <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
               <DatePicker
               style={{
                 width:'100%', height: '100%',
               }}
               date={this.state.dateBirth}
               placeholder={this.state.lang.indexOf('ar') != -1 ? 'تاريخ الميلاد' : 'Birthday Date'}
               mode="date"
               format="YYYY-MM-DD"
               // minDate="2016-05-01"
               // maxDate="2016-06-01"
               confirmBtnText="Confirm"
               cancelBtnText="Cancel"
               customStyles={{
                 dateIcon: {
                   position: 'relative',
                   display:'none',
                   left: 0,
                   top: 4,
                   marginLeft: 0
                 },
                 dateInput: {
                    borderWidth: 0, borderColor: '#707070', fontSize: 14,marginEnd:'65%'
                 }
               }}
               onDateChange={(dateBirth) => { this.setState({ dateBirth }) }}
             />
             <Image 
             resizeMode='contain'
             source={require('../img/date.png')} style={{width: 27, height: 27,position:'absolute',right:5}}>
           </Image>
           </View>
               }
             
              </View>
                         
            <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'الدوله / المدينه':'Country / City'}</Text>

              <View style={[this.state.lang ==='ar'?styles.row_res:styles.row,{ width: '93%',height: height*0.07,alignItems:'center',justifyContent:'center',marginTop:5}]}>
                 <View style={[styles.shadow,{flex:1,height:'100%',borderRadius: 7,margin:5}]} >
                  <Picker 
                  style={{width:'100%',alignItems:'center',justifyContent:'center'}} 
                  itemStyle={{backgroundColor:'#000',color: '#707070',fontSize:14}}

                     mode="dialog" selectedValue = {this.state.countryID?this.state.countryID:'1'} 
                   onValueChange = {(countryID) => 
                {
                  if(countryID !='1'){
                this.setState({ countryID:countryID })
                fetch('http://134.209.178.237/api/user/city?id='+countryID)
                .then((response) => response.json())
                .then((responseJson) => {
                   const cities = responseJson;
                   const citiesAr =[];
                   if(this.state.lang.indexOf('ar') != -1){
                   cities.forEach(element => {
                     citiesAr.push({
                       label:element.titleAr ,value:element._id,key:element._id
                     })
                   });

                  }else{
                    cities.forEach(element => {
                      citiesAr.push({
                        label:element.titleEN ,value:element._id,key:element._id
                      })
                    });
                  }
                  this.setState({ cities:citiesAr});
                })
                .catch((error) => {
                });
              }
              else{
                if(this.state.lang.indexOf('ar') != -1 ){
                  alert('يجب إختيار المدينة أولا');
                }
                else {
                  alert('You must select Country first');
                }
                this.setState({ countries :[]});
                this.setState({ cities :[]});
              }
              }}
               >
                       {this.state.countries.map((i, index) => (
               <Picker.Item  label = {i.label} value = {i.value} key={i.value} />
                       ))}
              </Picker>
              </View>
                 <View style={[styles.shadow,{flex:1,height:'100%' ,borderRadius: 7,margin:5}]}  >
              <Picker 
                  style={{width:'100%',alignItems:'center',justifyContent:'center'}} 
                  itemStyle={{backgroundColor:'#707070',fontSize:14,color:'#707070',}}
                  mode="dialog" selectedValue = {this.state.cityID?this.state.cityID:"1"} 
                  onValueChange = {(cityID) =>{
                    this.setState({ cityID })
                }}
              >
                       {this.state.cities.map((i, index) => (
               <Picker.Item
               label = {i.label} value = {i.value} key={i.value} />
                       ))}
              </Picker>
              </View>
              </View>
                 
              <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'تحميل صورة الهويه / الباسبور':'Upload ID photo / Passport '}</Text>
             <View style={[this.state.lang=== 'ar'?styles.row:styles.row_res,styles.shadow,{width:'90%',height:height*0.07,alignItems:'center',marginTop:7,borderRadius:7}]}>
             {!this.state.nationalImg ?
              <TouchableOpacity onPress={this.uploadImg1}
              style={{width: 30,height:30,margin:5,}}>
              <Image 
                 resizeMode='stretch'
                 source={require('../img/upload.png')} style={{width: '100%',height:'100%',}} >
              </Image>
              </TouchableOpacity>
             :
             <TouchableOpacity onPress={this.uploadImg1}
             style={{width: 30,height:30,margin:5,}}>
             <Image 
                resizeMode='stretch'
                source={{ uri: this.state.nationalImg }} style={{width: '100%',height:'100%',}} >
             </Image>
             </TouchableOpacity>
             }

            
                 <TouchableOpacity onPress={this.uploadImg1}
                 style={{flex:1}}>
                  <Text style={[this.state.lang==='ar'?styles.pRight:styles.pLeft,{width:'100%',color:'#DCDCDC',fontSize:14,fontFamily:'segoe'}]}>
                   {this.state.lang.indexOf('ar') != -1 ?'أختر ملـف ' :'Upload file'}
                  </Text>
                 </TouchableOpacity>
                </View>

             <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'رقم رخصه القيادة':'Driving license number'}</Text>
                <TextInput  
                            placeholderTextColor='#DCDCDC'                  
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'رقم رخصه القيادة ' :'Driving license number'} 
                            defaultValue={this.state.licienceID}
                            underlineColorAndroid="transparent"
                            onChangeText={(nationalId) => this.setState({ licienceID:nationalId  }) } 
                            style={[styles.shadow,this.state.lang==='ar'?styles.pRight:styles.pLeft,{width: '90%',height:height*0.07,borderRadius: 7,marginTop:7,color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput>  

                 <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'تحميل صورة الرخصه':'Upload license image'}</Text>
             <View style={[this.state.lang=== 'ar'?styles.row:styles.row_res,styles.shadow,{width:'90%',height:height*0.07,alignItems:'center',marginTop:7,borderRadius:7,marginBottom:10}]}>
             {!this.state.licenceImg ?
             <TouchableOpacity onPress={this.uploadImg2}
             style={{width: 30,height:30,margin:5,}}>
             <Image 
                resizeMode='stretch'
                source={require('../img/upload.png')} style={{width: '100%',height:'100%',}} >
             </Image>
             </TouchableOpacity>
             :
             <TouchableOpacity onPress={this.uploadImg2}
                 style={{width: 30,height:30,margin:5,}}>
                 <Image 
                    resizeMode='stretch'
                    source={{ uri: this.state.licenceImg }} style={{width: '100%',height:'100%',}} >
                 </Image>
                 </TouchableOpacity>
             }
             
                 <TouchableOpacity onPress={this.uploadImg2}
                 style={{flex:1}}>
                  <Text style={[this.state.lang==='ar'?styles.pRight:styles.pLeft,{width:'100%',color:'#DCDCDC',fontSize:14,fontFamily:'segoe'}]}>
                   {this.state.lang.indexOf('ar') != -1 ?'أختر ملـف ' :'Upload file'}
                  </Text>
                 </TouchableOpacity>
                </View>


                </View>
                <TouchableOpacity 
                 onPress={this.updateUserData.bind(this)}
                 style={{width: '80%',backgroundColor:'#4B4B4B', marginTop:15,borderRadius:7,borderColor:'#707070',borderWidth:1,marginBottom:'3%'}}>
                 <Text style={{width: '100%',height:height*0.07,textAlign:'center', textAlignVertical:'center',color:'#FFFFFF',fontSize:18,fontFamily:'segoe' }}>
                {this.state.lang.indexOf('ar') != -1 ?' حفـظ' :'Save'}
              </Text>
            </TouchableOpacity>

                </View>
               </ScrollView>
           }

<Modal style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                backgroundColor: 'transparent'
              }} 
            position={"center"} ref={"modal"} >
                
                <View style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor:'#FFFFFF',
                      borderRadius:10,
                      borderWidth:1,
                      borderColor:"#707070",
                      width: '80%'
                      
                  }} >
                  <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,{width:'95%',alignItems:'center'}]}>
                <TouchableOpacity
                 onPress={()=>{
                  this.refs.modal.close()
                 }}>
               <Icon name="close" size={20} color="#707070" style={{margin:5}} />
               </TouchableOpacity>
            </View>      
               <View style={{width: '80%',justifyContent:'center' ,alignItems:'center'}}>
                
                         <View style={{width:'90%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                           <View style={{flex: 1,height:2,backgroundColor:'#414141'}}></View>
                         <Text style={{textAlign:'center',fontSize:18,color:'#343434',fontFamily:'segoe',margin:5,}}>
                            {this.state.lang.indexOf('ar') != -1 ?' تعديل كلمه المرور ' :'Update password'}
                         </Text>
                         <View style={{flex: 1,height:2,backgroundColor:'#414141'}}></View>
                         </View>
                       
                          <TextInput  
                            placeholderTextColor='#000'
                            secureTextEntry
                            placeholder= {this.state.lang.indexOf('ar')!=-1?'كلمه المرور الحاليه':'Current password'} 
                            placeholderTextColor='#70707037'
                            underlineColorAndroid="transparent"
                            onChangeText={(currentPass) => this.setState({ currentPass  }) } 
                            style={[styles.shadow,{width: '90%',height:40,textAlign:'center' ,marginTop:7,color:'#000',justifyContent:'center' ,alignItems:'center',fontSize:14,borderRadius:10,fontFamily:'segoe'}]}>
                          </TextInput>
                          <TextInput  
                            placeholderTextColor='#000'  
                            secureTextEntry              
                            placeholder= {this.state.lang.indexOf('ar')!=-1?'كلمه المرور الجديده':'New password'} 
                            placeholderTextColor='#70707037'
                            underlineColorAndroid="transparent"
                            onChangeText={(newPass) => this.setState({ newPass  }) } 
                            style={[styles.shadow,{width: '90%',height:40,textAlign:'center' ,marginTop:7,color:'#000',justifyContent:'center' ,alignItems:'center',fontSize:14,borderRadius:10,fontFamily:'segoe'}]}>
                          </TextInput>
                          <TextInput  
                            placeholderTextColor='#000'  
                            secureTextEntry              
                            placeholder= {this.state.lang.indexOf('ar')!=-1?'تاكيد كلمه المرور':'Confirm password'}
                            placeholderTextColor='#70707037'
                            underlineColorAndroid="transparent"
                            onChangeText={(repeatPass) => this.setState({ repeatPass  }) } 
                            style={[styles.shadow,{width: '90%',height:40,textAlign:'center' ,marginTop:7,color:'#000',justifyContent:'center' ,alignItems:'center',fontSize:14,borderRadius:10,fontFamily:'segoe'}]}>
                          </TextInput>

                          <TouchableOpacity onPress={this.onSecureSave.bind(this)}
                          style={{width: '60%',height:35,borderRadius:10 , marginTop:'6%',marginBottom:"6%",backgroundColor:'#343434',justifyContent:'center'}}>
                          <Text style={{width: '100%',height:'100%',textAlign:'center',textAlignVertical:'center',
                           fontSize:16,color:'#FFFFFF',fontFamily:'segoe'}}>
                            {this.state.lang.indexOf('ar')!=-1?'حفـظ':'Save'}
                         </Text>
                </TouchableOpacity>
                </View>

                  
          </View>

            </Modal>
           </SafeAreaView>
        );
    }
}
export default MyProfileScreen;
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
    textAlign:'right',
  },
  left:{
    textAlign:'left',
  },
  pRight:{
    textAlign:'right',
    paddingRight:'5%'
  },
  pLeft:{
    textAlign:'left',
    paddingLeft:'5%'
  },
  view:{
    width:width ,
    height:height*0.1,
    backgroundColor:'#C8972C'
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
 maStart:{
   marginStart:'30%'
 },
 maEnd:{
   marginEnd:0
 },
 posLeft:{
  left:5
},
posRight:{
right:5
}
 
});