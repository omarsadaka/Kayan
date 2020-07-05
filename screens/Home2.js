import React, { Component } from 'react';
import {
  Text, View, TouchableOpacity, ImageBackground, ScrollView, Image, FlatList, YellowBox, Alert,StyleSheet,TextInput,
  ActivityIndicator, AsyncStorage, SafeAreaView,Dimensions,
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
const { width, height } = Dimensions.get('window')
import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'react-native-datepicker'
import { Container, Header, Content, Picker, Form } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { PROVIDER_GOOGLE ,Marker } from 'react-native-maps';
import Modal from 'react-native-modal';

class Home2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
          flag_lang: 0,
          Data: [],
          userId: '',
          lang: '',
          userData: {},
          recevinges:[
            {label: 'مطار القاهرة', value: '1',}
          ],
          deliveringes:[
            {label: 'مطار القاهرة', value: '1',}
          ],
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
        startDate:'',
        endDate:'',
        startTime: '', 
        endTime:'',
        minDate: new Date(),
        receving:'',
        delivering:'',
        isVisible:false,
        startTimeH:0,
      startTimeM:0,
      endTimeH:0,
      endTimeM:0,
      recevingLocation:'',
      deliveringLocation:'',
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
          this.setState({userId:data._id})
          this.setState({flag_lang:1})
        } else{
          this.setState({flag_lang:1})
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
          <View style={{ width: '100%', height: '8%', alignItems: 'center', justifyContent: 'center', }}>
              <View style={[this.state.lang ==='ar'?styles.row_res:styles.row,{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center',backgroundColor: '#C8972C'}]}>
                <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}
                  style={{ width:'13%',alignItems:'center' }}>
                  <Image resizeMode={'cover'} source={require('../img/nav.png')}
                    style={{ width: 25, height: 25, alignItems: 'center',margin:0 }} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', width:'74%', fontSize: 20,fontFamily:'segoe', color: "#fff",}}>
                  {this.state.lang.indexOf('ar') != -1 ? 'الرئيسيه' : 'Home'}
                </Text>
                <TouchableOpacity
                style={{ width: '13%' }}>
                </TouchableOpacity>
              </View>
             
          </View>
        )
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
                <ScrollView style={{width:'100%',flex:1,}}>
                <View style={{ width: '100%', height: '100%',alignItems:'center',marginBottom:'10%'}}>
                 <Image resizeMode={'cover'} source={require('../img/img.png')}
                style={{ width:width, height:height*0.25,alignItems: 'center' }} />
                <View style={{width:width,alignItems:'center',justifyContent:'center',marginTop:20,marginBottom:10}}>
                {/* <View style={{width:'90%',height:2,backgroundColor:'#F5F5F5'}}></View> */}
                <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:'80%',alignItems:'center',justifyContent:'center',}]}>
                <Image resizeMode={'cover'} source={require('../img/point2.png')}
                style={{ width:20, height: 20, alignItems: 'stretch' }} />
                <View style={{flex:1,height:2,backgroundColor:'#F5F5F5'}}></View>
                <Image resizeMode={'cover'} source={require('../img/point2.png')}
                style={{ width:20, height: 20, alignItems: 'stretch' }} />
                <View style={{flex:1,height:2,backgroundColor:'#F5F5F5'}}></View>
                <Image resizeMode={'cover'} source={require('../img/point2.png')}
                style={{ width:20, height: 20, alignItems: 'stretch' }} />
                <View style={{flex:1,height:2,backgroundColor:'#F5F5F5'}}></View>
                <Image resizeMode={'cover'} source={require('../img/point2.png')}
                style={{ width:20, height: 20, alignItems: 'stretch' }} />
                <View style={{flex:1,height:2,backgroundColor:'#F5F5F5'}}></View>
                <Image resizeMode={'cover'} source={require('../img/point.png')}
                style={{ width:20, height: 20, alignItems: 'stretch' }} />
                </View>
                </View>
                <View style={[styles.shadow,{width:'95%',marginTop:10,marginBottom:10,backgroundColor:'#F8F8F8',alignItems:'center',justifyContent:'center'}]}>
               <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'تاريخ الاستلام / الوقت':'Receving date / time'}</Text>

              <View style={[this.state.lang==='ar'?styles.row:styles.row_res,{ width: '91%',height: height*0.07,alignItems:'center',justifyContent:'center',marginTop:5}]}>
                  
               <View  style={[styles.shadow,{flex:1,height:'100%',borderRadius: 7,margin:2,justifyContent:'center'}]}>
                <DatePicker
                style={{
                  width:'100%',}}
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
                  <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'تاريخ التسليم / الوقت':'Delivering date / time'}</Text>

                <View style={[this.state.lang==='ar'?styles.row:styles.row_res,{width: '91%',height: height*0.07,alignItems:'center',justifyContent:'center',marginTop:5}]}>
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
                          width:'100%',}}
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

        <Text style={[this.state.lang === 'ar' ? styles.right : styles.left, { width: '90%', color: '#707070', fontSize: 14, fontFamily: "segoe", marginTop: 10 }]}>
          {this.state.lang === 'ar' ? 'موقع الاستلام' : 'Receving location'}</Text>
      
        <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center', elevation: 4, shadowOpacity: 0.3, backgroundColor: '#fff', borderRadius: 10,height:height*0.07 }]}>
          {/* <Image source={require('../img/path.png')}
            style={{ width: 20, height: 20, margin: 7 }} resizeMode="contain" /> */}
            <Icon name="caret-down" size={20} color="#707070" style={{margin:10}} />
          {/* <Text style={{ textAlign: 'center', color: '#969696', fontSize: 14, flex: 1 }}>مطار القاهرة</Text> */}
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
      
        <View style={[this.state.lang === 'ar' ? styles.pRow : styles.pRow_res, { width: '90%', alignItems: 'center', marginTop: 5, }]}>
          <TouchableOpacity
          onPress={()=>{
            this.setState({isVisible:true})
            // this.props.navigation.navigate('Maps')
           }}>
          <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{color: '#C8972C', fontSize: 14, margin: 3 }]}>{this.state.lang === 'ar' ? 'أعرض الخريطه' : 'Show map'}</Text>
          </TouchableOpacity>
          <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{color: '#707070', fontSize: 14, margin: 3 }]}>{this.state.lang === 'ar' ? 'لا تستطيع أيجاد الموقع؟' : 'You cannot find location?'}</Text>
          <Image source={require('../img/ques.png')}
            style={{ width: 20, height: 20, margin: 3 }} resizeMode="contain" />
        </View>
        <Text style={[this.state.lang === 'ar' ? styles.right : styles.left, { width: '90%', color: '#707070', fontSize: 14, fontFamily: "segoe", marginTop: 10 }]}>
          {this.state.lang === 'ar' ? 'موقع التسليم' : 'Delivering location'}</Text>
       
       
        <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center', elevation: 4, shadowOpacity: 0.3, backgroundColor: '#fff', borderRadius: 10,height:height*0.07 }]}>
          {/* <Image source={require('../img/path.png')}
            style={{ width: 20, height: 20, margin: 7 }} resizeMode="contain" /> */}
            <Icon name="caret-down" size={20} color="#707070" style={{margin:10}} />
          {/* <Text style={{ textAlign: 'center', color: '#969696', fontSize: 14, flex: 1 }}>مطار القاهرة</Text> */}
          <View style={{flex:1,alignItems:'center',justifyContent:'center'}}  >
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
          <View style={[styles.mapContainer,{height:'85%',flexDirection:'column'}]}>
            <MapView
             style={[styles.map,{width:'100%',height:'90%'}]}
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
           </MapView>
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
              const errors = this.validate();
              this.setState({ errors });
              if (Object.keys(errors).length === 0) {
                const obj ={
                  startDate:this.state.startDate,
                  endDate:this.state.endDate,
                  startTimeH:this.state.startTimeH,
                  startTimeM:this.state.startTimeM,
                  endTimeH:this.state.endTimeH,
                  endTimeM:this.state.endTimeM,
                  receving:this.state.recevingLocation,
                  delivering:this.state.deliveringLocation,
                }
                await AsyncStorage.setItem('Help',JSON.stringify(obj));
                this.props.navigation.navigate('ChooseCar')
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
            style={{ width: '80%', height: height*0.07,backgroundColor: '#4B4B4B', marginTop: 15, justifyContent: 'center', borderRadius: 8, alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ width: '100%', height: '100%', textAlign: 'center', color: '#FFFFFF', fontSize: 18,fontFamily:'segoe',textAlignVertical: 'center',}}>
            {this.state.lang.indexOf('ar') != -1 ? '  أحجز الأن  ' : ' Reserve now'}
            </Text>
            </TouchableOpacity>   
        
     </View>

       
                </View>
                </ScrollView>
              }
      <View style={[this.state.lang==='ar'?styles.row_res:styles.row,{ width: '100%', height: '8%',alignItems:'center',justifyContent:'center',position:'absolute',bottom:0 }]} >
               <TouchableOpacity
               style={{backgroundColor:'#C8972C',flex:1}}
               onPress={ async()=>{
                this.props.navigation.navigate('Home2')
               }}>
                <View style={[this.state.lang==='ar'?styles.row:styles.row_res,{width:'100%', height: '100%',alignItems:'center',justifyContent:'center',}]}>
                  <Text style={{color:'#000',fontSize:18,textAlign:'center',fontFamily:'segoe',margin:5}}>{this.state.lang==='ar'?'الرئيسية':'Home'}</Text>
                  <Image 
                   resizeMode='contain'
                   source={require('../img/b_home.png')} style={{width: 25, height: 25,margin:5}}></Image>
                </View>
                </TouchableOpacity>
                <View style={{width:2,height:'100%',backgroundColor:'#fff'}}></View>
                <TouchableOpacity
                style={{backgroundColor:'#C8972C',flex:1}}
                 onPress={ async()=>{
                  this.props.navigation.navigate('Homee')
                 }}>
                <View style={[this.state.lang==='ar'?styles.row:styles.row_res,{width:'100%', height: '100%',alignItems:'center',justifyContent:'center',}]}>
                <Text style={{color:'#fff',fontSize:18,textAlign:'center',fontFamily:'segoe',margin:5}}>{this.state.lang==='ar'?'سيارات':'Cars'}</Text>
                  <Image 
                   resizeMode='contain'
                   source={require('../img/car_icon2.png')} style={{width: 25, height: 25,margin:5}}></Image>
                </View>
                </TouchableOpacity>
              </View>
            </View>
    
          </SafeAreaView>
        );
      }
}
export default Home2;
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
      backgroundColor:'#fff'
    },
   start:{
     alignItems:'flex-start'
    },
   end:{
     alignItems:'center'
    },
   map: {
    ...StyleSheet.absoluteFillObject,
   },
   
  });
