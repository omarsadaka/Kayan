import React, { Component } from 'react';
import {
  Text, View, TouchableOpacity, StyleSheet, Image, FlatList,
  ActivityIndicator, AsyncStorage, BackHandler, RefreshControl, Dimensions, SafeAreaView
} from 'react-native';
//import Toast from 'react-native-simple-toast';
//import StarRating from 'react-native-star-rating';
import { Rating, AirbnbRating } from 'react-native-ratings';
//import Autocomplete from 'react-native-autocomplete-input';
//import { setTimeout } from 'core-js';
//import DeviceInfo from 'react-native-device-info';
// import { strings } from '../i18n';
//import I18n from 'react-native-i18n'
const { width, height } = Dimensions.get('window')
import NetInfo from "@react-native-community/netinfo";
import { Container, Header, Content, Picker, Form } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalDropdown from 'react-native-modal-dropdown';




class CarListScreen extends Component {


  constructor(props) {
    super(props);
    this.state = {
      flag_lang: 0,
      flag_len:1,
      CarData: [],
      filterCarData: [],
      lang: '',
      userData: {},
      starCount: 2,
      query: '',
      modeles: [],
      typies: [],
      modelId: 1,
      typeId: 1,
      catID: 1,
      categories: [],
      refreshing: false,
      bg1: '#FFFFFF',
      bg2: '#FFFFFF',
      bg3: '#FFFFFF',
      flag_block: 0,
      speed:''
    }
    BackHandler.addEventListener('hardwareBackPress', this.onBackClicked)
  }

  componentDidMount() {
    //NativeModules.ExceptionsManager = null;
    this._retrieveData();
    BackHandler.removeEventListener('hardwareBackPress', this.onBackClicked)
  }



  _retrieveData = async () => {
    const lang = await AsyncStorage.getItem('lang');
    this.setState({ lang })
    const value = await AsyncStorage.getItem('loginDataKayan');
    if (value) {
      const data = JSON.parse(value);
      this.setState({ userData: data })
      this.getData();
      this.getCategory();
      this.getModel();
      this.getTypes();
    } else {
      var data2 = {
        _id: '1',
        fullname: 'أسم المستخدم'
      }
      this.setState({ userData: data2 })
      this.getData();
      this.getCategory();
      this.getModel();
      this.getTypes();
    }
  }

