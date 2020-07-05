import React, { Component } from 'react';
import {
  Text, View, TouchableOpacity, StyleSheet, TextInput, Image, FlatList, Dimensions,
  ActivityIndicator, AsyncStorage, ScrollView, Alert, SafeAreaView
} from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
const { width, height } = Dimensions.get('window')
import NetInfo from "@react-native-community/netinfo";
import { Container, Header, Content, Picker, Form } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalDropdown from 'react-native-modal-dropdown';



class Summary extends Component{
    constructor(props) {
        super(props);
        this.state = {
          flag_lang: 0,
          additions: [],
          carInfo:{},
          step1:{},
          step2:[],
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
        track:1 ,
        dayNum:0,
        total:0,
        allPrice:0,
        lastCoast:0,
        copon:0,
        payedCoast:0,
        additionsPrice:0
    
        }
      }
      componentDidMount() {
        this._retrieveData();
      }
      _retrieveData = async () => {
        const { navigation } = this.props;
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
          this.setState({flag_lang:1})
        } else {
          this.setState({flag_lang:1})
          var data2 = {
            _id: '1',
            fullname: 'أسم المستخدم'
          }
          this.setState({ userData: data2 })
        }
        const carData = await AsyncStorage.getItem('CarInfo');
        if (carData) {
          const CarInfo = JSON.parse(carData);
          this.setState({ carInfo: CarInfo })
        } 

        const step1 = await AsyncStorage.getItem('Step1');
        if (step1) {
          const info1 = JSON.parse(step1);
          this.setState({ step1: info1 })
          var startDay = info1.startDate.split("-")
          var start_day = startDay[2];
          var endDay = info1.endDate.split("-")
          var end_day = endDay[2];
          var dayNum = end_day - start_day
          this.setState({dayNum})
        } 

        const step2 = await AsyncStorage.getItem('Step2');
        if (step2) {
          var price = 0;
          var totalPrice=0 ;
          const info2 = JSON.parse(step2);
          this.setState({ step2:info2})
          this.state.step2.forEach(element =>{
            price = element.additionsPrice+price;

          })
          this.setState({additionsPrice:price})
        } 

        var total = this.state.carInfo.price * this.state.dayNum
        this.setState({total})

        var allPrice = this.state.total + this.state.step1.insurance + this.state.additionsPrice
        this.setState({allPrice})

        var lastCoast = this.state.allPrice - this.state.copon 
        this.setState({lastCoast})

