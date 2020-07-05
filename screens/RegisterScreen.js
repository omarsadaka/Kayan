import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { AsyncStorage, SafeAreaView } from 'react-native';
import { ActivityIndicator, ScrollView,StyleSheet,Dimensions } from 'react-native';
//import Toast from 'react-native-simple-toast';

import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker';
const { width , height } = Dimensions.get('window')
import NetInfo from "@react-native-community/netinfo";
import { Container, Header, Content, Picker, Form } from "native-base";
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

class RegisterScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lang: '',
      mobile: '',
      color1:'#D4D4D4',
      color2:'#D4D4D4',
      color3:'#D4D4D4',
      email: '',
      fullName: '',
      flag_lang: 0,
      countries: [],
      countryID: '',
      cityID: '',
      codeID:'',
      con_codes:[],
      cities: [],
      password: '',
      confirmPassword: '',
      userKey: '',
    
     
    }

  }


  componentDidMount() {
    //NativeModules.ExceptionsManager = null;
    this._retrieveData();
    this.getCountry();
    this.getCodes();
  }
  _retrieveData = async () => {
    try {
      const lang = await AsyncStorage.getItem('lang');
      this.setState({ lang })
      this.setState({ flag_lang: 1 })
    } catch (error) { }
  }

  validate = () => {
    // this.setState({flag:0});
    const errors = {};
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.state.fullName) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('يرجي إدخال الأسم كامل');
      }
      else {
        // this.setState({flag:1});
        alert('fullname is requied');
      }
      errors.fullname = "fullname is requied ";
    }
    else if (this.state.fullName.length < 6) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('  الأسم كامل قصير جدآ');
      }
      else {
        // this.setState({flag:1});
        alert('fullname is very short');
      }
      errors.fullname = "fullname is very short ";
    }
    else if (this.state.codeID=='') {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('يجب أدخال كود المحافظه');
      }
      else {
        // this.setState({flag:1});
        alert('Country code is required');
      }
      errors.fullname = "Country code is required ";
    }
    else if (!this.state.mobile) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('ادخل  رقم الموبايل');
      }
      else {
        // this.setState({flag:1});
        alert('Mobile Is Requied ');
      }
      errors.mobile = "mobile is requied ";
    }
    else if (this.state.mobile.length < 5) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('  رقم الموبايل غير صحيح');
      }
      else {
        // this.setState({flag:1});
        alert('Invalid mobile number ');
      }
      errors.mobile = "mobile is requied ";
    }
    else if (!this.state.email) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert(' أدخل البريد الالكترونى');
      }
      else {
        // this.setState({flag:1});
        alert('Enter email');
      }
      errors.email = "email is invalied ";
    }
    else if (reg.test(this.state.email) === false) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert(' البريد الالكتروني غير صحيح');
      }
      else {
        // this.setState({flag:1});
        alert('Email Is invalied ');
      }
      errors.email = "email is invalied ";
    }
    else if (!this.state.password) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('يرجي ادخال كلمة السر');
      }
      else {
        // this.setState({flag:1});
        alert('password is required ');
      }
      errors.password = "password is requied";
    }
    else if (!this.state.confirmPassword) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert(' يرجي ادخال كلمة السر مرة اخري');
      }
      else {
        // this.setState({flag:1});
        alert('Confirm password is required ');
      }
      errors.confirmPassword = "Confirm password is requied";
    }
    else if (this.state.password != this.state.confirmPassword) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('كلمه المرور غير متطابقه ');
      }
      else {
        // this.setState({flag:1});
        alert('Password Not Match ');
      }
      errors.password = "password is requied";
    }
    else if (this.state.password.length < 6) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('  كلمة السر قصيرة');
      }
      else {
        // this.setState({flag:1});
        alert('password is very short ');
      }
      errors.password = "password is very short";
    }
    else if (!this.state.countryID) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('أدخل الدولة');
      }
      else {
        // this.setState({flag:1});
        alert('Enter country');
      }
      errors.confirmPassword = "Confirm password is requied";
    }
    else if (!this.state.cityID) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('أدخل المدينة');
      }
      else {
        // this.setState({flag:1});
        alert('Enter city');
      }
      errors.confirmPassword = "Confirm password is requied";
    }

    return errors;
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


  onSubmit = () => {
    // this.setState({flag_lang:0})
    NetInfo.fetch().then(state => {
      if(state.isConnected)
      {
        const errors = this.validate();
        this.setState({ errors });
        if (Object.keys(errors).length === 0) {

          try {
            axios.post("http://134.209.178.237/api/user/register",{
              fullname: this.state.fullName,
              mobile: this.state.mobile,
              countryID: this.state.countryID,
              cityID: this.state.cityID,
              countryCode:this.state.codeID,
              email: this.state.email,
              password: this.state.password,
              userKey: this.state.userKey,
            }).then(response => {
              if(response.data.message){
                if(response.data.message === 'sorry is email exsist'){
                  if(this.state.lang.indexOf('ar') != -1){
                   alert('هذا البريد الالكتروني يوجد');
                  }
                  else {
                   alert('email is exist');
                  }
                }
               else if(response.data.message === 'sorry is mobile exsist'){
                if(this.state.lang.indexOf('ar') != -1){
                 alert('هذا الرقم موجود');
                }
                else {
                 alert('mobil is exist');
                }
                  }
              }
              else if(response.data._id){
                this.setState({ fullName: '' })
                this.setState({ mobile: '' })
                this.setState({ email: '' })
                this.setState({ password: '' })
                this.setState({ confirmPassword: '' })
                if(this.state.lang.indexOf('ar') != -1 ){
                  alert(' تم التسجيل بنجاح');
                  this.props.navigation.push('Login');  
                }
                else {
                  alert('register complete ');
                  this.props.navigation.push('Login_En');  
                }
              }
              
            }).catch((error)=> {
                  if(this.state.lang.indexOf('ar') != -1){
                     alert('حدث خطأ ما حاول مرة أخرى');
                    }
                    else {
                      alert('Error happen try again');
                    }

            //   if(error.response.data.message === 'sorry is email exsist'){
            //     if(this.state.lang.indexOf('ar') != -1){
            //      alert('هذا البريد الالكتروني يوجد');
            //     }
            //     else {
            //      alert('email is exist');
            //     }
            //   }
            //  else if(error.response.data.message === 'sorry is mobile exsist'){
            //   if(this.state.lang.indexOf('ar') != -1){
            //    alert('هذا الرقم موجود');
            //   }
            //   else {
            //    alert('mobil is exist');
            //   }
            //     }
            }).finally(function () {
               // always executed
            });
         } catch (error) {
            console.log(error);
         }

        }
        else {
          // this.setState({flag_lang:1})
        }
      } else {
        if (this.state.lang.indexOf('ar') != -1) {
          // this.setState({flag_lang:1});
          alert('لايوجد اتصال بالانترنت');
        }
        else {
          // this.setState({flag_lang:1});
          alert('No Internet Connection ');
        }
      }
    })
  }

  _backPressed = async () => {
    this.props.navigation.navigate('Login');
  }

  renderOption() {
    return (
      <View style={{ width: '100%', height: '8%', alignItems: 'center', justifyContent: 'center', }}>
        {this.state.lang.indexOf('ar') != -1 ?
          <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: '#C8972C' }}>
            <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}
              style={{ width: '13%',height:'100%',alignItems:'center',justifyContent:'center' }}>
              <Image resizeMode={'cover'} source={require('../img/w_arrow.png')}
                style={{ width: 10, height: 18, alignItems: 'center',}} />
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', width: '74%', flex: 1, fontSize: 20,fontFamily:'segoe', color: "#fff", }}>
              {/* {strings("Home.barTitle")} */}
              {this.state.lang.indexOf('ar') != -1 ? 'أنشاء حساب' : 'Create account'}
            </Text>
            <TouchableOpacity onPress={() => {
              this.props.navigation.goBack()
            }}
              style={{ width: '13%',height:'100%',alignItems:'center',justifyContent:'center' }}>
              {/* <Image resizeMode={'cover'} source={require('../img/w_arrow.png')} 
       style={{width:10 , height:18,alignItems:'center',margin:10}}/> */}
            </TouchableOpacity>
          </View>
          :
          <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse', backgroundColor: '#C8972C' }}>
            <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}
              style={{ width: '13%',height:'100%',alignItems:'center',justifyContent:'center' }}>
              <Image resizeMode={'cover'} source={require('../img/r_back.png')}
                style={{ width: 10, height: 18, alignItems: 'center', margin: 7 }} />

            </TouchableOpacity>

            <Text style={{ textAlign: 'center', width: '74%', flex: 1, fontSize: 20,fontFamily:'segoe', color: "#fff", }}>
              {/* {strings("Home.barTitle")} */}
              {this.state.lang.indexOf('ar') != -1 ? 'انشاء حساب' : 'Create account'}
            </Text>
            <TouchableOpacity onPress={() => {
              this.props.navigation.goBack()
            }}
              style={{ width: '13%',height:'100%',alignItems:'center',justifyContent:'center' }}>
              {/* <Image resizeMode={'cover'} source={require('../img/w_arrow.png')} 
          style={{width:10 , height:18,alignItems:'center',margin:10}}/> */}
            </TouchableOpacity>
          </View>
        }
      </View>
    )
  }

  render() {
   
    return (
      <SafeAreaView style={{ width: '100%', height: '100%', alignItems: 'center', backgroundColor: '#fff' }}>
        {this.renderOption()}
        {this.state.flag_lang == 0 ?
          <ActivityIndicator 
          color='#C8972C'
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}/>
          :
          <ScrollView style={{ width: '100%', flex: 1, marginBottom: 10 }}>
            <View style={{ width: '100%', flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
            <Image
                resizeMode='stretch'
                source={require('../img/logo.png')} style={{width: width*0.9, height: height*0.16,marginTop:'5%'}}>
              </Image>
              <TextInput
                underlineColorAndroid='#fff'
                defaultValue={this.state.fullName}
                placeholderTextColor='#D4D4D4'
                onChangeText={(fullName) => this.setState({ fullName })}
                placeholder={this.state.lang.indexOf('ar') != -1 ? 'الاسم بالكامل ' : ' Full name'}
                style={{
                  paddingVertical: 0, width: '85%', height: height*0.07, textAlign: 'center', paddingStart: 10, color: '#000', marginTop: '5%', borderRadius: 8, fontSize: 14,
                 shadowColor: '#000000', shadowOffset: { width: 0, height: 0 }, shadowRadius: 6,elevation:3,shadowOpacity:0.2,fontFamily:"segoe",backgroundColor:'#FFF',}}
              />
            
              <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,styles.shadow,{ width: '85%', height: height*0.07,marginTop: 5, backgroundColor: '#FFF', justifyContent: 'center',borderRadius: 8,alignItems:'center',
                 backgroundColor:'#FFF'}]} >
               <View style={[{ width:'20%',height:'100%',alignItems:'center',backgroundColor:'#F7F7F7',borderRadius:7,flexDirection:'row'}]}>
              <Icon name="angle-down" size={15} color="#707070" style={{margin:3}} />
               <View style={[{width:'90%',alignItems:'center'}]}>
               <ModalDropdown
                   options={this.state.con_codes} // data
                   defaultValue='000'
                   onSelect={(index, value) => { 
                     this.setState({ codeID: value.title,color1:'#000' }) 
                    }}
                   renderButtonText={(rowData) => (rowData.title)} // ba3d ma t5tar
                   style={{ width:'90%', }} // abl ma t5tar
                   textStyle={{ fontSize: 12, color: this.state.color1,}}
                    dropdownStyle={{ width: 70, alignSelf: 'center', height: 250, borderColor: '#D7D7D7', borderWidth: 1, borderRadius: 3, }}
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
                  underlineColorAndroid='#fff'
                  keyboardType="numeric"
                  placeholderTextColor='#D4D4D4'
                  defaultValue={this.state.mobile}
                  keyboardType='numeric'
                  onChangeText={(mobile) => this.setState({ mobile })}
                  placeholder={this.state.lang.indexOf('ar') != -1 ? ' رقم الجوال ' : ' Mobile'}
                  style={[this.state.lang==='ar'?styles.left:styles.right,{ width: '80%', height: '100%', color: '#000', fontSize: 14,fontFamily:"segoe" }]}
                />
              </View>

              <TextInput
                underlineColorAndroid='#fff'
                placeholderTextColor='#D4D4D4'
                defaultValue={this.state.email}
                onChangeText={(email) => this.setState({ email })}
                placeholder={this.state.lang.indexOf('ar') != -1 ? ' البريد الالكتروني' : ' Email'}
                style={{
                  paddingVertical: 0, width: '85%', height: height*0.07, textAlign: 'center', paddingStart: 10, color: '#000', marginTop: 5, borderRadius: 8, fontSize: 14,
                  shadowColor: '#000000', shadowOffset: { width: 0, height: 0 }, shadowRadius: 6,elevation:3,shadowOpacity:0.2,fontFamily:"segoe",backgroundColor:'#FFF',
                }}
              />
              <TextInput
                underlineColorAndroid='#fff'
                secureTextEntry
                placeholderTextColor='#D4D4D4'
                defaultValue={this.state.password}
                onChangeText={(password) => this.setState({ password })}
                placeholder={this.state.lang.indexOf('ar') != -1 ? ' كلمه المرور ' : ' Password'}
                style={{
                  paddingVertical: 0, width: '85%', height: height*0.07, textAlign: 'center', paddingStart: 10, color: '#000', marginTop: 5, borderRadius: 8, fontSize: 14,
                  shadowColor: '#000000', shadowOffset: { width: 0, height: 0 }, shadowRadius: 6,elevation:3,shadowOpacity:0.2,fontFamily:"segoe",backgroundColor:'#FFF',
                }}
              />
              <TextInput
                underlineColorAndroid='#fff'
                placeholderTextColor='#D4D4D4'
                secureTextEntry
                defaultValue={this.state.confirmPassword}
                onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                placeholder={this.state.lang.indexOf('ar') != -1 ? '  تاكيد كلمه المرور ' : ' Confirm Password'}
                style={{
                  paddingVertical: 0, width: '85%', height: height*0.07, textAlign: 'center', paddingStart: 10, color: '#000', marginTop: 5, borderRadius: 8, fontSize: 14,
                  shadowColor: '#000000', shadowOffset: { width: 0, height: 0 }, shadowRadius: 6,elevation:3,shadowOpacity:0.2,fontFamily:"segoe",backgroundColor:'#FFF',
                }}
              />
              
             

              <View style={[this.state.lang==='ar'?styles.row:styles.row_res,{width: '86%', height:height*0.07,alignItems: 'center', justifyContent: 'center', marginTop: 5 }]}>
              
              <View style={[this.state.lang==='ar'?styles.row:styles.row_res,styles.viewRow,{ margin:2}]}>
              <Icon name="caret-down" size={15} color="#707070" style={{margin:10}} />
                <View style={[{ flex:1 }]}  >
                <ModalDropdown
                   // Data => Array
                   options={this.state.cities}// data
                   // Default Value => Before Selection
                   defaultValue={this.state.lang=='ar'?'أختر المدينة':'City'}
                   // Selection Process
                   onSelect={(index, value) => { 
                     this.setState({ cityID: value.id,color2:'#000' }) 
                    }}
                   // Value After Selection
                  
                   renderButtonText={(rowData) => (rowData.title)}  // ba3d ma t5tar
                   // Styling
                   style={{ width:'100%' }} // abl ma t5tar
                   textStyle={{ textAlign: 'center', fontSize: 14, color: this.state.color2,fontFamily:'segoe' }}
                   dropdownStyle={{ width: 150, alignSelf: 'center', height: 200, borderColor: '#D7D7D7', borderWidth: 1, borderRadius: 3, }}
                   renderRow={function (rowData, rowID, highlighted) {
                    return (
                     <View style={[ { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 40, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                     <Text style={[{ fontSize: 14, color: '#000', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                      {rowData.title}
                       </Text>
                        </View>
                      );
                      }.bind(this)}
                      />
                </View>
              </View>
              <View style={[this.state.lang==='ar'?styles.row:styles.row_res,styles.viewRow,{margin:2 }]}>
              <Icon name="caret-down" size={15} color="#707070" style={{margin:10}} />
                <View style={[{flex:1 }]} >
                <ModalDropdown
                   options={this.state.countries} // data
                   defaultValue={this.state.lang=='ar'?'أختر الدولة':'Country'}
                   onSelect={(index, value) => { 
                     this.setState({ countryID: value.id,color3:'#000' }) 
                     this.getCity(value.id)
                    }}
                   
                   renderButtonText={(rowData) => (rowData.title)} // ba3d ma t5tar
                   style={{ width:'100%' }} // abl ma t5tar
                   textStyle={{ textAlign: 'center', fontSize: 14, color: this.state.color3,fontFamily:'segoe' }}
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
              </View>




              {/* <View style={{
                width: '90%', height: 40, marginTop: 10, borderRadius: 17,alignItems: 'center', justifyContent: "center", justifyContent: "center",
                shadowColor: '#000000', shadowOffset: { width: 0, height: 0 },  shadowRadius: 6,elevation:3,shadowOpacity:0.2,fontFamily:"segoe",backgroundColor: '#fff',
              }}>
                <RadioForm
                  style={{}}
                  radio_props={this.state.lang.indexOf('ar') != -1 ? radio_props_ar : radio_props}
                  initial={1}
                  onPress={(gender) => { this.setState({ gender }) }}
                  formHorizontal={true}
                  //labelHorizontal={true}
                  buttonColor={'#707070'}
                  selectedButtonColor={'#000'}
                  labelColor={'#707070'}
                  buttonSize={15}
                  buttonOuterSize={25}
                  radioStyle={{ paddingRight: 30,paddingLeft: 30 }}
                  labelStyle={{ fontSize: 20,fontFamily:'segoe', color: '#707070', marginStart: 5, marginEnd: 5 }}
                />
              </View> */}


              <TouchableOpacity 
             onPress={this.onSubmit.bind(this)}
             style={{width: '85%',backgroundColor:'#4B4B4B', marginTop:height*0.1, marginBottom:5, borderColor:'#343434',borderWidth:1,borderRadius:8,
             shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowRadius: 6,elevation:3,shadowOpacity:0.2,fontFamily:"segoe",
             justifyContent:'center', alignItems:'center', height:height*0.07,
             }}>
              <Text style={{textAlign:'center',color:'#fff',fontSize:16,textAlignVertical:'center', }}>
              {this.state.lang.indexOf('ar') != -1 ? '  أنشاء الحساب    ' : ' Create account  '}
              </Text>
            </TouchableOpacity>

            </View>
          </ScrollView>
        }
      </SafeAreaView>
    )
  }
}
export default RegisterScreen;
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
    paddingEnd:'20%'
  },
  left:{
    textAlign:'left',
    paddingStart:'20%'
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
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
 },
 viewRow:{
  flex:1, height: '100%', 
  alignItems: 'center', borderRadius: 7,
  shadowColor: '#000000', shadowOffset: { width: 0, height: 0 }, 
  shadowRadius: 6,elevation:3,shadowOpacity:0.2,fontFamily:"segoe",
  backgroundColor: '#fff', 
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