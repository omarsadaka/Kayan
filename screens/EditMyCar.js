import React , {Component} from 'react';
import {Text , View , TouchableOpacity , ImageBackground , TextInput , Image  , StyleSheet ,Dimensions,
  ActivityIndicator,AsyncStorage,ScrollView,Alert, SafeAreaView ,FlatList} from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker';
import ToggleSwitch from 'toggle-switch-react-native';
const { width, height } = Dimensions.get('window')
import NetInfo from "@react-native-community/netinfo";
import { Container, Header, Content, Picker, Form } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
// import MapView, { PROVIDER_GOOGLE ,Marker } from 'react-native-maps';
import Modal from 'react-native-modal';
import ModalDropdown from 'react-native-modal-dropdown';


class EditMyCar extends Component{
    constructor(props) {
        super(props);
        this.state={
          flag_lang:0,
          Data:[],
          catID:'',
          carId:'',
          subCatID:'',
          errors:{},
          categories:[],
          subCategories:[],
          lang:'',
          userData:{},
          CarData:{},
          priceAr:'.. ريال',
          priceEN:'00 SAR',
          modeles:[],
          years:[],
          types:[],
          modeleID:'',
          yearID:'',
          typeID:'',
          isOn1:false,
          isOn2:false,
          automatic:2,
          Driver:2,
          period:1,
          flag:0,
          flag_design:0,
          flag_pay:0,
          length:0,
          price:0,
          carNum:0,
          carLogo:'http://134.209.178.237/uploadFiles/upload_a5ffb4efd115db2453a62bd663364902.png',
          image1:'http://134.209.178.237/uploadFiles/upload_a5ffb4efd115db2453a62bd663364902.png',
          image2:'http://134.209.178.237/uploadFiles/upload_a5ffb4efd115db2453a62bd663364902.png',
          image3:'http://134.209.178.237/uploadFiles/upload_a5ffb4efd115db2453a62bd663364902.png',
          image4:'http://134.209.178.237/uploadFiles/upload_a5ffb4efd115db2453a62bd663364902.png',
          image5:'http://134.209.178.237/uploadFiles/upload_a5ffb4efd115db2453a62bd663364902.png',
          image6:'http://134.209.178.237/uploadFiles/upload_a5ffb4efd115db2453a62bd663364902.png',
          car_Img:'',
          img1:'',
          img2:'',
          img3:'',
          img4:'',
          img5:'',
          img6:'',
          more_text_flag:0,
          more_img_flag:0,
          startDate:'',
          endDate:'',
          totalPrice:0,
          userId:'',
          notes:'',
          carState:0,
          carStates: [
            {
                label: 'Active',
                value: 2,
            },
            {
                label: 'Block',
                value: 4,
            },
            {
              label: 'Busy',
              value: 3,
          },
        ],
        carStates_ar: [
            {
                label: 'نشـطه',
                value: 2,
            },
            {
                label: 'معلقه',
                value: 4,
            },
            {
              label: 'مشغوله',
              value: 3,
          },
        ],
        rate:0,
          name:'',
          email:'',
          mobile:'',
          flight_num:'G22-10',
          BirthDay:'',
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

        wifi_num:'',
        set_num:'',
        countryID:'',
        cities:[],
        countries:[],
        bill:'',
        selectedHours: 0,
      selectedMinutes: 0,
      isDateTimePickerVisible: true,
      additions:[1],
      isVisible:false


         
    
        }
      }
      componentDidMount() {
        //NativeModules.ExceptionsManager = null;

        this._retrieveData();   
          }
       
      
        _retrieveData = async () => {
            const lang = await AsyncStorage.getItem('lang');
            this.setState({lang})
            // this.setState({flag_lang:1})
            const value = await AsyncStorage.getItem('loginDataKayan');  
            if(value){
              const data =JSON.parse(value); 
            this.setState({userData:data})
            this.setState({userId:this.state.userData._id})
            this.getCarData();
            // this.getCategory();
            // this.getModel();
            // this.getYears();
            // this.getTypes();
            }else{
                var data2 ={
                  _id:'1',
                  fullname:'أسم المستخدم'
                }
                this.setState({userData:data2})
                this.getCarData();
                // this.getCategory();
                // this.getModel();
                // this.getYears();
                // this.getTypes();
      
            }    
          }
          getCarData=()=>{
            const { navigation } = this.props;
            const car_Id = navigation.getParam('car_id', 'NO-ID');
            alert('rrrr'+car_Id)
            NetInfo.fetch().then(state => { 
              if(state.isConnected) {
              fetch('http://134.209.178.237/api/user/getCarByID?id='+car_Id)
              .then((response) => response.json())
              .then((responseJson) => {
              this.setState({flag_lang:1});  
                    const carInfo = responseJson;
                    this.setState({ CarData:carInfo});     
                     this.setState({carId:carInfo._id})
                   this.setState({catID:carInfo.categoryID._id})
                   this.setState({subCatID:carInfo.subCategoryID._id})
                   this.setState({carNum:carInfo.carNum})
                   this.setState({modeleID:carInfo.carModelID._id})
                   this.setState({yearID:carInfo.carYearID._id})
                   this.setState({typeID:carInfo.carTypeID._id})
                   this.getSubCategory(carInfo.categoryID._id);

                     this.setState({automatic:carInfo.automatic})
                     this.setState({Driver:carInfo.allowDriver})
                   
                    if(this.state.automatic == 2){
                        this.setState({isOn1:false})
                    }else{
                        this.setState({isOn1:true})
                    }
                    if(this.state.Driver == 2){
                        this.setState({isOn2:false})
                    }else{
                        this.setState({isOn2:true})
                    }
                   this.setState({period:carInfo.rentType})
                     this.setState({startDate:carInfo.startDate.split('T')[0].trim()})
                     this.setState({endDate:carInfo.endDate.split('T')[0].trim()})
                     this.setState({carLogo:carInfo.logo})
                     this.setState({image1:carInfo.img1})
                     this.setState({image2:carInfo.img2})
                     this.setState({image3:carInfo.img3})
                     this.setState({image4:carInfo.img4})
                     this.setState({image5:carInfo.img5})
                     this.setState({image6:carInfo.img6})
                     this.setState({notes:carInfo.description})
                     this.setState({totalPrice:carInfo.membershipPrice})
                     this.setState({length:carInfo.rentLenght})
                     this.setState({price:carInfo.rentPrice})
              })
              .catch((error) => {
                this.setState({flag_lang:1});
                alert("oooo"+{error});
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
          getCategory =()=>{ 
            NetInfo.fetch().then(state => { 
              if(state.isConnected) {
                fetch('http://134.209.178.237/api/user/category')
            .then((response) => response.json())
            .then((responseJson) => {
                const categories = responseJson;
                const categoriesAr =[];
                
                if(this.state.lang.indexOf('ar') != -1){
                  
                 categories.forEach(element => {
                  categoriesAr.push({
                   label:element.titleAr ,value:element._id,key:element._id
                  })
                });
                categoriesAr.unshift({
                 label:'كل الفئات' ,value:'1',key:'1'
                })
                // subCategoriesAr.unshift({
                //     label:'كل الفئات' ,value:'1',key:'1'
                //    })
                
               }else{
                 categories.forEach(element => {
                   categoriesAr.push({
                     label:element.titleEN ,value:element._id,key:element._id
                   })
                 });
                 categoriesAr.unshift({
                   label:'All Category' ,value:'1',key:'1'
                  })
                  // subCategoriesAr.unshift({
                  //   label:'All Category' ,value:'1',key:'1'
                  //  })
                  
               }
               this.setState({ categories :categoriesAr});
              //  this.setState({ subCategories :subCategoriesAr});
              
      
            })
            .catch((error) => {
              this.setState({flag_lang:1});
              alert(""+{error});
             
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
          getSubCategory=(catID)=> {
            NetInfo.fetch().then(state => { 
              if(state.isConnected) {
               
                fetch('http://134.209.178.237/api/user/subcategory?id='+catID)
                .then((response) => response.json())
                .then((responseJson) => {
                  const subCategories = responseJson;
                   const subCategoriesAr =[];
                   
                   if(this.state.lang.indexOf('ar') != -1){
                     
                    subCategories.forEach(element => {
                     subCategoriesAr.push({
                      label:element.titleAr ,value:element._id,key:element.price
                     })
                   });
                   subCategoriesAr.unshift({
                    label:'كل الفئات' ,value:'1',key:'1'
                   })
                   
                  }else{
                    subCategories.forEach(element => {
                      subCategoriesAr.push({
                        label:element.titleEN ,value:element._id,key:element.price
                      })
                    });
                    subCategoriesAr.unshift({
                      label:'All Category' ,value:'1',key:'1'
                     })
                     
                  }
                  this.setState({ subCategories :subCategoriesAr});
                  
        
                  
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
                  this.setState({flag:1});
                  alert('Sorry No Internet Connection');
                }
                }
              })
          }
          getModel =()=>{ 
            NetInfo.fetch().then(state => { 
              if(state.isConnected) {
                fetch('http://134.209.178.237/api/user/carModel')
            .then((response) => response.json())
            .then((responseJson) => {
                const models = responseJson;
                const modelsAr =[];
                if(this.state.lang.indexOf('ar') != -1){
                  
                 models.forEach(element => {
                  modelsAr.push({
                   label:element.titleAr ,value:element._id,key:element._id
                  })
                });
                modelsAr.unshift({
                 label:'كل الموديلات' ,value:'1',key:'1'
                })
                
               }else{
                 models.forEach(element => {
                   modelsAr.push({
                     label:element.titleEN ,value:element._id,key:element._id
                   })
                 });
                 modelsAr.unshift({
                   label:'All Models' ,value:'1',key:'1'
                  })
                 
               }
               this.setState({ modeles :modelsAr});
               
            })
            .catch((error) => {
              alert(""+{error});
             
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
          getYears =()=>{ 
            NetInfo.fetch().then(state => { 
              if(state.isConnected) {
                fetch('http://134.209.178.237/api/user/carYear')
            .then((response) => response.json())
            .then((responseJson) => {
                const years = responseJson;
                const yearsAr =[];
                if(this.state.lang.indexOf('ar') != -1){
                  
                 years.forEach(element => {
                  yearsAr.push({
                   label:element.titleAr ,value:element._id,key:element._id
                  })
                });
                yearsAr.unshift({
                 label:'كل الموديلات' ,value:'1',key:'1'
                })
                
               }else{
                 years.forEach(element => {
                   yearsAr.push({
                     label:element.titleEN ,value:element._id,key:element._id
                   })
                 });
                 yearsAr.unshift({
                   label:'All years' ,value:'1',key:'1'
                  })
                 
               }
               this.setState({ years :yearsAr});
               
            })
            .catch((error) => {
              alert(""+{error});
             
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
          getTypes =()=>{ 
            NetInfo.fetch().then(state => { 
              if(state.isConnected) {
                fetch('http://134.209.178.237/api/user/carType')
            .then((response) => response.json())
            .then((responseJson) => {
                const types = responseJson;
                const typesAr =[];
                if(this.state.lang.indexOf('ar') != -1){
                  
                 types.forEach(element => {
                  typesAr.push({
                   label:element.titleAr ,value:element._id,key:element._id
                  })
                });
                typesAr.unshift({
                 label:'فئه الموديل' ,value:'1',key:'1'
                })
                
               }else{
                 types.forEach(element => {
                   typesAr.push({
                     label:element.titleEN ,value:element._id,key:element._id
                   })
                 });
                 typesAr.unshift({
                   label:'Model category' ,value:'1',key:'1'
                  })
                 
               }
               this.setState({ types :typesAr});
               
            })
            .catch((error) => {
              alert(""+{error});
             
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
          validate1=(obj)=>{
            // resumeeeee 
            const errors ={};
             
             if(obj.catID==1){
               if(this.state.lang.indexOf('ar') != -1 ){
                 // this.setState({flag:1});
                 alert('يرجي اختيار الفئه' );
               }
               else {
                 // this.setState({flag:1});
                 alert(' Choose Category First ' );
               }
               errors.catID ="CategoryID is requied "; 
             }
           else if(obj.subCatID==1){
               if(this.state.lang.indexOf('ar') != -1 ){
                 // this.setState({flag:1});
                 alert('   يرجي اختبار نوع الفئه' );
               }
               else {
                 // this.setState({flag:1});
                 alert('Choose SubCategory First' );
               }
               errors.subCatID ="subCatID is requied "; 
             }
            
             else if(!obj.carNum){
               if(this.state.lang.indexOf('ar') != -1 ){
                 // this.setState({flag:1});
                 alert('أدخل  رقم السيارة ');
               }
               else {
                 // this.setState({flag:1});
                 alert('Enter Car Number ');
               }
               errors.carNum ="carNum is requied "; 
              }
             
             else if(obj.modeleID==1){
               if(this.state.lang.indexOf('ar') != -1 ){
                 // this.setState({flag:1});
                 alert('ادخل   موديل السيارة');
               }
               else {
                 // this.setState({flag:1});
                 alert('  Enter Car Model ');
               }
               errors.modeleID ="modeleID is requied ";
              }
               else if(obj.yearID==1){
                 if(this.state.lang.indexOf('ar') != -1 ){
                   // this.setState({flag:1});
                   alert(' ادخل سنه صنع السيارة');
                 }
                 else {
                   // this.setState({flag:1});
                   alert(' Enter Model Year ');
                 }
                 errors.yearID ="yearID is requied ";
               }
             else if(obj.typeID==1){
               if(this.state.lang.indexOf('ar') != -1 ){
                 // this.setState({flag:1});
                 alert('يرجي ادخال نوع السيارة ');
               }
               else {
                 // this.setState({flag:1});
                 alert('  Enter Car Type ');
               }
               errors.typeID ="typeID is requied ";
             } 
             else if(obj.rentType==0){
               if(this.state.lang.indexOf('ar') != -1 ){
                 // this.setState({flag:1});
                 alert('  يرجي اختيار نوع الايجار  ');
               }
               else {
                 // this.setState({flag:1});
                 alert(' Enter Type Of Boring ');
               }
               errors.rentType ="rentType is requied ";
             }
            
               else if(!obj.rentLenght ){
                 if(this.state.lang.indexOf('ar') != -1 ){
                   // this.setState({flag:1});
                   alert(' يرجي  ادخال اقل مدة للايجار  ');
                 }
                 else {
                   // this.setState({flag:1});
                   alert(' Plase  Enter Minimum Period First ');
                 }
                 errors.rentLenght ="rentLenght is requied ";
               } 
               else if(!obj.rentPrice){
                 if(this.state.lang.indexOf('ar') != -1 ){
                   // this.setState({flag:1});
                   alert('يرجي ادخال السعر ');
                 }
                 else {
                   // this.setState({flag:1});
                   alert(' Plase Enter  the Price ');
                 }
                 errors.rentPrice ="rentPrice is requied ";
               }
               else if(!obj.startDate ){
                 if(this.state.lang.indexOf('ar') != -1 ){
                   // this.setState({flag:1});
                   alert(' يرجي  ادخال  تاريخ البدء   ');
                 }
                 else {
                   // this.setState({flag:1});
                   alert(' Plase  Enter   Start Date ');
                 }
                 errors.startDate ="startDate is requied ";
               } 
               else if(!obj.endDate){
                 if(this.state.lang.indexOf('ar') != -1 ){
                   // this.setState({flag:1});
                   alert('يرجي ادخال تاريخ الانهاء ');
                 }
                 else {
                   // this.setState({flag:1});
                   alert(' Plase Enter End Date ');
                 }
                 errors.endDate ="endDate is requied ";
               }
               return  errors;
              
             }
             validate2=(obj2)=>{
                // resumeeeee 
                 const errors ={};
                 if(!obj2.logo){
                   if(this.state.lang.indexOf('ar') != -1 ){
                     // this.setState({flag:1});
                     alert('يرجي اختيار لوجو' );
                   }
                   else {
                     // this.setState({flag:1});
                     alert(' Choose Logo First ' );
                   }
                   errors.logo ="logo is requied "; 
                 }
               else if(!obj2.img1){
                   if(this.state.lang.indexOf('ar') != -1 ){
                     // this.setState({flag:1});
                     alert('   يرجي اختبار  صوره علي الاقل' );
                   }
                   else {
                     // this.setState({flag:1});
                     alert('Choose  One Image at Least' );
                   }
                   errors.img1 ="img1 is requied "; 
                 }
                
                 else if(!obj2.description){
                   if(this.state.lang.indexOf('ar') != -1 ){
                     // this.setState({flag:1});
                     alert('أدخل  ملاحظات السيارة ');
                   }
                   else {
                     // this.setState({flag:1});
                     alert('Enter Car Notes ');
                   }
                   errors.description ="description is requied "; 
                  }
                 
                //  else if(!obj2.membershipPrice){
                //    if(this.state.lang.indexOf('ar') != -1 ){
                //      // this.setState({flag:1});
                //      alert(' لا يوجد سعر  ');
                //    }
                //    else {
                //      // this.setState({flag:1});
                //      alert(' No price Found  ');
                //    }
                //    errors.membershipPrice ="membershipPrice is requied ";
                //   }
                //    else if(this.state.yearID==1){
                //      if(this.state.lang.indexOf('ar') != -1 ){
                //        // this.setState({flag:1});
                //        alert(' ادخل سنه صنع السيارة');
                //      }
                //      else {
                //        // this.setState({flag:1});
                //        alert(' Enter Model Year ');
                //      }
                     
                //  }
                
                return  errors;
                  
                 }
               
                  
                  
                  onApdate= async()=>{
                    this.setState({flag_lang:0})
                    const value = await AsyncStorage.getItem('loginDataKayan');  
                    if(value){
                      NetInfo.fetch().then(state => { 
                        if(state.isConnected) {
                      // this.btnRegister.load();
                      const obj2 ={
                        logo:this.state.carLogo,
                        img1: this.state.image1,
                        img2:this.state.image2,
                        img3:this.state.image3,
                        img4:this.state.image4,
                        img5:this.state.image5,
                        img6:this.state.image6,
                        carNum:this.state.carNum,
                        categoryID:this.state.catID,
                        userID:this.state.userId,
                        subCategoryID:this.state.subCatID,
                        carModelID:this.state.modeleID,
                        carTypeID:this.state.typeID,
                        carYearID:this.state.yearID,
                        rentType: this.state.period,
                        rentPrice:this.state.price,
                        allowDriver:this.state.Driver,
                        automatic:this.state.automatic,
                        description:this.state.notes,
                        startDate:this.state.startDate,
                        endDate:this.state.endDate,
                        rentLenght:this.state.length,
                        membershipPrice:this.state.totalPrice,
                      }
                      const errors =this.validate2(obj2);
                      this.setState({errors});
                      if(Object.keys(errors).length === 0){
                        this.setState({flag:0});
                        fetch('http://134.209.178.237/api/user/car/'+this.state.carId,{
                          method: 'PUT',
                          headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(obj2),
                        }).then((response) => response.json())
                            .then((responseJson) => {
                              if(responseJson._id){
                                this.setState({flag_lang:1});
                                if(this.state.lang.indexOf('ar') != -1 ){                                 
                                   alert(' تم تعديل السيارة بنجاح ');
                                   this.setState({flag_design:0})
                                   this.getCarData();
                                  }
                                  else {                                 
                                    alert(' Car Updated Successfully ');
                                    this.setState({flag_design:0})  
                                    this.getCarData();                                   
                                  }
                              }
                              else{
                               if(this.state.lang.indexOf('ar') != -1 ){
                                  this.setState({flag_lang:1});
                                 alert("حدث خطأ ما");
                                }
                               else {
                                this.setState({flag_lang:1})
                               alert("Opps !!");
                                }
                                
                              }
                            })
                            .catch((error) => {
                              console.error(error);
                              alert('error'+error);
                            });
                      }
                      else{
                        this.setState({flag_lang:1})
                        // this.btnRegister.reset();
                      }
                    }else{
                      if(this.state.lang.indexOf('ar') != -1 ){
                        this.setState({flag:1});
                        alert('لايوجد اتصال بالانترنت');
                      }
                      else {
                        this.setState({flag:1});
                        alert('No Internet Connection ');
                      }
                      }
                    })
                    }else{
                      this.setState({flag_lang:1});
                      Alert.alert(
                        this.state.lang.indexOf('ar') != -1 ?'كايان' :'Kayan',
                        this.state.lang.indexOf('ar') != -1 ?'يجب تسجيل الدخول أولا' :'you Must Login First',
              
                        [
                          {text:this.state.lang.indexOf('ar') != -1 ?'إلغاء' :'Cancel'
                          , onPress: () => this.dismiss, style: 'cancel'},
                          {text:    this.state.lang.indexOf('ar') != -1 ?' تسجيل الدخول' :'login Now', onPress: () => {
                            try{
                         const { navigation } = this.props;
                         navigation.push('Login');
                      
                       
                            }catch(e){}
                           }
                          
                         },
                        ],
                        { cancelable: true }
                       
                      )
                       return true;
                    }
                   
                    }
     
                    SendOrderState =async ()=>{
                      this.setState({flag_lang : 0})
                      var obj={  
                         status:this.state.carState
                      };
                       
                    fetch('http://134.209.178.237/api/user/request/'+this.state.carId, {
                      method: 'PUT',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body:  JSON.stringify(obj)
                  })
                    
                    .then((response) => response.json())
                    .then((responseJson) => {
                      if (responseJson._id) {
                       
                        if(this.state.lang.indexOf('ar') != -1 ){
                          this.setState({flag_lang:1})
                          alert("تم أرسال حاله السيارة");
                          this.setState({flag_status:1})
                         
                        }
                        else {
                          this.setState({flag_lang:1})
                          alert("Car state send successfully ");
                          this.setState({flag_status:1})
                         
                        }
                  // this.getUserData();
                      }
                      else{
                      
                        if(this.state.lang.indexOf('ar') != -1 ){
                          this.setState({flag_lang:1});
                          alert("حدث خطأ ما");
                        }
                        else {
                          this.setState({flag_lang:1})
                          alert("Opps !!");
                        }
                      }
                    
                     
                    })
                    .catch((error) => {
                     
                      // alert("error"+error);
                      if(this.state.lang.indexOf('ar') != -1 ){
                        this.setState({flag_lang:1})
                        alert("حدث خطأ ما");
                
                      }
                      else {
                        this.setState({flag_lang:1})
                        alert("Opps !!");
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
            
                    <Text style={{textAlign:'center',width:'80%',flex:1,fontSize:20,color:"#fff", }}>
                       {/* {strings("CarInfo.barTitle")} */}
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
         
                 <Text style={{textAlign:'center',width:'74%',flex:1,fontSize:20,color:"#fff", }}>
                    {/* {strings("CarInfo.barTitle")} */}
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

             renderItem(item){
              return (
               
                   <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:'100%',alignItems:'center',justifyContent:'center',marginVertical:2}]} >
                     <Icon name="close" size={22} color="#707070" style={{margin:'2%'}} />
                     <View style={[{width:'20%',height:25,borderRadius: 5, borderWidth:1 ,borderColor:'#DFDFDF',alignItems:'center',justifyContent:'center'}]}>
                     <Icon name="caret-down" size={15} color="#707070" style={[this.state.lang ==='ar'?styles.posLeft:styles.posRight,{position:'absolute'}]} />
                     <View style={[{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}]}>
                     <ModalDropdown
                   options={this.state.picker_props} // data
                   defaultValue='1'
                   onSelect={(index, value) => { 
                     this.setState({ wifi_num: value._id }) 
                    }}
                   renderButtonText={(rowData) => (rowData.value)} // ba3d ma t5tar
                   style={{ width:'100%', }} // abl ma t5tar
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
                     <Text style={{ textAlign: 'center', color: '#343C53', fontSize: 14,margin:3 }}>{this.state.lang === 'ar' ? 'عدد' : 'Number'}</Text>
                     <Text style={[this.state.lang === 'ar' ? styles.right : styles.left, {flex:1, color: '#343C53', fontSize: 14, fontFamily: "segoe",margin:5}]}>
                      {this.state.lang === 'ar' ? 'راوتر واي فاي' : 'Router WiFi'}</Text>
                      {this.state.lang ==='ar'?
                      <Icon name="caret-left" size={20} color="#707070" style={{margin:5}} />
                      :
                      <Icon name="caret-right" size={20} color="#707070" style={{margin:5}} />
                      }
                      
                   </View>
                   
              );
            }

    render(){
        var radio_props = [
            {label: 'Month', value: 3 },
            {label: 'Day', value: 2 },
            {label: 'Hour', value: 1 }
          ];  
          var radio_props_ar = [
            {label: 'شهر', value: 3 },
            {label: 'يوم', value: 2 },
            {label: 'ساعه', value: 1 }
          ];  
        return(
          <SafeAreaView style={{width: '100%', flex:1,alignItems:'center',}}>
          {this.renderOption()}
          {this.state.flag_lang == 0 ?
        <ActivityIndicator
        color='#C8972C'
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}/>
        :
        <ScrollView style={{width:'100%',flex:1}}>
           <View style={{width:'100%' , alignItems:'center',justifyContent:'center'}}>
           <View style={[this.state.lang === 'ar'?styles.row:styles.row_res,{width:'95%',alignItems:'center',marginTop:10,}]}>
              <Text style={{flex:1,textAlign:'center',alignItems:'center',fontSize:16,color:'#414141',fontFamily:'segoe'}}>
                {this.state.status_word}</Text>
              <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{flex:1,alignItems:'center',fontSize:14,color:'#414141',fontFamily:'segoe' }]}> 
              {this.state.lang ==='ar'?'حاله الطلب':'Order state'}
               </Text>
           </View>

        <View style={{width:'95%',flexDirection:'row',marginTop:5,justifyContent:'center',alignItems:'center'}}>
        <View style={{flex:1,height:2,backgroundColor:'#E4E4E4',alignItems:'flex-start'}}></View>
        <Text style={{textAlign:'center',fontSize:16,color:'#000000',fontFamily:'segoe',margin:5 }}> 
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
              date={this.state.time}
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
              onDateChange={(time) => {this.setState({time})}}
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
                  date={this.state.time2}
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
                  onDateChange={(time2) => {this.setState({time2})}}
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
                        onDateChange={(endDate) => {this.setState({endDate})}}
                      />   
              </View>
                  </View>

        <Text style={[this.state.lang === 'ar' ? styles.right : styles.left, { width: '90%', color: '#707070', fontSize: 14, fontFamily: "segoe", marginTop: 10 }]}>
          {this.state.lang === 'ar' ? 'مده الايجار' : 'Duration of rent'}</Text>
        <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center',backgroundColor: '#fff', borderRadius: 7,height:height*0.09,borderColor:'#E9E9E9',borderWidth:1 }]}>
        <Text style={{ textAlign: 'center', textAlignVertical:'center',color: '#969696', fontSize: 14, flex: 1,backgroundColor:'#F7F7F7',height:'100%',borderRadius:7,borderColor:'#E9E9E9',borderWidth:1 }}>{this.state.lang ==='ar'?'ر س':'SAR'}</Text>
          <Text style={{ textAlign: 'center', color: '#969696', fontSize: 14, flex: 3 }}>400 x 4</Text>
        </View>

        <Text style={[this.state.lang === 'ar' ? styles.right : styles.left, { width: '90%', color: '#707070', fontSize: 14, fontFamily: "segoe", marginTop: 10 }]}>
          {this.state.lang === 'ar' ? 'موقع الاستلام' : 'Receving location'}</Text>
        <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center', elevation: 4, shadowOpacity: 0.3, backgroundColor: '#fff', borderRadius: 10,height:height*0.07 }]}>
          {/* <Icon name="caret-down" size={20} color="#707070" style={{margin:'3%'}} /> */}
          <Text style={{ textAlign: 'center', color: '#969696', fontSize: 14, flex: 1 }}>مطار القاهرة</Text>
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
        <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center', elevation: 4, shadowOpacity: 0.3, backgroundColor: '#fff', borderRadius: 10,height:height*0.07 }]}>
          {/* <Icon name="caret-down" size={20} color="#707070" style={{margin:'3%'}} /> */}
          <Text style={{ textAlign: 'center', color: '#969696', fontSize: 14, flex: 1 }}>مطار القاهرة</Text>
          <Image source={require('../img/map.png')}
            style={{ width: 20, height: 20, margin: 7 }} resizeMode="contain" />
        </View> 
        <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center',}]}>
        <Image source={require('../img/addd.png')}
            style={[{ width: 30, height: 30, margin: 5,}]} resizeMode="stretch" />
          <Text style={[this.state.lang === 'ar' ? styles.right : styles.left,{color: '#707070', fontSize: 14,flex:1}]}>{this.state.lang === 'ar' ? 'الأضافات' : 'Additions'}</Text>
        </View> 
              {/* omar */}
        <View style={[{ width:'90%', alignItems: 'center',justifyContent: 'center',padding:5,borderRadius:6,backgroundColor:'#FFFFFF',borderColor:'#EEECEC',borderWidth:1}]}>
        <FlatList style={{ width:'100%'}}
                data={this.state.additions}
                numColumns={1}
                renderItem={({ item }) => this.renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
              />
        </View> 

        <Text style={[this.state.lang === 'ar' ? styles.right : styles.left, { width: '90%', color: '#707070', fontSize: 14, fontFamily: "segoe", marginTop: 10 }]}>
          {this.state.lang === 'ar' ? 'التأمين الزائد' : 'Overload insurance'}</Text>
        <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center', 
        backgroundColor: '#fff', borderRadius: 10,height:height*0.07,borderColor:'#DFDFDF',borderWidth:1 }]}>
        <Text style={{height:'100%', textAlign: 'center', color: '#969696', fontSize: 14, flex: 1,borderColor:'#DFDFDF',borderWidth:1,borderRadius:5,textAlignVertical:'center'}}>{this.state.lang ==='ar'?'ر س':'SAR'}</Text>
          <Text style={{ textAlign: 'center', color: '#969696', fontSize: 14, flex: 3 }}>5,000</Text>
        </View>

        <Text style={[this.state.lang === 'ar' ? styles.right : styles.left, { width: '90%', color: '#707070', fontSize: 14, fontFamily: "segoe", marginTop: 10 }]}>
          {this.state.lang === 'ar' ? 'الأجمالـى' : 'Total'}</Text>
        <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center',marginBottom:10,
         backgroundColor: '#fff', borderRadius: 10,height:height*0.07,borderColor:'#C8972C',borderWidth:1 , }]}>
        <Text style={{ height:'100%',textAlign: 'center', color: '#969696', fontSize: 14, flex: 1,borderColor:'#C8972C',borderWidth:1,borderRadius:5,textAlignVertical:'center' }}>{this.state.lang ==='ar'?'ر س':'SAR'}</Text>
          <Text style={{ textAlign: 'center', color: '#969696', fontSize: 14, flex: 3 }}>13,000</Text>
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
                            defaultValue={this.state.name}
                            onChangeText={(name) => this.setState({ name  }) } 
                            style={[{width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:10,color:'#000',fontSize:14,fontFamily:'segoe',backgroundColor:'#fff'}]}>
                          </TextInput>
                 <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'رقم الجوال':'Mobile'}</Text>
                          {/* <TextInput  
                            placeholderTextColor='#000'                  
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'رقم الموبايل ' :'Mobile'} 
                            defaultValue={this.state.mobile}
                            underlineColorAndroid="transparent"
                            onChangeText={(mobile) => this.setState({ mobile  }) } 
                            style={[{width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:7,color:'#000',fontSize:14,fontFamily:'segoe',backgroundColor:'#fff'}]}>
                          </TextInput>    */}
                <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{ width: '90%', height: height*0.07,marginTop: 7, backgroundColor: '#FFF', borderRadius: 7,alignItems:'center',
                 backgroundColor:'#FFF'}]} >
               <Text style={[{width:60,color: '#707070', fontSize: 12,fontFamily:"segoe",textAlign:'center',backgroundColor:'#F7F7F7',
               height:'100%',borderRadius:7,borderWidth:0.5,borderColor:'#919191',textAlignVertical:'center'}]}>
                   {this.state.lang === 'ar'? '+22':'+22'}</Text>
                <TextInput
                  underlineColorAndroid='#fff'
                  keyboardType="numeric"
                  placeholderTextColor='#D4D4D4'
                  defaultValue={this.state.mobile}
                  onChangeText={(mobile) => this.setState({ mobile })}
                  placeholder={this.state.lang.indexOf('ar') != -1 ? ' رقم الجوال ' : ' Mobile'}
                  style={[{ width:'60%', height: '100%', color: '#000', fontSize: 14,fontFamily:"segoe",textAlign:'center' }]}
                />
              </View>
                 <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'البريد الألكترونى':'Email'}</Text>

                          <TextInput  
                            placeholderTextColor='#000'                  
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'الايميل ' :'ُEmail'} 
                            defaultValue={this.state.email}
                            underlineColorAndroid="transparent"
                            onChangeText={(email) => this.setState({email}) } 
                            style={[{width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:7,color:'#000',fontSize:14,fontFamily:'segoe',backgroundColor:'#fff'}]}>
                          </TextInput> 
               <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
               {this.state.lang === 'ar'? 'شركه الطيران':'Airline'}</Text>
              <View style={[this.state.lang === 'ar'?styles.row:styles.row_res,{width: '90%',height:height*0.07,alignItems: 'center', marginTop: 5,justifyContent:'center',backgroundColor:'#fff',borderRadius:10}]}>
                 {/* <Image source={require('../img/path.png')} 
                style={{width:20,height:20,margin:7}} resizeMode="contain" /> */}
                <Text style={{ textAlign: 'center',color: '#969696', fontSize: 14,flex:1}}>مطار القاهرة</Text>
                 {/* <Image source={require('../img/map.png')} 
                style={{width:20,height:20,margin:7}} resizeMode="contain" /> */}
                </View> 
                <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'رقم الرحله الجويه':'Flight number'}</Text>
                          <TextInput  
                            placeholderTextColor='#000'                  
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'Flight number ' :'Flight number'} 
                            defaultValue={this.state.flight_num}
                            underlineColorAndroid="transparent"
                            onChangeText={(flight_num) => this.setState({ flight_num  }) } 
                            style={[{width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:7,color:'#000',fontSize:14,fontFamily:'segoe',backgroundColor:'#fff'}]}>
                          </TextInput>          

             <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'تحميل صورة الهويه / الباسبور':'Upload ID photo / Passport '}</Text>
             <View style={[this.state.lang=== 'ar'?styles.row:styles.row_res,{width:'90%',height:height*0.07,alignItems:'center',marginTop:7,borderRadius:7,marginBottom:10,backgroundColor:'#fff'}]}>
             <TouchableOpacity onPress={this.uploadImg}
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
                            defaultValue={this.state.name}
                            onChangeText={(name) => this.setState({ name  }) } 
                            style={[{backgroundColor:'#fff',width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:10,color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput>
                <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'تاريخ الميلاد':'Date of birth'}</Text>
                   <View style={[{backgroundColor:'#fff',width: '90%',height:height*0.07,borderRadius: 7,marginTop:7,}]} >     
                          <DatePicker
                        style={[{width: '100%',height:'100%',textAlign:'center' ,color:'#000',fontSize:14}]}
                        date={this.state.BirthDay.split('T')[0]}
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
                            defaultValue={this.state.mobile}
                            underlineColorAndroid="transparent"
                            onChangeText={(mobile) => this.setState({ mobile  }) } 
                            style={[{backgroundColor:'#fff',width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:7,color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput>   
               
              <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'تحميل صورة الرخصه  ':'Upload the license image '}</Text>
             <View style={[this.state.lang=== 'ar'?styles.row:styles.row_res,{backgroundColor:'#fff',height:height*0.07,width:'90%',alignItems:'center',marginTop:7,borderRadius:7,marginBottom:10}]}>
             <TouchableOpacity onPress={this.uploadImg}
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
        {this.state.lang === 'ar' ? 'تفاصيل الفاتورة' : 'Invoice details'}
        </Text>
        <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-end'}}></View>
        </View>

  <View style={[styles.shadow,{width:'95%',color: '#707070',marginTop:5,marginBottom:5,backgroundColor:'#F8F8F8',alignItems:'center',justifyContent:'center'}]}>
        <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'اسم الشركه':'Company name'}</Text>
                <TextInput  
                            placeholderTextColor='#000'
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'الاسم بالكامل' :'FullName'} 
                            underlineColorAndroid="transparent"
                            defaultValue={this.state.name}
                            onChangeText={(name) => this.setState({ name  }) } 
                            style={[{backgroundColor:'#fff',width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:10,color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput>
              <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'عنوان الشركه':'Company sddress'}</Text>
                <TextInput  
                            placeholderTextColor='#000'
                            placeholder={this.state.lang.indexOf('ar') != -1 ?'عنوان الشركه' :'Company sddress'} 
                            underlineColorAndroid="transparent"
                            defaultValue={this.state.name}
                            onChangeText={(name) => this.setState({ name  }) } 
                            style={[{backgroundColor:'#fff',width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:10,color:'#000',fontSize:14,fontFamily:'segoe'}]}>
                          </TextInput>
                          <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{ width:'90%',color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10}]}>
                   {this.state.lang === 'ar'? 'الدوله / المدينه':'Country / City'}</Text>

                   <View style={{ width: '90%',flexDirection:'row',height: height*0.07,alignItems:'center',justifyContent:'center',marginTop:5,marginBottom:20}}>
                   <View style={[{backgroundColor:'#fff',width: '50%',height:'100%',textAlign:'center' ,borderRadius: 7,marginTop:7,color:'#000',fontSize:14}]} >
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
                  <View style={[{backgroundColor:'#fff',width: '50%',height:'100%',textAlign:'center' ,borderRadius: 7,marginTop:7,color:'#000',fontSize:14,marginStart:5}]}  >
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

           <View style={[{backgroundColor:'#fff',width: '90%',height:height*0.07,textAlign:'center' ,borderRadius: 7,marginTop:7,color:'#000',marginBottom:15}]}  >
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
        {/* <TouchableOpacity 
                //  onPress={this.updateUserData.bind(this)}
                 style={{width: '80%',backgroundColor:'#4B4B4B', marginTop:10,borderRadius:10,borderColor:'#707070',borderWidth:1,marginBottom:10}}>
                 <Text style={{width: '100%',height:50,textAlign:'center', textAlignVertical:'center',color:'#fff',fontSize:18,fontFamily:'segoe', }}>
                {this.state.lang.indexOf('ar') != -1 ?' تعديل الحجز' :'Reservation modification'}
              </Text>
            </TouchableOpacity> */}
        </View>
          
        </ScrollView>
        }
        </SafeAreaView>  
        );
    }
}
export default EditMyCar;
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
 
});