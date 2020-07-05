/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Alert,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  FlatList,Platform,PixelRatio,AsyncStorage,ActivityIndicator
} from 'react-native';
const {width, height} = Dimensions.get('window');
import Entypo from 'react-native-vector-icons/Entypo';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';



class Terms extends Component{
    constructor(props) {
        super(props);
        this.state = {
          lang: '',
          flag_lang: 0,
          data:[],
          userData:{},
          userId:'',
        };
      }
      componentDidMount() {
        this._retrieveData();
      }
      _retrieveData = async () => {
        try {
          const lang = await AsyncStorage.getItem('lang');
          if (lang){
            this.setState({lang});
          }
          const value = await AsyncStorage.getItem('loginDataKayan');
      if (value){
         const data = JSON.parse(value);
        this.setState({userData:data});
        this.setState({userId:data._id});
        this.getData();
       } else {
        var data2 = {
          _id:'1',
          fullname:'أسم المستخدم',
        };
         this.setState({userData:data2});
         this.getData();
       }
        } catch (error){}
      }

      getData(){
        this.setState({Processing:true});
        NetInfo.fetch().then(state =>{
          if (state.isConnected){
            try {
              axios.get('http://134.209.178.237/api/user/getTerms',{
              }).then(response => {
                this.setState({flag_lang:1});
                const data = response.data;
               this.setState({ data });
              }).catch(function (error) {
                this.setState({flag_lang:1});
                 console.log(error);
              }).finally(function () {
                 // always executed
              });
           } catch (error) {
            this.setState({flag_lang:1});
              console.log(error);
           }
          } else {
            this.setState({flag_lang:1});
            if (this.state.lang === 'AR'){
              alert('لا يوجد أتصال بالانترنت');
            } else {
              alert('No internet connection');
            }
          }
        });
      } 
     
      renderItem(item){
         return (
          <View style={{width:'95%',alignItems:'center'}}>
             <Text style={[this.state.lang === "ar" ? styles.right : styles.left,styles.text,{fontSize:15}]}> {this.state.lang === 'ar'?item.titleAr:item.titleEN}</Text>
          </View>
         );
       }
       renderOption(){
            return (
               <View style={{ width: '100%', height: '8%', alignItems: 'center', justifyContent: 'center' }}>
               <View style={[this.state.lang ==='ar'?styles.row_res:styles.row,{width: width, height: '100%', alignItems: 'center', justifyContent: 'center',backgroundColor: '#C8972C', }]}>
                 <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}
                   style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center' }}>
                   <Image resizeMode={'cover'} source={require('../img/nav.png')}
                     style={{ width: 25, height: 25, alignItems: 'center' }} />
                 </TouchableOpacity>
     
                 <Text style={{ textAlign: 'center',  width:'80%', fontSize: 20,fontFamily:'segoe', color: "#fff",   }}>
                   {this.state.lang.indexOf('ar') != -1 ? 'الشروط والأحكام' : 'Terms and condition'}
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
            );
         
       }
    render(){
    return (
            <SafeAreaView style={styles.container} >
           
            {this.renderOption()}
            {this.state.flag_lang == 0 ?
          <ActivityIndicator
          color='#C8972C'
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }} />
          :
            <View style={[styles.shadow,styles.view,{}]}>
            <FlatList style={{width:'100%',marginTop:5}}
                    data={this.state.data}
                    numColumns={1}
                    renderItem={({item})=>this.renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                    />
          </View>
    }

         </SafeAreaView>
        );
    }
}

export default Terms;
const styles = StyleSheet.create({
   flex: {
       flex: 0
   },
   row: {
       flexDirection: 'row'
   },
   container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#FFF',
   },
   row_res:{
     flexDirection: 'row-reverse'
   },
   column: {
       flexDirection: 'column'
   },
   
   left:{
    textAlign:'left'
   },
   right:{
    textAlign:'right'
   }, 
   view:{
      width:'95%',
      alignItems:'center',
      justifyContent:'center',
      marginTop:10,backgroundColor:'#fff',
      borderRadius:10,
      height:'88%',
    },
    text:{
      color:'#343434',margin:3,
      width:'100%',fontFamily:'segoe',
   },
   shadow: {
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 6,
      },
      shadowOpacity: 0.05,
      elevation: 5,
   },
 });