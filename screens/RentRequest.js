import React, { Component } from 'react';
import { View, Text, YellowBox, StyleSheet, BackHandler, TouchableOpacity, TextInput, Image, ImageBackground, Alert } from 'react-native';
import { AsyncStorage,Dimensions } from 'react-native';
import { ActivityIndicator, FlatList, SafeAreaView, RefreshControl } from 'react-native';
//import Toast from 'react-native-simple-toast';
//import DeviceInfo from 'react-native-device-info';
// import { strings } from '../i18n';
//import I18n from 'react-native-i18n'
import NetInfo from "@react-native-community/netinfo";
const { width, height } = Dimensions.get('window')
import Icon from 'react-native-vector-icons/FontAwesome';




class RentRequest extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lang: '',
      flag_lang: 0,
      flag_design: 0,
      rentRequest:[],
      userData: {},
      userId: '',
      key: '',
      refreshing: false,
      flag_request: 0,
      bg1: '#E4E4E4',
      bg2: '#E4E4E4',
      txt1: '#343434',
      txt2: '#343434',
      clicked:0
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
        this.getRentRequest();
      } else {
        var data2 = {
          _id: '1',
          fullname: 'أسم المستخدم'
        }
        this.setState({ userData: data2 })
      }
    } catch (error) { }
  }
  handleRefresh = () => {
    this.setState({
      refreshing: true,
    }, () => {
       if(this.state.clicked ===0){
        this.getRentRequest();
       }else if(this.state.clicked ===1){
        this.getBusyRequest()
       }else{
        this.getFinishRequest()
       }
    })
  }
  getRentRequest = () => {
    NetInfo.fetch().then(state => {
      if(state.isConnected)
      {
        fetch('http://134.209.178.237/api/user/getUserReservation?userID='+this.state.userId)
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({ flag_lang: 1 });
            this.setState({ refreshing: false })
            const Data = responseJson;
            if (Data.length > 0) {
              const carInfo = []
              for (let index = 0; index < Data.length; index++) {
                if (this.state.lang==='ar') {
                  var obj = {
                    id: Data[index]._id,
                    carImg:Data[index].carID.logo,
                    type:Data[index].carID.carTypeID.titleAr,
                    rate:Data[index].status,
                    price:Data[index].carID.rentPrice,
                    men:Data[index].carID.personNum,
                    speed:Data[index].carID.automatic,
                    bag:Data[index].carID.bagsNum,
                    door:Data[index].carID.doorsNum,
                    status:Data[index].status
                  }
                } else {
                  var obj = {
                    id: Data[index]._id,
                    carImg: Data[index].carID.logo,
                    type: Data[index].carID.carTypeID.titleEN,
                    rate:Data[index].status,
                    price:Data[index].carID.rentPrice,
                    men:Data[index].carID.personNum,
                    speed:Data[index].carID.automatic,
                    bag:Data[index].carID.bagsNum,
                    door:Data[index].carID.doorsNum,
                    status:Data[index].status
                  }
                }
                  carInfo.push(obj)
              }
              this.setState({ rentRequest: carInfo });
            } else {
              this.setState({ refreshing: false })
              this.setState({ flag_request: 0 })
            }

          })
          .catch((error) => {
            this.setState({ refreshing: false })
            this.setState({ flag_lang: 1 });
            alert("" + error);
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
  getFinishRequest = () => {
    this.setState({flag_lang:0})
    NetInfo.fetch().then(state => {
      if(state.isConnected)
      {
        fetch('http://134.209.178.237/api/user/getUserReservation?userID=' + this.state.userId)
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({ flag_lang: 1 });
            this.setState({ refreshing: false })
            const Data = responseJson;
            
              const carInfo = []
              for (let index = 0; index < Data.length; index++) {
                
                if (this.state.lang.indexOf('ar') != -1) {
                  var obj = {
                    id: Data[index]._id,
                    carImg: Data[index].carID.logo,
                    type: Data[index].carID.carTypeID.titleAr,
                    rate:Data[index].status,
                    price:Data[index].carID.rentPrice,
                    men:Data[index].carID.personNum,
                    speed:Data[index].carID.automatic,
                    bag:Data[index].carID.bagsNum,
                    door:Data[index].carID.doorsNum,
                    status:Data[index].status
                  }
                } else {
                  var obj = {
                    id: Data[index]._id,
                    carImg: Data[index].carID.logo,
                    type: Data[index].carID.carTypeID.titleEN,
                    rate:Data[index].status,
                    price:Data[index].carID.rentPrice,
                    men:Data[index].carID.personNum,
                    speed:Data[index].carID.automatic,
                    bag:Data[index].carID.bagsNum,
                    door:Data[index].carID.doorsNum,
                    status:Data[index].status
                  }
                }

                // Data.forEach(car=>{
                //   if(car.status === 2){
                //    carInfo.push(obj)
                //   }
                // })
                if(Data[index].status ===2){
                  carInfo.push(obj)
                }

              }
             
              if (carInfo.length > 0) {
                this.setState({ flag_request: 0 })
                this.setState({ rentRequest: carInfo });
            } else {
              this.setState({ refreshing: false })
              this.setState({ flag_request: 1 })
            }

          })
          .catch((error) => {
            this.setState({ refreshing: false })
            this.setState({ flag_lang: 1 });
            alert("" + error);

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

  getBusyRequest = () => {
    this.setState({flag_lang:0})
    NetInfo.fetch().then(state => {
      if(state.isConnected)
      {
        fetch('http://134.209.178.237/api/user/getUserReservation?userID=' + this.state.userId)
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({ flag_lang: 1 });
            this.setState({ refreshing: false })
            const Data = responseJson;
          
              const carInfo = []
              for (let index = 0; index < Data.length; index++) {
                
                if (this.state.lang.indexOf('ar') != -1) {
                  var obj = {
                    id: Data[index]._id,
                    carImg: Data[index].carID.logo,
                    type: Data[index].carID.carTypeID.titleAr,
                    rate:Data[index].status,
                    price:Data[index].carID.rentPrice,
                    men:Data[index].carID.personNum,
                    speed:Data[index].carID.automatic,
                    bag:Data[index].carID.bagsNum,
                    door:Data[index].carID.doorsNum,
                    status:Data[index].status
                  }
                } else {
                  var obj = {
                    id: Data[index]._id,
                    carImg: Data[index].carID.logo,
                    type: Data[index].carID.carTypeID.titleEN,
                    rate:Data[index].status,
                    price:Data[index].carID.rentPrice,
                    men:Data[index].carID.personNum,
                    speed:Data[index].carID.automatic,
                    bag:Data[index].carID.bagsNum,
                    door:Data[index].carID.doorsNum,
                    status:Data[index].status
                  }
                }

                if(Data[index].status ===1){
                  carInfo.push(obj)
                }
                // Data.forEach(car=>{
                //   if(car.status === 1){
                //    carInfo.push(obj)
                //   }
                // })
              }
              if (carInfo.length > 0) {
                this.setState({ flag_request: 0 })
                this.setState({ rentRequest: carInfo });
            } else {
              this.setState({ refreshing: false })
              this.setState({ flag_request: 1 })
            }
          })
          .catch((error) => {
            this.setState({ refreshing: false })
            this.setState({ flag_lang: 1 });
            alert("" +  error );

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


  

  renderItem(item) {
    return (
      <View style={{ width: width * 0.6, padding: 5, flexDirection: 'row',}}>

        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={() => this.props.navigation.navigate('RentReqDetails', { request_id: item.id })}
        >
          <View style={{ flex: 1,  borderRadius: 5, elevation:5,shadowOpacity:0.3,backgroundColor:'#fff',alignItems:'center', }}>
          <View style={[this.state.lang.indexOf('ar')!=-1?styles.row :styles.row_res ,{ justifyContent:'center',alignItems:"center"}]}>
              <View style={{width:'18%',alignItems:"center",justifyContent:'center'}}>
              <Icon name="star" size={20} color="#FFE000" style={{margin:2}}/>
              <Text style={{ fontSize: 14, color: '#343434',}}>{item.rate}</Text>
              </View>
              <Text style={{ fontSize: 18, color: '#343434',width:"80%" ,fontFamily:"segoe",textAlign:'center' }}>{item.type}</Text>
            </View>
           <View style={{width:'100%',height:2,backgroundColor:'#E4E4E4',marginTop:2,marginBottom:2}}></View>
            <View style={{ width:'90%',height: 90,justifyContent:'center',alignItems:"center",marginTop:3}}>
              <Image
                resizeMode='stretch'
                source={{ uri: item.carImg }} style={{width:'95%', height: '100%', }}>
              </Image>
            </View>
            <View style={[this.state.lang.indexOf('ar')!=-1?styles.row :styles.row_res ,{width:'93%', justifyContent:'center',alignItems:"center",marginTop:3}]}>
              <View style={{flex:1,margin:7,borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE'}}>
               <View style={{width:'100%',height: 27,backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
                <Image
                  source={require('../img/dd.png')} style={{width:25, height: 25,}}>
                </Image>
              </View>
              <Text style={{ fontSize: 15, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center'}}>{item.door}</Text>
              </View>
              <View style={{flex:1,margin:7,borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE'}}>
              <View style={{width:'100%',height: 27,backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
                <Image
                  source={require('../img/sh.png')} style={{width:25, height: 25,}}>
                </Image>
              </View>
              <Text style={{ fontSize: 15, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center'}}>{item.bag}</Text>
              </View>
              <View style={{flex:1,margin:7,borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE'}}>
              <View style={{width:'100%',height: 27,backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
                <Image
                  source={require('../img/ma.png')} style={{width:25, height: 25,}}>
                </Image>
              </View>
              <Text style={{ fontSize: 15, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center'}}>{item.speed==1?'A':'M'}</Text>
              </View>
              <View style={{flex:1,margin:7,borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE'}}>
              <View style={{width:'100%',height: 27,backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
                <Image
                  source={require('../img/us.png')} style={{width:25, height: 25,}}>
                </Image>
              </View>
              <Text style={{ fontSize: 15, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center'}}>{item.men}</Text>
              </View>
            </View>
            <View style={[this.state.lang.indexOf('ar')!=-1?styles.row :styles.row_res ,{justifyContent:'center',alignItems:"center",marginTop:10,
            marginStart:10,marginEnd:10}]}>
              {this.state.lang === 'ar'?
               <Text style={{width:'70%',fontSize: 13, padding:2,fontWeight:'bold',color: '#707070',backgroundColor:'#F7F7F7',textAlign:'center',margin:5}}>{item.price}   {'ر س'}</Text>
              :
              <Text style={{width:'70%',fontSize: 13,padding:2, fontWeight:'bold',color: '#707070',backgroundColor:'#F7F7F7',textAlign:'center',margin:5}}>{item.price}   {'SAR'}</Text>
              }
             
              <Text style={{width:'30%', fontSize: 15, color: '#AEAEAE',fontFamily:"segoe",margin:2,textAlign:'center' }}>
                {this.state.lang === 'ar' ? 'السعر' : 'Price'}
              </Text>
            </View>
            <View style={{width:'100%',height:2,backgroundColor:'#E4E4E4',marginTop:3}}></View>
          <View style={{width:'100%',alignItems:'center',justifyContent:'center',marginTop:12,marginBottom:5 }}>
            {this.state.lang === 'ar'?
             <Text style={{width:'60%', fontSize: 16, color: '#AEAEAE',fontFamily:"segoe",textAlign:'center',backgroundColor:'#F6F6F6',
             padding:3}}>{item.status===1?'مشغول':'منتهى'}</Text>
            :
            <Text style={{width:'60%', fontSize: 16, color: '#AEAEAE',fontFamily:"segoe",textAlign:'center',backgroundColor:'#F6F6F6',
            padding:3}}>{item.status ===1?'Busy':'Finished'}</Text>
            }
           
          </View>
          </View>
        </TouchableOpacity>

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
              style={{ width: '13%',alignItems:'center',justifyContent:'center',height:'100%' }}>
              <Image resizeMode={'cover'} source={require('../img/w_arrow.png')}
                style={{ width: 10, height: 18, alignItems: 'center',  }} />
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', width: '80%', flex: 1, fontSize: 20, color: "#fff",fontFamily:'segoe' }}>
              {this.state.lang.indexOf('ar') != -1 ? 'طلباتـى' : 'My orders'}
            </Text>

            <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}
              style={{ width: '13%',alignItems:'center',justifyContent:'center',height:'100%' }}>
              <Image resizeMode={'cover'} source={require('../img/nav.png')}
                style={{ width: 25, height: 25, alignItems: 'center' }} />

            </TouchableOpacity>
          </View>
          :
          <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse', backgroundColor: '#C8972C' }}>
            <TouchableOpacity onPress={() => {
              this.props.navigation.goBack()
            }}
              style={{ width: '13%',alignItems:'center',justifyContent:'center',height:'100%' }}>
              <Image resizeMode={'cover'} source={require('../img/r_back.png')}
                style={{ width: 10, height: 18, alignItems: 'center',  }} />
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', width: '80%', flex: 1, fontSize: 20, color: "#fff",fontFamily:'segoe' }}>
              {this.state.lang.indexOf('ar') != -1 ? 'طلباتـى' : 'My orders'}
            </Text>

            <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}
              style={{ width: '13%',alignItems:'center',justifyContent:'center',height:'100%',  }}>
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
      <SafeAreaView style={{ width: '100%', flex: 1, alignItems: 'center', }}>
        {this.renderOption()}
        <View style={[styles.shadow,{width: '97%', height:'90%', alignItems: 'center',backgroundColor:'#F8F8F8',marginTop:5}]}>
        <View style={[this.state.lang === 'ar'?styles.row:styles.row_res,{ width: '95%', height: height*0.06,alignItems: 'center', justifyContent: 'center',marginTop:5 }]}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ bg1: '#C8972C' })
                this.setState({ bg2: '#E4E4E4' })
                this.setState({ txt1: '#FFFFFF' })
                this.setState({ txt2: '#000000' })
                this.setState({clicked:1})
                this.getBusyRequest()

              }}
              style={{ height:'100%',borderRadius: 5, flex: 1,marginStart: 5, backgroundColor: this.state.bg1 }}>
              <Text style={{ width: '100%', height:'100%',textAlign: 'center', color: this.state.txt1, fontSize: 15,fontFamily:'segoe',textAlignVertical:'center'}}>
                {this.state.lang.indexOf('ar') != -1 ? ' مشغـول' : 'Busy'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.setState({ bg1: '#E4E4E4' })
                this.setState({ bg2: '#C8972C' })
                this.setState({ txt1: '#000000' })
                this.setState({ txt2: '#FFFFFF' })
                this.setState({clicked:2})
                this.getFinishRequest()
              }}
              style={{ height:'100%',borderRadius: 5, flex: 1, marginStart: 5, backgroundColor: this.state.bg2 }}>
              <Text style={{ width: '100%',height:'100%', textAlign: 'center', color: this.state.txt2, fontSize: 15,fontFamily:'segoe',textAlignVertical:'center' }}>
                {this.state.lang.indexOf('ar') != -1 ? ' منتهـى' : 'Finished'}
              </Text>
            </TouchableOpacity>

          </View>
          {this.state.flag_lang == 0 ?
            <ActivityIndicator
            color='#C8972C'
              style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }} />
            :
            <View style={{ width: '100%', height: '100%',alignItems: 'center',}}>
              {this.state.flag_request == 1 ?
                <Text style={{
                  width: '90%', alignSelf: "center", justifyContent: 'center', textAlign: 'center', margin: 7, color: '#000',
                  borderRadius: 10, borderWidth: 1, borderColor: '#000', padding: 7, marginTop: 20, fontSize: 16,fontFamily:'segoe',
                }}>
                  {this.state.lang.indexOf('ar') != -1 ? " عفوا لا يوجد طلبات " :
                    " Sorry no requests "}
                </Text>
                :
                <FlatList style={{marginTop: 5,marginBottom:'12%' }}
                  refreshControl={
                    <RefreshControl
                      colors={["#9Bd35A", "#689F38"]}
                      refreshing={this.state.refreshing}
                      onRefresh={this.handleRefresh}
                    />
                  }
                  showsVerticalScrollIndicator={false}
                  data={this.state.rentRequest}
                  numColumns={1}
                  renderItem={({ item }) => this.renderItem(item)}
                  keyExtractor={(item, index) => index.toString()}
                />
              }
            </View>
          }

        </View>
      </SafeAreaView>
    );
  }
}
export default RentRequest;
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
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
       width: 0,
       height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
 },
 
});