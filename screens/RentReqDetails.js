import React, { Component } from 'react';
import { View, Text,ImageBackground, StyleSheet,BackHandler, TouchableOpacity, TextInput, Image ,Dimensions,Alert} from 'react-native';
import { AsyncStorage,Linking} from 'react-native';
import {ActivityIndicator, SafeAreaView, ScrollView,FlatList } from 'react-native';
const { width, height } = Dimensions.get('window')
import NetInfo from "@react-native-community/netinfo";
import DatePicker from 'react-native-datepicker'
import { Container, Header, Content, Picker, Form } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
// import MapView, { PROVIDER_GOOGLE ,Marker } from 'react-native-maps';
import Modal from 'react-native-modal';
import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios';
import ImagePicker from 'react-native-image-picker';




class RentReqDetails extends Component{
    constructor(props) {
        super(props);
        this.state={
          lang:'',
          flag_lang:0,
          flag_design:0,
          rentRequest:{},
          userData:{},
          userId:'',
          carID:'',
          requestId:'',
          bg1:'#fff',
          bg2:'#000',
          txt1:'#000',
          txt2:'#fff',
          startDate:'',
          endDate:'',
          carImg:'',
          rate:0,
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
        bills: [
          {
              label: 'كاش',
              value: '1',
          },
          {
              label: 'نقدي',
              value: '2',
          },
      ],         
      con_code:'',
      con_codes:[],
        wifi_num:'',
        set_num:'',
        cities:[],
        countries:[],
        companies:[],
        bill:'',
      additions:[],
      additions2:[],
      recieptData:{},
      isVisible:false,
      isVisible2:false,
      radioSelected :1,
      insurance:0,
      amount:0,
      amountPaid:0,
      dayNum:0,
      comID:'',
      countryID:'',
      cityID:'',
      compName:'',
      address:'',
      selectedArr:[],
      selectedID:[],
      radioSelected:'',
      wifi_num:0
      }
        
      }
    
    componentDidMount() {
      //NativeModules.ExceptionsManager = null;
        const { navigation } = this.props;
        const req_Id = navigation.getParam('request_id', 'NO-ID');
        this.setState({requestId:req_Id})
        // alert('id = '+req_Id)
        this._retrieveData();
      }
      _retrieveData = async () => {
        try {
          const lang = await AsyncStorage.getItem('lang');
          this.setState({lang})
          const value = await AsyncStorage.getItem('loginDataKayan');  
          if(value){
            const data =JSON.parse(value); 
          this.setState({userData:data})
          this.setState({userId:this.state.userData._id})
         this.getData();
         this.getCompanies()
         this.getCodes()
         this.getAdditionData()
         this.getRecieptData()
         this.getAddtion()
         this.getCountry();
        
          }else{
              var data2 ={
                _id:'1',
                fullname:'أسم المستخدم'
              }
              this.setState({userData:data2})
              this.getData();
          }    
        }catch(error){}
      }  

