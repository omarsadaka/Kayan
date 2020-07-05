import React, { Component } from 'react';
import {
  Text, View, TouchableOpacity, StyleSheet, TextInput, Image, FlatList,
  ActivityIndicator, AsyncStorage, SafeAreaView, Alert,Dimensions,
} from 'react-native';
import Modal from 'react-native-modalbox';
import { Rating, AirbnbRating } from 'react-native-ratings';
import NetInfo from "@react-native-community/netinfo";
const { width, height } = Dimensions.get('window')
import axios from 'axios';



class Notification extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lang: '',
      flag_lang: 0,
      design_flag: 1,
      notifications: [],
      userData: {},
      userId: '',
      carId: '',
      comment: '',
      refreshing: false,
      flag_rate: 0,
      starCount: 0,
      word: ''
    }
  }

  componentDidMount() {
    // NativeModules.ExceptionsManager = null;
    this._retrieveData();
  }

  _retrieveData = async () => {
    try {
      const lang = await AsyncStorage.getItem('lang');
      this.setState({ lang })
      const value = await AsyncStorage.getItem('loginDataKayan');
      const data = JSON.parse(value);
      if (value) {
        this.setState({ userData: data })
        this.setState({ userId: this.state.userData._id })
        //  alert('id = '+this.state.userId)
        this.getData()
      }
      else {
        this.getData()
        var data2 = {
          _id: '1'
        }
        this.setState({ userData: data2 })

      }
    } catch (error) {
      var data2 = {
        _id: '1'
      }
      this.setState({ userData: data2 })
    }
  }
  handleRefresh = () => {
    this.setState({
      refreshing: true,
    }, () => {
      this.getData();
    })
  }

  getData = async () => {
    const value = await AsyncStorage.getItem('loginDataKayan');
    if (value) {
      NetInfo.fetch().then(state =>{
        if (state.isConnected){
          try {
            axios.get('http://134.209.178.237/api/user/newNotifications',{
              params: {
                id:this.state.userId
            },
            }).then(response => {
              this.setState({flag_lang:1})
              const data = response.data;
              const notifications = []
              for (let index = 0; index < data.length; index++) {
                if (this.state.lang.indexOf('ar') != -1) {
                  var obj = {
                    msg:data[index].msg,
                    logo:data[index].carID.logo,
                    carName:data[index].carID.carTypeID.titleAr
                  }
                } else {
                  var obj = {
                    msg:data[index].msgEN,
                    logo:data[index].carID.logo,
                    carName:data[index].carID.carTypeID.titleEN
                  }
                }
                notifications.push(obj)
              }
              this.setState({ notifications: notifications });
            }).catch(function (error) {
              this.setState({flag_lang:1})
              alert(error)
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
    } else {
      this.setState({ flag_lang: 1 });
      Alert.alert(
        this.state.lang.indexOf('ar') != -1 ? 'كيان' : 'Kayan',
        this.state.lang.indexOf('ar') != -1 ? 'يجب تسجيل الدخول أولا لاظهار الأشعارات' :
          'you must be login to show notification',

        [
          {
            text: this.state.lang.indexOf('ar') != -1 ? 'ألغاء' : 'Cancel'
            , onPress: () => this.dismiss, style: 'cancel'
          },
          {
            text: this.state.lang.indexOf('ar') != -1 ? ' تسجيل الدخول' : 'login ', onPress: () => {
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

  ratingCompleted = async (rating) => {
    this.refs.modal.close();
    this.setState({ flag_lang: 0 });

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        const obj = {
          carID: this.state.carId,
          userID: this.state.userId,
          rate: rating,
          comment: this.state.comment
        }
        fetch('http://134.209.178.237/api/user/raviewCar', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj),
        }).then((response) => response.json())
          .then((responseJson) => {

            if (this.state.lang.indexOf('ar') != -1) {
              this.setState({ flag_lang: 1 });
              alert("شكرا لك ");
              this.setState({ starCount: rating })
              this.setState({ comment: '' })
              this.refs.modal.close()

            }
            else {
              this.setState({ flag_lang: 1 });
              alert('Thank You !!');
              this.setState({ starCount: rating })
              this.setState({ comment: '' })
              this.refs.modal.close()

            }

          })
          .catch((error) => {
            this.setState({ flag_lang: 1 });

          });

      } else {
        if (this.state.lang.indexOf('ar') != -1) {
          this.setState({ flag_lang: 1 });
          alert('لايوجد اتصال بالانترنت');
          this.refs.modal.close()
        }
        else {
          this.setState({ flag_lang: 1 });
          alert('No Internet Connection ');
          this.refs.modal.close()
        }
      }
    })

  }

  renderItem(item) {
    return (
      <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,styles.view]}>
            <View style={{ width: '40%', height:'100%', alignItems: 'center'}}>
              <Text style={[this.state.lang ==='ar'?styles.borRight:styles.borLeft,{ width:'100%', fontSize: 15,color: '#343434',fontFamily:'segoe', position:'absolute',top:5,
            backgroundColor:'#EFEAFA',padding:3,paddingHorizontal:10}]}>{item.msg}</Text>
              <Text style={{ flex: 1, fontSize: 14, textAlign: 'center', color: '#343434',position:'absolute',bottom:5 }}> {item.date}</Text>
            </View>

            <View style={{ width: '30%', height:'100%', alignItems: 'center',justifyContent:'center'}}>
              <Text style={{  fontSize: 14, textAlign: 'center', color: '#343434',fontFamily:'segoe',margin:3 }}>{item.carName} </Text>
              <Text style={{  fontSize: 14, textAlign: 'center', color: '#343434',fontFamily:'segoe',margin:3}}>#6755775</Text>
              {item.state == 1 ?
                  <TouchableOpacity
                    onPress={() => {
                      this.refs.modal.open()
                      this.setState({ carId: item.id })
                    }}
                    style={{ width: '60%', backgroundColor: '#343434', borderColor: '#707070', borderWidth: 1, borderRadius: 7, marginTop: 5, marginStart: 5 }}>
                    <Text style={{ width: '100%', fontSize: 15, textAlign: 'center', color: '#FFFFFF', }}>
                      {this.state.lang==='ar'?'تقييم':'Rate'}
                  </Text>
                  </TouchableOpacity>
                  :
                  <View style={{ display: 'none' }}></View>
                }
            </View>
            <View style={{ width: '30%', height:'100%', alignItems: 'center',justifyContent:'center'}}>
            <Image
                resizeMode='stretch'
                source={{ uri: item.logo }} style={{ width: '90%', height: '90%', }}>
              </Image>
            </View>
          </View>
      </View>
    );
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
              {this.state.lang ==='ar' ? 'الأشعارات' : 'Notifications'}
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

  render() {
    return (
      <SafeAreaView style={{ width: '100%', height: '100%', alignItems: 'center', }}>
        {this.renderOption()}

        {this.state.flag_lang == 0 ?
          <ActivityIndicator 
          color='#C8972C'
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}/>
          :
          <View>
            {this.state.flag_notify == 1 ?
              <Text style={{
                width: '90%', alignSelf: "center", justifyContent: 'center', textAlign: 'center', margin: 7, color: '#000',
                borderRadius: 10, borderWidth: 1, borderColor: '#000', padding: 7, marginTop: 20, fontSize: 16,  
              }}>
                {this.state.lang.indexOf('ar') != -1 ? "  لا يوجد  أشعارات الأن " :
                  "  No notifications now"}
              </Text>
              :
              <FlatList style={{ width: '95%', marginTop: 5,marginBottom:'13%' }}
                data={this.state.notifications}
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
            backgroundColor: '#fff',
            borderRadius: 7,
            borderWidth: 2,
            borderColor: "#fff",
            width: '90%'

          }} >
            <View style={{ width: '80%', marginTop: 10, justifyContent: 'center', alignItems: 'center' }} >

              <TextInput
                defaultValue={this.state.comment}
                onChangeText={(comment) => this.setState({ comment })}
                style={{
                  borderWidth: 1, borderColor: '#ccc', borderRadius: 8, width: '90%', height: 70, fontSize: 15, textAlign: 'auto',
                  alignItems: 'center', textAlignVertical: 'top'
                }}
                placeholder={this.state.lang.indexOf('ar') != -1 ? 'اكتب تعليق  ' : '  write comment'}
                underlineColorAndroid='transparent'
              ></TextInput>
              <View style={{ width: '80%', alignItems: 'center', justifyContent: 'center', marginTop: 3, marginBottom: 20 }}>
                <Rating
                  //showRating
                  type="star"
                  //fractions={1}
                  startingValue={this.state.starCount}
                  //readonly
                  imageSize={30}
                  //  onFinishRating={this.ratingCompleted.bind(this)}
                  ratingColor="#1A9658" />

              </View>
              <TouchableOpacity
                onPress={this.ratingCompleted.bind(this)}
                style={{
                  width: '30%', backgroundColor: '#343434', borderWidth: 1, borderRadius: 10, borderColor: '#343434', marginBottom: '20%',
                  marginTop: '7%', shadowColor: '#707070', shadowOffset: { width: 0, height: 3 }, shadowRadius: 6
                }}>
                <Text style={{
                  width: '100%', height: 30, textAlign: 'center', textAlignVertical: 'center',
                  fontSize: 20, color: '#FFFFFF', fontFamily:'segoe',  
                }}>
                  {this.state.lang.indexOf('ar') != -1 ? '  حفـظ    ' : ' Save  '}
                </Text>
              </TouchableOpacity>

            </View>


          </View>

        </Modal>
      </SafeAreaView>
    );


  }
}
export default Notification;
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
  pRow: {
    flexDirection: 'row',
    justifyContent:'flex-end'
},
view:{
  width: '100%',borderColor: '#EFEAEA', 
  borderRadius: 10, borderWidth: 1,
  justifyContent: 'center',marginVertical:3,
   alignItems: 'center',height:height/6
},
  pRow_res:{
  flexDirection: 'row-reverse',
  justifyContent:'flex-start'
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
 start:{
   alignItems:'flex-start'
 },
 end:{
   alignItems:'center'
 },
 borRight:{
   borderTopRightRadius:20,
   borderBottomRightRadius:20,
   textAlign:'right'
 },
 borLeft:{
   borderTopLeftRadius:20,
   borderBottomLeftRadius:20,
   textAlign:'left'
 }
});