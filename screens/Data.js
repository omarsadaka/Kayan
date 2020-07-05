import React, { Component } from 'react';
import {
  Text, View, TouchableOpacity, StyleSheet, TextInput, Image, FlatList, Dimensions,
  ActivityIndicator, AsyncStorage, ScrollView, Alert, SafeAreaView
} from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
const { width, height } = Dimensions.get('window')
import NetInfo from "@react-native-community/netinfo";
import { Container, Header, Content, Picker, Form } from "native-base";
import DatePicker from 'react-native-datepicker'
import Modal from 'react-native-modal';
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalDropdown from 'react-native-modal-dropdown';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';



class Data extends Component{
    constructor(props) {
        super(props);
        this.state = {
          color1:'#D4D4D4',
          color2:'#D4D4D4',
          color3:'#D4D4D4',
          color4:'#D4D4D4',
          color5:'#D4D4D4',
          flag_lang: 0,
          companies:[],
          bills: [
            {
                label: 'كاش',
                value: 1,
            },
            {
                label: 'فيزا',
                value: 2,
            },
        ],  
        bills_En: [
          {
              label: 'Cash',
              value: 1,
          },
          {
              label: 'Vesa',
              value: 2,
          },
      ],  
        userId:'',
        isVisible1:false, 
        isVisible2:false,  
        checked:false,
        cities:[],
        carInfo:{},
        countries:[],
        track:1,
        con_code:'',
        con_codes:[],
        fullName:'',
        mobile:'',
        email:'',
        compID:'',
        flight_num:'',
        driverName:'',
        dateBirth:'',
        licenseNum:'',
        licenseImg:'',
        bill:'',
        companyName:'',
        address:'',
        city:'',
        countryID:'',
        Step1:{},
        step2:[],
        step3:{},

        }
      }
      componentDidMount() {
        this._retrieveData();
      }
      _retrieveData = async () => {
        const { navigation } = this.props;
        const track = navigation.getParam('track', 'NO-ID');
        if(track){
          this.setState({track})
        }

        const ownerId = navigation.getParam('ownerID', 'NO-ID');
        this.setState({ownerId})

        const lang = await AsyncStorage.getItem('lang');
        this.setState({ lang })
        const value = await AsyncStorage.getItem('loginDataKayan');
        if (value) {
          const data = JSON.parse(value);
          this.setState({ userData: data })
          this.setState({ userId: this.state.userData._id })
          this.getCountry();
          this.getCompanies()
          this.getCodes()
        } else {
          var data2 = {
            _id: '1',
            fullname: 'أسم المستخدم'
          }
          this.setState({ userData: data2 })
          this.getCountry();
          this.getCompanies()
          this.getCodes()
        }

        const step1 = await AsyncStorage.getItem('Step1');
        if (step1) {
          const info1 = JSON.parse(step1);
          this.setState({ step1: info1 })
        } else {
         alert('no step1 for car')
          
        }

        const step2 = await AsyncStorage.getItem('Step2');
        if (step2) {
          const info2 = JSON.parse(step2);
          this.setState({ step2: info2 })
        } else {
         alert('no step2 for car')
        }

        const step3 = await AsyncStorage.getItem('Step3');
        if (step3) {
          const info3 = JSON.parse(step3);
          this.setState({ step3: info3 })
        } else {
         alert('no step3 for car')
          
        }

        const carData = await AsyncStorage.getItem('CarInfo');
        if (carData) {
          const CarInfo = JSON.parse(carData);
          this.setState({ carInfo: CarInfo })
        } 
      }

      getCompanies(){
        NetInfo.fetch().then(state =>{
         if (state.isConnected){
           try {
             axios.get('http://134.209.178.237/api/user/getAirline').then(response => {
               this.setState({flag_lang:1})
               const data = response.data;
               const comp = []
               for (let index = 0; index < data.length; index++) {
                 if (this.state.lang.indexOf('ar') != -1) {
                   var obj = {
                     title:data[index].titleAr,
                     id:data[index]._id
                   }
                 } else {
                   var obj = {
                     title:data[index].titleEN,
                     id:data[index]._id
                   }
                 }
                 comp.push(obj)
               }
               this.setState({ companies: comp });
             }).catch(function (error) {
               this.setState({flag_lang:1})
                console.log(error);
             }).finally(function () {
                // always executed
             });
          } catch (error) {
             console.log(error);
          }
         } else {
           this.setState({flag_lang:1})
           if (this.state.lang === 'AR'){
             alert('لا يوجد أتصال بالانترنت');
           } else {
             alert('No internet connection');
           }
         }
       });
     }