      getCompanies(){
        NetInfo.fetch().then(state =>{
         if (state.isConnected){
           try {
             axios.get('http://134.209.178.237/api/user/getAirline').then(response => {
            
               const companies = response.data;
               const companiesAr =[];
               
               if(this.state.lang.indexOf('ar') != -1){
                 
               companies.forEach(element => {
                 companiesAr.push({
                  label:element.titleAr ,value:element._id,key:element._id
                 })
               });
             
              }else{
                companies.forEach(element => {
                  companiesAr.push({
                    label:element.titleEN ,value:element._id,key:element._id
                  })
                });
             
              }
              this.setState({ companies :companiesAr});


             }).catch(function (error) {
              
                console.log(error);
             }).finally(function () {
                // always executed
             });
          } catch (error) {
             console.log(error);
          }
         } else {
         
           if (this.state.lang === 'AR'){
             alert('لا يوجد أتصال بالانترنت');
           } else {
             alert('No internet connection');
           }
         }
       });
     } 
     getCodes = () => {
      NetInfo.fetch().then(state => {
        if(state.isConnected)
        {
          fetch('https://restcountries.eu/rest/v2/all')
            .then((response) => response.json())
            .then((responseJson) => {
              const Data = responseJson;
              
              const codes = []
              for (let index = 0; index < Data.length; index++) {
                  var obj = {
                     title:Data[index].callingCodes[0],
                  }
               
                  codes.push(obj)
              }
              this.setState({ con_codes: codes });
  
            })
            .catch((error) => {
              if (this.state.lang.indexOf('ar') != -1) {
                this.setState({ flag: 1 });
                alert('عذرا حدث خطأ ما حاول مره أخري ');
              }
              else {
                this.setState({ flag: 1 });
                alert('Sorry error happen try again');
              }
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

      getData =()=>{ 
       
        NetInfo.fetch().then(state => {
          if(state.isConnected)
          {
            fetch('http://134.209.178.237/api/user/getReservationByID?id='+this.state.requestId)
        .then((response) => response.json())
        .then((responseJson) => {
                 this.setState({flag_lang:1});
                 const Data = responseJson;
                 this.setState({ rentRequest:Data });
                 this.setState({carImg:Data.carID.logo})
                 this.setState({carID:Data.carID._id})
                 this.setState({startDate:Data.receivedDate})
                 this.setState({endDate:Data.deliveryDate})
                 this.setState({rentPrice:Data.carID.rentPrice})
                 this.setState({status:Data.status})
                 this.setState({rate:Data.status})
                 this.setState({renterName:Data.renterName})
                 this.setState({renterEmail:Data.renterEmail})
                 this.setState({renterMobile:Data.renterMobile})
                 this.setState({dateBirth:Data.birthday})
                 this.setState({driverName:Data.driverName})
                 this.setState({comID:Data.airlineID})
                 this.setState({con_code:Data.countryCode})
                 this.setState({flightNum:Data.flightNumber})
                 this.setState({licenseNum:Data.DrivingLicenseNumber})
                 this.setState({licenseImg:Data.DrivingLicenseImg})
                 this.setState({bill:Data.paymentMethod})
                 this.setState({receivingLocation:Data.receivingLocation})
                 this.setState({deliveryLocation:Data.deliveryLocation})
                 this.setState({insurance:Data.insurance})
                 this.setState({amount:Data.amount})
                 this.setState({amountPaid:Data.amountPaid})
                 this.setState({startTimeH:Data.receivedTimeH})
                 this.setState({startTimeM:Data.receivedTimeM})
                 this.setState({endTimeH:Data.deliveryTimeH})
                 this.setState({endTimeM:Data.deliveryTimeM})


              if (this.state.lang==='ar') {
                  this.setState({carType:Data.carID.carTypeID.titleAr})
              }
              else{
                  this.setState({carType:Data.carID.carTypeID.titleEN})                
              }
              
              var start =  Data.receivedDate.split("T")[0]
              var end =  Data.deliveryDate.split("T")[0]

              var startDay = start.split("-")
              var start_day = startDay[2];
              var endDay = end.split("-")
              var end_day = endDay[2];
              var dayNum = end_day - start_day
              this.setState({dayNum})

              var startTime = this.state.startTimeH + ':' + this.state.startTimeM
              var endTime = this.state.endTimeH + ':' + this.state.endTimeM
              this.setState({startTime})
              this.setState({endTime})
        })
        .catch((error) => {
          this.setState({flag_lang:1});
          alert("rrrr"+{error});
         
        });
       
          }else{
            
              if (this.state.lang.indexOf('ar')!=-1) {
                this.setState({flag_lang:1});
                alert('عذرا لا يوجد اتصال بالانترنت');
              }else{
                this.setState({flag_lang:1});
                alert('No internet connection!')
              }
              
             }
        })
      }  

      getAdditionData(){
        NetInfo.fetch().then(state =>{
          if (state.isConnected){
            try {
              axios.get('http://134.209.178.237/api/user/getaddByReservationID',{
                params: {
                  reservationID:this.state.requestId,
              },
              }).then(response => {
                const data = response.data;
                this.setState({additions:data})
              }).catch(function (error) {
                 console.log(error);
              }).finally(function () {
                 // always executed
              });
           } catch (error) {
              console.log(error);
           }
          } else {
            
            if (this.state.lang === 'ar'){
              alert('لا يوجد أتصال بالانترنت');
            } else {
              alert('No internet connection');
            }
          }
        });
      }

      getRecieptData(){
        NetInfo.fetch().then(state =>{
          if (state.isConnected){
            try {
              axios.get('http://134.209.178.237/api/user/getRecieptByReservationID',{
                params: {
                  reservationID:this.state.requestId,
              },
              }).then(response => {
                const data = response.data;
                this.setState({recieptData:data})
                this.setState({compName:data.companyName})
                this.setState({address:data.address})
                this.setState({countryID:data.countryID})
                this.setState({cityID:data.cityID})
              }).catch(function (error) {
                 console.log(error);
              }).finally(function () {
                 // always executed
              });
           } catch (error) {
              console.log(error);
           }
          } else {
            
            if (this.state.lang === 'ar'){
              alert('لا يوجد أتصال بالانترنت');
            } else {
              alert('No internet connection');
            }
          }
        });
      }

      uploadImg=()=>{
        NetInfo.fetch().then(state => {
          if(state.isConnected){
            const options = {
              title: this.state.lang.indexOf('ar') != -1?'أختار الصور': 'Select photoes',
              cancelButtonTitle:this.state.lang.indexOf('ar') != -1?'الغاء ': 'Cancel',
              takePhotoButtonTitle:this.state.lang.indexOf('ar') != -1?'كاميرا ': 'Camera',
              chooseFromLibraryButtonTitle:this.state.lang.indexOf('ar') != -1?'معرض الصور ': 'Gallery ',
              storageOptions: {
                skipBackup: true,
                path: 'images',
              },
            };
            ImagePicker.showImagePicker(options, (response) => {      
              if (response.didCancel) {
                if(this.state.lang.indexOf('ar') != -1 ){
                  alert('تم الغاء رفع الصورة');
                }
                else {
                 
                  alert('upload image cancel');
                }
              } else if (response.error) {
                if(this.state.lang.indexOf('ar') != -1 ){
                  
                  alert("حدث خطأ ما");
                }
                else {
                  
                  alert("Opps !!");
                }
              } else if (response.customButton) {
                if(this.state.lang.indexOf('ar') != -1 ){
                  
                  alert("حدث خطأ ما");
                }
                else {
                  
                  alert("Opps !!");
                }
              } else {
                const source = { uri: response.uri };
                const data = new FormData();
                
                data.append('name', 'testName'); // you can append anyone.
                data.append('photo', {
                  uri: source.uri,
                  type: 'image/jpeg', // or photo.type
                  name: 'testPhotoName'
                });
              fetch('http://134.209.178.237/api/user/uploadFile', {
                method: 'post',
                body: data
              }).then((res)=>{ 
                return res.text() 
              })
              .then((text)=>{
                this.setState({
                  licenseImg: text
                });
               
                if(this.state.lang.indexOf('ar') != -1 ){
                  this.setState({flag:1});
                  alert("تم رفع الملف بنجاح");
                }
                else {
                  this.setState({flag:1});
                  alert("file added successfully ");
                }
                
              });
              }
            });
          }else{
            if(this.state.lang.indexOf('ar') != -1 ){
              this.setState({flag:1});
              alert('عذرا لا يوجد أتصال بالانترنت' );
            }
            else {
              this.setState({flag:1});
              alert('Sorry No Internet Connection');
            }
          }
        })
          
        }

      getCountry=()=> {
        NetInfo.fetch().then(state => {
          if(state.isConnected){
        fetch('http://134.209.178.237/api/user/country')
          .then((response) => response.json())
          .then((responseJson) => {
            const countries = responseJson;
             const countriesAr =[];
             
             if(this.state.lang.indexOf('ar') != -1){
               
             countries.forEach(element => {
               countriesAr.push({
                label:element.titleAr ,value:element._id,key:element._id
               })
             });
           
            }else{
              countries.forEach(element => {
                countriesAr.push({
                  label:element.titleEN ,value:element._id,key:element._id
                })
              });
           
            }
            this.setState({ countries :countriesAr});
            // this.setState({ countries :countriesAr});
            this.getCity(this.state.countryID);
            
          })
          .catch((error) => {
              alert('omaaaaar'+error)
          });
        }
          else{
            if(this.state.lang.indexOf('ar') != -1 ){
              alert('عذرا لا يوجد أتصال بالانترنت' );
            }
            else {
              alert('Sorry No Internet Connection');
            }
            }
          })
      }

      getAddtion(){
        NetInfo.fetch().then(state =>{
         if (state.isConnected){
           try {
             axios.get('http://134.209.178.237/api/user/getAdditions').then(response => {
               const data = response.data;
              this.setState({ additions2:data });
             }).catch(function (error) {
                console.log(error);
             }).finally(function () {
                // always executed
             });
          } catch (error) {
             console.log(error);
          }
         } else {
           if (this.state.lang === 'ar'){
             alert('لا يوجد أتصال بالانترنت');
           } else {
             alert('No internet connection');
           }
         }
       });
     }

      getCity=(countryID)=>{
        NetInfo.fetch().then(state => {
          if(state.isConnected){
            // alert("cityID"+this.state.cityID );
            fetch('http://134.209.178.237/api/user/city?id='+countryID)
                      .then((response) => response.json())
                      .then((responseJson) => {
                         const cities = responseJson;
                         const citiesAr =[];
                        
                         if(this.state.lang.indexOf('ar') != -1){
               
                            cities.forEach(element => {
                              citiesAr.push({
                               label:element.titleAr ,value:element._id,key:element._id
                              })
                            });
                            // citiesAr.unshift({
                            //  label:'المدينة' ,value:'1',key:'1'
                            // })
                           //  citiesAr.unshift({
                           //   label:'المنطقة' ,value:'1',key:'1'
                           //  })
                           }else{
                             cities.forEach(element => {
                               citiesAr.push({
                                 label:element.titleEN ,value:element._id,key:element._id
                               })
                             });
                            //  citiesAr.unshift({
                            //    label:'Country' ,value:'1',key:'1'
                            //   })
                           //    citiesAr.unshift({
                           //     label:'City' ,value:'1',key:'1'
                           //    })
                           }
                         
                        this.setState({ cities:citiesAr});
                      })
                      .catch((error) => {
                      });
                    }else{
                        if(this.state.lang.indexOf('ar') != -1 ){
                            this.setState({flag:1});
                            alert('عذرا لا يوجد أتصال بالانترنت' );
                          }
                          else {
                            this.setState({flag:1});
                            alert('Sorry No Internet Connection');
                          }
                      }
                   })   
            }

            validate = () => {
              // resumeeeee 
              const errors = {};
              if (!this.state.startDate) {
                if (this.state.lang.indexOf('ar') != -1) {
                  // this.setState({flag:1});
                  alert('يرجى ادخال تاريخ الاستلام ');
                }
                else {
                  // this.setState({flag:1});
                  alert(' Enter Receiving date First ');
                }
                errors.categoryID = "CategoryID is requied ";
              }
              else if (!this.state.endDate) {
                if (this.state.lang.indexOf('ar') != -1) {
                  // this.setState({flag:1});
                  alert('يرجى ادخال تاريخ التسليم');
                }
                else {
                  // this.setState({flag:1});
                  alert(' Enter delivering date First ');
                }
                errors.categoryID = "CategoryID is requied ";
              }
              else if (!this.state.receivingLocation) {
                if (this.state.lang.indexOf('ar') != -1) {
                  // this.setState({flag:1});
                  alert('يرجى ادخال مكان الاستلام');
                }
                else {
                  // this.setState({flag:1});
                  alert(' Enter receiving location First ');
                }
                errors.categoryID = "CategoryID is requied ";
              }
              else if (!this.state.deliveryLocation) {
                if (this.state.lang.indexOf('ar') != -1) {
                  // this.setState({flag:1});
                  alert('يرجى ادخال تاريخ التسليم');
                }
                else {
                  // this.setState({flag:1});
                  alert(' Enter delivering location First ');
                }
                errors.categoryID = "CategoryID is requied ";
              }
              else if (!this.state.renterName) {
                if (this.state.lang.indexOf('ar') != -1) {
                  // this.setState({flag:1});
                  alert('يرجى ادخال اسم المستأجر');
                }
                else {
                  // this.setState({flag:1});
                  alert(' Choose Category First ');
                }
                errors.categoryID = "CategoryID is requied ";
              }
              else if (!this.state.renterMobile) {
                if (this.state.lang.indexOf('ar') != -1) {
                  // this.setState({flag:1});
                  alert('يرجي ادخال  رقم الموبايل ');
                }
                else {
                  // this.setState({flag:1});
                  alert('  Enter Car Type ');
                }
                errors.carTypeID = "typeID is requied ";
              }
              else if (!this.state.renterEmail) {
                if (this.state.lang.indexOf('ar') != -1) {
                  // this.setState({flag:1});
                  alert('يرجى ادخال البريد الالكترونى');
                }
                else {
                  // this.setState({flag:1});
                  alert('  Enter Car Model ');
                }
                errors.carModelID = "modeleID is requied ";
              }
              else if (this.state.compID=='') {
                if (this.state.lang.indexOf('ar') != -1) {
                  // this.setState({flag:1});
                  alert('يرجى اختيار شركة الطيران');
                }
                else {
                  // this.setState({flag:1});
                  alert(' Plase  Enter   Start Date ');
                }
                errors.startDate = "startDate is requied ";
              }
              else if (!this.state.flightNum) {
                if (this.state.lang.indexOf('ar') != -1) {
                  // this.setState({flag:1});
                  alert('يرجي ادخال رقم الرحلة الجوية ');
                }
                else {
                  // this.setState({flag:1});
                  alert(' Plase Enter End Date ');
                }
                errors.endDate = "endDate is requied ";
              }
             
              else if (!this.state.driverName) {
                if (this.state.lang.indexOf('ar') != -1) {
                  // this.setState({flag:1});
                  alert('يرجي ادخال اسم السائق ');
                }
                else {
                  // this.setState({flag:1});
                  alert(' Plase Enter  the Price ');
                }
                errors.rentPrice = "rentPrice is requied ";
              }
              else if (!this.state.dateBirth) {
                if (this.state.lang.indexOf('ar') != -1) {
                  // this.setState({flag:1});
                  alert('يرجي ادخال تاريج الميلاد ');
                }
                else {
                  // this.setState({flag:1});
                  alert(' Plase Enter  the  Correct Price ');
                }
                errors.rentPrice = "rentPrice is requied ";
              }
              else if (!this.state.licenseNum) {
                if (this.state.lang.indexOf('ar') != -1) {
                  // this.setState({flag:1});
                  alert('يرجي ادخال رقم رخصة القيادة ');
                }
                else {
                  // this.setState({flag:1});
                  alert(' Plase Enter  the Price ');
                }
                errors.rentPrice = "rentPrice is requied ";
              }
              else if (!this.state.licenseImg) {
                if (this.state.lang.indexOf('ar') != -1) {
                  // this.setState({flag:1});
                  alert('يرجي اختيار صورة الرجصة    ');
                }
                else {
                  // this.setState({flag:1});
                  alert(' Plase Enter  the  Correct Price ');
                }
                errors.rentPrice = "rentPrice is requied ";
              }
              else if (!this.state.bill) {
                if (this.state.lang.indexOf('ar') != -1) {
                  // this.setState({flag:1});
                  alert('يرجي اختيار طريقة الدفع');
                }
                else {
                  // this.setState({flag:1});
                  alert(' Plase Enter  the  Correct Price ');
                }
                errors.rentPrice = "rentPrice is requied ";
              }
             
             
              return errors;
          
            } 
            
            
            updateData=()=>{
              this.setState({flag_lang:0});
              NetInfo.fetch().then(state =>{
                if (state.isConnected){
                 const errors = this.validate();
                 this.setState({errors});
                 if (Object.keys(errors).length === 0){
                   try {
                     axios.put('http://134.209.178.237/api/user/reservation/' + this.state.requestId,{
                      userID:this.state.userId,
                      receivedDate: this.state.startDate,
                      deliveryDate: this.state.endDate,
                      receivedTimeH: this.state.startTimeH,
                      receivedTimeM: this.state.startTimeM,
                      deliveryTimeH: this.state.endTimeH,
                      deliveryTimeM: this.state.endTimeM,
                      receivingLocation: this.state.receivingLocation,
                      deliveryLocation: this.state.deliveryLocation,
                      carID: this.state.carID,
                      insurance: this.state.insurance,
                      amount: this.state.amount,
                      amountPaid: this.state.amountPaid,
                      renterName: this.state.renterName,
                      renterMobile: this.state.renterMobile,
                      countryCode:this.state.con_code,
                      renterEmail: this.state.renterEmail,
                      airlineID: this.state.compID,
                      flightNumber: this.state.flightNum,
                      driverName: this.state.driverName,
                      birthday: this.state.dateBirth,
                      DrivingLicenseNumber: this.state.licenseNum,
                      DrivingLicenseImg: this.state.licenseImg,
                      paymentMethod: this.state.bill,
                      addition: this.state.additions,
                      companyName: this.state.compName,
                      address: this.state.address,
                      countryID: this.state.countryID,
                      cityID:this.state.cityID
                     }).then(response => {
                       if (response.data._id){
                        this.setState({flag_lang:1});
                         if (this.state.lang === 'ar'){
                           alert('تم تعديل بيانات الحجز بنجاح');
                         } else {
                           alert('Reservation information updated successfully');
                         }
                         this.getData()
                       } else {
                        this.setState({flag_lang:1});
                         if (this.state.lang === 'ar'){
                           alert('حدث خطأ ما حاول مرة أخرى');
                         } else {
                           alert('Opps try again');
                         }
                       }
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
                 }
                } else {
                  this.setState({flag_lang:1});
                 if (this.state.lang === 'ar'){
                   alert('لا يوجد أتصال بالانترنت');
                 } else {
                   alert('No internet connection');
                 }
                }
              });
            }     
     

      renderOption(){
        return(
          <View style={{width:'100%',height:'8%',alignItems:'center',justifyContent:'center',}}>
          {this.state.lang.indexOf('ar')!=-1?
          <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',backgroundColor:'#C8972C'}}>
          <TouchableOpacity  onPress={() =>{
      this.props.navigation.goBack()
       }}
       style={{width:'13%',height:'100%',alignItems:'center',justifyContent:'center'}}>
      <Image resizeMode={'cover'} source={require('../img/w_arrow.png')} 
     style={{width:10 , height:18,alignItems:'center',}}/>
     </TouchableOpacity>
     <Text style={{textAlign:'center',width:'74%',fontSize:18,fontFamily:'segoe',color:"#fff", }}>
        {/* {strings("OrderPage.barTitle")} */}
        {this.state.lang.indexOf('ar')!=-1?'تفاصيل الطلب':'Order details'}
        </Text>
          <TouchableOpacity onPress={() =>{this.props.navigation.openDrawer() }}
          style={{width:'13%',height:'100%',alignItems:'center',justifyContent:'center'}}>
          <Image resizeMode={'cover'} source={require('../img/nav.png')}
          style={{width:25 , height:25,alignItems:'center'}} />
         </TouchableOpacity>
       </View>
          :
          <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row-reverse',backgroundColor:'#C8972C'}}>
          <TouchableOpacity  onPress={() =>{
      this.props.navigation.goBack()
       }}
       style={{width:'13%',height:'100%',alignItems:'center',justifyContent:'center'}}>
      <Image resizeMode={'cover'} source={require('../img/r_back.png')} 
     style={{width:10 , height:18,alignItems:'center',}}/>
     </TouchableOpacity>
     <Text style={{textAlign:'center',width:'74%',fontSize:18,fontFamily:'segoe',color:"#fff", }}>
        {/* {strings("OrderPage.barTitle")} */}
        {this.state.lang.indexOf('ar')!=-1?'تفاصيل الطلب':'Order details'}
        </Text>
          <TouchableOpacity onPress={() =>{this.props.navigation.openDrawer() }}
          style={{width:'13%',height:'100%',alignItems:'center',justifyContent:'center'}}>
          <Image resizeMode={'cover'} source={require('../img/nav.png')}
          style={{width:25 , height:25,alignItems:'center'}} />

         </TouchableOpacity>
       </View>
        }
          </View>
        )
 }

 renderItem(item ,index){
  return (
       <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:'100%',alignItems:'center',justifyContent:'center',marginVertical:2}]} >
         <TouchableOpacity
         onPress={()=>{
          this.setState({
            additions: this.state.additions.filter(element => element._id != item._id)
          });
         }} >
         <Icon name="close" size={22} color="#707070" style={{margin:5}} />
        </TouchableOpacity>
         <View style={[{width:'20%',height:25,borderRadius: 5, borderWidth:1 ,borderColor:'#DFDFDF',alignItems:'center',justifyContent:'center'}]}>
         <Icon name="caret-down" size={15} color="#707070" style={[this.state.lang ==='ar'?styles.posLeft:styles.posRight,{position:'absolute'}]} />
         <View style={[{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}]}>
         <ModalDropdown
                   options={this.state.picker_props} // data
                   defaultValue={item.additionsNumber}
                   onSelect={(indx,value) => { 
                     var price = item.additionsPrice / item.additionsNumber
                     this.setState({ wifi_num: value.value }) 
                     this.state.additions[index].additionsNumber = value.value
                     this.state.additions[index].additionsPrice = value.value*price
                    //  alert(this.state.additions[index].additionsNumber)
                    }}
                   renderButtonText={(rowData) => (rowData.label)} // ba3d ma t5tar
                   style={{ width:'100%', }} // abl ma t5tar
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
         <Text style={{ textAlign: 'center', color: '#343C53', fontSize: 14,margin:7 }}>{this.state.lang === 'ar' ? 'عدد' : 'Number'}</Text>
         <Text style={[this.state.lang === 'ar' ? styles.right : styles.left, {flex:1, color: '#343C53', fontSize: 14, fontFamily: "segoe",paddingHorizontal:7}]}>
          {this.state.lang === 'ar' ? item.titleAr : item.titleEN}</Text>
          {this.state.lang ==='ar'?
          <Icon name="caret-left" size={20} color="#707070" style={{margin:5}} />
          :
          <Icon name="caret-right" size={20} color="#707070" style={{margin:5}} />
          }
          
       </View>
       
  );
} 
renderItem2(item){
  return (
    <TouchableOpacity
    onPress={ async()=>{
      // this.setState({checked: !this.state.checked});
     }}
    style={[{borderRadius:5,marginVertical:3,width:'100%',height:height/7}]}>
       <View style={[this.state.lang === 'ar'?styles.row:styles.row_res,{width:'100%',height:'100%',alignItems:'center',}]} >
          <View style={[this.state.lang === 'ar'?styles.row:styles.row_res,styles.shadow,{flex:1,height:'100%',alignItems:'center',justifyContent:'center',margin:2}]}>
             <View style={{width:'65%',height: '100%',backgroundColor:'#f8f8f8'}}>
             <Text style={[this.state.lang === 'ar'?styles._right:styles._left,{width:'100%',fontSize:17,color:'#434343',fontFamily:'segoe',position:'absolute',top:5}]}>
             {this.state.lang === 'ar'?item.titleAr:item.titleEN}
             </Text>
             <View style={[this.state.lang === 'ar'?styles.row:styles.row_res,{width:'100%',alignItems:'center',position:'absolute',bottom:5}]}>
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
               {/* <CheckBox
                checkedIcon={<Image style={{width:30,height:30,}} source={require('../img/checked.png')} />}
                uncheckedIcon={<Image style={{width:25,height:25,}} source={require('../img/unchecked.png')} />}
              checked={this.state.checked}
              onPress={() =>{
                 this.setState({checked: !this.state.checked});
                }}
               /> */}
               {this.renderRadio(item)}
       </View>
       
    </TouchableOpacity>
  );
}
 
renderRadio(clicked){
  const {additions,radioSelected,selectedID} = this.state;
  return(
   <TouchableOpacity
   style={{ width:25 ,height:25 ,borderRadius:3,backgroundColor:'#fff',elevation:5,margin:3,justifyContent:'center',alignItems:'center'}}
   onPress={()=>{
    if(additions.length!=0){
    additions.forEach(item=>{
      if(item.additionsID === clicked._id){
        this.setState({
         additions: additions.filter(item => item.additionsID != clicked._id)
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
         additions.push(obj)
         selectedID.push(clicked._id)
         this.setState({wifi_num:0})

         this.setState({additions})
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
     additions.push(obj)
     selectedID.push(clicked._id)
     alert(JSON.stringify(obj))
     this.setState({wifi_num:0})

     this.setState({additions})
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


   render(){
       return(
      <SafeAreaView style={{width: '100%', flex:1,alignItems:'center',}}>
        {this.renderOption()}
       {this.state.flag_lang === 0 ?
        <ActivityIndicator
        color='#C8972C'
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}/>
        :
        <ScrollView style={{width:'100%',flex:1}}>
           <View style={{width:'100%' , alignItems:'center',justifyContent:'center'}}>
           <View style={[this.state.lang === 'ar'?styles.row:styles.row_res,{width:'95%',alignItems:'center',marginTop:10,}]}>
              <Text style={{flex:1,textAlign:'center',alignItems:'center',fontSize:16,color:'#414141',fontFamily:'segoe'}}>
                {this.state.status ===1?'مشغول':'منتهى'}</Text>
              <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{flex:1,alignItems:'center',fontSize:14,color:'#414141',fontFamily:'segoe' }]}> 
              {this.state.lang ==='ar'?'حاله الطلب':'Order state'}
               </Text>
           </View>

        <View style={{width:'95%',flexDirection:'row',marginTop:5,justifyContent:'center',alignItems:'center'}}>
        <View style={{flex:1,height:2,backgroundColor:'#E4E4E4',alignItems:'flex-start'}}></View>
        <Text style={{textAlign:'center',fontSize:16,color:'#000000',fontFamily:'segoe',margin:10 }}> 
        {this.state.carType}
        </Text>
        <View style={{flex:1,height:2,backgroundColor:'#E4E4E4',alignItems:'flex-end'}}></View>
        </View>
        {!this.state.carImg ?
        <Image
          resizeMode="stretch"
         style={{ width: '95%', height: height/5,}}
        source={require('../img/image.png')}
        />
       :
        <View
      style={[styles.viewItem,{overflow: 'hidden',backgroundColor: '#FFF',borderRadius:10,marginTop:3}]}>
         <ImageBackground
             resizeMode ="cover"
             source={{uri:this.state.carImg}}
             style={{width: '100%', height: '100%', alignItems: 'center', borderRadius:10}} />
            <View style={{borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',
                  backgroundColor:'#AEAEAE',position: 'absolute',top:10,left:10}}>
               <View style={{width:width*0.1,height: 30,backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',}}>
               <Icon name="star" size={20} color="#FFE000" style={{margin:2}} />
              </View>
                <Text style={{ fontSize: 15, color: '#000',backgroundColor:'#AEAEAE',textAlign:'center'}}>{this.state.rate}</Text>
              </View>
       </View>
     }
     <View style={{width:'95%',flexDirection:'row',marginTop:3,justifyContent:'center',alignItems:'center'}}>
        <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-start'}}></View>
        <Text style={{width:'40%',textAlign:'center',fontSize:16,color:'#000000',fontFamily:'segoe', }}> 
        {this.state.lang === 'ar'?'بيانات الأيجار':'Rent infofmation'}
        </Text>
        <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-end'}}></View>
        </View>

  <View style={[styles.shadow,{width:'95%',color: '#707070',marginTop:5,marginBottom:5,backgroundColor:'#F8F8F8',alignItems:'center',justifyContent:'center'}]}>
        <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'تاريخ الاستلام / الوقت':'Receving date / time'}</Text>

        <View style={[this.state.lang==='ar'?styles.row:styles.row_res,{ width: '92%',height: height*0.07,alignItems:'center',justifyContent:'center',marginTop:5}]}>
                  
          <View  style={[styles.shadow,{flex:1,height:'100%',borderRadius: 7,margin:3,justifyContent:'center'}]}>
            <DatePicker
            style={{
              width:'100%', }}
              date={this.state.startTime }
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
                  width:25,
                  height:25
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
                   
          <View style={[styles.shadow,{flex:1,height:'100%',borderRadius: 7,margin:3,justifyContent:'center'}]} >
          <DatePicker
            style={{
              width:'100%', height: '100%',}}
              date={this.state.startDate}
              placeholder={this.state.lang.indexOf('ar') != -1 ?'تاريخ البدأ' :'Start date'}
              mode="date"
              format="YYYY-MM-DD"
              // minDate="2016-05-01"
              // maxDate="2016-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              iconSource={require('../img/date.png')}
              customStyles={{
                dateIcon: {
                  right: 0,
                  top: 0,
                  width:25,
                  height:25
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

        <View style={[this.state.lang==='ar'?styles.row:styles.row_res,{width: '92%',height: height*0.07,alignItems:'center',justifyContent:'center',marginTop:5}]}>
               <View  style={[styles.shadow,{flex:1,height:'100%',borderRadius: 7,margin:3,justifyContent:'center'}]}>
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
                      width:25,
                      height:25
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
                <View style={[styles.shadow,{flex:1,height:'100%',borderRadius: 7,margin:3,justifyContent:'center'}]} >
                       <DatePicker
                        style={{
                          width:'100%', height: '100%',}}
                        date={this.state.endDate}
                        placeholder={this.state.lang.indexOf('ar') != -1 ?'تاريخ الانتهاء' :'End date'}
                        mode="date"
                        format="YYYY-MM-DD"
                        // minDate="2016-05-01"
                        // maxDate="2016-06-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        iconSource={require('../img/date.png')}
                        customStyles={{
                          dateIcon: {
                            right: 0,
                            top: 0,
                            width:25,
                            height:25
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
          {this.state.lang === 'ar' ? 'مده الايجار' : 'Duration of rent'}</Text>
        <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,styles.shadow, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center',backgroundColor: '#fff', borderRadius: 7,height:height*0.07,borderColor:'#E9E9E9',borderWidth:1 }]}>
        <Text style={{ textAlign: 'center', textAlignVertical:'center',color: '#969696', fontSize: 14, flex: 1,backgroundColor:'#F7F7F7',height:'100%',borderRadius:7,borderColor:'#E9E9E9',borderWidth:1 }}>{this.state.lang ==='ar'?'ر س':'SAR'}</Text>
                      <Text style={{ textAlign: 'center', color: '#969696', fontSize: 14, flex: 3 }}>{this.state.dayNum} {'X'} {this.state.rentPrice} </Text>
        </View>

        <Text style={[this.state.lang === 'ar' ? styles.right : styles.left, { width: '90%', color: '#707070', fontSize: 14, fontFamily: "segoe", marginTop: 10 }]}>
          {this.state.lang === 'ar' ? 'موقع الاستلام' : 'Receving location'}</Text>
        <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,styles.shadow, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center', elevation: 4, shadowOpacity: 0.3, backgroundColor: '#fff', borderRadius: 10,height:height*0.07 }]}>
          {/* <Icon name="caret-down" size={20} color="#707070" style={{margin:'3%'}} /> */}
          {/* <Text style={{ textAlign: 'center', color: '#969696', fontSize: 14, flex: 1 }}>{this.state.receivingLocation}</Text> */}
          <TextInput  
             placeholderTextColor='#707070'
             placeholder={this.state.lang.indexOf('ar') != -1 ?'موقع الاستلام' :'Receiving location'} 
             underlineColorAndroid="transparent"
             defaultValue={this.state.receivingLocation}
             onChangeText={(receivingLocation) => this.setState({ receivingLocation  }) } 
            style={{flex:1,height:'100%',textAlign:'center' ,color:'#000',fontSize:14,fontFamily:'segoe'}}>
            </TextInput>
          <Image source={require('../img/map.png')}
            style={{ width: 20, height: 20, margin: 7 }} resizeMode="contain" />
        </View>
        <View style={[this.state.lang === 'ar' ? styles.pRow : styles.pRow_res, { width: '90%', marginTop: 5,}]}>
          <TouchableOpacity
          onPress={()=>{
            this.setState({isVisible:true})
           }}>
          <Text style={[this.state.lang === 'ar' ? styles.right : styles.left,{ color: '#C8972C',fontSize:14,margin:3}]}>{this.state.lang === 'ar' ? 'أعرض الخريطه' : 'Show map'}</Text>
          </TouchableOpacity>
          <Text style={[this.state.lang === 'ar' ? styles.right : styles.left,{color: '#707070', fontSize: 14,margin: 3 }]}>{this.state.lang === 'ar' ? 'لا تستطيع أيجاد الموقع؟' : 'You cannot find location?'}</Text>
          <Image source={require('../img/ques.png')}
            style={{ width: 20, height: 20, margin: 3 }} resizeMode="contain" />
        </View>
        <Text style={[this.state.lang === 'ar' ? styles.right : styles.left, { width: '90%', color: '#707070', fontSize: 14, fontFamily: "segoe", marginTop: 10 }]}>
          {this.state.lang === 'ar' ? 'موقع التسليم' : 'Delivering location'}</Text>
        <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,styles.shadow, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center', elevation: 4, shadowOpacity: 0.3, backgroundColor: '#fff', borderRadius: 10,height:height*0.07 }]}>
          {/* <Icon name="caret-down" size={20} color="#707070" style={{margin:'3%'}} /> */}
          {/* <Text style={{ textAlign: 'center', color: '#969696', fontSize: 14, flex: 1 }}>{this.state.deliveryLocation}</Text> */}
          <TextInput  
            placeholderTextColor='#707070'
            placeholder={this.state.lang.indexOf('ar') != -1 ?'موقع التسليم' :'Delivering location'} 
            underlineColorAndroid="transparent"
            defaultValue={this.state.deliveryLocation}
            onChangeText={(deliveryLocation) => this.setState({ deliveryLocation  }) } 
            style={{flex:1,height:'100%',textAlign:'center' ,color:'#000',fontSize:14,fontFamily:'segoe',}}>
            </TextInput>
          <Image source={require('../img/map.png')}
            style={{ width: 20, height: 20, margin: 7 }} resizeMode="contain" />
        </View> 
        <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center',}]}>
         <TouchableOpacity
         onPress={()=>{
          this.setState({isVisible2:true})
         }} >
        <Image source={require('../img/addd.png')}
            style={[{ width: 30, height: 30, margin: 5,}]} resizeMode="stretch" />
        </TouchableOpacity>
          <Text style={[this.state.lang === 'ar' ? styles.right : styles.left,{color: '#707070', fontSize: 14,flex:1}]}>{this.state.lang === 'ar' ? 'الأضافات' : 'Additions'}</Text>
        </View> 
              {/* omar */}
        <View style={[styles.shadow,{ width:'90%', alignItems: 'center',justifyContent: 'center',padding:5,borderRadius:6,backgroundColor:'#FFFFFF',borderColor:'#EEECEC',borderWidth:1}]}>
        <FlatList style={{ width:'100%'}}
                data={this.state.additions}
                numColumns={1}
                renderItem={({ item ,index }) => this.renderItem(item,index)}
                keyExtractor={(item, index) => index.toString()}
              />
        </View> 

        <Text style={[this.state.lang === 'ar' ? styles.right : styles.left, { width: '90%', color: '#707070', fontSize: 14, fontFamily: "segoe", marginTop: 10 }]}>
          {this.state.lang === 'ar' ? 'التأمين الزائد' : 'Overload insurance'}</Text>
        <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,styles.shadow, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center', 
        backgroundColor: '#fff', borderRadius: 10,height:50,borderColor:'#DFDFDF',borderWidth:1 }]}>
        <Text style={{height:'100%', textAlign: 'center', color: '#343434', fontSize: 14, flex: 1,borderColor:'#DFDFDF',borderWidth:1,borderRadius:5,textAlignVertical:'center'}}>{this.state.lang ==='ar'?'ر.س':'SAR'}</Text>
          <Text style={{ textAlign: 'center', color: '#707070', fontSize: 14, flex: 3 }}>{this.state.insurance}</Text>
        </View>

        <Text style={[this.state.lang === 'ar' ? styles.right : styles.left, { width: '90%', color: '#707070', fontSize: 14, fontFamily: "segoe", marginTop: 10 }]}>
          {this.state.lang === 'ar' ? 'الأجمالـى' : 'Total'}</Text>
        <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,styles.shadow, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center',marginBottom:10,
         backgroundColor: '#fff', borderRadius: 10,height:height*0.07,borderColor:'#C8972C',borderWidth:1 , }]}>
        <Text style={{ height:'100%',textAlign: 'center', color: '#343434', fontSize: 14, flex: 1,borderColor:'#C8972C',borderWidth:1,borderRadius:5,textAlignVertical:'center' }}>{this.state.lang ==='ar'?'ر.س':'SAR'}</Text>
          <Text style={{ textAlign: 'center', color: '#707070', fontSize: 14, flex: 3,fontWeight:'bold' }}>{this.state.amount}</Text>
        </View> 
          
     </View>


         <View style={{width:'90%',flexDirection:'row',marginTop:'5%',justifyContent:'center',alignItems:'center'}}>
        <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-start'}}></View>
        <Text style={{width:'40%',textAlign:'center',fontSize:16,color:'#4B4B4B',fontFamily:'segoe' }}> 
        {this.state.lang === 'ar' ? 'بيانات المستأجر' : 'Tenant data'}
        </Text>
        <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-end'}}></View>
        </View>
 <View style={[styles.shadow,{width:'95%',color: '#707070',marginTop:5,marginBottom:5,backgroundColor:'#F8F8F8',alignItems:'center',justifyContent:'center'}]}>
        <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'الأســم':'Name'}</Text>
                <TextInput  
                            placeholderTextColor='#000'
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'الاسم بالكامل' :'FullName'} 
                            underlineColorAndroid="transparent"
                            defaultValue={this.state.renterName}
                            onChangeText={(renterName) => this.setState({ renterName  }) } 
                            style={[styles.shadow,{width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:10,color:'#000',fontSize:14,fontFamily:'segoe',backgroundColor:'#fff'}]}>
                          </TextInput>
                 <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'رقم الجوال':'Mobile'}</Text>
              <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,styles.shadow,{ width: '90%', height: height*0.07,marginTop: 5, backgroundColor: '#FFF', borderRadius: 8,alignItems:'center',
                 backgroundColor:'#FFF'}]} >
               <View style={[{ width:'20%',height:'100%',alignItems:'center',flexDirection:'row',backgroundColor:'#F7F7F7',borderRadius:7}]}>
              <Icon name="angle-down" size={15} color="#707070" style={{margin:5}} />
               <View style={[{width:'90%',alignItems:'center'}]}>
               <ModalDropdown
                   options={this.state.con_codes} // data
                   defaultValue={this.state.con_code}
                   onSelect={(index, value) => { 
                     this.setState({ con_code: value.title }) 
                    }}
                   renderButtonText={(rowData) => (rowData.title)} // ba3d ma t5tar
                   style={{ width:'100%' }} // abl ma t5tar
                   textStyle={{  fontSize: 12, color: '#000' }}
                    dropdownStyle={{ width: 80, alignSelf: 'center', height: 200, borderColor: '#D7D7D7', borderWidth: 1, borderRadius: 3, }}
                   renderRow={function (rowData, rowID, highlighted) {
                    return (
                     <View style={[ { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 40, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                     <Text style={[{ fontSize: 12, color: '#000', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                      {/* {this.state.lang==='ar'?rowData.titleAr:rowData.titleEN} */}
                      {rowData.title}
                       </Text>
                        </View>
                      );
                      }.bind(this)}
                      />
                  </View>
              </View>
                <TextInput
                  underlineColorAndroid='#fff'
                  keyboardType="numeric"
                  placeholderTextColor='#D4D4D4'
                  defaultValue={this.state.renterMobile}
                  keyboardType='numeric'
                  onChangeText={(renterMobile) => this.setState({ renterMobile })}
                  placeholder={this.state.lang.indexOf('ar') != -1 ? ' رقم الجوال ' : ' Mobile'}
                  style={[{ width: '60%', height: '100%', color: '#000', fontSize: 14,fontFamily:"segoe",textAlign:'center' }]}
                />
              </View>
                 <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'البريد الألكترونى':'Email'}</Text>

                          <TextInput  
                            placeholderTextColor='#000'                  
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'الايميل ' :'ُEmail'} 
                            defaultValue={this.state.renterEmail}
                            underlineColorAndroid="transparent"
                            onChangeText={(renterEmail) => this.setState({renterEmail}) } 
                            style={[styles.shadow,{width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:7,color:'#000',fontSize:14,fontFamily:'segoe',backgroundColor:'#fff'}]}>
                          </TextInput> 
               <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
               {this.state.lang === 'ar'? 'شركه الطيران':'Airline'}</Text>
               <View style={[this.state.lang==='ar'?styles.row:styles.row_res,styles.shadow,{ width: '90%',height:height*0.07,borderRadius: 7,marginTop:7,backgroundColor:'#fff'}]}>
              <Icon name="caret-down" size={18} color="#707070" style={{margin:10}} />
               <View style={{flex:1}}  >
               <Picker 
                  style={{width:'100%',alignItems:'center',color:'#707070',justifyContent:'center',backgroundColor:'transparent'}} 
                  itemStyle={{backgroundColor:'#707070',fontSize:14}}
                  mode="dialog" selectedValue = {this.state.comID?this.state.comID:"1"} 
                  onValueChange = {(comID) =>{
                    this.setState({ comID })
                 }}
               >
                       {this.state.companies.map((i, index) => (
               <Picker.Item
               label = {i.label} value = {i.value} key={i.value} />
                       ))}
              </Picker>
              </View>
              </View>    
                <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'رقم الرحله الجويه':'Flight number'}</Text>
                          <TextInput  
                            placeholderTextColor='#000'                  
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'Flight number ' :'Flight number'} 
                            defaultValue={this.state.flightNum}
                            underlineColorAndroid="transparent"
                            onChangeText={(flightNum) => this.setState({ flightNum  }) } 
                            style={[styles.shadow,{width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:7,color:'#000',fontSize:14,fontFamily:'segoe',backgroundColor:'#fff'}]}>
                          </TextInput>          
                   

             <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'تحميل صورة الهويه / الباسبور':'Upload ID photo / Passport '}</Text>
             <View style={[this.state.lang=== 'ar'?styles.row:styles.row_res,styles.shadow,{width:'90%',height:height*0.07,alignItems:'center',marginTop:7,borderRadius:7,marginBottom:10,backgroundColor:'#fff'}]}>
             <TouchableOpacity
              // onPress={this.uploadImg}
                 style={{width: 30,height:30,margin:5,}}>
                 <Image 
                    resizeMode='stretch'
                    source={require('../img/upload.png')} style={{width: '100%',height:'100%',}} >
                 </Image>
                 </TouchableOpacity>
                 <TouchableOpacity
                  // onPress={this.uploadImg}
                 style={{flex:1}}>
                  <Text style={{width:'100%',color:'#DCDCDC',fontSize:14,textAlign:'center',fontFamily:'segoe'}}>
                   {this.state.lang.indexOf('ar') != -1 ?'أختر ملـف ' :'Upload file'}
                  </Text>
                 </TouchableOpacity>
                </View>
   </View>
        <View style={{width:'90%',flexDirection:'row',marginTop:'5%',justifyContent:'center',alignItems:'center'}}>
        <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-start'}}></View>
        <Text style={{width:'40%',textAlign:'center',fontSize:16,color:'#4B4B4B',fontFamily:'segoe' }}> 
        {this.state.lang === 'ar' ? 'بيانات السائق' : 'Driver data'}
        </Text>
        <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-end'}}></View>
        </View>

  <View style={[styles.shadow,{width:'95%',color: '#707070',marginTop:5,marginBottom:5,backgroundColor:'#F8F8F8',alignItems:'center',justifyContent:'center'}]}>
        <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'الأســم':'Name'}</Text>
                <TextInput  
                            placeholderTextColor='#000'
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'الاسم بالكامل' :'FullName'} 
                            underlineColorAndroid="transparent"
                            defaultValue={this.state.driverName}
                            onChangeText={(driverName) => this.setState({ driverName  }) } 
                            style={[styles.shadow,{backgroundColor:'#fff',width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:10,color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput>
                <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'تاريخ الميلاد':'Date of birth'}</Text>
                   <View style={[styles.shadow,{backgroundColor:'#fff',width: '90%',height:height*0.07,borderRadius: 7,marginTop:7,}]} >     
                          <DatePicker
                        style={[{width: '100%',height:'100%',textAlign:'center' ,color:'#000',fontSize:14}]}
                        date={this.state.dateBirth}
                        placeholder={this.state.lang.indexOf('ar') != -1 ?'تاريخ الميلاد' :'Birthday Date'}
                        mode="date"
                        format="YYYY-MM-DD"
                        // minDate="2016-05-01"
                        // maxDate="2016-06-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateIcon: {
                          position: 'relative',
                          display:'none',
                          left: 0,
                          top: 4,
                          marginLeft: 0,
                        },
                        dateInput: {
                          marginLeft: 0
                          ,borderWidth: 0,borderColor: '#707070',fontSize:14
                        }
                        // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(dateBirth) => {this.setState({dateBirth})}}
                      />   
                     <Image 
                    resizeMode='contain'
                    source={require('../img/date.png')} style={[this.state.lang ==='ar'?styles.posLeft:styles.posRight,{width: 25, height: 25,margin:5,position:'absolute',}]}>
                  </Image> 
                      </View>     
                 <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'رقم رخصه القيادة':'Licence number'}</Text>
                          <TextInput  
                            placeholderTextColor='#000'                  
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'رقم رخصه القيادة ' :'Licence number'} 
                            defaultValue={this.state.licenseNum}
                            keyboardType='numeric'
                            underlineColorAndroid="transparent"
                            onChangeText={(licenseNum) => this.setState({ licenseNum  }) } 
                            style={[styles.shadow,{backgroundColor:'#fff',width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:7,color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput>   
               
              <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'تحميل صورة الرخصه  ':'Upload the license image '}</Text>
             <View style={[this.state.lang=== 'ar'?styles.row:styles.row_res,styles.shadow,{backgroundColor:'#fff',height:height*0.07,width:'90%',alignItems:'center',marginTop:7,borderRadius:7,marginBottom:10}]}>
             <TouchableOpacity onPress={this.uploadImg}
                 style={{width: 30,height:30,margin:5,}}>
                 <Image 
                    resizeMode='stretch'
                    source={{uri:this.state.licenseImg}} style={{width: '100%',height:'100%',}} >
                 </Image>
                 </TouchableOpacity>
                 <TouchableOpacity
                  onPress={this.uploadImg}
                 style={{flex:1}}>
                  <Text style={{width:'100%',color:'#DCDCDC',fontSize:14,textAlign:'center',fontFamily:'segoe'}}>
                   {this.state.lang.indexOf('ar') != -1 ?'أختر ملـف ' :'Upload file'}
                  </Text>
                 </TouchableOpacity>
                </View> 
     </View>

     <View style={{width:'90%',flexDirection:'row',marginTop:'5%',justifyContent:'center',alignItems:'center'}}>
        <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-start'}}></View>
        <Text style={{width:'40%',textAlign:'center',fontSize:16,color:'#4B4B4B',fontFamily:'segoe' }}> 
        {this.state.lang === 'ar' ? 'تفاصيل الفاتورة' : 'Invoice details'}
        </Text>
        <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-end'}}></View>
        </View>

  <View style={[styles.shadow,{width:'95%',color: '#707070',marginTop:5,marginBottom:5,backgroundColor:'#F8F8F8',alignItems:'center',justifyContent:'center'}]}>
        <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'اسم الشركه':'Company name'}</Text>
                <TextInput  
                            placeholderTextColor='#707070'
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'الاسم بالكامل' :'FullName'} 
                            underlineColorAndroid="transparent"
                            defaultValue={this.state.compName}
                            onChangeText={(compName) => this.setState({ compName  }) } 
                            style={[styles.shadow,{backgroundColor:'#fff',width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:10,color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput>
              <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'عنوان الشركه':'Company sddress'}</Text>
                <TextInput  
                            placeholderTextColor='#707070'
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'عنوان الشركه' :'Company sddress'} 
                            underlineColorAndroid="transparent"
                            defaultValue={this.state.address}
                            onChangeText={(address) => this.setState({ address})} 
                            style={[styles.shadow,{backgroundColor:'#fff',width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:10,color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput>
                          <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'الدوله / المدينه':'Country / City'}</Text>

                   <View style={[this.state.lang === 'ar'?styles.row_res:styles.row,{width: '90%',height: height*0.07,alignItems:'center',justifyContent:'center',marginTop:5,marginBottom:20}]}>
                   <View style={[styles.shadow,{backgroundColor:'#fff',width: '50%',height:'100%',borderRadius: 7,marginTop:7,alignItems:'center',justifyContent:'center',margin:3}]}>
                   <Icon name="caret-down" size={18} color="#707070" style={[this.state.lang==='ar'?styles.posLeft:styles.posRight,{position:'absolute'}]} />
                   <View style={{width:'100%',alignItems:'center'}} >
                  <Picker 
                  style={{width:'100%',alignItems:'center',color:'#707070',justifyContent:'center',backgroundColor:'transparent'}} 
                  itemStyle={{backgroundColor:'#000',color: '#707070',fontSize:14}}

                     mode="dialog" selectedValue = {this.state.countryID?this.state.countryID:'1'} 
                   onValueChange = {(countryID) => 
                {
                  if(countryID !='1'){
                this.setState({ countryID:countryID })
                fetch('http://134.209.178.237/api/user/city?id='+countryID)
                .then((response) => response.json())
                .then((responseJson) => {
                   const cities = responseJson;
                   const citiesAr =[];
                   if(this.state.lang.indexOf('ar') != -1){
                   cities.forEach(element => {
                     citiesAr.push({
                       label:element.titleAr ,value:element._id,key:element._id
                     })
                   });

                  }else{
                    cities.forEach(element => {
                      citiesAr.push({
                        label:element.titleEN ,value:element._id,key:element._id
                      })
                    });
                  }
                  this.setState({ cities:citiesAr});
                })
                .catch((error) => {
                });
              }
              else{
                if(this.state.lang.indexOf('ar') != -1 ){
                  alert('يجب إختيار المدينة أولا');
                }
                else {
                  alert('You must select Country first');
                }
                this.setState({ countries :[]});
                this.setState({ cities :[]});
              }
              }}
               >
                       {this.state.countries.map((i, index) => (
               <Picker.Item  label = {i.label} value = {i.value} key={i.value} />
                       ))}
              </Picker>
              </View>
              </View>

                 <View style={[styles.shadow,{backgroundColor:'#fff',width: '50%',height:'100%',borderRadius: 7,marginTop:7,alignItems:'center',justifyContent:'center',margin:3}]}>
              <Icon name="caret-down" size={18} color="#707070" style={[this.state.lang==='ar'?styles.posLeft:styles.posRight,{position:'absolute'}]} />
              <View style={{width:'100%',alignItems:'center'}}  >
              <Picker 
                  style={{width:'100%',alignItems:'center',color:'#707070',justifyContent:'center',backgroundColor:'transparent'}} 
                  itemStyle={{backgroundColor:'#707070',fontSize:14}}
                  mode="dialog" selectedValue = {this.state.cityID?this.state.cityID:"1"} 
                  onValueChange = {(cityID) =>{
                    this.setState({ cityID })
                }}
              >
                       {this.state.cities.map((i, index) => (
               <Picker.Item
               label = {i.label} value = {i.value} key={i.value} />
                       ))}
              </Picker>
              </View>
              </View>
              </View>    
                
     </View>
     <View style={{width:'90%',flexDirection:'row',marginTop:'5%',justifyContent:'center',alignItems:'center'}}>
        <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-start'}}></View>
        <Text style={{width:'40%',textAlign:'center',fontSize:16,color:'#4B4B4B',fontFamily:'segoe' }}> 
        {this.state.lang === 'ar' ? 'طريقه الدفع والسداد' : 'Payment method'}
        </Text>
        <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-end'}}></View>
        </View>
        <View style={[styles.shadow,{width:'95%',color: '#707070',marginTop:5,marginBottom:5,backgroundColor:'#F8F8F8',alignItems:'center',justifyContent:'center'}]}>    
        <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'أختر طريقه الدفع':'Choose your payment method'}</Text>
               <View style={[this.state.lang==='ar'?styles.row:styles.row_res,styles.shadow,{width: '90%',height:height*0.07,borderRadius: 7,marginTop:7,color:'#000',marginBottom:15,alignItems:'center',justifyContent:'center'}]}>
              <Icon name="caret-down" size={18} color="#707070" style={{margin:10}} />
               <View style={{flex:1}}  >
              <Picker 
                  style={{width:'100%',alignItems:'center',color:'#707070',justifyContent:'center',backgroundColor:'transparent'}} 
                  itemStyle={{backgroundColor:'#707070',fontSize:14}}
                  mode="dialog" selectedValue = {this.state.bill?this.state.bill:"1"} 
                  onValueChange = {(bill) =>{
                    this.setState({ bill })
                 }}
                >
                       {this.state.bills.map((i, index) => (
                <Picker.Item
                label = {i.label} value = {i.value} key={i.value} />
                       ))}
               </Picker>
               </View>  
             </View>
        </View>
          
        <Modal
             isVisible={this.state.isVisible}
             onBackdropPress={() => this.setState({ isVisible: false })}
             swipeDirection="left"
             >
          <View style={[styles.mapContainer,{height:'85%',flexDirection:'column'}]}>
            {/* <MapView
             style={[styles.map,{flex:1}]}
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
           </MapView> */}
           <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,{width:'100%',alignItems:'center',left:10,top:10,position:'absolute'}]}>
                <TouchableOpacity
                 onPress={()=>this.setState({isVisible:false})}>
               <Icon name="close" size={18} color="#707070" style={{}} />
               </TouchableOpacity>
            </View>
         </View>
         
          </Modal>
          <Modal
             isVisible={this.state.isVisible2}
             onBackdropPress={() => this.setState({ isVisible2: false })}
             swipeDirection="left"
             >
          <View style={{width:'100%',height:'85%',alignItems:'center',backgroundColor:'#F8F8F8'}}>
          <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res,{width:'100%',alignItems:'center'}]}>
                <TouchableOpacity
                 onPress={()=>this.setState({isVisible2:false})}>
               <Icon name="close" size={18} color="#707070" style={{margin:5}} />
               </TouchableOpacity>
            </View>
          <View style={[styles.shadow,{width:'95%',alignItems:'center',justifyContent:'center',marginTop:5}]}>      
                <View style={{width:'95%',flexDirection:'row',marginTop:5,justifyContent:'center',alignItems:'center'}}>
                <View style={{width:'20%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-start'}}></View>
               <Text style={{flex:1,textAlign:'center',fontSize:16,color:'#808080',fontFamily:'segoe', }}> 
                {this.state.lang === 'ar'?'أختر الأضافات حسب رغبتك':'Choose the extras as you wish'}
               </Text>
               <View style={{width:'20%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-end'}}></View>
              </View>
              <FlatList style={{ width: '97%', marginTop: 5,marginBottom:5 }}
                data={this.state.additions2}
                numColumns={1}
                renderItem={({ item }) => this.renderItem2(item)}
                keyExtractor={(item, index) => index.toString()}
              />

              </View>
              <TouchableOpacity
           onPress={() => {
            this.setState({ isVisible2: false })
            }}
            style={{ width: '50%',height: height*0.05, backgroundColor: '#4B4B4B',justifyContent: 'center',borderRadius: 8, alignItems: 'center',position:'absolute',bottom:'3%' }}>
            <Text style={{ width: '100%',height: '100%',textAlign:'center',alignItems:'center',color:'#FFFFFF', fontSize:18,fontFamily:'segoe',textAlignVertical: 'center',   }}>
            {this.state.lang.indexOf('ar') != -1 ? 'أضافه' : 'Add'}
            </Text>
            </TouchableOpacity>
           
          
         </View>
         
          </Modal>
        <TouchableOpacity 
                 onPress={this.updateData.bind(this)}
                 style={{width: '80%',backgroundColor:'#4B4B4B', marginTop:10,borderRadius:10,borderColor:'#707070',borderWidth:1,marginBottom:10}}>
                 <Text style={{width: '100%',height:height*0.07,textAlign:'center', textAlignVertical:'center',color:'#fff',fontSize:18,fontFamily:'segoe', }}>
                {this.state.lang.indexOf('ar') != -1 ?' تعديل الحجز' :'Reservation modification'}
              </Text>
            </TouchableOpacity>
        </View>
          
        </ScrollView>
        }
      </SafeAreaView>  
       );
   }
}
export default RentReqDetails;
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
  _right:{
    textAlign:'right',
    right:'22%'
  },
  _left:{
    textAlign:'left',
    left:'22%'
  },
  viewItem:{
    width:'95%',
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
 posLeft:{
   left:7
 },
 posRight:{
   right:7
 },
 maStart:{
  marginStart:'30%'
},
maEnd:{
  marginEnd:0
},
mar_start:{
  marginStart:'0%'
},
mar_end:{
  marginEnd:'10%'
}

 
});