  onBackClicked = () => {
    this.goBack(); // works best when the goBack is async
    return true;
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true,
    }, () => {
      this.getData();
    })
  }

  getCategory = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        fetch('http://134.209.178.237/api/user/category')
          .then((response) => response.json())
          .then((responseJson) => {
            const cat_Filter = responseJson;
            const cat_filterAr = [];
            for (let index = 0; index < cat_Filter.length; index++) {
              if (this.state.lang.indexOf('ar') != -1) {
                var obj = {
                   title:cat_Filter[index].titleAr,
                   id:cat_Filter[index]._id
                }
               
              } else {
                var obj = {
                  title:cat_Filter[index].titleEN,
                  id:cat_Filter[index]._id
                }
              }
              cat_filterAr.push(obj)
            }
            this.setState({ categories: cat_filterAr });
          })
          .catch((error) => {
            alert('omaaaaar' + error)
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

  filterData = (type, model, cat) => {

    var tempArr = [];
    //this.setState({CarData: this.state.filterCarData});
    if (type != 1) {
      this.state.filterCarData.forEach(car => {
        if (car.carTypeID == type) {
          if (model == car.carModelID || model == 1) {
            if (cat == car.carCatID || cat == 1) {
              tempArr.push(car)
            }
          }
        }
      });
      this.setState({ CarData: tempArr });

    } else if (model != 1) {
      this.state.filterCarData.forEach(car => {
        if (car.carModelID == model) {
          if (type == car.carTypeID || type == 1) {
            if (cat == car.carCatID || cat == 1) {
              tempArr.push(car)
            }
          }
        }
      });
      this.setState({ CarData: tempArr });
    } else if (cat != 1) {
      this.state.filterCarData.forEach(car => {
        if (car.carCatID == cat) {
         
          if (model == car.carModelID || model == 1) {
            if (type == car.carTypeID || type == 1) {
              tempArr.push(car)
            }
          }
        }
      });
      this.setState({ CarData: tempArr });
    } else {
      this.setState({ CarData: this.state.filterCarData });
    }



  }

  getData = () => {
    const { navigation } = this.props;
    const cat_Id = navigation.getParam('cat_id', 'NO-ID');
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        fetch('http://134.209.178.237/api/user/carbyCategory?id=' + cat_Id)
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({ flag_lang: 1 });
            this.setState({ refreshing: false })
            const Data = responseJson;
           
            // if (Data.length > 0) {
              const carInfo = []
              for (let index = 0; index < Data.length; index++) {
                if (this.state.lang.indexOf('ar') != -1) {
                 
                  var obj = {
                    id: Data[index]._id,
                    logo: Data[index].logo,
                    type: Data[index].carTypeID.titleAr,
                    model: Data[index].carModelID.titleAr,
                    price: Data[index].rentPrice,
                    rate: Data[index].status,
                    carTypeID: Data[index].carTypeID._id,
                    carModelID: Data[index].carModelID._id,
                    carCatID:Data[index].categoryID._id,
                    startDate: Data[index].startDate,
                    endDate: Data[index].endDate,
                    men_num:Data[index].personNum,
                    bag_num:Data[index].bagsNum,
                    door_num:Data[index].doorsNum,
                    speed:Data[index].automatic
                  }
                } else {
                  var obj = {
                    id: Data[index]._id,
                    logo: Data[index].logo,
                    type: Data[index].carTypeID.titleEN,
                    model: Data[index].carModelID.titleEN,
                    price: Data[index].rentPrice,
                    rate: Data[index].status,
                    carTypeID: Data[index].carTypeID._id,
                    carModelID: Data[index].carModelID._id,
                    carCatID:Data[index].categoryID._id,
                    startDate: Data[index].startDate,
                    endDate: Data[index].endDate,
                    men_num:Data[index].personNum,
                    bag_num:Data[index].bagsNum,
                    door_num:Data[index].doorsNum,
                    speed:Data[index].automatic
                  }
                }

                var day = new Date().getDate();
                var month = new Date().getMonth() + 1;
                var year = new Date().getFullYear();

                var res = Data[index].endDate.split("-")
                var booking_day = res[2];
                var booking_month = res[1];
                var booking_year = res[0];
                if ((booking_year == year && booking_month == month && booking_day >= day) || (booking_year == year && booking_month >= month) ||
                  (booking_year > year)) {
                  if (Data[index].status != 1) {
                    carInfo.push(obj)
                  }
                }
              }
              if(carInfo.length === 0){
                this.setState({flag_len:2})
              }else{
                this.setState({ CarData: carInfo });
                this.setState({ filterCarData: carInfo });
              }
          })
          .catch((error) => {
            this.setState({ flag_lang: 1 });
            this.setState({ refreshing: false })
            alert("" + { error });

          });

      } else {

        if (this.state.lang.indexOf('ar') != -1) {
          this.setState({ flag_lang: 1 });
          this.setState({ refreshing: false })
          alert('عذرا لا يوجد اتصال بالانترنت');
        } else {
          this.setState({ flag_lang: 1 });
          this.setState({ refreshing: false })
          alert('No internet connection!')
        }
      }
    })
  }

  getModel = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        fetch('http://134.209.178.237/api/user/carModel')
          .then((response) => response.json())
          .then((responseJson) => {
            const models = responseJson;
            const modelsAr = [];
            for (let index = 0; index < models.length; index++) {
              if (this.state.lang.indexOf('ar') != -1) {
                var obj = {
                   title:models[index].titleAr,
                   id:models[index]._id
                }
              } else {
                var obj = {
                  title:models[index].titleEN,
                  id:models[index]._id
                }
              }
              modelsAr.push(obj)
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
      if (state.isConnected) {
        fetch('http://134.209.178.237/api/user/carType')
          .then((response) => response.json())
          .then((responseJson) => {
            const types = responseJson;
            const typesAr = [];
            for (let index = 0; index < types.length; index++) {
              if (this.state.lang.indexOf('ar') != -1) {
                var obj = {
                   title:types[index].titleAr,
                   id:types[index]._id
                }
              } else {
                var obj = {
                  title:types[index].titleEN,
                  id:types[index]._id
                }
              }
              typesAr.push(obj)
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

  renderItem(item) {
    return (
      <View style={{ width: width * 0.6, padding: 2, flexDirection: 'row', }}>

        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={() => this.props.navigation.navigate('CarDetailsScreen', { car_id: item.id })}
        >
          <View style={{ flex: 1,  borderRadius: 5, elevation:5,shadowOpacity:0.3,backgroundColor:'#fff',alignItems:'center' }}>
          <View style={[this.state.lang.indexOf('ar')!=-1?styles.row :styles.row_res ,{ justifyContent:'center',alignItems:"center",marginTop:3}]}>
              <View style={{width:'18%',alignItems:"center",justifyContent:'center'}}>
              <Icon name="star" size={20} color="#FFE000" style={{margin:2}} />
              <Text style={{ fontSize: 14, color: '#343434',}}>{item.rate}</Text>
              </View>
              <Text style={{ fontSize: 18, color: '#343434',width:"80%" ,fontFamily:"segoe",textAlign:'center' }}>{item.type}</Text>
            </View>
           <View style={{width:'100%',height:2,backgroundColor:'#E4E4E4',marginTop:5,marginBottom:5}}></View>
            <View style={{ width:'90%',height: 100,justifyContent:'center',alignItems:"center",marginTop:3}}>
              <Image
                resizeMode='stretch'
                source={{ uri: item.logo }} style={{width:'95%', height: '100%', }}>
              </Image>
            </View>
            <View style={[this.state.lang.indexOf('ar')!=-1?styles.row :styles.row_res ,{ width:'90%',justifyContent:'center',alignItems:"center",marginTop:3}]}>
              <View style={{flex:1,margin:5,borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE'}}>
               <View style={{width:'100%',height: 27,backgroundColor:'#f8f8f8',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
                <Image
                  source={require('../img/dd.png')} style={{width:25, height: 25,}}>
                </Image>
              </View>
              <Text style={{ fontSize: 18, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center'}}>{item.door_num}</Text>
              </View>
              <View style={{flex:1,margin:5,borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE'}}>
              <View style={{width:'100%',height: 27,backgroundColor:'#f8f8f8',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
                <Image
                  source={require('../img/sh.png')} style={{width:25, height: 25,}}>
                </Image>
              </View>
              <Text style={{ fontSize: 18, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center'}}>{item.bag_num}</Text>
              </View>
              <View style={{flex:1,margin:5,borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE'}}>
              <View style={{width:'100%',height: 27,backgroundColor:'#f8f8f8',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
                <Image
                  source={require('../img/ma.png')} style={{width:25, height: 25,}}>
                </Image>
              </View>
              <Text style={{ fontSize: 18, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center'}}>{item.speed===1?'A':'M'}</Text>
              </View>
              <View style={{flex:1,margin:5,borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE'}}>
              <View style={{width:'100%',height: 27,backgroundColor:'#f8f8f8',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
                <Image
                  source={require('../img/us.png')} style={{width:25, height: 25,}}>
                </Image>
              </View>
              <Text style={{ fontSize: 18, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center'}}>{item.men_num}</Text>
              </View>
            </View>
            <View style={[this.state.lang.indexOf('ar')!=-1?styles.row :styles.row_res ,{justifyContent:'center',alignItems:"center",marginTop:15,
            marginStart:10,marginEnd:10}]}>
              {this.state.lang==='ar'?
               <Text style={{width:'70%',fontSize: 16, color: '#707070',backgroundColor:'#F7F7F7',textAlign:'center',margin:5}}>{item.price}   {'ر س'}</Text>
              :
              <Text style={{width:'70%',fontSize: 16, color: '#707070',backgroundColor:'#F7F7F7',textAlign:'center',margin:5}}>{item.price}   {'SAR'}</Text>
              }
              <Text style={{width:'30%', fontSize: 15, color: '#AEAEAE',fontFamily:"segoe",margin:2,textAlign:'center' }}>
                {this.state.lang === 'ar' ? 'السعر' : 'Price'}
              </Text>
            </View>
           
          </View>
        </TouchableOpacity>

      </View>
    );
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

            <Text style={{ textAlign: 'center', flex: 1, fontSize: 20,fontFamily:'segoe', color: "#fff",   }}>
              {this.state.lang.indexOf('ar') != -1 ? 'قائمه السيارات' : 'Car list'}
            </Text>

            <TouchableOpacity onPress={() => {
              this.props.navigation.goBack()
            }}
              style={{ width:'13%',height:'100%',alignItems:'center',justifyContent:'center'  }}>
              <Image resizeMode={'cover'} source={require('../img/w_arrow.png')}
                style={{ width: 10, height: 18, alignItems: 'center', }} />
            </TouchableOpacity>
          </View>
          :
          <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse', backgroundColor: '#C8972C', }}>
            <TouchableOpacity onPress={() => {
              this.props.navigation.goBack()
            }}
              style={{width:'13%',height:'100%',alignItems:'center',justifyContent:'center'  }}>
              <Image resizeMode={'cover'} source={require('../img/r_back.png')}
                style={{ width: 10, height: 18, alignItems: 'center', }} />
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', fontSize: 20,fontFamily:'segoe', color: "#fff", width:'74%'  }}>
              {this.state.lang.indexOf('ar') != -1 ? 'قائمه السيارات' : 'Car list'}
            </Text>

            <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}
              style={{  }}>
              <Image resizeMode={'cover'} source={require('../img/nav.png')}
                style={{ width: 25, height: 25, alignItems: 'center',margin:3}} />

            </TouchableOpacity>
          </View>
        }
      </View>
    )
  }

  render() {

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor:'#FFF', alignItems: 'center', }}>
        {this.renderOption()}
        {this.state.flag_lang == 0 ?
          <ActivityIndicator
          color='#C8972C'
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }} />
          :
          <View style={{ width: '95%',height :'90%', alignItems: 'center',elevation:5,shadowOpacity:0.3,backgroundColor:'#f8f8f8',
          marginTop:5,borderRadius:5, }}>

            {/***************************************************/}

            <View style={[this.state.lang==='ar'?styles.row:styles.row_res,{width:'98%',marginTop:5}]}>
              <View style={[styles.viewRow,{backgroundColor: this.state.bg2,margin:2 }]}>
              <Icon name="caret-down" size={10} color="#000" style={[this.state.lang==='ar'?styles.posLeft:styles.posRight,{position:'absolute'}]} />
              <View style={[{width:'100%' }]}  >
              <ModalDropdown
                   options={this.state.typies} // data
                   defaultValue={this.state.lang=='ar'?'الموديل':'Model'}
                   onSelect={(index, value) => { 
                     this.setState({ typeId: value.id }) 
                     if (value.id == 1) {
                      this.setState({ bg2: '#FFFFFF' })
                    } else {
                      this.setState({ bg2: '#C8972C' })
                    }
                    this.filterData(value.id, this.state.modelId, this.state.catID)
                    }}
                   
                   renderButtonText={(rowData) => (rowData.title)} // ba3d ma t5tar
                   style={{  }} // abl ma t5tar
                   textStyle={{ textAlign: 'center', fontSize: 14, color: '#000' }}
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
             
              <View style={[styles.viewRow,{backgroundColor: this.state.bg1,margin:2 }]}>
              <Icon name="caret-down" size={10} color="#000" style={[this.state.lang==='ar'?styles.posLeft:styles.posRight,{position:'absolute'}]} />
              <View style={[{width:'100%'}]}  >
              <ModalDropdown
                   options={this.state.modeles} // data
                   defaultValue={this.state.lang=='ar'?'النوع':'Type'}
                   onSelect={(index, value) => { 
                     this.setState({ modelId: value.id }) 
                     if (value.id == 1) {
                      this.setState({ bg1: '#FFFFFF' })
                    } else {
                      this.setState({ bg1: '#C8972C' })
                    }

                    this.filterData(this.state.typeId, value.id, this.state.catID);
                    }}
                   
                   renderButtonText={(rowData) => (rowData.title)} // ba3d ma t5tar
                   style={{  }} // abl ma t5tar
                   textStyle={{ textAlign: 'center', fontSize: 14, color: '#000' }}
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

              <View style={[styles.viewRow,{backgroundColor: this.state.bg3,margin:2 }]}>
              <Icon name="caret-down" size={10} color="#000" style={[this.state.lang==='ar'?styles.posLeft:styles.posRight,{position:'absolute'}]} />
              <View style={[{width:'100%'}]}  >
              <ModalDropdown
                   options={this.state.categories} // data
                   defaultValue={this.state.lang=='ar'?'الفئة':'Category'}
                   onSelect={(index, value) => { 
                     this.setState({ catID: value.id }) 
                     if (value.id == 1) {
                      this.setState({ bg3: '#FFFFFF' })
                    } else {
                      this.setState({ bg3: '#C8972C' })
                    }
                    this.filterData(this.state.typeId, this.state.modelId, value.id);
                    }}
                   
                   renderButtonText={(rowData) => (rowData.title)} // ba3d ma t5tar
                   style={{  }} // abl ma t5tar
                   textStyle={{ textAlign: 'center', fontSize: 14, color: '#000' }}
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

            {/***************************************************/}

         
              <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
                {this.state.flag_len===1?
                 <FlatList style={{  marginTop: 5,marginBottom:'10%' }}
                 refreshControl={
                   <RefreshControl
                     colors={["#9Bd35A", "#689F38"]}
                     refreshing={this.state.refreshing}
                     onRefresh={this.handleRefresh}
                   />
                 }
                 showsVerticalScrollIndicator={false}
                 data={this.state.CarData}
                 numColumns={1}
                 renderItem={({ item }) => this.renderItem(item)}
                 keyExtractor={(item, index) => index.toString()}
               />
                
                :
                <Text style={{width:'90%',margin:5,fontSize:17,color:'#707070',fontFamily:'segoe',textAlign:'center',marginTop:'10%'}}>
                   {this.state.lang==='ar'? 'لا يوجد سيارات لهذة الفئة الأن':'No cars for this category now'}
                 </Text>
               } 
            </View>
            

          </View>
        }
      </SafeAreaView>
    );


  }

}
export default CarListScreen;
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
  viewRow:{
    flex: 1, justifyContent: 'center', alignItems:'center',
    borderRadius: 5,  
    height: 35,elevation:4,shadowOpacity:0.2
  },
  maStart:{
    marginStart:'60%'
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