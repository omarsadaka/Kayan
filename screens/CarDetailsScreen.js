import React, { Component } from 'react';
import { View, Text, YellowBox, Dimensions, SafeAreaView, TouchableOpacity, TextInput, Image, ImageBackground, Alert } from 'react-native';
import { AsyncStorage,StyleSheet } from 'react-native';
import { ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import ImageSlider from 'react-native-image-slider';
import DatePicker from 'react-native-datepicker'
const { width, height } = Dimensions.get('window')
import NetInfo from "@react-native-community/netinfo";
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
// import MapView, { PROVIDER_GOOGLE ,Marker } from 'react-native-maps';
import { Container, Header, Content, Picker, Form } from "native-base";
import Modal from 'react-native-modal';
import axios from 'axios';





class CarDetailsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lang: '',
      flag_lang: 0,
      flag_design: 0,
      flag_reserve: 0,
      bg1: '#C8972C',
      bg2: '#E4E4E4',
      bg3: '#E4E4E4',
      bg4: '#E4E4E4',
      txt1: '#FFFFFF',
      txt2: '#343434',
      txt3: '#343434',
      txt4: '#343434',
      carData: {},
      userData: {},
      userId: '',
      carId: '',
      img1: 'http://134.209.178.237/uploadFiles/upload_3ef8527b05b9a96f4dbf63f04f98b68d.png',
      img2: 'http://134.209.178.237/uploadFiles/upload_3ef8527b05b9a96f4dbf63f04f98b68d.png',
      img3: 'http://134.209.178.237/uploadFiles/upload_3ef8527b05b9a96f4dbf63f04f98b68d.png',
      img4: 'http://134.209.178.237/uploadFiles/upload_3ef8527b05b9a96f4dbf63f04f98b68d.png',
      img5: 'http://134.209.178.237/uploadFiles/upload_3ef8527b05b9a96f4dbf63f04f98b68d.png',
      img6: 'http://134.209.178.237/uploadFiles/upload_3ef8527b05b9a96f4dbf63f04f98b68d.png',
      logo: '',
      carType: '',
      carModel: '',
      carYear: '',
      auto: '',
      automatic: '',
      startDate: '',
      endDate: '',
      minDate: new Date(),
      carRate: 0,
      rentPrice: 0,
      type: 0,
      cat: '',
      subCat: '',
      desc: '',
      notes: '',
      ownerId: '',
      carOrder: [],
      recevinges:[
        {label: 'مطار القاهرة', value: '1',}
      ],
      deliveringes:[
        {label: 'مطار القاهرة', value: '1',}
      ],
      key: '',
      car_startDate: '',
      car_endDate: '',
      clicked:0,
      isVisible:false,
      personNum:'',
      doorsNum:'',
      bagsNum:'',
      startTimeH:0,
      startTimeM:0,
      endTimeH:0,
      endTimeM:0,
      recevingLocation:'',
      deliveringLocation:'',
      insurance:0
      
    }

  }

  componentDidMount() {
    this._retrieveData();
  }

  _retrieveData = async () => {
    // const ReactNative = require('react-native');
    // ReactNative.I18nManager.allowRTL(false); 
    try {
      const lang = await AsyncStorage.getItem('lang');
      this.setState({ lang })
      const value = await AsyncStorage.getItem('loginDataKayan');
      if (value) {
        const data = JSON.parse(value);
        this.setState({ userData: data })
        this.setState({ userId: this.state.userData._id })
        this.getData();
      } else {
        var data2 = {
          _id: '1',
          fullname: 'أسم المستخدم'
        }
        this.setState({ userData: data2 })
        this.getData();
      }
    } catch (error) { }
  }

  getData = () => {
    const { navigation } = this.props;
    const car_Id = navigation.getParam('car_id', 'NO-ID');
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        axios.get('http://134.209.178.237/api/user/getCarByID',{
          params: {
            id:car_Id,
        },
        }).then(async(response) => {
            this.setState({ flag_lang: 1 });
            const Data = response.data;
            this.setState({ CarData: Data });
            this.setState({ carId: Data._id });
            this.setState({ ownerId: Data.userID._id })
            this.setState({ logo: Data.logo })
            this.setState({ car_startDate: Data.startDate })
            this.setState({ car_endDate: Data.endDate })
            this.setState({ carRate: Data.status })
            this.setState({ desc: Data.description })
            this.setState({ auto: Data.automatic })
            this.setState({personNum:Data.personNum})
            this.setState({doorsNum:Data.doorsNum})
            this.setState({bagsNum:Data.bagsNum})
            this.setState({abs:Data.abs})
            this.setState({bluetooth:Data.bluetooth})
            this.setState({centralLock:Data.centralLock})
            this.setState({electriGlass:Data.electriGlass})
            this.setState({sportTrims:Data.sportTrims})
            this.setState({cdPlayer:Data.cdPlayer})
            this.setState({cruiseControl:Data.cruiseControl})
            this.setState({ rentPrice: Data.rentPrice })
            this.setState({ img1: Data.img1 })
            this.setState({ img2: Data.img2 })
            this.setState({ img3: Data.img3 })
            this.setState({ img4: Data.img4 })
            this.setState({ img5: Data.img5 })
            this.setState({ img6: Data.img6 })
            this.setState({insurance:Data.insurance})
            if (this.state.lang.indexOf('ar') != -1) {
             
              this.setState({ cat: Data.categoryID.titleAr })
              this.setState({ carType: Data.carTypeID.titleAr })
              this.setState({ carModel: Data.carModelID.titleAr })
              const obj = {
                logo: Data.logo,
                rate :Data.status,
                type: Data.carTypeID.titleAr,
                price: Data.rentPrice,
                ownerId:Data.userID._id
              }
              await AsyncStorage.setItem('CarInfo',JSON.stringify(obj));
            } else {
              this.setState({ cat: Data.categoryID.titleEN })
              this.setState({ carType: Data.carTypeID.titleEN })
              this.setState({ carModel: Data.carModelID.titleEN })
              const obj = {
                logo: Data.logo,
                rate :Data.status,
                type:Data.carTypeID.titleEN,
                price: Data.rentPrice,
                ownerId:Data.userID._id
              }
              await AsyncStorage.setItem('CarInfo',JSON.stringify(obj));
            }


          })
          .catch((error) => {
            this.setState({ flag_lang: 1 });
            alert("" + { error });

          });

      } else {

        if (this.state.lang.indexOf('ar') != -1) {
          this.setState({ flag_lang: 1 });
          alert('عذرا لا يوجد اتصال بالانترنت');
        } else {
          this.setState({ flag_lang: 1 });
          alert('No internet connection!')
        }

      }
    })
  }

 

  _onReservePressed = async () => {
    this.setState({ flag_lang: 0 })
    const value = await AsyncStorage.getItem('loginDataKayan');
    if (value) {
      if (this.state.ownerId == this.state.userId) {
        if (this.state.lang.indexOf('ar') != -1) {
          this.setState({ flag_lang: 1 });
          alert('هذة السيارة ملك لك لايمكنك حجزها')

        }
        else {
          this.setState({ flag_lang: 1 });
          alert('This Car Belongs to You You Cannot Reserve it')

        }
      } else {
        if (this.state.startDate && this.state.endDate) {
          this.setState({ flag_lang: 0 });
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              const obj = {
                carID: this.state.carId,
                userID: this.state.userId,
                price: this.state.rentPrice,
                notes: this.state.notes,
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                ownerID: this.state.ownerId
              }
              fetch('http://134.209.178.237/api/user/request', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
              }).then((response) => response.json())
                .then((responseJson) => {
                  console.log(responseJson)
                  const obj2 = {
                    clientID: this.state.userId,
                  }

                  if (responseJson.message) {
                    if (responseJson.message == "sorry is car exsist") {
                      //alert(this.state.lang.indexOf('ar') != -1 ? "عفوا هذه السياره محجوزه" : "Car is reserved")
                      this.refs.modal1.open()
                      this.setState({ flag_lang: 1 });
                    } else {
                      this.setState({ flag_lang: 1 });
                    }
                  } else {
                    fetch('http://134.209.178.237/api/user/car/' + this.state.carId, {
                      method: 'PUT',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(obj2),
                    }).then((response) => {
                      console.log(response)
                      response.json()
                    })
                      .then((responseJson) => {
                        if (this.state.lang.indexOf('ar') != -1) {
                          this.setState({ flag_lang: 1 });
                          this.refs.modal.open()
                          alert("  شكرا لك تم حجز السيارة ");
                          this.setState({ notes: '' })
                        }
                        else {
                          this.setState({ flag_lang: 1 });
                          this.refs.modal.open()
                          alert('Thank You !!');

                          this.setState({ notes: '' })

                        }

                      })
                      .catch((error) => {

                        alert('error' + error);
                      });
                  }

                })
                .catch((error) => {
                  this.setState({ flag_lang: 1 });

                });

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
        } else {
          if (this.state.lang.indexOf('ar') != -1) {
            this.setState({ flag_lang: 1 });
            alert('تاريخ البدء والانتهاء مطلوبين');

          }
          else {
            this.setState({ flag_lang: 1 });
            alert('StartDate end EndDate Required');

          }
        }
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

  validate = () => {
    const errors = {};
    if (!this.state.startDate) {
      if (this.state.lang.indexOf('ar') != -1) {
        this.setState({flag:1});
        alert('يرجى أدخال تاريخ البداية');
      }
      else {
        this.setState({flag:1});
        alert('Enter start date');
      }
      errors.fullname = "fullname is requied ";
    }
    else if (!this.state.startTime) {
      if (this.state.lang.indexOf('ar') != -1) {
        this.setState({flag:1});
        alert('يرجى أدخال وقت البداية');
      }
      else {
        this.setState({flag:1});
        alert('enter start time');
      }
      errors.nationalID = "personalID is requied ";
    }
    else if (!this.state.endDate) {
      if (this.state.lang.indexOf('ar') != -1) {
        this.setState({flag:1});
        alert('يرجى أدخال تاريخ النهاية');
      }
      else {
        this.setState({flag:1});
        alert('Enter end date');
      }
      errors.mobile = "mobile is requied ";
    }
    else if (!this.state.endTime) {
      if (this.state.lang.indexOf('ar') != -1) {
        this.setState({flag:1});
        alert('يرجى أدخال وقت النهاية');
      }
      else {
        this.setState({flag:1});
        alert('Enter end time');
      }
      errors.password = "password is requied";
    }
    else if (this.state.recevingLocation ==='') {
      if (this.state.lang.indexOf('ar') != -1) {
        this.setState({flag:1});
        alert(' يرجي ادخال  مكان الاستلام');
      }
      else {
        this.setState({flag:1});
        alert('Enter receiving place');
      }
      errors.confirmPassword = "Confirm password is requied";
    }
    else if (this.state.deliveringLocation ==='') {
      if (this.state.lang.indexOf('ar') != -1) {
        this.setState({flag:1});
        alert(' يرجي ادخال  مكان التسليم');
      }
      else {
        this.setState({flag:1});
        alert('Enter delivering place');
      }
      errors.confirmPassword = "Confirm password is requied";
    }
    return errors;
  }

  renderOption() {
    return (
      <View style={{ width: '100%', height: '8%', alignItems: 'center', justifyContent: 'center' }}>
        {this.state.lang.indexOf('ar') != -1 ?
          <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse', backgroundColor: '#C8972C', }}>
            <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}
              style={{ width:'13%',height:'100%',alignItems:'center',justifyContent:'center' }}>
              <Image resizeMode={'cover'} source={require('../img/nav.png')}
                style={{ width: 25, height: 25, alignItems: 'center' }} />
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', fontSize: 20,fontFamily:'segoe', color: "#fff", width:'74%'  }}>
              {this.state.lang.indexOf('ar') != -1 ? 'تفاصيل السيارة' : 'Car details'}
            </Text>

            <TouchableOpacity onPress={() => {
              this.props.navigation.goBack()
            }}
              style={{ width:'13%',height:'100%',alignItems:'center',justifyContent:'center' }}>
              <Image resizeMode={'cover'} source={require('../img/w_arrow.png')}
                style={{ width: 10, height: 18, alignItems: 'center', }} />
            </TouchableOpacity>
          </View>
          :
          <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse', backgroundColor: '#C8972C', }}>
            <TouchableOpacity onPress={() => {
              this.props.navigation.goBack()
            }}
              style={{ width:'13%',height:'100%',alignItems:'center',justifyContent:'center' }}>
              <Image resizeMode={'cover'} source={require('../img/r_back.png')}
                style={{ width: 10, height: 18, alignItems: 'center',}} />
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', width:'74%', fontSize: 20,fontFamily:'segoe', color: "#fff",   }}>
              {this.state.lang.indexOf('ar') != -1 ? 'تفاصيل السيارة' : 'Car details'}
            </Text>

            <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}
              style={{ width:'13%',height:'100%',alignItems:'center',justifyContent:'center' }}>
              <Image resizeMode={'cover'} source={require('../img/nav.png')}
                style={{ width: 25, height: 25, alignItems: 'center' }} />
            </TouchableOpacity>
          </View>
        }

      </View>
    )
  }
  render() {
    const images = [
      this.state.img1,
      this.state.img2,
      this.state.img3,
      this.state.img4,
      this.state.img5,
      this.state.img6,
    ];
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor:'#FFF', alignItems: 'center',}}>
        {this.renderOption()}
            <View style={{ width: width, height: height, alignItems: 'center'}}>
             <View style={{width:'95%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:10}}>
               <View style={{ width: '30%', height: 2, backgroundColor: '#414141', alignItems: 'flex-start' }}></View>
                <Text style={{ width: '40%', textAlign: 'center', fontSize: 16, color: '#414141',fontFamily:'segoe' }}>{this.state.carType} </Text>
                <View style={{ width: '30%', height: 2, backgroundColor: '#414141', alignItems: 'flex-end' }}></View>
             </View>
              <View style={{ width: width, height:'20%',alignItems: 'center', justifyContent: 'center',marginTop:10,}}>

                {!this.state.logo ?

                  <Image
                    resizeMode="stretch"
                    style={{ width: '95%', height: '100%',}}
                    source={require('../img/image.png')}
                  />
                  :
        <View
         style={[styles.viewItem,{overflow: 'hidden',backgroundColor: '#FFF',elevation:3,borderRadius:10}]}>
         <ImageBackground
             resizeMode ="cover"
             source={{uri:this.state.logo}}
             style={{width: '100%', height: '100%', alignItems: 'center', borderRadius:10}} />
            <LinearGradient colors={['#43434380','#38383810']} style={styles.linearGradient}/>
            <View style={{width:width*0.1,borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',
                  backgroundColor:'#AEAEAE',position: 'absolute',top:10,left:10}}>
               <View style={{width:'100%',height: 30,backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
                {/* <Image
                  source={require('../img/starr.png')} style={{width:20, height: 20,}}>
                </Image> */}
                 <Icon name="star" size={20} color="#FFE000" style={{margin:2}} />
              </View>
                <Text style={{ fontSize: 15, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center'}}>{this.state.carRate}</Text>
              </View>
       </View>

                }

              </View>

              <View style={[this.state.lang ==='ar'?styles.row_res:styles.row,{width: '96%', height: '6%',alignItems: 'center', justifyContent: 'center',marginTop:10 }]}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ flag_design: 0 })
                    this.setState({ bg1: '#C8972C' })
                    this.setState({ bg2: '#E4E4E4' })
                    this.setState({ bg3: '#E4E4E4' })
                    this.setState({ bg4: '#E4E4E4' })
                    this.setState({ txt1: '#FFFFFF' })
                    this.setState({ txt2: '#343434' })
                    this.setState({ txt3: '#343434' })
                    this.setState({ txt4: '#343434' })

                  }}
                  style={[{height:'100%', borderRadius: 8, flex: 1, margin:3, backgroundColor: this.state.bg1,justifyContent:'center' }]}>
                  <Text style={{ width: '100%',textAlign: 'center', color: this.state.txt1, fontSize: 14,fontFamily:"segoe"}}>
                    {this.state.lang.indexOf('ar') != -1 ? ' معلومات' : 'Info'}
                    {/* {strings("CarDetail.Info")} */}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.setState({ flag_design: 1 })
                    this.setState({ bg1: '#E4E4E4' })
                    this.setState({ bg2: '#C8972C' })
                    this.setState({ bg3: '#E4E4E4' })
                    this.setState({ bg4: '#E4E4E4' })
                    this.setState({ txt1: '#343434' })
                    this.setState({ txt2: '#FFFFFF' })
                    this.setState({ txt3: '#343434' })
                    this.setState({ txt4: '#343434' })
                  }}
                  style={[{height:'100%',borderRadius: 8, flex: 1, margin:3, backgroundColor: this.state.bg2,justifyContent:'center' }]}>
                  <Text style={{ width: '100%', textAlign: 'center', color: this.state.txt2, fontSize: 14, fontFamily:"segoe"  }}>
                    {this.state.lang.indexOf('ar') != -1 ? ' الصور ' : 'Gallery'}
                    {/* {strings("CarDetail.Gallery")} */}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.setState({ flag_design: 2 })
                    this.setState({ bg1: '#E4E4E4' })
                    this.setState({ bg2: '#E4E4E4' })
                    this.setState({ bg3: '#C8972C' })
                    this.setState({ bg4: '#E4E4E4' })
                    this.setState({ txt1: '#343434' })
                    this.setState({ txt2: '#343434' })
                    this.setState({ txt3: '#FFFFFF' })
                    this.setState({ txt4: '#343434' })
                  }}
                  style={[{height:'100%', borderRadius: 8, flex: 1, margin:3, backgroundColor: this.state.bg3,justifyContent:'center' }]}>
                  <Text style={{ width: '100%', textAlign: 'center', color: this.state.txt3, fontSize: 14, fontFamily:"segoe"  }}>
                    {this.state.lang.indexOf('ar') != -1 ? 'مزايا ' : 'Option'}
                    {/* {strings("CarDetail.Option")} */}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ flag_design: 3 })
                    this.setState({ bg1: '#E4E4E4' })
                    this.setState({ bg2: '#E4E4E4' })
                    this.setState({ bg3: '#E4E4E4' })
                    this.setState({ bg4: '#C8972C' })
                    this.setState({ txt1: '#343434' })
                    this.setState({ txt2: '#343434' })
                    this.setState({ txt3: '#343434' })
                    this.setState({ txt4: '#FFFFFF' })
                  }}
                  style={[{height:'100%',borderRadius: 8, flex: 1, margin:3, backgroundColor: this.state.bg4,justifyContent:'center'}]}>
                  <Text style={{ width: '100%', textAlign: 'center', color: this.state.txt4, fontSize: 14,fontFamily:"segoe"   }}>
                    {this.state.lang.indexOf('ar') != -1 ? 'حجز ' : 'Rent'}
                  </Text>
                </TouchableOpacity>
              </View>

              {this.state.flag_lang == 0 ?
                <ActivityIndicator
                color='#C8972C'
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }} />
                :
                <View style={{width:width , alignItems:'center',}}>
                <View style={{width:'94%',height:'70%',alignItems: 'center',elevation:4,shadowOpacity:0.3, backgroundColor:'#F8F8F8',marginTop:10,
               }}>
                  {this.state.flag_design == 0 ?
                    // first Flag
                    
              
               <View style={{ width: '96%', alignItems: 'center', justifyContent: 'center',}}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 5 }}>
               <View style={[this.state.lang.indexOf('ar')!=-1?styles.row :styles.row_res ,{ width:'100%',height:height*0.05,justifyContent:'center',alignItems:"center",marginTop:10}]}>
              <View style={{flex:1,height:'100%',margin:5,borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE',flexDirection:'row'}}>
              <Text style={{ width:'50%',fontSize: 18, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center',borderRadius:5}}>{this.state.doorsNum}</Text>
              <View style={{width:'50%',height: '100%',backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
                <Image
                  source={require('../img/dd.png')} style={{width:25, height: '100%',}}>
                </Image>
              </View>
              </View>
              <View style={{flex:1,height:'100%',margin:5,borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE',flexDirection:'row'}}>
              <Text style={{width:'50%', fontSize: 18, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center',borderRadius:5}}>{this.state.bagsNum}</Text>
              <View style={{width:'50%',height: '100%',backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
                <Image
                  source={require('../img/sh.png')} style={{width:25, height: '100%',}}>
                </Image>
              </View>
              </View>
              <View style={{flex:1,height:'100%',margin:5,borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE',flexDirection:'row'}}>
              <Text style={{ width:'50%',fontSize: 18, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center',borderRadius:5}}>{this.state.auto===1?'A':'M'}</Text>
              <View style={{width:'50%',height: '100%',backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
                <Image
                  source={require('../img/ma.png')} style={{width:25, height: '100%',}}>
                </Image>
              </View>
              </View>
              <View style={{flex:1,height:'100%',margin:5,borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE',flexDirection:'row'}}>
              <Text style={{ width:'50%',fontSize: 18, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center',borderRadius:5}}>{this.state.personNum}</Text>
              <View style={{width:'50%',height: '100%',backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
                <Image
                  source={require('../img/us.png')} style={{width:25, height: '100%',}}>
                </Image>
              </View>
              </View>
            </View>
               <View style={[this.state.lang === 'ar'? styles.row_res:styles.row,{width: '100%',height:height*0.07 ,alignItems: 'center', marginTop: 10,}]}>
                 <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width: '35%',color: '#343434', fontSize: 14,margin:5,fontFamily:"segoe"}]}>
                   {this.state.lang === 'ar'? 'فئـه':'Category'}</Text>
                <Text style={{width: '60%', textAlign: 'center', color: '#343434', fontSize: 14, padding: 5,backgroundColor:'#fff',fontFamily:"segoe"}}>{this.state.cat}</Text>
               </View>
                       
                 <View style={[this.state.lang === 'ar'? styles.row_res:styles.row,{width: '100%', height:height*0.07,alignItems: 'center', marginTop: 10,}]}>
                 <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width: '35%',color: '#343434', fontSize: 14,margin:5,fontFamily:"segoe"}]}>
                   {this.state.lang === 'ar'? 'نوع السيارة':'Car type'}</Text>
                <Text style={{width: '60%', textAlign: 'center', color: '#343434', fontSize: 14, padding: 5,backgroundColor:'#FFFFFF',fontFamily:"segoe"}}>{this.state.carType}</Text>
               </View>
                         
                <View style={[this.state.lang === 'ar'? styles.row_res:styles.row,{width: '100%', height:height*0.07,alignItems: 'center', marginTop: 10,}]}>
                 <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width: '35%',color: '#343434', fontSize: 14,margin:5,fontFamily:"segoe"}]}>
                   {this.state.lang === 'ar'? 'موديل السيارة':'Car model'}</Text>
                <Text style={{width: '60%', textAlign: 'center', color: '#343434', fontSize: 14, padding: 5,backgroundColor:'#FFFFFF',fontFamily:"segoe"}}>{this.state.carModel}</Text>
               </View>
              
               <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width: '96%',color: '#343434', fontSize: 14,margin:5,fontFamily:"segoe",marginTop:10,}]}>
                   {this.state.lang === 'ar'? 'الـوصـف':'Description'}</Text>
                <View style={{width:'100%',alignItems:'center',height:height*0.07,}}>   
                <Text style={{width: '96%', textAlign: 'center', color: '#707070', fontSize: 14, padding: 5,backgroundColor:'#FFFFFF' ,fontFamily:"segoe"}}>
                  {this.state.desc}</Text> 
                </View>        
                </ScrollView>
                </View>
               
                    :
               <View style={{ width: '98%', alignItems: 'center' }}>
                      {this.state.flag_design == 1 ?
                        // second Flag

                        <View style={{ height: '95%', width: '100%', marginBottom: 5, alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ height: '95%', width: '100%', }}>
                            <ImageSlider
                              loopBothSides={false}
                              // autoPlayWithInterval={1000}
                              images={images}
                              customButtons={(position, move) => (
                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:3}}>
                                  {images.map((image, index) => {
                                    return (
                                      <TouchableOpacity
                                        key={index}
                                        underlayColor="#ccc"
                                        onPress={() => move(index)}
                                      >
                                        <Image
                                         source={{uri:image}} style={{width:30, height: 30,margin:2,borderRadius:5}}>
                                      </Image>
                                      </TouchableOpacity>
                                    );
                                  })}
                                </View>
                              )}
                              />
                          </View>
                        </View>
                        :

            <View style={{width: '98%',  alignItems: 'center' }}>
              {this.state.flag_design == 2 ?
                            // third Flag
             <View style={{ width: '100%', alignItems: 'center',marginTop:20 }}>
              {this.state.abs ===1?
               <View style={[this.state.lang === "ar"? styles.row:styles.row_res,styles.view,{marginTop:3}]}>
               <Text style={[this.state.lang === "ar" ? styles.right : styles.left,styles.text]}>
               {this.state.lang === 'ar' ? 'ABS' : 'ABS'}</Text>
               <Image source={require('../img/point.png')} 
               style={{width:12,height:12,margin:7}} resizeMode="contain" />
            </View>
              :
              <View style={{display:'none'}}></View>
              }
                
             {this.state.bluetooth ===1?
            <View style={[this.state.lang === "ar"? styles.row:styles.row_res,styles.view,{marginTop:3}]}>
               <Text style={[this.state.lang === "ar" ? styles.right : styles.left,styles.text]}>
               {this.state.lang === 'ar' ? 'بلوتوث' : 'Blutooth'}</Text>
               <Image source={require('../img/point.png')} 
               style={{width:12,height:12,margin:7}} resizeMode="contain" />
            </View> 
             :
             <View style={{display:'none'}}></View>
             }

            {this.state.centralLock ===1?
            <View style={[this.state.lang === "ar"? styles.row:styles.row_res,styles.view,{marginTop:3}]}>
               <Text style={[this.state.lang === "ar" ? styles.right : styles.left,styles.text]}>
               {this.state.lang === 'ar' ? 'قفل مركزى' : 'Lock Centeral'}</Text>
               <Image source={require('../img/point.png')} 
               style={{width:12,height:12,margin:7}} resizeMode="contain" />
            </View> 
            :
            <View style={{display:'none'}}></View>
            }

           {this.state.electriGlass ===1?
            <View style={[this.state.lang === "ar"? styles.row:styles.row_res,styles.view,{marginTop:3}]}>
               <Text style={[this.state.lang === "ar" ? styles.right : styles.left,styles.text]}>
               {this.state.lang === 'ar' ? 'زجاج كهربائي' : 'Electric glass'}</Text>
               <Image source={require('../img/point.png')} 
               style={{width:12,height:12,margin:7}} resizeMode="contain" />
            </View> 
            :
            <View style={{display:'none'}}></View>
            }

           {this.state.sportTrims ===1?
            <View style={[this.state.lang === "ar"? styles.row:styles.row_res,styles.view,{marginTop:3}]}>
               <Text style={[this.state.lang === "ar" ? styles.right : styles.left,styles.text]}>
               {this.state.lang === 'ar' ? 'جنوط سبور' : 'Spore gante'}</Text>
               <Image source={require('../img/point.png')} 
               style={{width:12,height:12,margin:7}} resizeMode="contain" />
            </View> 
            :
            <View style={{display:'none'}}></View>
            }

            {this.state.cdPlayer ===1?
            <View style={[this.state.lang === "ar"? styles.row:styles.row_res,styles.view,{marginTop:3}]}>
               <Text style={[this.state.lang === "ar" ? styles.right : styles.left,styles.text]}>
               {this.state.lang === 'ar' ? 'مشفل CD' : 'CD Player'}</Text>
               <Image source={require('../img/point.png')} 
               style={{width:12,height:12,margin:7}} resizeMode="contain" />
            </View> 
            :
            <View style={{display:'none'}}></View>
            }

            {this.state.cruiseControl ===1?
            <View style={[this.state.lang === "ar"? styles.row:styles.row_res,styles.view,{marginTop:3}]}>
               <Text style={[this.state.lang === "ar" ? styles.right : styles.left,styles.text]}>
               {this.state.lang === 'ar' ? 'مثبت سرعة' : 'cruise control'}</Text>
               <Image source={require('../img/point.png')} 
               style={{width:12,height:12,margin:7}} resizeMode="contain" />
            </View>  
             :
            <View style={{display:'none'}}></View>
            }
             </View>
             
               :
                // fourth Flag 
              <View style={{width: width, justifyContent: 'center', alignItems: 'center' }}>              
             <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 18 }}>                                              
            <View style={{ width: width, alignItems: 'center', justifyContent: 'center' }}>
             <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'89%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'تاريخ الأستلام/الوقت':'Receive date/time'}</Text>
               
              <View style={[this.state.lang==='ar'?styles.row:styles.row_res,{ width: '90%',height: height*0.07,alignItems:'center',justifyContent:'center',marginTop:5}]}>
                  
                  <View  style={[styles.shadow,{flex:1,height:'100%',borderRadius: 7,margin:2,justifyContent:'center'}]}>
                   <DatePicker
                   style={{
                     width:'100%', }}
                     date={this.state.startTime}
                     placeholder={this.state.lang.indexOf('ar') != -1 ?'بداية الوقت' :'Start time'}
                     mode="time"
                     format="HH:mm"
                     // minDate="2016-05-01"
                     // maxDate="2016-06-01"
                     confirmBtnText="Confirm"
                     cancelBtnText="Cancel"
                     iconSource={require('../img/time.png')}
                     customStyles={{
                       dateIcon: {
                         right: 0,
                         top: 0,
                         width:30,
                         height:30
                       },
                       dateInput: {
                        
                         borderWidth: 0,borderColor: '#707070',fontSize:14
                       }
                       // ... You can check the source to find the other keys.
                       }}
                     onDateChange={(startTime) => {
                      var startTimeH = startTime.split(':')[0]
                       var startTimeM = startTime.split(':')[1]
                       this.setState({startTimeH})
                       this.setState({startTimeM})
                       this.setState({startTime})
                      }}
                 />
                                    
                  </View>
                          
                 <View style={[styles.shadow,{flex:1,height:'100%',borderRadius: 7,margin:2,justifyContent:'center'}]} >
                 <DatePicker
                   style={{
                     width:'100%',}}
                     date={this.state.startDate}
                     placeholder={this.state.lang.indexOf('ar') != -1 ?'تاريخ البدأ' :'Start date'}
                     mode="date"
                     format="YYYY-MM-DD"
                     minDate={new Date()}
                     // maxDate="2016-06-01"
                     confirmBtnText="Confirm"
                     cancelBtnText="Cancel"
                     iconSource={require('../img/date.png')}
                     customStyles={{
                       dateIcon: {
                         right: 0,
                         top: 0,
                         width:30,
                         height:30
                       },
                     dateInput: {
                      
                       borderWidth: 0,borderColor: '#707070',fontSize:14
                     }
                     // ... You can check the source to find the other keys.
                     }}
                     onDateChange={(startDate) => {this.setState({startDate})}}
                 />
                 </View>
                
                 </View>

             <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'89%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'تاريخ التسليم/الوقت':'Delivery date/time'}</Text>
               
                <View style={[this.state.lang==='ar'?styles.row:styles.row_res,{width: '90%',height: height*0.07,alignItems:'center',justifyContent:'center',marginTop:5}]}>
                       <View  style={[styles.shadow,{flex:1,height:'100%',borderRadius: 7,margin:2,justifyContent:'center'}]}>
                       <DatePicker
                style={{
                  width:'100%',}}
                  date={this.state.endTime}
                  placeholder={this.state.lang.indexOf('ar') != -1 ?'نهاية الوقت' :'End time'}
                  mode="time"
                  format="HH:mm"
                  // minDate="2016-05-01"
                  // maxDate="2016-06-01"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  iconSource={require('../img/time.png')}
                  customStyles={{
                    dateIcon: {
                      right: 0,
                      top: 0,
                      width:30,
                      height:30
                    },
                    dateInput: {
                     
                      borderWidth: 0,borderColor: '#707070',fontSize:14
                    }
                    // ... You can check the source to find the other keys.
                    }}
                  onDateChange={(endTime) => {
                       var endTimeH = endTime.split(':')[0]
                       var endTimeM = endTime.split(':')[1]
                       this.setState({endTimeH})
                       this.setState({endTimeM})
                       this.setState({endTime})
                  }}
              />
                        </View>
                        <View style={[styles.shadow,{flex:1,height:'100%',borderRadius: 7,margin:2,justifyContent:'center'}]} >
                       <DatePicker
                        style={{
                          width:'100%', }}
                        date={this.state.endDate}
                        placeholder={this.state.lang.indexOf('ar') != -1 ?'تاريخ الانتهاء' :'End date'}
                        mode="date"
                        format="YYYY-MM-DD"
                        minDate={new Date()}
                        // maxDate="2016-06-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        iconSource={require('../img/date.png')}
                        customStyles={{
                          dateIcon: {
                            right: 0,
                            top: 0,
                            width:30,
                            height:30
                          },
                        dateInput: {
                          
                          borderWidth: 0,borderColor: '#707070',fontSize:14
                        }
                        // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(endDate) => {
                          var start = this.state.startDate.split("-")
                          var start_day = start[2];
                          var start_month = start[1];
                          var start_year = start[0];

                          var end = endDate.split("-")
                          var end_day = end[2];
                          var end_month = end[1];
                          var end_year = end[0];

                          if (start_year == end_year && start_month == end_month && start_day > end_day) {
                            if (this.state.lang.indexOf('ar') != -1) {
                              alert('عفوا هذا التاريخ خطأ لايمكن تنفيذ الحجز')
                            } else {
                              alert('Sory you entered wrong date')
                            }

                            return;
                          }
                          if (start_year == end_year && start_month < end_month) {
                            if (this.state.lang.indexOf('ar') != -1) {
                              alert('عفوا هذا التاريخ خطأ لايمكن تنفيذ الحجز')
                            } else {
                              alert('Sory you entered wrong date')
                            }

                            return;
                          }
                          if (start_year < end_year) {
                            if (this.state.lang.indexOf('ar') != -1) {
                              alert('عفوا هذا التاريخ خطأ لايمكن تنفيذ الحجز')
                            } else {
                              alert('Sory you entered wrong date')
                            }

                            return;
                          }

                          this.setState({endDate})
                        }}
                      />   
              </View>
                  </View>
              <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'89%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'موقع الاستلام':'Receving location'}</Text>
        <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center', elevation: 4, shadowOpacity: 0.3, backgroundColor: '#fff', borderRadius: 10,height:height*0.07 }]}>
            <Icon name="caret-down" size={20} color="#707070" style={{margin:10}} />
         
          <View style={{flex:1}}  >
              <TextInput  
                            placeholderTextColor='#D4D4D4'
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'موقع الاستلام' :'Receving location'} 
                            underlineColorAndroid="transparent"
                            defaultValue={this.state.recevingLocation}
                            onChangeText={(recevingLocation) => this.setState({ recevingLocation  }) } 
                            style={[this.state.lang === 'ar' ? styles.right : styles.left,{width:'100%',height:'100%',borderRadius: 7,color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput>
              </View>
          <Image source={require('../img/map.png')}
            style={{ width: 20, height: 20, margin: 7 }} resizeMode="contain" />
        </View>
                <View style={[this.state.lang === 'ar'?styles.pRow:styles.pRow_res,{width: '89%',marginTop: 5,}]}>
                <TouchableOpacity
                onPress={()=>{
                  this.setState({isVisible:true})
                 }}>  
                <Text style={[this.state.lang === 'ar' ? styles.right : styles.left,{ color: '#C8972C',fontSize:14,margin:3}]}>{this.state.lang === 'ar' ? 'أعرض الخريطه' : 'Show map'}</Text>
                </TouchableOpacity>
               <Text style={{ textAlign: 'center', color: '#707070', fontSize: 14,margin: 3 }}>{this.state.lang === 'ar' ? 'لا تستطيع أيجاد الموقع؟' : 'You cannot find location?'}</Text>
                <Image source={require('../img/ques.png')} 
                style={{width:20,height:20,margin:3}} resizeMode="contain" />
                </View> 
                <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'89%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'موقع التسليم':'Delivering location'}</Text>
             
                <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center', elevation: 4, shadowOpacity: 0.3, backgroundColor: '#fff', borderRadius: 10,height:height*0.07 }]}>
        
            <Icon name="caret-down" size={20} color="#707070" style={{margin:10}} />
          <View style={{flex:1}}  >
               <TextInput  
                            placeholderTextColor='#D4D4D4'
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'موقع التسليم' :'Delivering location'} 
                            underlineColorAndroid="transparent"
                            defaultValue={this.state.deliveringLocation}
                            onChangeText={(deliveringLocation) => this.setState({ deliveringLocation  }) } 
                            style={[this.state.lang === 'ar' ? styles.right : styles.left,{width:'100%',height:'100%',borderRadius: 7,color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput>
              </View>
          <Image source={require('../img/map.png')}
            style={{ width: 20, height: 20, margin: 7 }} resizeMode="contain" />
        </View> 
               
            <Modal
             isVisible={this.state.isVisible}
             onBackdropPress={() => this.setState({ isVisible: false })}
             swipeDirection="left"
             >
          <View style={[styles.mapContainer,{height:'80%',flexDirection:'column'}]}>
            {/* <MapView
             style={[styles.map,{flex:1}]}
             initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.015,
             longitudeDelta: 0.0121,
             }}
             showsUserLocation={true}
             zoomTapEnabled={true}
             mapType ='standard'
            >
              <Marker coordinate={ {latitude: 37.78825,longitude: -122.4324} }
               title = "title"
               description = "description"
               pinColor = "blue"
               image = {require("../img/map.png")} />
           </MapView> */}
           <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,{width:'100%',alignItems:'center',left:10,top:10,position:'absolute'}]}>
                <TouchableOpacity
                 onPress={()=>this.setState({isVisible:false})}>
               <Icon name="close" size={18} color="#707070" style={{}} />
               </TouchableOpacity>
            </View>
         </View>
         
          </Modal>

                <TouchableOpacity
                   onPress={async() => {
                    if(this.state.userId!=''){
                      // this.props.navigation.navigate('Additions',{track:0})
                      const errors = this.validate();
                      this.setState({ errors });
                      if (Object.keys(errors).length === 0) {
                        const obj ={
                          carID:this.state.carId,
                          startDate:this.state.startDate,
                          endDate:this.state.endDate,
                          startTimeH:this.state.startTimeH,
                          startTimeM:this.state.startTimeM,
                          endTimeH:this.state.endTimeH,
                          endTimeM:this.state.endTimeM,
                          receving:this.state.recevingLocation,
                          delivering:this.state.deliveringLocation,
                          insurance:this.state.insurance
                        }
                        await AsyncStorage.setItem('Step1',JSON.stringify(obj));
                        this.props.navigation.navigate('Additions',{track:1})
                      }else{
                        this.setState({flag_lang:1})
                      }
                     }else{
                      if (this.state.lang.indexOf('ar') != -1) {
                        alert('يجب تسجيل الدخول أولا');
                      }
                      else {
                        alert('You must login first');
                      }
                     }
                   }}
                   style={{ width: '89%', backgroundColor: '#343434', marginTop: '5%', justifyContent: 'center', borderRadius: 7, alignItems: 'center', }}>
                   <Text style={{ width: '100%', height: height*0.07, textAlign: 'center', alignItems: 'center', color: '#FFFFFF', fontSize: 18,fontFamily:'segoe', textAlignVertical: 'center',   }}>
                   {this.state.lang.indexOf('ar') != -1 ? '  أحجز الأن  ' : ' Reserve now'}
                  </Text>
                  </TouchableOpacity>             
              </View>

                               

                              {this.state.flag_reserve == 1 ?
                                <View style={{ width: '100%', justifyContent: 'center', marginTop: 20, alignItems: 'center' }}>
                                  {this.state.lang.indexOf('ar') != -1 ?

                                    <View style={{ width: '100%', justifyContent: 'center', marginTop: 20, alignItems: 'center' }}>
                                      <View style={{ width: '90%', height: 50, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>

                                        <DatePicker
                                          style={{ width: '40%', backgroundColor: '#fff', borderColor: '#707070', borderWidth: 1, borderRadius: 5, flex: 1, marginStart: 5, justifyContent: 'center' }}
                                          date={this.state.endDate}
                                          placeholder={this.state.lang.indexOf('ar') != -1 ? 'تاريخ الانتهاء' : 'End Date'}
                                          // placeholder={strings("CarDetail.EndDate")}
                                          mode="date"
                                          format="YYYY-MM-DD"
                                          // minDate="2016-05-01"
                                          // maxDate="2016-06-01"
                                          minDate={this.state.minDate}
                                          // endDate={this.state.car_endDate}
                                          confirmBtnText="Confirm"
                                          cancelBtnText="Cancel"
                                          customStyles={{
                                            dateIcon: {
                                              // position: 'absolute',
                                              // left: 0,
                                              // top: 4,
                                              // marginLeft: 0
                                            },
                                            dateInput: {
                                              marginLeft: 0
                                              , borderWidth: 0, borderColor: '#707070', alignItems: 'center',  fontSize: 14
                                            }
                                            // ... You can check the source to find the other keys.
                                          }}
                                          onDateChange={(endDate) => {

                                            var res1 = this.state.car_endDate.split("-")
                                            var day = res1[2];
                                            var month = res1[1];
                                            var year = res1[0];

                                            var res = endDate.split("-")
                                            var booking_day = res[2];
                                            var booking_month = res[1];
                                            var booking_year = res[0];



                                            if (year == booking_year && month == booking_month && day < booking_day) {
                                              if (this.state.lang.indexOf('ar') != -1) {
                                                alert('عفوا هذا التاريخ خطأ لايمكن تنفيذ الحجز')
                                              } else {
                                                alert('Sory you entered wrong date')
                                              }

                                              return;
                                            }
                                            if (year == booking_year && month < booking_month) {
                                              if (this.state.lang.indexOf('ar') != -1) {
                                                alert('عفوا هذا التاريخ خطأ لايمكن تنفيذ الحجز')
                                              } else {
                                                alert('Sory you entered wrong date')
                                              }

                                              return;
                                            }
                                            if (year < booking_year) {
                                              if (this.state.lang.indexOf('ar') != -1) {
                                                alert('عفوا هذا التاريخ خطأ لايمكن تنفيذ الحجز')
                                              } else {
                                                alert('Sory you entered wrong date')
                                              }

                                              return;
                                            }
                                            this.setState({ endDate })
                                          }}
                                        />
                                        <DatePicker
                                          style={{ width: '40%', backgroundColor: '#fff', borderColor: '#707070', borderWidth: 1, borderRadius: 5, flex: 1, justifyContent: 'center', marginStart: 5 }}
                                          date={this.state.startDate}
                                          placeholder={this.state.lang.indexOf('ar') != -1 ? ' تاريخ البدء' : 'Start Date'}
                                          // placeholder={strings("CarDetail.StartDate")}
                                          mode="date"
                                          format="YYYY-MM-DD"
                                          minDate={this.state.minDate}
                                          confirmBtnText="Confirm"
                                          cancelBtnText="Cancel"
                                          customStyles={{
                                            dateIcon: {
                                              // position: 'absolute',
                                              // left: 0,
                                              // top: 4,
                                              // marginLeft: 0
                                            },
                                            dateInput: {
                                              marginLeft: 0
                                              , borderWidth: 0, borderColor: '#707070', alignItems: 'center', fontSize: 14
                                            }
                                            // ... You can check the source to find the other keys.
                                          }}
                                          onDateChange={(startDate) => {
                                            var res1 = this.state.car_endDate.split("-")
                                            var day = res1[2];
                                            var month = res1[1];
                                            var year = res1[0];

                                            var res = startDate.split("-")
                                            var booking_day = res[2];
                                            var booking_month = res[1];
                                            var booking_year = res[0];
                                            // alert(''+day)


                                            if (year == booking_year && month == booking_month && day < booking_day) {
                                              if (this.state.lang.indexOf('ar') != -1) {
                                                alert('عفوا هذا التاريخ خطأ لايمكن تنفيذ الحجز')
                                              } else {
                                                alert('Sory you entered wrong date')
                                              }

                                              return;
                                            }
                                            if (year == booking_year && month < booking_month) {
                                              if (this.state.lang.indexOf('ar') != -1) {
                                                alert('عفوا هذا التاريخ خطأ لايمكن تنفيذ الحجز')
                                              } else {
                                                alert('Sory you entered wrong date')
                                              }

                                              return;
                                            }
                                            if (year < booking_year) {
                                              if (this.state.lang.indexOf('ar') != -1) {
                                                alert('عفوا هذا التاريخ خطأ لايمكن تنفيذ الحجز')
                                              } else {
                                                alert('Sory you entered wrong date')
                                              }

                                              return;
                                            }
                                            this.setState({ startDate })
                                          }}
                                        />
                                      </View>
                                      <TextInput
                                        placeholderTextColor='#000'
                                        underlineColorAndroid="transparent"
                                        defaultValue={this.state.notes}
                                        onChangeText={(notes) => this.setState({ notes })}
                                        placeholder={this.state.lang.indexOf('ar') != -1 ? ' أكتب ملاحظاتك هنا  ' : ' Write notes here'}
                                        // placeholder={strings("CarDetail.Notes")}
                                        placeholderTextColor="#70707037"
                                        style={{ width: 300, height: 80, textAlign: 'left', fontSize: 14, color: '#707070', marginTop: 5, borderRadius: 10, borderColor: '#707070', borderWidth: 1, textAlignVertical: 'top' }}
                                      ></TextInput>
                                    </View>
                                    :
                                    <View style={{ width: '100%', justifyContent: 'center', marginTop: 20, alignItems: 'center' }}>
                                      <View style={{ width: '90%', height: 50, flexDirection: 'row-reverse', justifyContent: 'space-between', marginTop: 10 }}>

                                        <DatePicker
                                          style={{ width: '40%', backgroundColor: '#fff', borderColor: '#707070', borderWidth: 1, borderRadius: 5, flex: 1, marginStart: 5, justifyContent: 'center' }}
                                          date={this.state.endDate}
                                          placeholder={this.state.lang.indexOf('ar') != -1 ? 'تاريخ الانتهاء' : 'End Date'}
                                          // placeholder={strings("CarDetail.EndDate")}
                                          mode="date"
                                          format="YYYY-MM-DD"
                                          // minDate="2016-05-01"
                                          // maxDate="2016-06-01"
                                          minDate={this.state.minDate}
                                          // endDate={this.state.car_endDate}
                                          confirmBtnText="Confirm"
                                          cancelBtnText="Cancel"
                                          customStyles={{
                                            dateIcon: {
                                              // position: 'absolute',
                                              // left: 0,
                                              // top: 4,
                                              // marginLeft: 0
                                            },
                                            dateInput: {
                                              marginLeft: 0
                                              , borderWidth: 0, borderColor: '#707070', alignItems: 'center',  fontSize: 14
                                            }
                                            // ... You can check the source to find the other keys.
                                          }}
                                          onDateChange={(endDate) => {

                                            var res1 = this.state.car_endDate.split("-")
                                            var day = res1[2];
                                            var month = res1[1];
                                            var year = res1[0];

                                            var res = endDate.split("-")
                                            var booking_day = res[2];
                                            var booking_month = res[1];
                                            var booking_year = res[0];



                                            if (year == booking_year && month == booking_month && day < booking_day) {
                                              if (this.state.lang.indexOf('ar') != -1) {
                                                alert('عفوا هذا التاريخ خطأ لايمكن تنفيذ الحجز')
                                              } else {
                                                alert('Sory you entered wrong date')
                                              }

                                              return;
                                            }
                                            if (year == booking_year && month < booking_month) {
                                              if (this.state.lang.indexOf('ar') != -1) {
                                                alert('عفوا هذا التاريخ خطأ لايمكن تنفيذ الحجز')
                                              } else {
                                                alert('Sory you entered wrong date')
                                              }

                                              return;
                                            }
                                            if (year < booking_year) {
                                              if (this.state.lang.indexOf('ar') != -1) {
                                                alert('عفوا هذا التاريخ خطأ لايمكن تنفيذ الحجز')
                                              } else {
                                                alert('Sory you entered wrong date')
                                              }

                                              return;
                                            }
                                            this.setState({ endDate })
                                          }}
                                        />
                                        <DatePicker
                                          style={{ width: '40%', backgroundColor: '#fff', borderColor: '#707070', borderWidth: 1, borderRadius: 5, flex: 1, justifyContent: 'center', marginStart: 5 }}
                                          date={this.state.startDate}
                                          placeholder={this.state.lang.indexOf('ar') != -1 ? ' تاريخ البدء' : 'Start Date'}
                                          // placeholder={strings("CarDetail.StartDate")}
                                          mode="date"
                                          format="YYYY-MM-DD"
                                          minDate={this.state.minDate}
                                          confirmBtnText="Confirm"
                                          cancelBtnText="Cancel"
                                          customStyles={{
                                            dateIcon: {
                                              // position: 'absolute',
                                              // left: 0,
                                              // top: 4,
                                              // marginLeft: 0
                                            },
                                            dateInput: {
                                              marginLeft: 0
                                              , borderWidth: 0, borderColor: '#707070', alignItems: 'center',  fontSize: 14
                                            }
                                            // ... You can check the source to find the other keys.
                                          }}
                                          onDateChange={(startDate) => {
                                            var res1 = this.state.car_endDate.split("-")
                                            var day = res1[2];
                                            var month = res1[1];
                                            var year = res1[0];

                                            var res = startDate.split("-")
                                            var booking_day = res[2];
                                            var booking_month = res[1];
                                            var booking_year = res[0];
                                            // alert(''+day)


                                            if (year == booking_year && month == booking_month && day < booking_day) {
                                              if (this.state.lang.indexOf('ar') != -1) {
                                                alert('عفوا هذا التاريخ خطأ لايمكن تنفيذ الحجز')
                                              } else {
                                                alert('Sory you entered wrong date')
                                              }

                                              return;
                                            }
                                            if (year == booking_year && month < booking_month) {
                                              if (this.state.lang.indexOf('ar') != -1) {
                                                alert('عفوا هذا التاريخ خطأ لايمكن تنفيذ الحجز')
                                              } else {
                                                alert('Sory you entered wrong date')
                                              }

                                              return;
                                            }
                                            if (year < booking_year) {
                                              if (this.state.lang.indexOf('ar') != -1) {
                                                alert('عفوا هذا التاريخ خطأ لايمكن تنفيذ الحجز')
                                              } else {
                                                alert('Sory you entered wrong date')
                                              }

                                              return;
                                            }
                                            this.setState({ startDate })
                                          }}
                                        />
                                      </View>
                                      <TextInput
                                        placeholderTextColor='#000'
                                        underlineColorAndroid="transparent"
                                        defaultValue={this.state.notes}
                                        onChangeText={(notes) => this.setState({ notes })}
                                        placeholder={this.state.lang.indexOf('ar') != -1 ? ' أكتب ملاحظاتك هنا  ' : ' Write notes here'}
                                        // placeholder={strings("CarDetail.Notes")}
                                        placeholderTextColor="#70707037"
                                        style={{ width: 300, height: 80, textAlign: 'left', fontSize: 14, color: '#707070', marginTop: 5, borderRadius: 10, borderColor: '#707070', borderWidth: 1, textAlignVertical: 'top' }}
                                      ></TextInput>
                                    </View>
                                  }

                                </View>
                                : <View style={{ display: 'none' }} ></View>}

                            </ScrollView>
                   </View>
                          }

                        </View>
                      }

                    </View>

                  }

                </View>
                </View>
              }
 
            </View>
           
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
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#707070",
            width: '80%'

          }} >

            <View style={{ width: '80%', marginTop: 10, justifyContent: 'center', alignItems: 'center' }} >
              <Text style={{ width: '100%', textAlign: 'center', alignItems: 'center', textAlignVertical: 'center', color: '#343434', fontSize: 20,fontFamily:'segoe' }}>
                {this.state.lang.indexOf('ar') != -1 ? '  تمت عمليه الحجز بنجاح  ' : ' Reserve done successfully'}
                {/* {strings("CarDetail.ReserveDone")} */}
              </Text>

              <TouchableOpacity
                onPress={() => { this.refs.modal.close() }}
                style={{ width: '40%', backgroundColor: '#343434', marginTop: '10%', justifyContent: 'center', borderRadius: 20, alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ width: '100%', height: 37, textAlign: 'center', alignItems: 'center', color: '#FFFFFF', fontSize: 20,fontFamily:'segoe', padding: 5, textAlignVertical: 'center' }}>
                  {this.state.lang.indexOf('ar') != -1 ? '  نعــم  ' : ' Yes'}
                  {/* {strings("CarDetail.Yes")}  */}
                </Text>
              </TouchableOpacity>

            </View>


          </View>

        </Modal>

        <Modal style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          backgroundColor: 'transparent'
        }}
          position={"center"} ref={"modal1"} >

          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#707070",
            width: '80%'

          }} >

            <View style={{ width: '80%', marginTop: 10, justifyContent: 'center', alignItems: 'center' }} >
              <Text style={{ width: '100%', textAlign: 'center', alignItems: 'center', textAlignVertical: 'center', color: '#343434', fontSize: 20,fontFamily:'segoe' }}>
                {this.state.lang.indexOf('ar') != -1 ? 'عفوا هذه السياره محجوزه' : 'Sorry, Car is reserved'}
                {/* {strings("CarDetail.ReserveDone")} */}
              </Text>

              <TouchableOpacity
                onPress={() => { this.refs.modal1.close() }}
                style={{ width: '40%', backgroundColor: '#343434', marginTop: '10%', justifyContent: 'center', borderRadius: 20, alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ width: '100%', height: 37, textAlign: 'center', alignItems: 'center', color: '#FFFFFF', fontSize: 20,fontFamily:'segoe', padding: 5, textAlignVertical: 'center' }}>
                  {this.state.lang.indexOf('ar') != -1 ? '  نعــم  ' : ' Yes'}
                  {/* {strings("CarDetail.Yes")}  */}
                </Text>
              </TouchableOpacity>

            </View>


          </View>

        </Modal>

      </SafeAreaView>
    );
  }
}
export default CarDetailsScreen;
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
  view:{
    width:width ,
    alignItems:'center',
    justifyContent:'center',
  },
  text:{
    width:'70%',
    color:'#343434',
    fontSize:14,
    margin:5,
    textAlignVertical:'center',
    fontFamily:'segoe',
  },
  viewItem:{
    width:'95%',
    height:height / 5,
    alignItems:'center',
    justifyContent:'center',
  },
  linearGradient: {
    width:width,
    height:'100%',
    borderRadius:15,
    position:'absolute',
   },
   pRow: {
    flexDirection: 'row',
    justifyContent:'flex-end'
},
  pRow_res:{
  flexDirection: 'row-reverse',
  justifyContent:'flex-end'
},
mapContainer:{
  width:'100%',
  alignItems:'center',
  backgroundColor:'#fff',
},
map: {
  ...StyleSheet.absoluteFillObject,
},
 
});