        var payedCoast = (25*this.state.lastCoast)/100
        this.setState({payedCoast})
      }

      renderOption() {
        return (
          <View style={{width: '100%', height: '8%', alignItems: 'center', justifyContent: 'center',}}>
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
                  {this.state.lang ==='ar' ? 'الملخص' : 'Summary'}
                </Text>
                <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}
                  style={{ width:'13%',height:'100%',alignItems:'center',justifyContent:'center' }}>
                  <Image resizeMode={'cover'} source={require('../img/nav.png')}
                    style={{ width: 25, height: 25, alignItems: 'center', }} />
                </TouchableOpacity>

              </View>
              
          </View>
        )
      }

      renderItem(item){
        return (
          <View
          style={[this.state.lang === 'ar' ? styles.row : styles.row_res,{width:'100%',marginVertical:2}]}>
               <Text style={{ width: '35%',fontSize: 15,textAlign:'center',color:'#505050', margin:2, fontFamily:'segoe'}}>
                  {item.additionsPrice}  رس</Text>
                  <Text style={[styles.shadow,{width:'15%',borderRadius:8,fontSize:15,textAlign:'center',color:'#505050',margin:2,fontFamily:'segoe'}]}>
                  {item.additionsNumber}</Text>
                  <Text style={{ width: '15%',fontSize: 15,textAlign:'center',color:'#505050',fontFamily:'segoe'}}>
                  {this.state.lang === 'ar' ? 'عدد' : 'Num'}</Text>
                  <Text style={{ width: '35%',fontSize: 15,textAlign:'center',color:'#505050', margin:2, fontFamily:'segoe'}}>
                  {this.state.lang === 'ar' ? item.titleAr : item.titleEN}</Text>
          </View>
        );
      }
    render(){
      const {step1} = this.state
        return(
            <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor:'#FFF', alignItems: 'center', justifyContent: 'center', }}>
            {this.renderOption()}
            <View style={{ width: '100%', flex: 1, alignItems: 'center' }}>
              {this.state.flag_lang == 0 ?
                <ActivityIndicator
                color='#C8972C'
                  style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }} />
                :
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 5 }}>
                <View style={{ width: '100%', height: '100%',alignItems:'center',}}>
                {this.state.track === 1 ?
                 <View style={{width:width,alignItems:'center',justifyContent:'center',marginTop:20,marginBottom:10}}>
                 {/* <View style={{width:'90%',height:2,backgroundColor:'#F5F5F5'}}></View> */}
                 <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:'80%',alignItems:'center',justifyContent:'center',}]}>
                 <Image resizeMode={'cover'} source={require('../img/point2.png')}
                 style={{ width:20, height: 20, alignItems: 'center' }} />
                 <View style={{flex:1,height:2,backgroundColor:'#F5F5F5'}}></View>
                 <Image resizeMode={'cover'} source={require('../img/point.png')}
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
                <Image resizeMode={'cover'} source={require('../img/point.png')}
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
               

                <View style={{width: width*0.6, height: height * 0.45 ,borderRadius: 5, elevation:5,shadowOpacity:0.3,backgroundColor:'#fff',marginTop:10,alignItems:'center' }}>
               <View style={[this.state.lang.indexOf('ar')!=-1?styles.row :styles.row_res ,{ justifyContent:'center',alignItems:"center",marginTop:3}]}>
              <View style={{width:'18%',alignItems:"center",justifyContent:'center'}}>
              <Image
                resizeMode='stretch'
                source={require('../img/starr.png')} style={{width:20, height: 20,margin:2 }}>
              </Image>
              <Text style={{ fontSize: 14, color: '#343434',fontFamily:'segoe'}}>{this.state.carInfo.rate}</Text>
              </View>
              <Text style={{ fontSize: 18, color: '#343434',width:"80%" ,fontFamily:"segoe",textAlign:'center' }}>{this.state.carInfo.type}</Text>
            </View>
           <View style={{width:'100%',height:2,backgroundColor:'#E4E4E4',marginTop:5,marginBottom:5}}></View>
            <View style={{ width:'90%',height: '33%',justifyContent:'center',alignItems:"center",marginTop:3}}>
              <Image
                resizeMode='stretch'
                source={{ uri: this.state.carInfo.logo }} style={{width:'95%', height: '100%', }}>
              </Image>
            </View>
            <View style={[this.state.lang.indexOf('ar')!=-1?styles.row :styles.row_res ,{ width:'90%',justifyContent:'center',alignItems:"center",marginTop:3}]}>
              <View style={{flex:1,margin:5,borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE'}}>
               <View style={{width:'100%',height: 27,backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
                <Image
                  source={require('../img/dd.png')} style={{width:25, height: 25,}}>
                </Image>
              </View>
              <Text style={{ fontSize: 18, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center',fontFamily:'segoe'}}>5</Text>
              </View>
              <View style={{flex:1,margin:5,borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE'}}>
              <View style={{width:'100%',height: 27,backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
                <Image
                  source={require('../img/sh.png')} style={{width:25, height: 25,}}>
                </Image>
              </View>
              <Text style={{ fontSize: 18, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center',fontFamily:'segoe'}}>2</Text>
              </View>
              <View style={{flex:1,margin:5,borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE'}}>
              <View style={{width:'100%',height: 27,backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
                <Image
                  source={require('../img/ma.png')} style={{width:25, height: 25,}}>
                </Image>
              </View>
              <Text style={{ fontSize: 18, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center',fontFamily:'segoe'}}>A</Text>
              </View>
              <View style={{flex:1,margin:5,borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE'}}>
              <View style={{width:'100%',height: 27,backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
                <Image
                  source={require('../img/us.png')} style={{width:25, height: 25,}}>
                </Image>
              </View>
              <Text style={{ fontSize: 18, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center',fontFamily:'segoe'}}>4</Text>
              </View>
            </View>
            <View style={[this.state.lang.indexOf('ar')!=-1?styles.row :styles.row_res ,{justifyContent:'center',alignItems:"center",position:'absolute',bottom:5,
              marginStart:10,marginEnd:10 }]}>
                {this.state.lang==='ar'?
              <Text style={{width:'70%',fontSize: 16, color: '#707070',backgroundColor:'#F7F7F7',textAlign:'center',margin:5}}>{this.state.carInfo.price}   {'ر س'}</Text>
              :
              <Text style={{width:'70%',fontSize: 16, color: '#707070',backgroundColor:'#F7F7F7',textAlign:'center',margin:5}}>{this.state.carInfo.price}   {'SAR'}</Text>
              }
              <Text style={{width:'30%', fontSize: 15, color: '#AEAEAE',fontFamily:"segoe",margin:2,textAlign:'center' }}>
                {this.state.lang === 'ar' ? 'السعر' : 'Price'}
              </Text>
            </View>
          </View>
                <View style={{width:'95%',alignItems:'center',backgroundColor:'#F8F8F8',borderRadius:10,borderColor:'#E4E4E4',borderWidth:1,marginTop:'10%'}}>
                <Text style={{ width:'100%',fontSize: 22, color: '#343434',fontFamily:'segoe',textAlign:'center',margin:7}}>{this.state.lang==='ar'?'الملخص':'Summary'}</Text>
               
                <View style={{width:'90%',height:1,backgroundColor:'#E4E4E4'}}/>

                <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,{width:'100%',height: 70,alignItems:'center',justifyContent:'center'}]}>
                 <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                   <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{alignItems:'center',justifyContent:'center'}]}>
                    <Text style={{  width:'60%',fontSize: 12, textAlign: 'center', color: '#707070',fontFamily:'segoe',}}>{step1.startDate}</Text>
                    <Image resizeMode={'cover'} source={require('../img/date.png')}
                     style={{ width:20, height: 20, alignItems: 'center',margin:7 }} />
                   </View>
                   <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{alignItems:'center',justifyContent:'center'}]}>
                   <Text style={{ width:'60%', fontSize: 12, textAlign: 'center', color: '#707070',fontFamily:'segoe',}}>{step1.startTimeH}:{step1.startTimeM}</Text>
                    <Image resizeMode={'cover'} source={require('../img/time.png')}
                     style={{ width:20, height: 20, alignItems: 'center',margin:7 }} />
                   </View>
               </View>
                 <View style={{width:1,height:'100%',backgroundColor:'#E4E4E4'}}/>
                 <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                 <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{alignItems:'center',justifyContent:'center'}]}>
                    <Text style={{flex:1, height:'100%' ,fontSize: 14, textAlign: 'center', color: '#707070',fontFamily:'segoe',margin:3}}>{step1.receving}</Text>
                    <Image resizeMode={'contain'} source={require('../img/map.png')}
                     style={{ width:20, height: 20, alignItems: 'center',margin:5 }} />
                   </View>
               </View>
                 <View style={{width:1,height:'100%',backgroundColor:'#E4E4E4'}}/>
                 <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                 <Text style={{ fontSize: 18, textAlign: 'center', color: '#505050',fontFamily:'segoe'}}>
                 {this.state.lang === 'ar' ? 'الاستلام' : 'The receipt'}</Text>
               </View>
              </View>

              <View style={{width:'100%',height:1,backgroundColor:'#E4E4E4'}}/>
              {/* *************** */}
              <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,{width:'100%',height: 70,alignItems:'center',justifyContent:'center'}]}>
               <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{alignItems:'center',justifyContent:'center'}]}>
                    <Text style={{ width:'60%', fontSize: 12, textAlign: 'center', color: '#707070',fontFamily:'segoe',}}>{step1.endDate}</Text>
                    <Image resizeMode={'cover'} source={require('../img/date.png')}
                     style={{ width:20, height: 20, alignItems: 'center',margin:7 }} />
                   </View>
                   <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{alignItems:'center',justifyContent:'center'}]}>
                    <Text style={{ width:'60%', fontSize: 12, textAlign: 'center', color: '#707070',fontFamily:'segoe',}}>{step1.endTimeH}:{step1.endTimeM}</Text>
                    <Image resizeMode={'cover'} source={require('../img/time.png')}
                     style={{ width:20, height: 20, alignItems: 'center',margin:7 }} />
                   </View>
               </View>
                 <View style={{width:1,height:'100%',backgroundColor:'#E4E4E4'}}/>
               <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{alignItems:'center',justifyContent:'center'}]}>
                    <Text style={{ flex:1,height:'100%' ,fontSize: 14, textAlign: 'center', color: '#707070',fontFamily:'segoe',margin:3}}>{step1.delivering}</Text>
                    <Image resizeMode={'contain'} source={require('../img/map.png')}
                     style={{ width:20, height: 20, alignItems: 'center',margin:5 }} />
                   </View>
               </View>
                 <View style={{width:1,height:'100%',backgroundColor:'#E4E4E4'}}/>
               <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                 <Text style={{ fontSize: 18, textAlign: 'center', color: '#505050',fontFamily:'segoe'}}>
                 {this.state.lang === 'ar' ? 'الأرجاع' : 'Returns'}</Text>
               </View>
              </View>
              <View style={{width:'100%',height:1,backgroundColor:'#E4E4E4'}}/>
              {/* *************** */}
              <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,{width:'100%',height: 70,alignItems:'center',justifyContent:'center'}]}>
              <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <Text style={{  fontSize: 12, textAlign: 'center', color: '#39393B',fontFamily:'segoe'}}>{this.state.total}  ر س</Text>
               </View>
                 <View style={{width:1,height:'100%',backgroundColor:'#E4E4E4'}}/>
                 <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <Text style={{  fontSize: 12, textAlign: 'center', color: '#39393B',fontFamily:'segoe'}}> {this.state.dayNum}  X {this.state.carInfo.price}</Text>
               </View>
                 <View style={{width:1,height:'100%',backgroundColor:'#E4E4E4'}}/>
                 <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                 <Text style={{fontSize: 18, textAlign: 'center', color: '#505050',fontFamily:'segoe'}}>
                 {this.state.lang === 'ar' ? 'مدة الايجار' : 'Duration of rent'}</Text>
               </View>
              </View>
              <View style={{width:'100%',height:1,backgroundColor:'#E4E4E4'}}/>
              {/* ******************* */}

              <View style={{width:'100%',height: 100,}}>
                <Text style={[this.state.lang === 'ar' ? styles.right : styles.left,{fontSize: 18,margin:3,paddingHorizontal:7,color: '#505050',fontFamily:'segoe'}]}>
                  {this.state.lang === 'ar' ? 'الأضافات' : 'Additions'}</Text>
                  <FlatList style={{  marginTop: 3,marginBottom:3 }}
                  showsVerticalScrollIndicator={false}
                  data={this.state.step2}
                  numColumns={1}
                  renderItem={({ item }) => this.renderItem(item)}
                  keyExtractor={(item, index) => index.toString()}
                />
            
              </View>


              {/* <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,{width:'100%',height: 70,backgroundColor:'#000',alignItems:'center',justifyContent:'center'}]}>
              <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <Text style={{  fontSize: 12, textAlign: 'center', color: '#39393B',fontFamily:'segoe'}}>200</Text>
               </View>
                 <View style={{width:1,height:'100%',backgroundColor:'#E4E4E4'}}/>
                 <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                 <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:'100%',alignItems:'center',justifyContent:'center'}]}>
                 <View style={[styles.shadow,{width:50,height:30,alignItems:'center',borderRadius: 5,flexDirection:'row', margin:3}]}>
                  <Icon name="caret-down" size={13} color="#000" style={{margin:3}} />   
                 <View style={[{width:'90%'}]}  >
                 <ModalDropdown
                   options={this.state.picker_props} // data
                   defaultValue='1'
                   onSelect={(index, value) => { 
                     this.setState({ wifi_num: value._id }) 
                    }}
                   renderButtonText={(rowData) => (rowData.value)} // ba3d ma t5tar
                   style={{ width:'100%' }} // abl ma t5tar
                   textStyle={{ textAlign: 'center', fontSize: 12, color: '#000' }}
                    dropdownStyle={{ width: 30, alignSelf: 'center', height: 150, borderColor: '#D7D7D7', borderWidth: 1, borderRadius: 3, }}
                   renderRow={function (rowData, rowID, highlighted) {
                    return (
                     <View style={[ { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 40, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                     <Text style={[{ fontSize: 12, color: '#000', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                      {rowData.value}
                       </Text>
                        </View>
                      );
                      }.bind(this)}
                      />
                </View>
                 </View>
                     <Text style={{  fontSize: 14, textAlign: 'center', color: '#707070',fontFamily:'segoe',margin:3}}>{this.state.lang === 'ar' ? 'عـدد' : 'Num'}</Text>
                   </View>
               </View>
                 <View style={{width:1,height:'100%',backgroundColor:'#E4E4E4'}}/>
                 <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                 <Text style={{  fontSize: 18, textAlign: 'center', color: '#505050',fontFamily:'segoe'}}>
                 {this.state.lang === 'ar' ? 'الأضافات' : 'Additions'}</Text>
                 <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{alignItems:'center',justifyContent:'center'}]}>
                    <Text style={{  fontSize: 14, textAlign: 'center', color: '#707070',fontFamily:'segoe',margin:5}}>راوترWiFi</Text>
                    <Image resizeMode={'cover'} source={require('../img/path2.png')}
                     style={{ width:8, height: 12, alignItems: 'center',margin:5 }}/>
                   </View>
               </View>
              </View> */}


              <View style={{width:'100%',height:1,backgroundColor:'#E4E4E4'}}/>
              {/* ********************* */}
              <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,{width:'100%',height: 70,alignItems:'center',justifyContent:'center'}]}>
              <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <Text style={{  fontSize: 12, textAlign: 'center', color: '#39393B',fontFamily:'segoe'}}>{this.state.step1.insurance}</Text>
               </View>
                 <View style={{width:1,height:'100%',backgroundColor:'#E4E4E4'}}/>
                 <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <Text style={{  fontSize: 12, textAlign: 'center', color: '#39393B',fontFamily:'segoe'}}></Text>
               </View>
                 <View style={{width:1,height:'100%',backgroundColor:'#E4E4E4'}}/>
                 <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                 <Text style={{ fontSize: 18, textAlign: 'center', color: '#505050',fontFamily:'segoe'}}>
                 {this.state.lang === 'ar' ? 'التأمين الزائد' : 'Overload insurance'}</Text>
               </View>
              </View>
              <View style={{width:'100%',height:1,backgroundColor:'#E4E4E4'}}/>
              {/* ****************** */}
              <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,{width:'100%',height: 70,alignItems:'center',justifyContent:'center'}]}>
              <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <Text style={{  fontSize: 12, textAlign: 'center', color: '#39393B',fontFamily:'segoe'}}>{this.state.allPrice}</Text>
               </View>
                 <View style={{width:1,height:'100%',backgroundColor:'#E4E4E4'}}/>
                 <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <Text style={{  fontSize: 18, textAlign: 'center', color: '#39393B',fontFamily:'segoe'}}>{this.state.lang === 'ar' ? 'الأجمالى' : 'Total'}</Text>
               </View>
                 <View style={{width:1,height:'100%',backgroundColor:'#E4E4E4'}}/>
                 
                 <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                 <Text style={{ fontSize: 18, textAlign: 'center', color: '#505050',fontFamily:'segoe'}}></Text>
               </View>
              </View>
              <View style={{width:'100%',height:1,backgroundColor:'#E4E4E4'}}/>
                </View>
                <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res, { width: '95%', alignItems: 'center', marginTop: 15, justifyContent: 'center' }]}>
                <TextInput
                 underlineColorAndroid='#fff' 
                defaultValue={this.state.coupon}
                placeholderTextColor='#A5A5A5'
                onChangeText={(coupon) => this.setState({ coupon  }) }
                placeholder={this.state.lang.indexOf('ar') != -1 ?' كود الخصم' :' Discount code'}
                style={{flex:1,height:height*0.07,textAlign:'center',color:'#000',fontSize:14,fontFamily:"segoe",backgroundColor:'#FFF',
                borderRadius:8,borderColor:'#E4E4E4',borderWidth:1,margin:5}}
                ></TextInput>
                <Text style={{ textAlign: 'center', color: '#2E2E2E', fontSize: 13, margin: 5,fontFamily:'segoe' }}>{this.state.lang === 'ar' ? 'هل لديك قسيمه خصم؟' : 'Do you have a discount coupon?'}</Text>
                <Image source={require('../img/ques.png')}
                 style={{ width: 20, height: 20, margin: 5 }} resizeMode="contain" />
                </View>
                <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res, { width: '95%',height:height*0.09, alignItems: 'center', marginTop: 15, justifyContent: 'center',borderRadius:8,borderColor:'#E4E4E4',borderWidth:1 }]}>
                 {this.state.lang ==='ar'?
                  <Text style={{ flex:1,height:'100%',textAlignVertical:'center',textAlign: 'center', color: '#343C53', fontSize: 20, margin: 5,fontFamily:'segoe',backgroundColor:'#f8f8f8' }}>
                   {this.state.lastCoast} ر س</Text> 
                 :
                 <Text style={{ flex:1,height:'100%',textAlignVertical:'center',textAlign: 'center', color: '#343C53', fontSize: 18, margin: 5,fontWeight:'bold' ,backgroundColor:'#f8f8f8'}}>
                 {this.state.lastCoast} SAR</Text> 
                 }
               
                    <View style={{width:2,height:'100%',backgroundColor:'#C0C0C0'}}></View>
                    <Text style={{ flex:2,textAlign: 'center', color: '#343434', fontSize: 22, margin: 5,fontFamily:'segoe' }}>
                        {this.state.lang === 'ar' ? 'الاجمالى' : 'Total'}</Text>
                </View>
                <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res, { width: '95%',height:height*0.08, alignItems: 'center', marginTop: 15, justifyContent: 'center',borderRadius:5,borderColor:'#E4E4E4',borderWidth:1 }]}>
                 {this.state.lang ==='ar'?
                  <Text style={{ flex:1,height:'100%',textAlign: 'center',textAlignVertical:'center', color: '#FFFFFF', fontSize: 18,fontWeight:'bold',backgroundColor:'#C8972C',borderRadius:5 }}>
                   {this.state.payedCoast} ر س</Text> 
                 :
                 <Text style={{ flex:1,height:'100%',textAlign: 'center', textAlignVertical:'center',color: '#FFFFFF', fontSize: 20,fontFamily:'segoe',backgroundColor:'#C8972C',borderRadius:5 }}>
                 {this.state.payedCoast} SAR</Text> 
                 }
               
                    <Text style={{ flex:1,textAlign: 'center', color: '#343434', fontSize: 20, margin: 5,fontFamily:'segoe' }}>
                        {this.state.lang === 'ar' ? 'دفعه مقدمه 25%' : 'Down payment 25%'}</Text>
                </View>
                <TouchableOpacity
                onPress={async() => {
                  const obj ={
                    insurance:this.state.step1.insurance,
                    amount:this.state.lastCoast,
                    amountPaid:this.state.payedCoast
                  }
                  await AsyncStorage.setItem('Step3',JSON.stringify(obj));
                 this.props.navigation.navigate('Data',{track:this.state.track,ownerID:this.state.carInfo.ownerId})
                }}
            style={{ width: '60%', backgroundColor: '#4B4B4B',justifyContent: 'center',borderRadius: 8, alignItems: 'center',marginTop:20,marginBottom:10 }}>
            <Text style={{ width: '100%',height: height*0.07,textAlign:'center',alignItems:'center',color:'#FFFFFF', fontSize:20,fontFamily:'segoe', padding: 5, textAlignVertical: 'center',   }}>
            {this.state.lang.indexOf('ar') != -1 ? 'أستمرار' : 'Countinue'}
            </Text>
            </TouchableOpacity>
                </View>
                </ScrollView>
              }
    
            </View>
    
          </SafeAreaView>
        );
    }
}
export default Summary;
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
      elevation: 3,
      backgroundColor:'#fff'
   },
   start:{
     alignItems:'flex-start'
   },
   end:{
     alignItems:'center'
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