      getCountry = () => {
        NetInfo.fetch().then(state => {
          if(state.isConnected)
          {
            fetch('http://134.209.178.237/api/user/country')
              .then((response) => response.json())
              .then((responseJson) => {
                const Data = responseJson;
                
                const country = []
                for (let index = 0; index < Data.length; index++) {
                  if (this.state.lang.indexOf('ar') != -1) {
                    var obj = {
                       title:Data[index].titleAr,
                       id:Data[index]._id
                    }
                  } else {
                    var obj = {
                      title:Data[index].titleEN,
                      id:Data[index]._id
                    }
                  }
                  country.push(obj)
                }
                this.setState({ countries: country });
    
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
       
      getCity = (id)=>{
        NetInfo.fetch().then(state => {
          if(state.isConnected)
          {
          fetch('http://134.209.178.237/api/user/city?id=' + id)
            .then((response) => response.json())
            .then((responseJson) => {
              const Data = responseJson;
              const city = []
              for (let index = 0; index < Data.length; index++) {
                if (this.state.lang.indexOf('ar') != -1) {
                  var obj = {
                    title:Data[index].titleAr,
                    id:Data[index]._id
                  }
                } else {
                  var obj = {
                    title:Data[index].titleEN,
                    id:Data[index]._id
                  }
                }
                city.push(obj)
              }
              this.setState({ cities: city });
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
            })
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

      validate = () => {
        // resumeeeee 
        const errors = {};
        if (!this.state.fullName) {
          if (this.state.lang.indexOf('ar') != -1) {
            this.setState({flag_lang:1});
            alert('يرجى ادخال اسم المستأجر');
          }
          else {
            this.setState({flag_lang:1});
            alert(' Choose Category First ');
          }
          errors.categoryID = "CategoryID is requied ";
        }
        else if (!this.state.mobile) {
          if (this.state.lang.indexOf('ar') != -1) {
            this.setState({flag_lang:1});
            alert('يرجي ادخال  رقم الموبايل ');
          }
          else {
            this.setState({flag_lang:1});
            alert('  Enter Car Type ');
          }
          errors.carTypeID = "typeID is requied ";
        }
        else if (!this.state.email) {
          if (this.state.lang.indexOf('ar') != -1) {
            this.setState({flag_lang:1});
            alert('يرجى ادخال البريد الالكترونى');
          }
          else {
            this.setState({flag_lang:1});
            alert('  Enter Car Model ');
          }
          errors.carModelID = "modeleID is requied ";
        }
        else if (!this.state.compID) {
          if (this.state.lang.indexOf('ar') != -1) {
            this.setState({flag_lang:1});
            alert('يرجى اختيار شركة الطيران');
          }
          else {
            this.setState({flag_lang:1});
            alert(' Plase  Enter   Start Date ');
          }
          errors.startDate = "startDate is requied ";
        }
        else if (!this.state.flight_num) {
          if (this.state.lang.indexOf('ar') != -1) {
            this.setState({flag_lang:1});
            alert('يرجي ادخال رقم الرحلة الجوية ');
          }
          else {
            this.setState({flag_lang:1});
            alert(' Plase Enter End Date ');
          }
          errors.endDate = "endDate is requied ";
        }
       
        else if (!this.state.driverName) {
          if (this.state.lang.indexOf('ar') != -1) {
            this.setState({flag_lang:1});
            alert('يرجي ادخال اسم السائق ');
          }
          else {
            this.setState({flag_lang:1});
            alert(' Plase Enter  the Price ');
          }
          errors.rentPrice = "rentPrice is requied ";
        }
        else if (!this.state.dateBirth) {
          if (this.state.lang.indexOf('ar') != -1) {
            this.setState({flag_lang:1});
            alert('يرجي ادخال تاريج الميلاد ');
          }
          else {
            this.setState({flag_lang:1});
            alert(' Plase Enter  the  Correct Price ');
          }
          errors.rentPrice = "rentPrice is requied ";
        }
        else if (!this.state.licenseNum) {
          if (this.state.lang.indexOf('ar') != -1) {
            this.setState({flag_lang:1});
            alert('يرجي ادخال رقم رخصة القيادة ');
          }
          else {
            this.setState({flag_lang:1});
            alert(' Plase Enter  the Price ');
          }
          errors.rentPrice = "rentPrice is requied ";
        }
        else if (!this.state.licenseImg) {
          if (this.state.lang.indexOf('ar') != -1) {
            this.setState({flag_lang:1});
            alert('يرجي اختيار صورة الرخصة');
          }
          else {
            this.setState({flag_lang:1});
            alert(' Plase Enter  the  Correct Price ');
          }
          errors.rentPrice = "rentPrice is requied ";
        }
        else if (!this.state.bill) {
          if (this.state.lang.indexOf('ar') != -1) {
            this.setState({flag_lang:1});
            alert('يرجي اختيار طريقة الدفع');
          }
          else {
            this.setState({flag_lang:1});
            alert(' Plase Enter  the  Correct Price ');
          }
          errors.rentPrice = "rentPrice is requied ";
        }
        else if (!this.state.checked) {
          if (this.state.lang.indexOf('ar') != -1) {
            this.setState({flag_lang:1});
            alert('يرجي الموافقه على الشروط والاحكام');
          }
          else {
            this.setState({flag_lang:1});
            alert(' Plase Enter  the  Correct Price ');
          }
          errors.rentPrice = "rentPrice is requied ";
        }
       
        return errors;
    
      }
       
      onAdd = async () => {
        this.setState({ flag_lang: 0 })
        const value = await AsyncStorage.getItem('loginDataKayan');
        if (value) {
          if (this.state.carInfo.ownerId == this.state.userId) {
            if (this.state.lang.indexOf('ar') != -1) {
              this.setState({ flag_lang: 1 });
              alert('هذة السيارة ملك لك لايمكنك حجزها')
            }
            else {
              this.setState({ flag_lang: 1 });
              alert('This Car Belongs to You You Cannot Reserve it')
    
            }
          } else {
              NetInfo.fetch().then(state => {
                if (state.isConnected) {
                  const errors = this.validate();
                  this.setState({ errors });
                  if (Object.keys(errors).length === 0) {
                    axios.post("http://134.209.178.237/api/user/reservation",{
                      userID:this.state.userId,
                      ownerID:this.state.ownerID,
                      receivedDate: this.state.step1.startDate,
                      deliveryDate: this.state.step1.endDate,
                      receivedTimeH: this.state.step1.startTimeH,
                      receivedTimeM: this.state.step1.startTimeM,
                      deliveryTimeH: this.state.step1.endTimeH,
                      deliveryTimeM: this.state.step1.endTimeM,
                      receivingLocation: this.state.step1.receving,
                      deliveryLocation: this.state.step1.delivering,
                      carID: this.state.step1.carID,
                      insurance: this.state.step3.insurance,
                      amount: this.state.step3.amount,
                      amountPaid: this.state.step3.amountPaid,
                      renterName: this.state.fullName,
                      renterMobile: this.state.mobile,
                      countryCode:this.state.con_code,
                      renterEmail: this.state.email,
                      airlineID: this.state.compID,
                      flightNumber: this.state.flight_num,
                      driverName: this.state.driverName,
                      birthday: this.state.dateBirth,
                      DrivingLicenseNumber: this.state.licenseNum,
                      DrivingLicenseImg: this.state.licenseImg,
                      paymentMethod: this.state.bill,
                      addition: this.state.step2,
                      companyName: this.state.companyName,
                      address: this.state.address,
                      countryID: this.state.countryID,
                      cityID:this.state.cityID
                   
                    }).then((responseJson) => {
                        if (responseJson.data._id) {
                          this.setState({ flag_lang: 1 });
                          AsyncStorage.removeItem('Step1');
                          AsyncStorage.removeItem('Step2');
                          AsyncStorage.removeItem('Step3');
                          this.setState({isVisible2:true})
                          this.setState({fullName:''})
                          this.setState({mobile:''})
                          this.setState({email:''})
                          this.setState({flight_num:''})
                          this.setState({driverName:''})
                          this.setState({dateBirth:''})
                          this.setState({licenseNum:''})
                          this.setState({address:''})
                          this.setState({companyName:''})

                        }
                        else {
                          if (this.state.lang.indexOf('ar') != -1) {
                            this.setState({ flag_lang: 1 });
                            alert("حدث خطأ ما");
                          }
                          else {
                            this.setState({ flag_lang: 1 });
                            alert("Opps !!");
                          }
                        }
                      })
                      .catch((error) => {
                        console.error(error);
                        alert('error' + error);
                        this.setState({ flag_lang: 1 })
                      });
                  }
                  else {
                    this.setState({ flag_lang: 1 });
                  }
                } else {
                  if (this.state.lang.indexOf('ar') != -1) {
                    this.setState({ flag_lang: 1 });
                    alert('لايوجد اتصال بالانترنت');
                  }
                  else {
                    this.setState({ flag_lang: 1 });
                    alert('No Internet Connection ');
                  }
                }
              })
            }
        } else {
          this.setState({ flag_lang: 1 });
          Alert.alert(
            this.state.lang.indexOf('ar') != -1 ? 'كايان' : 'Kayan',
            this.state.lang.indexOf('ar') != -1 ? 'يجب تسجيل الدخول أولا' : 'you Must Login First',
    
            [
              {
                text: this.state.lang.indexOf('ar') != -1 ? 'إلغاء' : 'Cancel'
                , onPress: () => this.dismiss, style: 'cancel'
              },
              {
                text: this.state.lang.indexOf('ar') != -1 ? ' تسجيل الدخول' : 'login Now', onPress: () => {
                  try {
                    const { navigation } = this.props;
                    navigation.push('Login');
    
    
                  } catch (e) { }
                }
    
              },
            ],
            { cancelable: true }
    
          )
          return true;
        }
    
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
                  licenseImg: text
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
      renderOption() {
        return (
          <View style={{width: width, height: '8%', alignItems: 'center', justifyContent: 'center',}}>
              <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:'100%',height:'100%',alignItems:'center',justifyContent:'space-between', 
              backgroundColor:'#C8972C',}]}>

             {this.state.lang ==='ar'?
                 <TouchableOpacity  onPress={() =>{
                    this.props.navigation.goBack()
                  }}
                 style={{width:'13%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <Image resizeMode={'cover'} source={require('../img/w_arrow.png')} 
                 style={{width:10 , height:18,alignItems:'center',}}/>
               </TouchableOpacity>
                :
                <TouchableOpacity  onPress={() =>{
                    this.props.navigation.goBack()
                  }}
                 style={{width:'13%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <Image resizeMode={'cover'} source={require('../img/r_back.png')} 
                 style={{width:10 , height:18,alignItems:'center',}}/>
               </TouchableOpacity>
                }
             <Text style={{ textAlign: 'center',width:'74%', fontSize: 20,fontFamily:'segoe', color: "#fff",   }}>
                  {this.state.lang ==='ar' ? 'البيانات' : 'Data'}
                </Text>
                <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}
                  style={{ width:'13%',height:'100%',alignItems:'center',justifyContent:'center' }}>
                  <Image resizeMode={'contain'} source={require('../img/nav.png')}
                    style={{ width: 25, height: 25, alignItems: 'center', margin:3}} />
                </TouchableOpacity>

              </View>
              
          </View>
        )
      }
    render(){
        return(
        <SafeAreaView style={{ width: width,  alignItems: 'center',flex:1 }}>
            {this.renderOption()}
            <View style={{ width: width,flex: 1,alignItems: 'center' }}>
              {this.state.flag_lang == 0 ?
                <ActivityIndicator
                color='#C8972C'
                  style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }} />
                :
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={{ width: width,alignItems:'center',}}>
               {this.state.track ===1?
                <View style={{width:width,alignItems:'center',justifyContent:'center',marginTop:20,marginBottom:10}}>
                {/* <View style={{width:'90%',height:2,backgroundColor:'#F5F5F5'}}></View> */}
                <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:'80%',alignItems:'center',justifyContent:'center',}]}>
                <Image resizeMode={'cover'} source={require('../img/point.png')}
                style={{ width:20, height: 20, alignItems: 'center' }} />
                <View style={{flex:1,height:2,backgroundColor:'#F5F5F5'}}></View>
                <Image resizeMode={'cover'} source={require('../img/point.png')}
                style={{ width:20, height: 20, alignItems: 'center' }} />
                <View style={{flex:1,height:2,backgroundColor:'#F5F5F5'}}></View>
                <Image resizeMode={'cover'} source={require('../img/point.png')}
                style={{ width:20, height: 20, alignItems: 'center' }} />
                </View>
                </View>
               :
               <View style={{width:width,alignItems:'center',justifyContent:'center',marginTop:20,marginBottom:10}}>
               {/* <View style={{width:'90%',height:2,backgroundColor:'#F5F5F5'}}></View> */}
               <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:'80%',alignItems:'center',justifyContent:'center',}]}>
               <Image resizeMode={'cover'} source={require('../img/point.png')}
               style={{ width:20, height: 20, alignItems: 'center' }} />
               <View style={{flex:1,height:2,backgroundColor:'#F5F5F5'}}></View>
               <Image resizeMode={'cover'} source={require('../img/point.png')}
               style={{ width:20, height: 20, alignItems: 'center' }} />
               <View style={{flex:1,height:2,backgroundColor:'#F5F5F5'}}></View>
               <Image resizeMode={'cover'} source={require('../img/point.png')}
               style={{ width:20, height: 20, alignItems: 'center' }} />
               <View style={{flex:1,height:2,backgroundColor:'#F5F5F5'}}></View>
               <Image resizeMode={'cover'} source={require('../img/point.png')}
               style={{ width:20, height: 20, alignItems: 'center' }} />
               <View style={{flex:1,height:2,backgroundColor:'#F5F5F5'}}></View>
               <Image resizeMode={'cover'} source={require('../img/point.png')}
               style={{ width:20, height: 20, alignItems: 'center' }} />
               </View>
               </View>
               }
               
                <View style={{width:'95%',flexDirection:'row',marginTop:10,justifyContent:'center',alignItems:'center'}}>
                <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'center'}}></View>
                <Text style={{width:'40%',textAlign:'center',fontSize:22,color:'#969696',fontFamily:'segoe', }}> 
                {this.state.lang === 'ar'?'بيانات المستأجر':'Tenant data'}
                </Text>
               <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'center'}}></View>
               </View>

                <View style={[{width:'95%',marginTop:5,backgroundColor:'#F8F8F8',alignItems:'center',justifyContent:'center',elevation:1,shadowOpacity:0.2}]}>
               <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                {this.state.lang === 'ar'? 'الأســم':'Name'}</Text>
                <TextInput  
                            placeholderTextColor='#D4D4D4'
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'الاسم بالكامل' :'FullName'} 
                            underlineColorAndroid="transparent"
                            defaultValue={this.state.fullName}
                            onChangeText={(fullName) => this.setState({ fullName  }) } 
                            style={[styles.shadow,this.state.lang==='ar'?styles.pRight:styles.pLeft,{width: '90%',height:height*0.07,borderRadius: 7,marginTop:10,color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput>
                 <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'رقم الجوال':'Mobile'}</Text>
                         
                <View style={[styles.shadow,this.state.lang==='ar'?styles.row:styles.row_res,{width: '90%',height:height*0.07,borderRadius: 7,marginTop:7,color:'#000',fontSize:14,fontFamily:'segoe'}]} >
               <View style={[{width:'20%',height:'100%',alignItems:'center',flexDirection:'row',backgroundColor:'#F7F7F7',borderRadius:7}]}>
              <Icon name="angle-down" size={15} color="#707070" style={{margin:5}} />
               <View style={[{width:'95%'}]}>
               <ModalDropdown
                   options={this.state.con_codes} // data
                   defaultValue='000'
                   onSelect={(index, value) => { 
                     this.setState({ con_code: value.title,color1:'#000' }) 
                    }}
                   renderButtonText={(rowData) => (rowData.title)} // ba3d ma t5tar
                   style={{ width:'100%' }} // abl ma t5tar
                   textStyle={{  fontSize: 12, color: this.state.color1 }}
                    dropdownStyle={{ width: 70, alignSelf: 'center', height: 200, borderColor: '#D7D7D7', borderWidth: 1, borderRadius: 3, }}
                   renderRow={function (rowData, rowID, highlighted) {
                    return (
                     <View style={[ { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 40, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                     <Text style={[{ fontSize: 12, color: '#000', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                      {/* {this.state.lang==='ar'?rowData.titleAr:rowData.titleEN} */}
                      {rowData.title}
                       </Text>
                        </View>
                      );
                      }.bind(this)}
                      />
                  </View>
              </View>
               <TextInput  
                            placeholderTextColor='#D4D4D4'                  
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'رقم الموبايل ' :'Mobile'} 
                            defaultValue={this.state.mobile}
                            keyboardType='numeric'
                            underlineColorAndroid="transparent"
                            onChangeText={(mobile) => this.setState({ mobile  }) } 
                            style={[this.state.lang==='ar'?styles.pRight:styles.pLeft,,{ width: '80%', height: '100%', color: '#000', fontSize: 14,fontFamily:"segoe" }]}>
                          </TextInput>    
              </View>
                 <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'البريد الألكترونى':'Email'}</Text>

                          <TextInput  
                            placeholderTextColor='#D4D4D4'                  
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'البريد الألكترونى ' :'ُEmail'} 
                            defaultValue={this.state.email}
                            underlineColorAndroid="transparent"
                            onChangeText={(email) => this.setState({email}) } 
                            style={[styles.shadow,this.state.lang==='ar'?styles.pRight:styles.pLeft,{width: '90%',height:height*0.07,borderRadius: 7,marginTop:7,color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput> 
               <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
               {this.state.lang === 'ar'? 'شركه الطيران':'Airline'}</Text>
              
               <View style={[this.state.lang==='ar'?styles.row:styles.row_res,styles.shadow,{ width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:7,color:'#000',fontSize:14}]}>
              <Icon name="caret-down" size={18} color="#707070" style={{margin:10}} />
               <View style={{flex:1,alignItems:'center',justifyContent:'center'}}  >
               <ModalDropdown
                   options={this.state.companies} // data
                   defaultValue={this.state.lang === 'ar'? 'أختر شركة الطيران':'Choose airline'}
                   onSelect={(index, value) => { 
                     this.setState({ compID: value.id,color2:'#000'}) 
                    }}
                   renderButtonText={(rowData) => (rowData.title)} // ba3d ma t5tar
                   style={{ width:'100%' }} // abl ma t5tar
                   textStyle={{  fontSize: 14, color: this.state.color2,fontFamily:'segoe',paddingHorizontal:10}}
                    dropdownStyle={{ width: 150, alignSelf: 'center', height: 200, borderColor: '#D7D7D7', borderWidth: 1, borderRadius: 3, }}
                   renderRow={function (rowData, rowID, highlighted) {
                    return (
                     <View style={[ { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 40, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                     <Text style={[{ fontSize: 14, color: '#000', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                      {/* {this.state.lang==='ar'?rowData.titleAr:rowData.titleEN} */}
                      {rowData.title}
                       </Text>
                        </View>
                      );
                      }.bind(this)}
                      />
              </View>
              </View>
                <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? ' رقم الرحله الجويه':' Flight number'}</Text>
                         
              <View style={[this.state.lang==='ar'?styles.row:styles.row_res,styles.shadow,{ width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:7,color:'#000',fontSize:14,marginBottom:15}]}>
              {/* <Icon name="caret-down" size={18} color="#707070" style={{margin:10}} /> */}
               <TextInput  
                            placeholderTextColor='#D4D4D4'                  
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'أكتب رقم الرحله ' :'Enter flight number'} 
                            defaultValue={this.state.flight_num}
                            underlineColorAndroid="transparent"
                            onChangeText={(flight_num) => this.setState({ flight_num  }) } 
                            style={[this.state.lang==='ar'?styles.pRight:styles.pLeft,{width: '100%',color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput>          
              </View>            

              
          </View>
               
                <View style={{width:'95%',flexDirection:'row',marginTop:10,justifyContent:'center',alignItems:'center'}}>
                <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'center'}}></View>
                <Text style={{width:'40%',textAlign:'center',fontSize:22,color:'#969696',fontFamily:'segoe', }}> 
                {this.state.lang === 'ar'?'بيانات السائق':'Driver data'}
                </Text>
                <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'center'}}></View>
               </View>
 
                <View style={{width:'95%',marginTop:5,backgroundColor:'#F8F8F8',alignItems:'center',justifyContent:'center',elevation:1,shadowOpacity:0.2}}>
               <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                {this.state.lang === 'ar'? 'أسم السائق':' Driver name'}</Text>
                <TextInput  
                            placeholderTextColor='#D4D4D4'
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'الاسم بالكامل' :'FullName'} 
                            underlineColorAndroid="transparent"
                            defaultValue={this.state.driverName}
                            onChangeText={(driverName) => this.setState({ driverName  }) } 
                            style={[styles.shadow,this.state.lang==='ar'?styles.pRight:styles.pLeft,{width: '90%',height:height*0.07,borderRadius: 7,marginTop:10,color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput>
                 
                    <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                     {this.state.lang === 'ar'? 'تاريخ الميلاد':'Date of birth'}</Text>
                   
              <View style={[styles.shadow,{width: '90%',height:height*0.07,borderRadius: 7,marginTop:7,alignItems:'center',justifyContent:'center'}]} >
               {this.state.lang==='ar'?
               <DatePicker
               style={{
                 width:'100%', height: '100%',}}
               date={this.state.dateBirth}
               placeholder={this.state.lang.indexOf('ar') != -1 ? 'أختر تاريخ الميلاد' : ' Birthday Date'}
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
                 },
                 dateInput: {
                    borderWidth: 0, fontSize: 14,marginStart:'65%'
                 }
                 
               }}
               onDateChange={(dateBirth) => { this.setState({ dateBirth }) }}
             />
               :
               <DatePicker
                style={{
                  width:'100%', height: '100%',}}
                date={this.state.dateBirth}
                placeholder={this.state.lang.indexOf('ar') != -1 ? 'أختر تاريخ الميلاد' : ' Birthday Date'}
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
                  },
                  dateInput: {
                     borderWidth: 0, fontSize: 14,marginEnd:'65%'
                  }
                  
                }}
                onDateChange={(dateBirth) => { this.setState({ dateBirth }) }}
              />
               }
              
                <Image 
                resizeMode='contain'
                source={require('../img/date.png')} style={[this.state.lang ==='ar'?styles.posLeft:styles.posRight,{width: 27, height: 27,position:'absolute'}]}>
              </Image>
              </View>
              
                <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? ' رقم رخصه القياده':'License number'}</Text>
                          <TextInput  
                            placeholderTextColor='#D4D4D4'                  
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'رقم رخصه القياده ' :'License number'} 
                            defaultValue={this.state.licenseNum}
                            keyboardType='numeric'
                            underlineColorAndroid="transparent"
                            onChangeText={(licenseNum) => this.setState({ licenseNum  }) } 
                            style={[styles.shadow,this.state.lang==='ar'?styles.pRight:styles.pLeft,{width: '90%',height:height*0.07,borderRadius: 7,marginTop:7,color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput>     

              <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
              {this.state.lang === 'ar'? 'تحميل صورة الرخصه  ':'Upload the license image '}</Text>
             <View style={[this.state.lang=== 'ar'?styles.row:styles.row_res,styles.shadow,{width:'90%',height:height*0.07,alignItems:'center',marginTop:7,borderRadius:7,marginBottom:15}]}>
             {/* <TouchableOpacity 
              onPress={this.uploadImg}
                 style={{width: 30,height:30,margin:5,}}>
                 <Image 
                    resizeMode='stretch'
                    source={require('../img/upload.png')} style={{width: '100%',height:'100%',}} >
                 </Image>
                 </TouchableOpacity> */}

                  {!this.state.licenseImg ?
              <TouchableOpacity onPress={this.uploadImg}
              style={{width: 30,height:30,margin:5,}}>
              <Image 
                 resizeMode='stretch'
                 source={require('../img/upload.png')} style={{width: '100%',height:'100%',}} >
              </Image>
              </TouchableOpacity>
             :
             <TouchableOpacity onPress={this.uploadImg}
             style={{width: 30,height:30,margin:5,}}>
             <Image 
                resizeMode='stretch'
                source={{ uri: this.state.licenseImg }} style={{width: '100%',height:'100%',}} >
             </Image>
             </TouchableOpacity>
             }
              <TouchableOpacity
                  onPress={this.uploadImg}
                 style={{flex:1}}>
                  <Text style={[this.state.lang==='ar'?styles.pRight:styles.pLeft,{width:'100%',color:'#DCDCDC',fontSize:14,fontFamily:'segoe'}]}>
                   {this.state.lang.indexOf('ar') != -1 ?'أختر ملـف ' :'Upload file'}
                  </Text>
                 </TouchableOpacity>
                </View> 
              
          </View>

                <View style={{width:'90%',flexDirection:'row',marginTop:'5%',justifyContent:'center',alignItems:'center'}}>
                <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-start'}}></View>
                <Text style={{width:'40%',textAlign:'center',fontSize:16,color:'#4B4B4B',fontFamily:'segoe' }}> 
                {this.state.lang === 'ar' ? 'طريقه الدفع والسداد' : 'Payment method'}
               </Text>
               <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-end'}}></View>
            </View>
          
                <View style={[styles.shadow,{width:'95%',color: '#707070',marginTop:5,backgroundColor:'#F8F8F8',alignItems:'center',justifyContent:'center'}]}>    
                <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'أختر طريقه الدفع':'Choose your payment method'}</Text>

             <View style={[this.state.lang==='ar'?styles.row:styles.row_res,styles.shadow,{width: '90%',height:height*0.07,borderRadius: 7,marginTop:7,color:'#000',marginBottom:15,alignItems:'center',justifyContent:'center'}]}>
              <Icon name="caret-down" size={18} color="#707070" style={{margin:10}} />
               <View style={{flex:1}}  >
               <ModalDropdown
                   options={this.state.lang === 'ar'? this.state.bills :this.state.bills_En} // data
                   defaultValue={this.state.lang === 'ar'? 'أختر ':'Choose'}
                   onSelect={(index, value) => { 
                     this.setState({ bill: value.value,color3:'#000' }) 
                    }}
                   renderButtonText={(rowData) => (rowData.label)} // ba3d ma t5tar
                   style={{ width:'100%' }} // abl ma t5tar
                   textStyle={{  fontSize: 14, color: this.state.color3,fontFamily:'segoe',paddingHorizontal:10}}
                    dropdownStyle={{ width: 150, alignSelf: 'center', height: 100, borderColor: '#D7D7D7', borderWidth: 1, borderRadius: 3, }}
                   renderRow={function (rowData, rowID, highlighted) {
                    return (
                     <View style={[ { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 40, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                     <Text style={[{ fontSize: 14, color: '#000', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                      {/* {this.state.lang==='ar'?rowData.titleAr:rowData.titleEN} */}
                      {rowData.label}
                       </Text>
                        </View>
                      );
                      }.bind(this)}
                      />
               </View>  
             </View>

           </View>

           <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res, { width: '90%', alignItems: 'center', marginTop: 15, justifyContent: 'center' }]}>
           <TouchableOpacity
           style={{flex: 1,}}
           onPress={()=>{
            this.setState({isVisible1:true})
           }}>
          <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{color:'#C8972C',fontSize: 14,margin: 3}]}>{this.state.lang === 'ar' ? 'أضغط هنـا' : 'Click here'}</Text>
          </TouchableOpacity>
          <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{color: '#707070', fontSize: 14,margin: 3 }]}>{this.state.lang === 'ar' ? 'هل تريد فاتورة؟' : 'Do you want an invoice?'}</Text>
          <Image source={require('../img/ques.png')}
            style={{ width: 20, height: 20, margin: 3 }} resizeMode="contain" />
         </View>

         <View style={[this.state.lang === "ar"?styles.row_res:styles.row,{marginTop:10,width:'60%',alignItems:'center',justifyContent:'center'}]}>
                <CheckBox
                  checkedIcon={<Image style={{width:30,height:30,}} source={require('../img/checked.png')} />}
                  uncheckedIcon={<Image style={{width:30,height:30,}} source={require('../img/unchecked.png')} />}
                checked={this.state.checked}
                onPress={() =>{
                   this.setState({checked: !this.state.checked});
                  }}
                 />
                   <Text style={{color:'#707070',textAlign:'center',fontSize:14,fontFamily:'segoe',}}>
                       {this.state.lang==="ar"?'موافق على الشروط والاحكام':'Accept terms and condition'}</Text>
                </View>

            <TouchableOpacity
                onPress={this.onAdd.bind(this)}
            style={{ width: '65%', backgroundColor: '#4B4B4B',justifyContent: 'center',borderRadius: 8, alignItems: 'center',marginTop:5,marginBottom:10 }}>
            <Text style={{ width: '100%',height: height*0.07,textAlign:'center',alignItems:'center',color:'#FFFFFF', fontSize:18,fontFamily:'segoe', padding: 5, textAlignVertical: 'center',   }}>
            {this.state.lang.indexOf('ar') != -1 ? 'تأكيد الحجـز' : 'Confirm reservation'}
            </Text>
            </TouchableOpacity>
          <Modal
             isVisible={this.state.isVisible1}
             onBackdropPress={() => this.setState({ isVisible1: false })}
             swipeDirection="left"
             >
          <View style={[styles.modal,{}]}>
             <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,{width:'100%',alignItems:'center'}]}>
                <TouchableOpacity
                 onPress={()=>this.setState({isVisible1:false})}>
               <Icon name="close" size={18} color="#707070" style={{margin:10}} />
               </TouchableOpacity>
            </View>
            <View style={{width:'95%',flexDirection:'row',marginTop:5,justifyContent:'center',alignItems:'center'}}>
                <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'center'}}></View>
                <Text style={{width:'40%',textAlign:'center',fontSize:16,color:'#414141',fontFamily:'segoe', }}> 
                {this.state.lang === 'ar'?'تفاصيل الفاتورة':'Invoice details'}
                </Text>
               <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'center'}}></View>
               </View>
               <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 16,fontFamily:"segoe",marginTop:10}]}>
                {this.state.lang === 'ar'? 'أسم الشركه':'Company name'}</Text>
                <TextInput  
                            placeholderTextColor='#D4D4D4'
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'أكتب الاسم كامل' :' Enter FullName'} 
                            underlineColorAndroid="transparent"
                            defaultValue={this.state.companyName}
                            onChangeText={(companyName) => this.setState({ companyName  }) } 
                            style={[this.state.lang==='ar'?styles.pRight:styles.pLeft,{width:'90%',height:height*0.07,borderRadius: 7,borderColor:'#F6F6F6',borderWidth:2,marginTop:7,color:'#000',fontSize:14,fontFamily:'segoe',backgroundColor:'#FCFCFC'}]}>
                          </TextInput>
                 <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 16,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'العنوان':'Address'}</Text>
                          <TextInput  
                            placeholderTextColor='#D4D4D4'                  
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'العنوان ' :'Address'} 
                            defaultValue={this.state.address}
                            underlineColorAndroid="transparent"
                            onChangeText={(address) => this.setState({ address  }) } 
                            style={[this.state.lang==='ar'?styles.pRight:styles.pLeft,{width:'90%',height:height*0.07,borderRadius: 7,borderColor:'#F6F6F6',borderWidth:2,marginTop:7,color:'#000',fontSize:14,fontFamily:'segoe',backgroundColor:'#FCFCFC'}]}>
                          </TextInput>   
                <View style={{width:'90%',flexDirection:'row',marginTop:5,justifyContent:'center',alignItems:'center'}}>
                <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{flex:1,fontSize:16,color:'#8F8B8B',fontFamily:'segoe', }]}> 
                {this.state.lang === 'ar'?'المدينه':'City'}
                </Text>
                <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{flex:1,fontSize:16,color:'#8F8B8B',fontFamily:'segoe', }]}> 
                {this.state.lang === 'ar'?'الدوله':'Country'}
                </Text>
               </View>

               <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{ width: '92%',height: height*0.07,alignItems:'center',justifyContent:'center',marginTop:5,marginBottom:15}]}>
               <View style={[styles.viewRow,{margin:3 }]}>
              <Icon name="caret-down" size={18} color="#707070" style={[this.state.lang==='ar'?styles.posLeft:styles.posRight,{position:'absolute'}]} />
                   <View style={[{width:'100%',alignItems:'center'}]} >
                   <ModalDropdown
                   // Data => Array
                   options={this.state.cities}// data
                   // Default Value => Before Selection
                   defaultValue={this.state.lang=='ar'?'أختر المدينة':'City'}
                   // Selection Process
                   onSelect={(index, value) => { 
                     this.setState({ cityID: value.id,color4:'#000' }) 
                    }}
                   // Value After Selection
                  
                   renderButtonText={(rowData) => (rowData.title)}  // ba3d ma t5tar
                   // Styling
                   style={{ width:'100%' }} // abl ma t5tar
                   textStyle={{ textAlign: 'center', fontSize: 14, color: this.state.color4,fontFamily:'segoe' }}
                   dropdownStyle={{ width: 150, alignSelf: 'center', height: 200, borderColor: '#D7D7D7', borderWidth: 1, borderRadius: 3, }}
                   renderRow={function (rowData, rowID, highlighted) {
                    return (
                     <View style={[ { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 40, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                     <Text style={[{ fontSize: 14, color: '#000', textAlign: 'center',fontFamily:'segoe' }, highlighted && { color: '#000' }]}>
                      {rowData.title}
                       </Text>
                        </View>
                      );
                      }.bind(this)}
                      />
              </View>
              </View>
              <View style={[styles.viewRow,{ margin:3}]}>
              <Icon name="caret-down" size={18} color="#707070" style={[this.state.lang==='ar'?styles.posLeft:styles.posRight,{position:'absolute'}]} />
                <View style={[{width:'100%',alignItems:'center'}]}  >
                <ModalDropdown
                   options={this.state.countries} // data
                   defaultValue={this.state.lang=='ar'?'أختر الدولة':'Country'}
                   onSelect={(index, value) => { 
                     this.setState({ countryID: value.id , color5:'#000' }) 
                     this.getCity(value.id)
                    }}
                   renderButtonText={(rowData) => (rowData.title)} // ba3d ma t5tar
                   style={{ width:'100%' }} // abl ma t5tar
                   textStyle={{ textAlign: 'center', fontSize: 14, color:this.state.color5,fontFamily:'segoe' }}
                    dropdownStyle={{ width: 150, alignSelf: 'center', height: 200, borderColor: '#D7D7D7', borderWidth: 1, borderRadius: 3, }}
                   renderRow={function (rowData, rowID, highlighted) {
                    return (
                     <View style={[ { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 40, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                     <Text style={[{ fontSize: 14, color: '#000', textAlign: 'center',fontFamily:'segoe' }, highlighted && { color: '#000' }]}>
                      {/* {this.state.lang==='ar'?rowData.titleAr:rowData.titleEN} */}
                      {rowData.title}
                       </Text>
                        </View>
                      );
                      }.bind(this)}
                      />
              </View>
              </View>
              </View>    
              <TouchableOpacity
                onPress={() => {
                this.setState({isVisible1:false})
                }}
            style={{ width: '40%', backgroundColor: '#4B4B4B',justifyContent: 'center',borderRadius: 8, alignItems: 'center',marginTop:10,marginBottom:10 }}>
            <Text style={{ width: '100%',height: height*0.07,textAlign:'center',alignItems:'center',color:'#FFFFFF', fontSize:20,fontFamily:'segoe', padding: 5, textAlignVertical: 'center',   }}>
            {this.state.lang.indexOf('ar') != -1 ? 'تــم' : 'Done'}
            </Text>
            </TouchableOpacity>
           
         </View>
         
          </Modal>
          <Modal
             isVisible={this.state.isVisible2}
             onBackdropPress={() => this.setState({ isVisible2: false })}
             swipeDirection="left"
             >
          <View style={[styles.modal,{justifyContent:'center'}]}>
             <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,{width:'100%',alignItems:'center'}]}>
                <TouchableOpacity
                 onPress={()=>this.setState({isVisible2:false})}>
               <Icon name="close" size={18} color="#707070" style={{margin:10}} />
               </TouchableOpacity>
            </View>
            <Text style={{ width: '100%',textAlign:'center',alignItems:'center',color:'#343434', fontSize:22,fontFamily:'segoe',}}>
            {this.state.lang.indexOf('ar') != -1 ? 'تمت عمليه الحجز بنجاح' : 'The reservation was made successfully'}
            </Text>

            <TouchableOpacity
                onPress={() => {
                this.setState({isVisible2:false})
                }}
            style={{ width: '40%', backgroundColor: '#4B4B4B',justifyContent: 'center',borderRadius: 8, alignItems: 'center',marginTop:20,marginBottom:10 }}>
            <Text style={{ width: '100%',height: 40,textAlign:'center',alignItems:'center',color:'#FFFFFF', fontSize:20,fontFamily:'segoe', padding: 5, textAlignVertical: 'center',   }}>
            {this.state.lang.indexOf('ar') != -1 ? 'حسنا' : 'Done'}
            </Text>
            </TouchableOpacity>
           
         </View>
         
          </Modal>

              </View>
              </ScrollView>
              }
            </View>
    
          </SafeAreaView>
        );
    }
}
export default Data;
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
    pRight:{
      textAlign:'right',
      paddingRight:10
    },
    pLeft:{
      textAlign:'left',
      paddingLeft:10
    },
    viewItem:{
      width:'98%',
      height:height / 5,
      alignItems:'center',
      justifyContent:'center',
    },
    viewRow:{
      flex:1,height:'100%',
      textAlign:'center' ,borderRadius: 7,justifyContent:'center',
      color:'#000',fontSize:14,backgroundColor:'#FCFCFC',
      borderColor:'#F6F6F6',borderWidth:2,alignItems:'center'
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
   start:{
     alignItems:'flex-start'
   },
   end:{
     alignItems:'center'
   },
   modal:{
    width:'100%',
    alignItems:'center',
    backgroundColor:'#fff',
    borderRadius:8,
    borderColor:'#707070',borderWidth:1,
  },
  maStart:{
    marginStart:'30%'
  },
  maEnd:{
    marginEnd:0
  },
  posLeft:{
   left:7
  },
  posRight:{
   right:7
  }
  
  });
