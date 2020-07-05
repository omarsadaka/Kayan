import React, { Component } from 'react';
import {
  Text, View, TouchableOpacity, ImageBackground, ScrollView, Image, FlatList, YellowBox, Alert,StyleSheet,
  ActivityIndicator, AsyncStorage, SafeAreaView,Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const {width, height} = Dimensions.get('window')
import MapView from 'react-native-maps';

class Maps extends Component{
    constructor(props) {
        super(props);
        this.state = {
          flag_lang: 0,
          Data: [],
          lang: '',
          userData: {},
         
        }
      }
      componentDidMount() {
        this._retrieveData();
      }
      _retrieveData = async () => {

        const lang = await AsyncStorage.getItem('lang');
        this.setState({ lang })
    
        const value = await AsyncStorage.getItem('loginDataKayan');
        if (value) {
          const data = JSON.parse(value);
          this.setState({ userData: data })
          this.setState({flag_lang:1})
        } else {
    
          var data2 = {
            _id: '1',
            fullname: 'أسم المستخدم'
          }
          this.setState({ userData: data2 })
        }
      } 

      renderOption() {
        return (
          <View style={{ width: '100%', height: '8%', alignItems: 'center', justifyContent: 'center' }}>
              <View style={[this.state.lang ==='ar'?styles.row_res:styles.row,{width: width, height: '100%', alignItems: 'center', justifyContent: 'center',backgroundColor: '#C8972C', }]}>
                <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}
                  style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center' }}>
                  <Image resizeMode={'cover'} source={require('../img/nav.png')}
                    style={{ width: 25, height: 25, alignItems: 'center' }} />
                </TouchableOpacity>
    
                <Text style={{ textAlign: 'center',  width:'80%', fontSize: 20,fontFamily:'segoe', color: "#fff",   }}>
                  {this.state.lang.indexOf('ar') != -1 ? 'الخريطة' : 'Map'}
                </Text>
                {this.state.lang==='ar'?
                 <TouchableOpacity onPress={() => {
                  this.props.navigation.goBack()
                }}
                  style={{ width:'10%',height:'100%',alignItems:'center',justifyContent:'center' }}>
                  <Image resizeMode={'cover'} source={require('../img/w_arrow.png')}
                    style={{ width: 10, height: 18, alignItems: 'center', }} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => {
                  this.props.navigation.goBack()
                }}
                  style={{ width:'10%',height:'100%',alignItems:'center',justifyContent:'center' }}>
                  <Image resizeMode={'cover'} source={require('../img/r_back.png')}
                    style={{ width: 10, height: 18, alignItems: 'center', }} />
                </TouchableOpacity>
                }
               
              </View>
             
          </View>
        )
      }
    render(){
        return(
            <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor:'#FFF', alignItems: 'center',}}>
            {this.renderOption()}
        <View style ={{width:width,height:'90%',alignItems:'center',justifyContent:'center'}}>
        <View style={styles.container}>
     <MapView
       style={styles.map}
       region={{
         latitude: 37.78825,
         longitude: -122.4324,
         latitudeDelta: 0.015,
         longitudeDelta: 0.0121,
       }}
     >
     </MapView>
   </View>
      </View>
         </SafeAreaView>
        );
    }
}
export default Maps;
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
    pRow_res:{
    flexDirection: 'row-reverse',
    justifyContent:'flex-end'
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
    container: {
      ...StyleSheet.absoluteFillObject,
      height: 400,
      width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });