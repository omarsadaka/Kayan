import React, { Component } from 'react';
import { View, Text,YellowBox, Linking,BackHandler, TouchableOpacity, TextInput, Image ,ImageBackground,Alert} from 'react-native';
import { AsyncStorage, SafeAreaView} from 'react-native';
import {ActivityIndicator, FlatList, ScrollView } from 'react-native';
//import Toast from 'react-native-simple-toast';
import { Rating, AirbnbRating } from 'react-native-ratings';
import ImageSlider from 'react-native-image-slider';
//import DatePicker from 'react-native-datepicker'
//import Modal from 'react-native-modalbox';
import NetInfo from "@react-native-community/netinfo";


class CarOrderDetails extends Component{
    constructor(props) {
        super(props);
        this.state={
          lang:'',
          flag_lang:0,
          flag_design:0,
          flag_status:0,
          bg1:'#fff',
          bg2:'#000',
          bg3:'#000',
          bg4:'#000',
          txt1:'#000',
          txt2:'#fff',
          txt3:'#fff',
          txt4:'#fff',
          orderData:{},
          userData:{},
          userId:'',
          carId:'',
          img1:'http://134.209.178.237/uploadFiles/upload_3ef8527b05b9a96f4dbf63f04f98b68d.png',
          img2:'http://134.209.178.237/uploadFiles/upload_3ef8527b05b9a96f4dbf63f04f98b68d.png',
          img3:'http://134.209.178.237/uploadFiles/upload_3ef8527b05b9a96f4dbf63f04f98b68d.png',
          img4:'http://134.209.178.237/uploadFiles/upload_3ef8527b05b9a96f4dbf63f04f98b68d.png',
          logo:'',
          carNum:'',
          carType:'',
          carModel:'',
          carYear:'',
          driver:'',
          auto:'',
          allowDriver:'yes',
          automatic:'yes',
          startDate:'',
          endDate:'',
          carRate:0,
          rentPrice:0,
          rentType:0,
          type:0,
          rentLenght:0,
          cat:'',
          subCat:'',
          desc:'',
          startDate:'',
          endDate:'',
          notes:'',
          ownerId:'',
          carOrder:[],
          key:'',
          userImg:'',
          userName:'',
          userRate:2,
          phoneNum:'010',
          identityNum:'00',
          requestId:'',
          comment:'',
        }
        
      }
      // static navigationOptions =({navigation})=> ({
      //   headerStyle: {borderBottomColor:'#000',borderBottomWidth:1, backgroundColor:  '#000' },
      // headerTitle: () => (
      //   <View style={{width:'100%',justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
         
      //     <Text style={{width:'90%',textAlign:'center',fontSize: 20,color:'#fff',fontFamily:'segoe' ,alignItems:'center',}}>
      //     {/* {DeviceInfo.getDeviceLocale().indexOf('ar') != -1 ?'الرئيسيه' :'Home'} */}
      //      Request Details
      //     </Text>
        
      //     <TouchableOpacity style={{width:'10%',justifyContent:'center',alignItems:'center',marginStart:5}}
      //      onPress={() => navigation.openDrawer()}>
      //     <Image resizeMode="contain" 
      //                   style={{width:'80%', height: 25,alignItems:'stretch',justifyContent:'center'}}
      //                   source={require('../img/nav.png')}
      //                   ></Image>
      //     </TouchableOpacity>
      //   </View>
      //     ),
      // headerRight: (<View/>) 
      // });
      static navigationOptions = ({navigation})=> ({
        headerTitle: (<Text style={{textAlign:'center',flex:1,fontSize:20,fontFamily:'segoe',color:"#fff"}}>Order details</Text>),
        headerRight: 
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Image resizeMode={'cover'} source={require('../img/nav.png')}
        style={{width:25 , height:25,margin:3,marginEnd:10}} />
      </TouchableOpacity>,
      headerLeft:
      <TouchableOpacity  onPress={() =>{
        navigation.goBack()
      }}>
      <Image resizeMode={'cover'} source={require('../img/arrow.png')} 
      style={{width:9 , height:18,margin:3,marginStart:8}}/>
      </TouchableOpacity>,
        headerTitleStyle: { textAlign: 'center', alignSelf: 'center', flex: 1 },
        headerStyle: {  elevation:0 ,backgroundColor:  '#000'}
      });
      componentDidMount() {   
        this._retrieveData();
      }
     
      _retrieveData = async () => {
       
        try {
          const lang = await AsyncStorage.getItem('lang');
          this.setState({lang})
            this.setState({flag_lang:1})
          const value = await AsyncStorage.getItem('loginDataKayan');  
          if(value){
            const data =JSON.parse(value); 
          this.setState({userData:data})
          this.setState({userId:this.state.userData._id})
          this.getData();
         
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

      getData =()=>{ 
        const { navigation } = this.props;
        const req_Id = navigation.getParam('carOrder_id', 'NO-ID');
        this.setState({requestId:req_Id})  
        NetInfo.fetch().then(state => {
          if(state.isConnected)
          {
            fetch('http://134.209.178.237/api/user/getRequestByID?id='+req_Id)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({flag_lang:1});
            const Data = responseJson;
           this.setState({ orderData:Data });
          if (this.state.lang.indexOf('ar')!=-1) {
           
              this.setState({userImg:Data.userID.personalImg})
              this.setState({carNum:Data.carID.carNum})
              this.setState({carId:Data.carID._id})
            //   this.setState({carRate:Data.totalRate})
            this.setState({date:Data.startDate})
             this.setState({carType:Data.carID.carTypeID.titleAr})
             this.setState({carModel:Data.carID.carModelID.titleAr})
             this.setState({carYear:Data.carID.carYearID.titleAr})          
            this.setState({driver:Data.carID.allowDriver})
            this.setState({auto:Data.carID.automatic})
            this.setState({type:Data.carID.rentType})
            this.setState({rentPrice:Data.carID.rentPrice})
            this.setState({rentLenght:Data.carID.rentLenght})
            this.setState({userName:Data.userID.fullname})
            this.setState({phoneNum:Data.userID.mobile})
            this.setState({identityNum:Data.userID.nationalID})
            this.setState({img1:Data.userID.personalImg})
            this.setState({img2:Data.userID.licenseImg})
            this.setState({img3:Data.userID.nationalIdImg})          
            if(this.state.driver == 1){
              this.setState({allowDriver:'نعم'})
            }else{
              this.setState({allowDriver:'لا'})
            }
            if(this.state.auto == 1){
              this.setState({automatic:'نعم'})
            }else{
              this.setState({automatic:'لا'})
            }
            if(this.state.type == 1){
               this.setState({rentType:'بالساعه'})
            }else if(this.state.type == 2){
              this.setState({rentType:'باليوم'})
            }
            else{
              this.setState({rentType:'بالشهر'})
            }
          }else{          
            this.setState({userImg:Data.userID.personalImg})
            this.setState({carNum:Data.carID.carNum})
            this.setState({carId:Data.carID._id})
            //   this.setState({carRate:Data.totalRate})
           this.setState({date:Data.startDate})
            this.setState({carType:Data.carID.carTypeID.titleEN})
            this.setState({carModel:Data.carID.carModelID.titleEN})
            this.setState({carYear:Data.carID.carYearID.titleEN})
            this.setState({driver:Data.carID.allowDriver})
            this.setState({auto:Data.carID.automatic})
            this.setState({type:Data.carID.rentType})
            this.setState({rentPrice:Data.carID.rentPrice})
            this.setState({rentLenght:Data.carID.rentLenght})
            this.setState({userName:Data.userID.fullname})
            this.setState({phoneNum:Data.userID.mobile})
            this.setState({identityNum:Data.userID.nationalID})
            this.setState({img1:Data.userID.personalImg})
            this.setState({img2:Data.userID.licenseImg})
            this.setState({img3:Data.userID.nationalIdImg})
           
            if(this.state.driver == 1){
              this.setState({allowDriver:'yes'})
            }else{
              this.setState({allowDriver:'No'})
            }
            if(this.state.auto == 1){
              this.setState({automatic:'yes'})
            }else{
              this.setState({automatic:'No'})
            }
            if(this.state.type == 1){
              this.setState({rentType:'By Hour'})
           }else if(this.state.type == 2){
             this.setState({rentType:'By Day'})
           }
           else{
             this.setState({rentType:'By Month'})
           }
          }
           this.getUserRate();
          
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
      getUserRate=()=>{
        NetInfo.fetch().then(state => {
          if(state.isConnected)
          {
            fetch('http://134.209.178.237/api/user/getUserReviews?id='+this.state.carId+'&userID='+this.state.userId)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({flag_lang:1});
            const Data = responseJson;
           this.setState({userRate:Data.rate})
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
      _onSendPressed =()=>{
        if(this.state.notes ){
            this.setState({flag_lang:0});
            NetInfo.fetch().then(state => {
              if(state.isConnected)
              {
                const obj ={
                  userID:this.state.userId,
                  msg:this.state.notes,                
                  requestID:this.state.requestId
                }
                fetch('http://134.209.178.237/api/user/requestSpam', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(obj),
                }).then((response) => response.json())
                    .then((responseJson) => {
                     
                        if(this.state.lang.indexOf('ar') != -1 ){
                          this.setState({flag_lang:1});
                          alert("تم ارسال الملاحظات بنجاح ");
                         
                          this.setState({notes:''})
                         
                        }
                        else {
                          this.setState({flag_lang:1});
                          alert('Your Notes Send Successfully !!');
                         
                          this.setState({notes:''})
                         
                        }
                      
                    })
                    .catch((error) => {
                      this.setState({flag_lang:1});
                     
                    });
            
            }else{
              if(this.state.lang.indexOf('ar') != -1 ){
                this.setState({flag_lang:1});
                alert('لايوجد اتصال بالانترنت');
               
              }
              else {
                this.setState({flag_lang:1});
                alert('No Internet Connection ');
                
              }    
                }
            })
          }else{
            if(this.state.lang.indexOf('ar') != -1 ){
              this.setState({flag_lang:1});
              alert('ادخل الملاحظات من فضلك اولا');
             
            }
            else {
              this.setState({flag_lang:1});
              alert('Enter Your Notes First');
              
            }    
          }
      }

    render(){
        const images = [
            this.state.img1,
            this.state.img2,
            this.state.img3,
            this.state.img4, 
            ];
           
        return(
        <SafeAreaView style={{width: '100%', backgroundColor:'#FFF', flex:1,alignItems:'center',justifyContent: 'center',}}>
          {this.state.flag_lang == 0 ?
              <ActivityIndicator/>
              :
              <ScrollView style={{width:'100%',flex:1}}>
              <View style={{width:'100%' ,flex:1 , alignItems:'center'}}>
              <View style={{width:'70%',alignItems:'center',justifyContent:'center'}}>
              {!this.state.userImg?
                   <TouchableOpacity>
                     <Image 
                       resizeMode="stretch" 
                       style={{width:200, height: 80,marginTop:3}}
                       source={require('../img/user.png')}
                       ></Image> 
                       </TouchableOpacity>
                            
                         :
                         <TouchableOpacity >
                         <Image 
                          resizeMode="stretch" 
                          style={{width:200, height: 80,marginTop:3}}
                            source={{uri:this.state.userImg }} 
                          ></Image>
                          </TouchableOpacity>
                                   
                           }

                         {!this.state.userName?
                           <Text style={{width:'100%',fontSize:18 , color:'#000',marginTop:2,textAlign:'center',justifyContent:'center'}}>User Name </Text>
                           :
                          <Text style={{width:'100%',fontSize:18 , color:'#000',marginTop:2,textAlign:'center',justifyContent:'center'}}> {this.state.userName}</Text>
                          }
                
                <Rating
                        //showRating
                        type="star"
                        //fractions={1}
                        startingValue={this.state.userRate}
                        //readonly
                        imageSize={30}
                        // onFinishRating={this.ratingCompleted.bind(this)}
                        ratingColor ="#1A9658"/>
                       {!this.state.date?
                           <Text style={{width:'100%',fontSize:18 , color:'#000',marginTop:2,textAlign:'center',justifyContent:'center'}}>Date </Text>
                           :
                          <Text style={{width:'100%',fontSize:18 , color:'#000',marginTop:2,textAlign:'center',justifyContent:'center'}}> {this.state.date.split('T')[0].trim()}</Text>
                          }
            
              </View>
              
              <View style={{width:'98%',height:37,flexDirection:'row',alignItems:'center',justifyContent:'center',}}>
                  <TouchableOpacity 
                  onPress={()=>{
                    this.setState({flag_design:0})
                    this.setState({bg1:'#fff'})
                    this.setState({bg2:'#000'})
                    this.setState({bg3:'#000'})
                    this.setState({bg4:'#000'})
                    this.setState({txt1:'#000'})
                    this.setState({txt2:'#fff'})
                    this.setState({txt2:'#fff'})
                    this.setState({txt4:'#fff'})                   
                  }}
                  style={{width: '30%',borderRadius:5,flex:1,borderColor:'#000',borderWidth:1,backgroundColor:this.state.bg1}}>
                  <Text style={{width: '100%',textAlign:'center',color:this.state.txt1,fontSize:15}}>
                  {this.state.lang.indexOf('ar') != -1 ?' تواصل معي' :'Contact Us'}
                 </Text>
                 </TouchableOpacity>

                 <TouchableOpacity 
                   onPress={()=>{
                    this.setState({flag_design:1})
                    this.setState({bg1:'#000'})
                    this.setState({bg2:'#fff'})
                    this.setState({bg3:'#000'})
                    this.setState({bg4:'#000'})
                    this.setState({txt1:'#fff'})
                    this.setState({txt2:'#000'})
                    this.setState({txt3:'#fff'})
                    this.setState({txt4:'#fff'})
                   }}
                  style={{width: '30%',borderColor:'#000',borderWidth:1,borderRadius:5,flex:1,marginStart:3,backgroundColor:this.state.bg2}}>
                  <Text style={{width: '100%',textAlign:'center',color:this.state.txt2,fontSize:15}}>
                  {this.state.lang.indexOf('ar') != -1 ?' كماليات ' :'Option'}
                 </Text>
                 </TouchableOpacity>

                 <TouchableOpacity 
                   onPress={()=>{
                    this.setState({flag_design:2})
                    this.setState({bg1:'#000'})
                    this.setState({bg2:'#000'})
                    this.setState({bg3:'#fff'})
                    this.setState({bg4:'#000'})
                    this.setState({txt1:'#fff'})
                    this.setState({txt2:'#fff'})
                    this.setState({txt3:'#000'})
                    this.setState({txt4:'#fff'})
                   }}
                  style={{width: '30%',borderColor:'#000',borderWidth:1,borderRadius:5,flex:1,marginStart:3,backgroundColor:this.state.bg3}}>
                  <Text style={{width: '100%',textAlign:'center',color:this.state.txt3,fontSize:15}}>
                  {this.state.lang.indexOf('ar') != -1 ?'الايجار ' :'Rent'}
                 </Text>
                 </TouchableOpacity>
                 <TouchableOpacity 
                   onPress={()=>{
                    this.setState({flag_design:3})
                    this.setState({bg1:'#000'})
                    this.setState({bg2:'#000'})
                    this.setState({bg3:'#000'})
                    this.setState({bg4:'#fff'})
                    this.setState({txt1:'#fff'})
                    this.setState({txt2:'#fff'})
                    this.setState({txt3:'#fff'})
                    this.setState({txt4:'#000'})
                   }}
                  style={{width: '30%',borderColor:'#000',borderWidth:1,borderRadius:5,flex:1,marginStart:3,backgroundColor:this.state.bg4}}>
                  <Text style={{width: '100%',textAlign:'center',color:this.state.txt4,fontSize:15}}>
                  {this.state.lang.indexOf('ar') != -1 ?'ملاحظات ' :'Notes'}
                 </Text>
                 </TouchableOpacity>
                </View>
                <View style={{justifyContent:'center',alignItems:'center',width:'100%'}}>
                   
                   {this.state.flag_design == 0 ?
                   // first Flag
                   <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                     {this.state.lang.indexOf('ar') != -1 ? 
                     <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                    <View style={{width:'97%',flexDirection:'row-reverse',alignItems:'center',marginTop:3,marginEnd:3}}>
                    <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:17,}}>
                    {this.state.lang.indexOf('ar') != -1 ?' رقم الهاتف ' :'Phone Number'}</Text>
                    <Text onPress={()=>{Linking.openURL('tel://'+this.state.phoneNum)}}
                    style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:18,padding:3,marginEnd:3,
                    borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.phoneNum}</Text>
                    </View>
                    <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'center',marginTop:3,marginEnd:3}}>
                    <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:17,}}>
                    {this.state.lang.indexOf('ar') != -1 ?' رقم الهويه ' :'Identity Number'}</Text>
                    <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:18,padding:3,marginEnd:3,
                    borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.identityNum}</Text>
                    </View>
                    <View style={{height:150,width:'95%',marginTop:10,marginBottom:7}}>
                        <ImageSlider
                          loopBothSides
                          autoPlayWithInterval={2000}
                          images={images}/>
                   </View>
                  
                     </View>
                     :
                     <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                    <View style={{width:'97%',flexDirection:'row',alignItems:'center',marginTop:3,marginStart:3}}>
                    <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:17,}}>
                    {this.state.lang.indexOf('ar') != -1 ?' رقم الهاتف ' :'Phone Number'}</Text>
                    <Text onPress={()=>{ Linking.openURL('tel://'+this.state.phoneNum)}}
                    style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:18,padding:3,marginStart:3,
                    borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.phoneNum}</Text>
                    </View>
                    <View style={{width:'97%' ,flexDirection:'row',alignItems:'center',marginTop:3,marginStart:3}}>
                    <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:17,}}>
                    {this.state.lang.indexOf('ar') != -1 ?' رقم الهويه ' :'Identity Number'}</Text>
                    <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:18,padding:3,marginStart:3,
                    borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.identityNum}</Text>
                    </View>
                    <View style={{height:150,width:'95%',marginTop:10,marginBottom:7}}>
                        <ImageSlider
                          loopBothSides
                          autoPlayWithInterval={2000}
                          images={images}/>
                   </View>
                    </View>
                     }
                   
