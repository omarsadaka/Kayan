import React, { Component } from 'react';
import { View, Text, YellowBox, StyleSheet, BackHandler, TouchableOpacity, TextInput, Image, ImageBackground, Alert } from 'react-native';
import { AsyncStorage, SafeAreaView } from 'react-native';
import { ActivityIndicator, FlatList, ScrollView, RefreshControl } from 'react-native';
//import Toast from 'react-native-simple-toast';
//import DeviceInfo from 'react-native-device-info';
// import { strings } from '../i18n';
//import I18n from 'react-native-i18n'
import NetInfo from "@react-native-community/netinfo";

class MyCarRentRequest extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lang: '',
      flag_lang: 0,
      flag_design: 0,
      bg1: '#C8972C',
      bg2: '#FFFFFF',
      txt1: '#FFFFFF',
      txt2: '#000000',
      pendingRequest: [],
      finishingRequest: [],
      filterPendingRequest: [],
      filterFinishingRequest: [],
      userData: {},
      userId: '',
      key: '',
      modeles: [],
      typies: [],
      modelId: 1,
      typeId: 1,
      catID: 0,
      refreshing: false,
      drivers_en: [
        {
          label: 'Driver',
          value: '0',
          key: '0'
        },
        {
          label: 'Yes',
          value: '1',
          key: '0'
        },
        {
          label: 'No',
          value: '2',
          key: '0'
        }
      ],
      drivers_ar: [
        {
          label: 'سواق',
          value: '0',
          key: '0'
        },
        {
          label: 'نعــم',
          value: '1',
          key: '0'
        },
        {
          label: 'لا',
          value: '2',
          key: '0'
        }
      ],
      flag_pending: 0,
      flag_pending: 0




    }

  }


  componentDidMount() {
    //NativeModules.ExceptionsManager = null;
    this._retrieveData();
  }
  _retrieveData = async () => {
    try {
      const lang = await AsyncStorage.getItem('lang');
      this.setState({ lang })
      //  this.setState({flag_lang:1})
      const value = await AsyncStorage.getItem('loginDataKayan');
      if (value) {
        const data = JSON.parse(value);
        this.setState({ userData: data })
        this.setState({ userId: this.state.userData._id })
        this.getPengingRequest();
        this.getModel();
        this.getTypes();

      } else {
        var data2 = {
          _id: '1',
          fullname: 'أسم المستخدم'
        }
        this.setState({ userData: data2 })
      }
      // this.getPengingRequest();
      // this.getFinishingRequest();
    } catch (error) { }
  }
  handleRefresh1 = () => {
    this.setState({
      refreshing: true,
    }, () => {
      this.getPengingRequest();
    })
  }
  handleRefresh2 = () => {
    this.setState({
      refreshing: true,
    }, () => {
      this.getFinishingRequest();
    })
  }

  getPengingRequest = () => {
    this.setState({ flag_lang: 0 })
    NetInfo.fetch().then(state => {
      if(state.isConnected)
      {
        fetch('http://134.209.178.237/api/user/pendingRequests?id=' + this.state.userId)
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({ flag_lang: 1 });
            this.setState({ refreshing: false })
            const Data = responseJson;
            if (Data.length > 0) {
              const carInfo = []
              for (let index = 0; index < Data.length; index++) {

                if (this.state.lang.indexOf('ar') != -1) {
                  const status = Data[index].status
                  if (status == 1) {
                    this.setState({ key: 'قيد التنفيذ' })
                  } else if (status == 3) {
                    this.setState({ key: 'مقبول' })
                  } else if (status == 4) {
                    this.setState({ key: 'بدأ الايجار' })
                  }
                  var obj = {
                    id: Data[index]._id,
                    userImg: Data[index].userID.personalImg,
                    userName: Data[index].userID.fullname,
                    userPhone: Data[index].userID.mobile,
                    startDate: Data[index].startDate,
                    endDate: Data[index].endDate,
                    carNum: Data[index].carID.carNum,
                    keyStatus: this.state.key,
                    carTypeID: Data[index].carID.carTypeID._id,
                    carModelID: Data[index].carID.carModelID._id,
                    allowDeiver: Data[index].carID.allowDriver,
                    cat: Data[index].carID.categoryID.titleAr,
                    type: Data[index].carID.carTypeID.titleAr,
                    model: Data[index].carID.carModelID.titleAr,
                    requestNumber: Data[index].requestNumber
                  }
                } else {
                  const status = Data[index].status
                  if (status == 1) {
                    this.setState({ key: 'Pending' })
                  } else if (status == 3) {
                    this.setState({ key: 'Accepted' })
                  } else if (status == 4) {
                    this.setState({ key: 'Start rent' })
                  }
                  var obj = {
                    id: Data[index]._id,
                    userImg: Data[index].userID.personalImg,
                    userName: Data[index].userID.fullname,
                    userPhone: Data[index].userID.mobile,
                    startDate: Data[index].startDate,
                    endDate: Data[index].endDate,
                    carNum: Data[index].carID.carNum,
                    keyStatus: this.state.key,
                    carTypeID: Data[index].carID.carTypeID._id,
                    carModelID: Data[index].carID.carModelID._id,
                    allowDeiver: Data[index].carID.allowDriver,
                    cat: Data[index].carID.categoryID.titleEN,
                    type: Data[index].carID.carTypeID.titleEN,
                    model: Data[index].carID.carModelID.titleEN,
                    requestNumber: Data[index].requestNumber
                  }
                }

                carInfo.push(obj)
              }
              this.setState({ pendingRequest: carInfo });
              this.setState({ filterPendingRequest: carInfo });
            } else {
              this.setState({ refreshing: false })
              this.setState({ flag_pending: 0 })
              // if (this.state.lang.indexOf('ar')!=-1) {
              //   this.setState({flag_lang:1});
              //   alert('عذرا لا يوجد  حجوزات الأن  ');
              // }else{
              //   this.setState({flag_lang:1});
              //   alert('No reservation now   ')
              // }
            }



          })
          .catch((error) => {
            this.setState({ refreshing: false })
            this.setState({ flag_lang: 1 });
            alert("" + { error });

          });

      } else {
        this.setState({ refreshing: false })
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

  getFinishingRequest = () => {
    this.setState({ flag_lang: 0 })
    NetInfo.fetch().then(state => {
      if(state.isConnected)
      {
        fetch('http://134.209.178.237/api/user/finishRequests?id=' + this.state.userId)
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({ flag_lang: 1 });
            this.setState({ refreshing: false })
            const Data = responseJson;
            if (Data.length > 0) {
              const carInfo = []
              for (let index = 0; index < Data.length; index++) {
                this.setState({ flag_lang: 1 });
                if (this.state.lang.indexOf('ar') != -1) {
                  const status = Data[index].status
                  if (status == 5) {
                    this.setState({ key: 'انتهي' })
                  }
                  // else if(status == 3){
                  //   this.setState({key:'مقبول'})
                  // }else if(status == 4){
                  //   this.setState({key:'بدأ الايجار'})
                  // }
                  var obj = {
                    id: Data[index]._id,
                    userImg: Data[index].userID.personalImg,
                    userName: Data[index].userID.fullname,
                    userPhone: Data[index].userID.mobile,
                    startDate: Data[index].startDate,
                    endDate: Data[index].endDate,
                    carNum: Data[index].carID.carNum,
                    keyStatus: this.state.key,
                    carTypeID: Data[index].carID.carTypeID._id,
                    carModelID: Data[index].carID.carModelID._id,
                    allowDeiver: Data[index].carID.allowDriver,
                    cat: Data[index].carID.categoryID.titleAr,
                    type: Data[index].carID.carTypeID.titleAr,
                    model: Data[index].carID.carModelID.titleAr

                  }
                } else {
                  const status = Data[index].status
                  if (status == 5) {
                    this.setState({ key: 'Finished' })
                  }
                  // else if(status == 3){
                  //   this.setState({key:'Accepted'})
                  // }else if(status == 4){
                  //   this.setState({key:'StartRent'})
                  // }
                  var obj = {
                    id: Data[index]._id,
                    userImg: Data[index].userID.personalImg,
                    userName: Data[index].userID.fullname,
                    userPhone: Data[index].userID.mobile,
                    startDate: Data[index].startDate,
                    endDate: Data[index].endDate,
                    carNum: Data[index].carID.carNum,
                    keyStatus: this.state.key,
                    carTypeID: Data[index].carID.carTypeID._id,
                    carModelID: Data[index].carID.carModelID._id,
                    allowDeiver: Data[index].carID.allowDriver,
                    cat: Data[index].carID.categoryID.titleEN,
                    type: Data[index].carID.carTypeID.titleEN,
                    model: Data[index].carID.carModelID.titleEN

                  }
                }

                carInfo.push(obj)
              }
              this.setState({ pendingRequest: carInfo });
              this.setState({ filterPendingRequest: carInfo });
            } else {
              this.setState({ flag_finish: 0 })
              // if (this.state.lang.indexOf('ar')!=-1) {
              //   this.setState({flag_lang:1});
              //   alert(' لا يوجد حجوزات منتهيه   ');
              // }else{
              //   this.setState({flag_lang:1});
              //   alert('No finishing reservation now  ')
              // }
            }



          })
          .catch((error) => {
            this.setState({ refreshing: false })
            this.setState({ flag_lang: 1 });
            alert("" + { error });

          });

      } else {
        this.setState({ refreshing: false })
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
  getModel = () => {
    NetInfo.fetch().then(state => {
      if(state.isConnected)
      {
        fetch('http://134.209.178.237/api/user/carModel')
          .then((response) => response.json())
          .then((responseJson) => {
            const models = responseJson;
            const modelsAr = [];
            if (this.state.lang.indexOf('ar') != -1) {

              models.forEach(element => {
                modelsAr.push({
                  label: element.titleAr, value: element._id, key: element._id
                })
              });
              modelsAr.unshift({
                label: ' الموديلات', value: '1', key: '1'
              })

            } else {
              models.forEach(element => {
                modelsAr.push({
                  label: element.titleEN, value: element._id, key: element._id
                })
              });
              modelsAr.unshift({
                label: ' Models', value: '1', key: '1'
              })

            }
            this.setState({ modeles: modelsAr });

          })
          .catch((error) => {
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
  getTypes = () => {
    NetInfo.fetch().then(state => {
      if(state.isConnected)
      {
        fetch('http://134.209.178.237/api/user/carType')
          .then((response) => response.json())
          .then((responseJson) => {
            const types = responseJson;
            const typesAr = [];
            if (this.state.lang.indexOf('ar') != -1) {

              types.forEach(element => {
                typesAr.push({
                  label: element.titleAr, value: element._id, key: element._id
                })
              });
              typesAr.unshift({
                label: ' الانواع', value: '1', key: '1'
              })

            } else {
              types.forEach(element => {
                typesAr.push({
                  label: element.titleEN, value: element._id, key: element._id
                })
              });
              typesAr.unshift({
                label: ' types', value: '1', key: '1'
              })

            }
            this.setState({ typies: typesAr });

          })
          .catch((error) => {
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

  filterData = (type, model, driver) => {

    var tempArr = [];

    //this.setState({CarData: this.state.filterCarData});
    if (type != 1) {
      this.state.filterPendingRequest.forEach(car => {
        if (car.carTypeID == type) {
          if (model == car.carModelID || model == 1) {
            if (driver == car.allowDeiver || driver == 0) {
              tempArr.push(car)
            }
          }
        }
      });
      this.setState({ pendingRequest: tempArr });

    } else if (model != 1) {
      this.state.filterPendingRequest.forEach(car => {
        if (car.carModelID == model) {
          if (type == car.carTypeID || type == 1) {
            if (driver == car.allowDeiver || driver == 0) {
              tempArr.push(car)
            }
          }
        }
      });
      this.setState({ pendingRequest: tempArr });
    } else if (driver != 0) {
      this.state.filterPendingRequest.forEach(car => {
        if (car.allowDeiver == driver) {
          if (model == car.carModelID || model == 1) {
            if (type == car.carTypeID || type == 1) {
              tempArr.push(car)
            }
          }
        }
      });
      this.setState({ pendingRequest: tempArr });
    } else {
      this.setState({ pendingRequest: this.state.filterPendingRequest });
    }



  }


  renderItem(item) {
    return (
      <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        {this.state.lang.indexOf('ar') != -1 ?
          <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('MyCarReqDetails', { myCarRequest_id: item.id })}
            >
              <View style={{ margin: 5, width: '98%', backgroundColor: '#FCFCFC', borderColor: '#EFEAEA', borderRadius: 10, borderWidth: 1 }}>

                <View style={{ width: '100%', padding: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ flex: 1, fontSize: 16, textAlign: 'center', color: '#343434', }}> {"رقم الطلب : " + item.requestNumber}</Text>
                </View>

                <View style={{ width: '100%', height: 50, padding: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                  <Text style={{ flex: 1, fontSize: 16, textAlign: 'center', color: '#343434', }}> {item.model}</Text>
                  <Text style={{ flex: 1, fontSize: 16, textAlign: 'center', color: '#343434', }}> {item.type}</Text>
                  <Text style={{ flex: 1, fontSize: 16, textAlign: 'center', color: '#343434', }}> {item.cat}</Text>
                </View>

                <View style={{ width: '100%', padding: 3, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                  <Image

                    source={{ uri: item.userImg }} style={{ width: '30%', height: 80, alignItems: 'center', borderRadius: 10 }}>
                  </Image>

                  <View style={{ width: '60%', justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{ width: '100%', fontSize: 14, textAlign: 'right', color: '#343434', marginEnd: 10, margin: 3 }}> {item.userName}</Text>
                    <Text style={{ width: '100%', fontSize: 14, textAlign: 'right', color: '#343434', marginEnd: 10, margin: 3 }}> {item.userPhone}</Text>
                  </View>

                </View>

                <View style={{ width: '99%', padding: 3, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 7 }}>
                  <Text style={{ width: '10%', fontSize: 14, textAlign: 'center', color: '#343434', }}>
                    {/* {strings("MrCarRent.from")} */}
                    مـن
              </Text>
                  <Image
                    resizeMode="stretch"
                    style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}
                    source={require('../img/calendar.png')}>
                  </Image>
                  <Text style={{ width: '30%', fontSize: 14, textAlign: 'right', color: '#343434', borderBottomColor: '#707070', borderBottomWidth: 1 }}>{item.startDate.split('T')[0].trim()}</Text>
                  <Text style={{ width: '5%' }}></Text>
                  <Text style={{ width: '10%', fontSize: 14, textAlign: 'center', color: '#343434', }}>
                    {/* {strings("MrCarRent.to")} */}
                    حتي
           </Text>
                  <Image
                    resizeMode="stretch"
                    style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}
                    source={require('../img/calendar.png')}>
                  </Image>
                  <Text style={{ width: '30%', fontSize: 14, textAlign: 'right', color: '#343434', borderBottomColor: '#707070', borderBottomWidth: 1 }}>{item.endDate.split('T')[0].trim()}</Text>
                </View>

              </View>
            </TouchableOpacity>

          </View>
          :
          <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('MyCarReqDetails', { myCarRequest_id: item.id })}
            >
              <View style={{ margin: 5, width: '98%', backgroundColor: '#FCFCFC', borderColor: '#EFEAEA', borderRadius: 10, borderWidth: 1 }}>
                
              <View style={{ width: '100%', padding: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ flex: 1, fontSize: 16, textAlign: 'center', color: '#343434', }}> {"Order number: " + item.requestNumber}</Text>
              </View>
                
                <View style={{ width: '100%', height: 50, padding: 3, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center' }}>

                  <Text style={{ flex: 1, fontSize: 16, textAlign: 'center', color: '#343434', }}> {item.model}</Text>
                  <Text style={{ flex: 1, fontSize: 16, textAlign: 'center', color: '#343434', }}> {item.type}</Text>
                  <Text style={{ flex: 1, fontSize: 16, textAlign: 'center', color: '#343434', }}> {item.cat}</Text>
                </View>

                <View style={{ width: '100%', padding: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                  <Image

                    source={{ uri: item.userImg }} style={{ width: '30%', height: 80, alignItems: 'center', borderRadius: 10 }}>
                  </Image>

                  <View style={{ width: '60%', justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{ width: '100%', fontSize: 14, textAlign: 'left', color: '#343434', marginEnd: 10, margin: 3 }}> {item.userName}</Text>
                    <Text style={{ width: '100%', fontSize: 14, textAlign: 'left', color: '#343434', marginEnd: 10, margin: 3 }}> {item.userPhone}</Text>
                  </View>

                </View>

                <View style={{ width: '99%', padding: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 7 }}>
                  <Text style={{ width: '10%', fontSize: 14, textAlign: 'center', color: '#343434', }}>
                    {/* {strings("MrCarRent.from")} */}
                    From
              </Text>
                  <Image
                    resizeMode="stretch"
                    style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}
                    source={require('../img/calendar.png')}>
                  </Image>
                  <Text style={{ width: '30%', fontSize: 14, textAlign: 'left', color: '#343434', borderBottomColor: '#707070', borderBottomWidth: 1 }}>{item.startDate.split('T')[0].trim()}</Text>
                  <Text style={{ width: '5%' }}></Text>
                  <Text style={{ width: '10%', fontSize: 14, textAlign: 'center', color: '#343434', }}>
                    {/* {strings("MrCarRent.to")} */}
                    Until
              </Text>
                  <Image
                    resizeMode="stretch"
                    style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}
                    source={require('../img/calendar.png')}>
                  </Image>
                  <Text style={{ width: '30%', fontSize: 14, textAlign: 'left', color: '#343434', borderBottomColor: '#707070', borderBottomWidth: 1 }}>{item.endDate.split('T')[0].trim()}</Text>
                </View>

              </View>
            </TouchableOpacity>

          </View>
        }

      </View>
    );
  }


  renderOption() {
    return (
      <View style={{ width: '100%', height: '8%', alignItems: 'center', justifyContent: 'center', }}>
        {this.state.lang.indexOf('ar') != -1 ?
          <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: '#C8972C' }}>
            <TouchableOpacity onPress={() => {
              this.props.navigation.goBack()
            }}
              style={{ width: '8%' }}>
              <Image resizeMode={'cover'} source={require('../img/w_arrow.png')}
                style={{ width: 10, height: 18, alignItems: 'center', margin: 10 }} />
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', width: '80%', flex: 1, fontSize: 20,fontFamily:'segoe', color: "#fff", }}>
              {/* {strings("MrCarRent.barTitle")} */}
              {this.state.lang.indexOf('ar') != -1 ? ' طلبات واردة ' : 'Received request'}
            </Text>

            <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}
              style={{ width: '8%' }}>
              <Image resizeMode={'cover'} source={require('../img/nav.png')}
                style={{ width: 25, height: 25, alignItems: 'center' }} />

            </TouchableOpacity>

          </View>
          :
          <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse', backgroundColor: '#C8972C' }}>
            <TouchableOpacity onPress={() => {
              this.props.navigation.goBack()
            }}
              style={{ width: '8%' }}>
              <Image resizeMode={'cover'} source={require('../img/r_back.png')}
                style={{ width: 10, height: 18, alignItems: 'center', margin: 10 }} />
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', width: '80%', flex: 1, fontSize: 20,fontFamily:'segoe', color: "#fff", }}>
              {/* {strings("MrCarRent.barTitle")} */}
              {this.state.lang.indexOf('ar') != -1 ? ' طلبات واردة ' : 'Received request'}
            </Text>

            <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}
              style={{ width: '8%', marginStart: 7 }}>
              <Image resizeMode={'cover'} source={require('../img/nav.png')}
                style={{ width: 25, height: 25, alignItems: 'center' }} />

            </TouchableOpacity>

          </View>
        }
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={{ width: '100%', backgroundColor: '#FFF', flex: 1, alignItems: 'center', }}>
        {this.renderOption()}
        <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>

          <View style={{ width: '97%', height: 37, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ pendingRequest: [] })
                this.setState({ flag_design: 0 })
                this.setState({ bg1: '#C8972C' })
                this.setState({ bg2: '#FFFFFF' })
                this.setState({ txt1: '#FFFFFF' })
                this.setState({ txt2: '#000000' })
                this.setState({ modelId: 1 })
                this.setState({ typeId: 1 })
                this.setState({ catID: 0 })
                this.getPengingRequest();

              }}
              style={{ width: '30%', borderColor: '#000', borderWidth: 1, borderRadius: 5, flex: 1, backgroundColor: this.state.bg1 }}>
              <Text style={{ width: '100%', textAlign: 'center', color: this.state.txt1, fontSize: 20 }}>
                {this.state.lang.indexOf('ar') != -1 ? ' تحت التنفيذ' : 'Pending'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.setState({ pendingRequest: [] })
                this.setState({ flag_design: 1 })
                this.setState({ bg1: '#FFFFFF' })
                this.setState({ bg2: '#C8972C' })
                this.setState({ txt1: '#000000' })
                this.setState({ txt2: '#FFFFFF' })
                this.setState({ modelId: 1 })
                this.setState({ typeId: 1 })
                this.setState({ catID: 0 })
                this.getFinishingRequest();

              }}
              style={{ width: '30%', borderColor: '#000', borderWidth: 1, borderRadius: 5, flex: 1, marginStart: 3, backgroundColor: this.state.bg2 }}>
              <Text style={{ width: '100%', textAlign: 'center', color: this.state.txt2, fontSize: 20 }}>
                {this.state.lang.indexOf('ar') != -1 ? ' المنتهيـه ' : 'Finished'}
              </Text>
            </TouchableOpacity>

          </View>
          {this.state.flag_lang == 0 ?
            <ActivityIndicator
            color='#C8972C'
              style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }} />
            :
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {this.state.flag_design == 0 ?
                // first Flag
                <View>
                  {this.state.flag_pending == 1 ?
                    <Text style={{
                      width: '90%', alignSelf: "center", justifyContent: 'center', textAlign: 'center', margin: 7, color: '#000',
                      borderRadius: 10, borderWidth: 1, borderColor: '#000', padding: 7, marginTop: 20, fontSize: 16,
                    }}>
                      {this.state.lang.indexOf('ar') != -1 ? " عفوا لا يوجد طلبات قادمه الان " :
                        " Sorry no receiving requests now"}
                    </Text>
                    :
                    <FlatList style={{ width: '100%', marginBottom: '10%' }}
                      data={this.state.pendingRequest}
                      refreshControl={
                        <RefreshControl
                          colors={["#9Bd35A", "#689F38"]}
                          refreshing={this.state.refreshing}
                          onRefresh={this.handleRefresh1}
                        />
                      }
                      numColumns={1}
                      renderItem={({ item }) => this.renderItem(item)}
                      keyExtractor={(item, index) => index.toString()}
                      ref={ref => this.flatList = ref}
                      onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
                      onLayout={() => this.flatList.scrollToEnd({ animated: true })}
                    />
                  }
                </View>
                :
                // second Flag
                <View>
                  {this.state.flag_finish == 1 ?
                    <Text style={{
                      width: '90%', alignSelf: "center", justifyContent: 'center', textAlign: 'center', margin: 7, color: '#000',
                      borderRadius: 10, borderWidth: 1, borderColor: '#000', padding: 7, marginTop: 20, fontSize: 16,
                    }}>
                      {this.state.lang.indexOf('ar') != -1 ? " عفوا لا يوجد طلبات منتهيه الان " :
                        " Sorry no finished requests now"}
                    </Text>
                    :
                    <FlatList style={{ width: '100%', marginBottom: '10%' }}
                      data={this.state.pendingRequest}
                      refreshControl={
                        <RefreshControl
                          colors={["#9Bd35A", "#689F38"]}
                          refreshing={this.state.refreshing}
                          onRefresh={this.handleRefresh2}
                        />
                      }
                      numColumns={1}
                      renderItem={({ item }) => this.renderItem(item)}
                      keyExtractor={(item, index) => index.toString()}
                      ref={ref => this.flatList = ref}
                      onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
                      onLayout={() => this.flatList.scrollToEnd({ animated: true })}
                    />
                  }
                </View>


              }
            </View>
          }
        </View>



      </SafeAreaView>
    );
  }
}
export default MyCarRentRequest;