import React, { Component } from 'react';
import {
  Text, View, TouchableOpacity, StyleSheet, TextInput, Image, FlatList, Dimensions,
  ActivityIndicator, AsyncStorage, ScrollView, Alert, SafeAreaView
} from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
const { width, height } = Dimensions.get('window')
import NetInfo from "@react-native-community/netinfo";
import { Container, Header, Content, Picker, Form } from "native-base";
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios';


class Additions extends Component {
    constructor(props) {
        super(props);
        this.state = {
          flag_lang: 0,
          additions: [],
          picker_props: [
            {
                label: '1',
                value: 1,
            },
            {
                label: '2',
                value: 2,
            },
            {
              label: '3',
              value: 3,
          },
        ],   
        carId:'',
        ownerId:'',
        track:1,
        selectedArr:[],
        selectedID:[],
        radioSelected:'',
        wifi_num:0
    
        }
      }
      componentDidMount() {
        this._retrieveData();
      }
      _retrieveData = async () => {
        const { navigation } = this.props;
        const car_id = navigation.getParam('car_id', 'NO-ID');
        this.setState({carId:car_id})
       
        const track = navigation.getParam('track', 'NO-ID');
        if(track){
          this.setState({track})
        }
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

      getData(){
         NetInfo.fetch().then(state =>{
          if (state.isConnected){
            try {
              axios.get('http://134.209.178.237/api/user/getAdditions').then(response => {
                this.setState({flag_lang:1})
                const data = response.data;
               this.setState({ additions:data });
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
            if (this.state.lang === 'ar'){
              alert('لا يوجد أتصال بالانترنت');
            } else {
              alert('No internet connection');
            }
          }
        });
      }

      renderOption() {
        return (
          <View style={{width: '100%', height: '8%', alignItems: 'center', justifyContent: 'center',}}>
              <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:'100%',height:'100%',alignItems:'center',justifyContent:'space-between', 
              backgroundColor:'#C8972C', }]}>
                   {this.state.lang ==='ar'?
                 <TouchableOpacity  onPress={() =>{
                    this.props.navigation.goBack()
                  }}
                 style={{width:'13%',alignItems:'center',justifyContent:'center',height:'100%'}}>
                <Image resizeMode={'cover'} source={require('../img/w_arrow.png')} 
                 style={{width:10 , height:18,alignItems:'center',}}/>
               </TouchableOpacity>
                :
                <TouchableOpacity  onPress={() =>{
                    this.props.navigation.goBack()
                  }}
                 style={{width:'13%',alignItems:'center',justifyContent:'center',height:'100%'}}>
                <Image resizeMode={'cover'} source={require('../img/r_back.png')} 
                 style={{width:10 , height:18,alignItems:'center',}}/>
               </TouchableOpacity>
                }
               
             <Text style={{ textAlign: 'center', width:'74%', fontSize: 20,fontFamily:'segoe', color: "#fff",   }}>
                  {this.state.lang ==='ar' ? 'الأضافات' : 'Additions'}
                </Text>
               
                <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}
                  style={{ width: '13%',alignItems:'center',justifyContent:'center',height:'100%' }}>
                  <Image resizeMode={'cover'} source={require('../img/nav.png')}
                    style={{ width: 25, height: 25, alignItems: 'center',}} />
                </TouchableOpacity>
    
              </View>
              
          </View>
        )
      }
     
       
      renderRadio(clicked){
        const {selectedArr,radioSelected,selectedID} = this.state;
        return(
         <TouchableOpacity
         style={{ width:25 ,height:25 ,borderRadius:3,backgroundColor:'#fff',elevation:5,margin:3,justifyContent:'center',alignItems:'center'}}
         onPress={()=>{
          //  if(this.state.wifi_num ==0){
          //   if (this.state.lang === 'ar'){
          //     alert('أختر العدد أولا');
          //   } else {
          //     alert('Choose number first');
          //   }
          //  }else{
          //   this.setState({radioSelected:clicked._id})
          //   const price = clicked.price*this.state.wifi_num
          //   const obj ={
          //   additionsID:clicked._id,
          //   additionsNumber:this.state.wifi_num,
          //   additionsPrice:price,
          //  }
          //  selectedArr.push(obj)
          //  selectedID.push(clicked._id)
          //  alert(JSON.stringify(obj))
          //  this.setState({wifi_num:0})
          //  }
         
          if(selectedArr.length!=0){
          selectedArr.forEach(item=>{
            if(item.additionsID === clicked._id){
              this.setState({
               selectedArr: selectedArr.filter(item => item.additionsID != clicked._id)
             });
               this.setState({
              selectedID: selectedID.filter(item => item != clicked._id)
            });
            this.setState({wifi_num:0})
            }else{
              if(this.state.wifi_num ==0){
                if (this.state.lang === 'ar'){
                  alert('أختر العدد أولا');
                } else {
                  alert('Choose number first');
                }
               }else{
                this.setState({radioSelected:clicked._id})
                const price = clicked.price*this.state.wifi_num
                const obj ={
                additionsID:clicked._id,
                titleAr:clicked.titleAr,
                titleEN:clicked.titleEN,
                additionsNumber:this.state.wifi_num,
                additionsPrice:price,
               }
               selectedArr.push(obj)
               selectedID.push(clicked._id)
               this.setState({wifi_num:0})
               }
            }
         })
        }else{
          if(this.state.wifi_num ==0){
            if (this.state.lang === 'ar'){
              alert('أختر العدد أولا');
            } else {
              alert('Choose number first');
            }
           }else{
            this.setState({radioSelected:clicked._id})
            const price = clicked.price*this.state.wifi_num
            const obj ={
            additionsID:clicked._id,
            titleAr:clicked.titleAr,
            titleEN:clicked.titleEN,
            additionsNumber:this.state.wifi_num,
            additionsPrice:price,
           }
           selectedArr.push(obj)
           selectedID.push(clicked._id)
          //  alert(JSON.stringify(obj))
           this.setState({wifi_num:0})
           }
        }
        
         }}>

           {selectedID.includes(clicked._id)?
           <Icon name="check" size={20} color="#C8972C" style={{}}/> 
           :
           <View style={{display:'none'}}></View>
           }
         </TouchableOpacity>
        )
      }
      renderItem(item){
        return (
          <View
           style={[{marginVertical:3,width:'100%',height:height/6,borderRadius:10}]}>
             <View style={[this.state.lang === 'ar'?styles.row:styles.row_res,{width:'100%',height:'100%',alignItems:'center',}]} >
                <View style={[this.state.lang === 'ar'?styles.row:styles.row_res,styles.shadow,{flex:1,borderRadius:10,height:'100%',alignItems:'center',justifyContent:'center',margin:2}]}>
                   <View style={{width:'65%',height: '100%',backgroundColor:'#f8f8f8',justifyContent:'center',alignItems:'center'}}>
                   <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{width:'100%',fontSize:17,color:'#434343',fontFamily:'segoe',position:'absolute',top:5}]}>
                     {this.state.lang === 'ar'?item.titleAr:item.titleEN}
                   </Text>
                   <View style={[this.state.lang === 'ar'?styles.row:styles.row_res,{alignItems:'center',position:'absolute',bottom:5}]}>
                  {this.state.lang ==='ar'?
                   <Text style={{fontSize:14,color:'#434343',fontWeight:'bold',textAlign:'center',margin:5}}> {item.price}  ر س</Text>
                  :
                  <Text style={{fontSize:14,color:'#434343',fontWeight:'bold',textAlign:'center',margin:5}}> {item.price} SAR</Text>
                  }
           <View style={[this.state.lang==='ar'?styles.row:styles.row_res,styles.shadow,{width:60,height:30,alignItems:'center',borderRadius: 5, justifyContent:'center',margin:5,}]}>
            <Icon name="caret-down" size={12} color="#000" style={{margin:5}} />       
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}  >
            <ModalDropdown
                   options={this.state.picker_props} // data
                   defaultValue={this.state.wifi_num}
                   onSelect={(index, value) => { 
                     this.setState({ wifi_num: value.value }) 
                    }}
                   renderButtonText={(rowData) => (rowData.label)} // ba3d ma t5tar
                   style={{ width:'100%' }} // abl ma t5tar
                   textStyle={{ textAlign: 'center', fontSize: 12, color: '#000' }}
                    dropdownStyle={{ width: 30, alignSelf: 'center', height: 150, borderColor: '#D7D7D7', borderWidth: 1, borderRadius: 3, }}
                   renderRow={function (rowData, rowID, highlighted) {
                    return (
                     <View style={[ { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 40, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                     <Text style={[{ fontSize: 12, color: '#000', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                      {rowData.label}
                       </Text>
                        </View>
                      );
                      }.bind(this)}
                      />
             </View>
            </View>

           </View>
            </View>
                   <Image resizeMode={'stretch'} source={{ uri: item.imgPath }}
                   style={{ width:'35%', height: '100%', alignItems: 'center' }} />
            </View>     
                    
                     {this.renderRadio(item)}
          
             </View>
             
          </View>
        );
      }

    render(){
      
        return(
            <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor:'#FFF', alignItems: 'center', justifyContent: 'center', }}>
            {this.renderOption()}
            <View style={{ width: '100%', flex: 1, alignItems: 'center' }}>
              {this.state.flag_lang == 0 ?
                <ActivityIndicator
                color='#C8972C'
                  style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }} />
                :
                <View style={{ width: width, height: height , alignItems:'center',}}>
                 {this.state.track === 1 ?
                 <View style={{width:width,alignItems:'center',justifyContent:'center',marginTop:20,marginBottom:10}}>
                 {/* <View style={{width:'90%',height:2,backgroundColor:'#F5F5F5'}}></View> */}
            <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:'80%',alignItems:'center',justifyContent:'center',}]}>
             <Image resizeMode={'cover'} source={require('../img/point2.png')}
             style={{ width:20, height: 20, alignItems: 'center' }} />
             <View style={{flex:1,height:2,backgroundColor:'#F5F5F5'}}></View>
             <Image resizeMode={'cover'} source={require('../img/point2.png')}
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
                <Image resizeMode={'cover'} source={require('../img/point2.png')}
                style={{ width:20, height: 20, alignItems: 'center' }} />
                <View style={{flex:1,height:2,backgroundColor:'#F5F5F5'}}></View>
                 <Image resizeMode={'cover'} source={require('../img/point2.png')}
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
                   
                <View style={[styles.shadow,{width:'95%',height:'75%',color: '#707070',marginTop:10,marginBottom:5,backgroundColor:'#F8F8F8',alignItems:'center',justifyContent:'center'}]}>      
                <View style={{width:'95%',flexDirection:'row',marginTop:5,justifyContent:'center',alignItems:'center'}}>
                <View style={{width:'20%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-start'}}></View>
               <Text style={{flex:1,textAlign:'center',fontSize:16,color:'#808080',fontFamily:'segoe', }}> 
                {this.state.lang === 'ar'?'أختر الأضافات حسب رغبتك':'Choose the extras as you wish'}
               </Text>
               <View style={{width:'20%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-end'}}></View>
              </View>
              <FlatList style={{ width: '96%', marginTop: 15,marginBottom:5 }}
                data={this.state.additions}
                numColumns={1}
                renderItem={({ item }) => this.renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
                extraData={this.state.selectedItem}
              />

            <TouchableOpacity
            onPress={async() => {
            // AsyncStorage.removeItem('Step2');
              // alert(JSON.stringify(this.state.selectedArr))
              await AsyncStorage.setItem('Step2',JSON.stringify(this.state.selectedArr));
             
              this.props.navigation.navigate('Summary',{track:this.state.track})
            }}
            style={{ width: '50%', backgroundColor: '#4B4B4B',justifyContent: 'center',borderRadius: 8, alignItems: 'center',position:'absolute',bottom:10 }}>
            <Text style={{ width: '100%',height: height*0.06,textAlign:'center',alignItems:'center',color:'#FFFFFF', fontSize:20,fontFamily:'segoe', padding: 5, textAlignVertical: 'center',   }}>
            {this.state.lang.indexOf('ar') != -1 ? 'التالى' : 'Next'}
            </Text>
            </TouchableOpacity>

              </View>
             
                </View>
              }
            </View>
    
          </SafeAreaView>
        );
    }
}
export default Additions;
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
      right:'13%'
    },
    left:{
      textAlign:'left',
     left:'13%'
    },
    viewItem:{
      width:'98%',
      height:height / 5,
      alignItems:'center',
      justifyContent:'center',
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
      backgroundColor:'#F8F8F8'
   },
   start:{
     alignItems:'flex-start'
   },
   end:{
     alignItems:'center'
   }
   
  });
