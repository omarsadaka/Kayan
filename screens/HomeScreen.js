import React, { Component } from 'react';
import {
  Text, View, TouchableOpacity, ImageBackground, BackHandler, Image, FlatList, YellowBox, Alert,StyleSheet,
  ActivityIndicator, AsyncStorage, SafeAreaView,Dimensions,
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
const { width, height } = Dimensions.get('window')
import LinearGradient from 'react-native-linear-gradient';

class Home extends Component {


  constructor(props) {
    super(props);
    this.state = {
      flag_lang: 0,
      Data: [],
      catId: '',
      lang: '',
      userData: {},
     

    }
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackClicked)
    );
  }


  componentDidMount() {

    this._retrieveData();
    YellowBox.ignoreWarnings(['Class RCTCxxModule']);
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackClicked)
    );
  }

 




  onBackClicked = () => {
    if (this.props.navigation.state.routeName == 'Homee') {
      //  Toast.show(this.props.navigation.state.routeName);
      Alert.alert(
        this.state.lang.indexOf('ar') != -1 ? 'كيان' : 'Kayan',
        this.state.lang.indexOf('ar') != -1 ? 'هل أنت متأكد من أنك تريد الخروج؟' : 'Are you sure you want to exit?',
        [
          {
            text: this.state.lang.indexOf('ar') != -1 ? 'إلغاء' : ' Cancel'
            , onPress: () => this.dismiss, style: 'cancel'
          },
          {
            text: this.state.lang.indexOf('ar') != -1 ? 'موافق' : 'Ok'
            , onPress: () => BackHandler.exitApp()
          },
        ],
        { cancelable: true }

      )
      return true;
    }
    else { return false; }
  }
  _retrieveData = async () => {

    const lang = await AsyncStorage.getItem('lang');
    this.setState({ lang })

    const value = await AsyncStorage.getItem('loginDataKayan');
    if (value) {
      const data = JSON.parse(value);
      this.setState({ userData: data })
      this.getData();
    } else {

      var data2 = {
        _id: '1',
        fullname: 'أسم المستخدم'
      }
      this.setState({ userData: data2 })
      this.getData();
    }
  }

  getData = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        fetch('http://134.209.178.237/api/user/category')
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({ flag_lang: 1 });
            const Data = responseJson;
            this.setState({ Data: Data });


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



  renderItem(item){
    return (
      <TouchableOpacity
      onPress={ async()=>{
        this.props.navigation.navigate('CarListScreen', { cat_id: item._id })
       }}
      style={[styles.viewItem,{overflow: 'hidden',backgroundColor: '#FFF',elevation:3,borderRadius:10,marginBottom: 10,marginVertical:3}]}>
         <ImageBackground
             resizeMode ="cover"
             source={{uri: item.imgPath}}
             style={{  width: width, height: '100%', alignItems: 'center', borderRadius:15}} />
            <LinearGradient colors={['#43434380','#38383810']} style={styles.linearGradient}/>
           <Text style={{ width: '40%',fontSize: 25,textAlign:'center',color:'#FFF', margin:7,position: 'absolute',top:10,
               textAlignVertical:'center',fontFamily:'segoe'}}>
                 {this.state.lang === 'ar' ? item.titleAr : item.titleEN}</Text>
      </TouchableOpacity>
    );
  }


  renderOption() {
    return (
      <View style={{ width: '100%', height: '8%', alignItems: 'center', justifyContent: 'center', }}>
          <View style={[this.state.lang ==='ar'?styles.row_res:styles.row,{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center',backgroundColor: '#C8972C'}]}>
            <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}
              style={{width: '15%',height:'100%',alignItems:'center',justifyContent:'center'  }}>
              <Image resizeMode={'cover'} source={require('../img/nav.png')}
                style={{ width: 25, height: 25, alignItems: 'center',margin:5 }} />
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', flex: 1, fontSize: 20,fontFamily:'segoe', color: "#fff",}}>
              {this.state.lang.indexOf('ar') != -1 ? 'الرئيسيه' : 'Home'}</Text>

            <TouchableOpacity
            style={{ width: '15%',height:'100%',alignItems:'center',justifyContent:'center' }}>
            </TouchableOpacity>
          </View>
         
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor:'#FFF', alignItems: 'center', justifyContent: 'center', }}>

        {this.renderOption()}
        <View style={{ width: '100%', flex: 1, alignItems: 'center' }}>

          {this.state.flag_lang == 0 ?
            <ActivityIndicator
            color='#C8972C'
              style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }} />
            :
            <View style={{ width: '100%', height: '100%',alignItems:'center',justifyContent:'center' }}>
              <FlatList style={{ width: '95%', marginTop: 3 ,marginBottom:'10%'}}
                data={this.state.Data}
                showsVerticalScrollIndicator={false}
                numColumns={1}
                renderItem={({ item }) => this.renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
              />
               <View style={[this.state.lang==='ar'?styles.row_res:styles.row,{ width: '100%', height: '8%',alignItems:'center',justifyContent:'center',position:'absolute',bottom:0 }]} >
               <TouchableOpacity
               style={{backgroundColor:'#C8972C',flex:1}}
               onPress={ async()=>{
                this.props.navigation.navigate('Home2')
               }}>
                <View style={[this.state.lang==='ar'?styles.row:styles.row_res,{width:'100%', height: '100%',alignItems:'center',justifyContent:'center',}]}>
                  <Text style={{color:'#fff',fontSize:18,textAlign:'center',fontFamily:'segoe',margin:5}}>{this.state.lang==='ar'?'الرئيسية':'Home'}</Text>
                  <Image 
                   resizeMode='contain'
                   source={require('../img/w_home.png')} style={{width: 25, height: 25,margin:5}}></Image>
                </View>
                </TouchableOpacity>
                <View style={{width:2,height:'100%',backgroundColor:'#fff'}}></View>
                <TouchableOpacity
                style={{backgroundColor:'#C8972C',flex:1}}
                 onPress={ async()=>{
                  this.props.navigation.navigate('Homee')
                 }}>
                <View style={[this.state.lang==='ar'?styles.row:styles.row_res,{width:'100%', height: '100%',alignItems:'center',justifyContent:'center',}]}>
                <Text style={{color:'#000',fontSize:18,textAlign:'center',fontFamily:'segoe',margin:5}}>{this.state.lang==='ar'?'سيارات':'Cars'}</Text>
                  <Image 
                   resizeMode='contain'
                   source={require('../img/car_icon.png')} style={{width: 25, height: 25,margin:5}}></Image>
                </View>
                </TouchableOpacity>
              </View>
            </View>
           
          }

        </View>

      </SafeAreaView>
    );


  }
}
export default Home;
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  viewItem:{
    width:'100%',
    height:height / 4,
    alignItems:'center',
    justifyContent:'center',
  },
    linearGradient: {
   width:width,
   height:'100%',
   borderRadius:15,
   position:'absolute',
  },
  row: {
    flexDirection: 'row'
},
row_res:{
  flexDirection: 'row-reverse'
},
});