                  </View>
                  : 
                    
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                     {this.state.flag_design == 1 ? 
                      // second Flag
                      
                    <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                     {this.state.lang.indexOf('ar') != -1 ? 
                 <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                   <View style={{width:'97%',flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginEnd:3}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20,}}>
                     {this.state.lang.indexOf('ar') != -1 ?' تسمح بسائق ' :'Allow Driver:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.allowDriver}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginEnd:3}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20,}}>
                     {this.state.lang.indexOf('ar') != -1 ?'  هيدروماتيك ' :'Automatic:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.automatic}</Text>
                     </View> 
                     <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'center',marginTop:3,marginEnd:3}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20,}}>
                  {this.state.lang.indexOf('ar') != -1 ?' نوع السيارة ' :'Car Type:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:18,padding:3,marginEnd:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.carType}</Text>
                  </View>
                  <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'center',marginTop:3,marginEnd:3}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20,}}>
                  {this.state.lang.indexOf('ar') != -1 ?'موديل السيارة ' :'Car Model:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:18,padding:3,marginEnd:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.carModel}</Text>
                  </View>
                  <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'center',marginTop:3,marginEnd:3}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20,}}>
                  {this.state.lang.indexOf('ar') != -1 ?' سنه الصنع  ' :'Car Year:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:18,padding:3,marginEnd:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.carYear}</Text>
                  </View>                
                     </View>
                     :
                     <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                    <View style={{width:'97%',flexDirection:'row',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20,}}>
                     {this.state.lang.indexOf('ar') != -1 ?' :تسمح بسائق ' :'Allow Driver:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.allowDriver}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20,}}>
                     {this.state.lang.indexOf('ar') != -1 ?' : هيدروماتيك ' :'Automatic:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.automatic}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row',alignItems:'center',marginTop:3,marginStart:3}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20,}}>
                  {this.state.lang.indexOf('ar') != -1 ?' :نوع السيارة ' :'Car Type:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:18,padding:3,marginStart:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.carType}</Text>
                  </View>
                  <View style={{width:'97%' ,flexDirection:'row',alignItems:'center',marginTop:3,marginStart:3}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20,}}>
                  {this.state.lang.indexOf('ar') != -1 ?' :موديل السيارة ' :'Car Model:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:18,padding:3,marginStart:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.carModel}</Text>
                  </View>
                  <View style={{width:'97%' ,flexDirection:'row',alignItems:'center',marginTop:3,marginStart:3}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20,}}>
                  {this.state.lang.indexOf('ar') != -1 ?' :سنه الصنع  ' :'Car Year:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:18,padding:3,marginStart:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.carYear}</Text>
                  </View>
                    </View>
                     }
                   
                  </View>
                      :
                                                       
                      <View style={{justifyContent:'center',alignItems:'center'}}>
                      {this.state.flag_design == 2 ? 
                       // third Flag
                       <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                        {this.state.lang.indexOf('ar') != -1 ? 
                       <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                       <View style={{width:'97%',flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginEnd:3}}>
                       <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20,}}>
                       {this.state.lang.indexOf('ar') != -1 ?' نوع الايجار  ' :' Rent Type:'}</Text>
                       <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                       borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.rentType}</Text>
                       </View>
                       <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginEnd:3}}>
                       <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20,}}>
                       {this.state.lang.indexOf('ar') != -1 ?' سعر الايجار ' :'Rent Price:'}</Text>
                       <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                       borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.rentPrice}</Text>
                       </View>
                       <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginEnd:3}}>
                       <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20,}}>
                       {this.state.lang.indexOf('ar') != -1 ?' مدة الايجار ' :'Rent Lenght:'}</Text>
                       <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                       borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.rentLenght}</Text>
                       </View>
                       </View>
                       :
                       <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                       <View style={{width:'97%',flexDirection:'row',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                       <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20,}}>
                       {this.state.lang.indexOf('ar') != -1 ?' :نوع الايجار  ' :' Rent Type:'}</Text>
                       <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                       borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.rentType}</Text>
                       </View>
                       <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                       <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20,}}>
                       {this.state.lang.indexOf('ar') != -1 ?' : سعر الايجار ' :'Rent Price:'}</Text>
                       <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                       borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.rentPrice}</Text>
                       </View>
                       <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                       <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20,}}>
                       {this.state.lang.indexOf('ar') != -1 ?' : مدة الايجار ' :'Rent Lenght:'}</Text>
                       <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                       borderRadius:10,borderColor:'#000',borderWidth:1}}>{this.state.rentLenght}</Text>
                       </View>
                       </View>
                       }    
                       </View>
                       :
                       // fourth Flag                                 
                       <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                          <TextInput
                    placeholderTextColor='#000'
                   underlineColorAndroid="transparent"
                   defaultValue={this.state.notes}
                   onChangeText={(notes) => this.setState({ notes  }) }
                    placeholder={this.state.lang.indexOf('ar') != -1 ?' اكتب ملاحظاتك' :' write notes'}
                   style={{width:300,height:90,textAlign:'auto',color:'#000',marginTop:5,borderRadius:10,borderColor:'#000',borderWidth:1,}}
                    ></TextInput>
                    <TouchableOpacity 
                    onPress={()=>{
                      this._onSendPressed();
                    }}
                    style={{width:'60%',backgroundColor:'#000', marginTop:'5%',justifyContent:'center',borderRadius:17,alignItems:'center',marginBottom:20}}>
                   <Text style={{width: '100%',height:35,textAlign:'center', alignItems:'center',color:'#fff',fontSize:20,padding:5}}>
                    {this.state.lang.indexOf('ar') != -1 ?'  ارسال  ' :' Send'} </Text>
                   </TouchableOpacity>
                       </View>
                   }
   
                    </View>
                  }
   
                   </View>
                      
                  }
                 
                  </View>
              </View>
              </ScrollView>
          }

     
        </SafeAreaView>
        );
    }
}
export default CarOrderDetails;