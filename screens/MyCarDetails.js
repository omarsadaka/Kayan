import React, { Component } from 'react';
import { View, Text,YellowBox, StyleSheet,BackHandler, TouchableOpacity, TextInput, Image ,ImageBackground,Alert} from 'react-native';
import { AsyncStorage, SafeAreaView} from 'react-native';
import {ActivityIndicator, FlatList, ScrollView } from 'react-native';
//import Toast from 'react-native-simple-toast';
import { Rating, AirbnbRating } from 'react-native-ratings';
import ImageSlider from 'react-native-image-slider';
import DatePicker from 'react-native-datepicker'
import NetInfo from "@react-native-community/netinfo";


class MyCarDetails extends Component{

    constructor(props) {
        super(props);
        this.state={
          lang:'',
          flag_lang:0,
          flag_design:0,
          flag_reserve:0,
          bg1:'#fff',
          bg2:'#000',
          bg3:'#000',
          bg4:'#000',
          txt1:'#000',
          txt2:'#fff',
          txt3:'#fff',
          txt4:'#fff',
          carData:{},
          userData:{},
          userId:'',
          carID:'',
          img1:'http://134.209.178.237/uploadFiles/upload_3ef8527b05b9a96f4dbf63f04f98b68d.png',
          img2:'http://134.209.178.237/uploadFiles/upload_3ef8527b05b9a96f4dbf63f04f98b68d.png',
          img3:'http://134.209.178.237/uploadFiles/upload_3ef8527b05b9a96f4dbf63f04f98b68d.png',
          img4:'http://134.209.178.237/uploadFiles/upload_3ef8527b05b9a96f4dbf63f04f98b68d.png',
          img5:'http://134.209.178.237/uploadFiles/upload_3ef8527b05b9a96f4dbf63f04f98b68d.png',
          img6:'http://134.209.178.237/uploadFiles/upload_3ef8527b05b9a96f4dbf63f04f98b68d.png',
          logo:'',
          carNum:'',
          carType:'',
          carModel:'',
          carYear:'',
          driver:'',
          auto:'',
          allowDriver:'',
          automatic:'',
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
          key:'',
          carOrder:[],


         
        }
        
      }
   
    
      componentDidMount() {
        this._retrieveData();
      }
      _retrieveData = async () => {
        try {
          const lang = await AsyncStorage.getItem('lang');
          this.setState({lang})
          //  this.setState({flag_lang:1})
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
          }    
        }catch(error){}
      }

      getData =()=>{ 
        const { navigation } = this.props;
        const car_Id = navigation.getParam('myCar_id', 'NO-ID');
        // alert('id = '+car_Id)  
        this.setState({carId:car_Id})
        NetInfo.fetch().then(state => {
          if(state.isConnected)
          {
            fetch('http://134.209.178.237/api/user/getCarByID?id='+car_Id)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({flag_lang:1});
            const Data = responseJson;
           this.setState({ CarData:Data });
          if (this.state.lang.indexOf('ar')!=-1) {
            this.setState({carID:Data._id});
              this.setState({logo:Data.logo})
              this.setState({carNum:Data.carNum})
              this.setState({carRate:Data.totalRate})
            this.setState({cat:Data.categoryID.titleAr})
            this.setState({subCat:Data.subCategoryID.titleAr})
            this.setState({carType:Data.carTypeID.titleAr})
            this.setState({carModel:Data.carModelID.titleAr})
            this.setState({carYear:Data.carYearID.titleAr})
            this.setState({desc:Data.description})
            this.setState({driver:Data.allowDriver})
            this.setState({auto:Data.automatic})
            this.setState({type:Data.rentType})
            this.setState({rentPrice:Data.rentPrice})
            this.setState({rentLenght:Data.rentLenght})
            this.setState({img1:Data.img1})
            this.setState({img2:Data.img2})
            this.setState({img3:Data.img3})
            this.setState({img4:Data.img4})
            this.setState({img5:Data.img5})
            this.setState({img6:Data.img6})
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
            this.setState({carID:Data._id});
            this.setState({logo:Data.logo})
              this.setState({carNum:Data.carNum})
              this.setState({carRate:Data.totalRate})
            this.setState({cat:Data.categoryID.titleEN})
            this.setState({subCat:Data.subCategoryID.titleEN})
            this.setState({carType:Data.carTypeID.titleEN})
            this.setState({carModel:Data.carModelID.titleEN})
            this.setState({carYear:Data.carYearID.titleEN})
            this.setState({desc:Data.description})
            this.setState({driver:Data.allowDriver})
            this.setState({auto:Data.automatic})
            this.setState({type:Data.rentType})
            this.setState({rentPrice:Data.rentPrice})
            this.setState({rentLenght:Data.rentLenght})
            this.setState({img1:Data.img1})
            this.setState({img2:Data.img2})
            this.setState({img3:Data.img3})
            this.setState({img4:Data.img4})
            this.setState({img5:Data.img5})
            this.setState({img6:Data.img6})
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

      _onReservePressed =()=>{
        if(this.state.startDate && this.state.endDate){
        this.setState({flag_lang:0});
        NetInfo.fetch().then(state => {
          if(state.isConnected)
          {
            const obj ={
              carID:this.state.carId,
              userID:this.state.userId,
              price:this.state.rentPrice,
              notes:this.state.notes,
              startDate:this.state.startDate,
              endDate:this.state.endDate
            }
            fetch('http://134.209.178.237/api/user/request', {
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
                      alert("شكرا لك ");
                     
                      this.setState({notes:''})
                     
                    }
                    else {
                      this.setState({flag_lang:1});
                      alert('Thank You !!');
                     
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
          alert('تاريخ البدء والانتهاء مطلوبين');
         
        }
        else {
          this.setState({flag_lang:1});
          alert('StartDate end EndDate Required');
          
        }    
      }
      }
      _onEditPressed= async () => {
        this.props.navigation.navigate('EditMyCar',{car_id:this.state.carID});
      }
      getCarOrder=()=>{
        this.setState({flag_lang:0})
        NetInfo.fetch().then(state => {
          if(state.isConnected)
          {
            fetch('http://134.209.178.237/api/user/carRequests?id='+this.state.carId)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({flag_lang:1});
           const Data = responseJson;
           if(Data.length>0){
            const car_Order =[]
            for (let index = 0; index < Data.length; index++) {
                   const status = Data[index].status
                   if(status == 1){
                      this.setState({key:'Pending'})
                   }else if(status == 2){
                     this.setState({key:'Finished'})
                   }else{
                     this.setState({key:'Rejected'})
                   }
 
               var obj ={
                 id:Data[index]._id,
                 userImg:Data[index].userID.personalImg,
                 userName:Data[index].userID.fullname,
                 status:this.state.key,
                 date:Data[index].startDate
                 
               }      
                     
               car_Order.push(obj)
            }
           this.setState({ carOrder:car_Order });
           }else{
            if (this.state.lang.indexOf('ar')!=-1) {
              this.setState({flag_lang:1});
              alert('عذرا لا يوجد  حجوزات علي  هذة السيارة');
            }else{
              this.setState({flag_lang:1});
              alert('No Orders on  this Car')
            }
           }
          
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
      renderItem(item){ 
        return(
            <View style={{width:'100%',alignItems:'center',justifyContent:'space-around'}}>
            
             <TouchableOpacity 
              onPress={()=>this.props.navigation.navigate('CarOrderDetails',{ carOrder_id:item.id})}
             >
            <View style={{padding:2 , marginStart:3,flexDirection:'row',width:'98%'}}>
            <Image 
             source={{uri: item.userImg}} style={{width: '25%', height: 90 ,alignItems:'center',borderRadius: 10,marginStart:5}}>
            </Image>
             <View style={{width:'75%',height:90,justifyContent:'center',marginStart:5}}>
             <Text style={{width:'100%',fontSize:18,textAlign:'left',color:'#000', }}> {item.userName}</Text>
             <Text style={{width:'100%',fontSize:18,textAlign:'left',color:'#000', }}>{item.date.split('T')[0].trim()}</Text>
             <Text style={{width:'100%',fontSize:18,textAlign:'left',color:'#000', }}> {this.state.key}</Text>
             </View>
            </View>
           
            </TouchableOpacity>
            <View style={{width:'95%',marginTop:3,height:1,backgroundColor:'#000'}}></View>
            </View>
            );
      }

      renderOption(){
        return(
          <View style={{width:'100%',height:'8%',alignItems:'center',justifyContent:'center',}}>
          {this.state.lang.indexOf('ar')!=-1?
          <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',backgroundColor:'#C8972C'}}>
          <TouchableOpacity  onPress={() =>{
      this.props.navigation.goBack()
       }}
       style={{width:'8%'}}>
      <Image resizeMode={'cover'} source={require('../img/w_arrow.png')} 
     style={{width:10 , height:18,alignItems:'center',margin:10}}/>
     </TouchableOpacity>

     <Text style={{textAlign:'center',width:'80%',flex:1,fontSize:20,fontFamily:'segoe',color:"#fff", }}>
        {/* {strings("Contact.barTitle")} */}
        {this.state.lang.indexOf('ar') != -1 ?' تفاصيل السيارة ' :'Car details'}
        </Text>
         
          <TouchableOpacity onPress={() =>{this.props.navigation.openDrawer() }}
          style={{width:'8%'}}>
          <Image resizeMode={'cover'} source={require('../img/nav.png')}
          style={{width:25 , height:25,alignItems:'center'}} />

         </TouchableOpacity>
       
       </View>
          :
          <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row-reverse',backgroundColor:'#C8972C'}}>
          <TouchableOpacity  onPress={() =>{
      this.props.navigation.goBack()
       }}
       style={{width:'8%'}}>
      <Image resizeMode={'cover'} source={require('../img/w_arrow.png')} 
     style={{width:10 , height:18,alignItems:'center',margin:10}}/>
     </TouchableOpacity>

     <Text style={{textAlign:'center',width:'80%',flex:1,fontSize:20,fontFamily:'segoe',color:"#fff", }}>
        {/* {strings("Contact.barTitle")} */}
        {this.state.lang.indexOf('ar') != -1 ?' تفاصيل السيارة ' :'Car details'}
        </Text>
         
          <TouchableOpacity onPress={() =>{this.props.navigation.openDrawer() }}
          style={{width:'8%'}}>
          <Image resizeMode={'cover'} source={require('../img/nav.png')}
          style={{width:25 , height:25,alignItems:'center'}} />

         </TouchableOpacity>
       
       </View>
        }

          </View>
        )
 }

    render(){
        const images = [
            this.state.img1,
            this.state.img2,
            this.state.img3,
            this.state.img4,
            this.state.img5,
            this.state.img6,
            ];
        return(
            <SafeAreaView style={{width: '100%', flex:1,alignItems:'center',}}>
              {this.renderOption()}
            {this.state.flag_lang == 0? 
              <ActivityIndicator/>
              :
             <ScrollView style={{width:'100%',flex:1}}>
               {this.state.lang.indexOf('ar')!=-1?
                <View style={{width:'100%' ,flex:1 , alignItems:'center'}}>
                <TouchableOpacity onPress={this._onEditPressed.bind(this)}>
                                        <Image 
                                     resizeMode="stretch" 
                                      style={{width:40, height: 40,marginTop:3,}}
                                       source={require('../img/edit.png')} 
                                      ></Image>
                                     </TouchableOpacity>
                 <View style={{width:'70%',alignItems:'center',justifyContent:'center',}}>
                 
                 {!this.state.logo?
                                 <TouchableOpacity onPress={this.uploadImg}>
                                    <Image 
                                    resizeMode="stretch" 
                                    style={{width:180, height: 80,marginTop:3,marginStart:10}}
                                    source={require('../img/user.png')}
                                   ></Image> 
                                 </TouchableOpacity>
                               
                                   :
                                     <TouchableOpacity onPress={this.uploadImg}>
                                        <Image 
                                     resizeMode="stretch" 
                                      style={{width:180, height: 80,marginTop:3,marginStart:10}}
                                       source={{uri:this.state.logo }} 
                                      ></Image>
                                     </TouchableOpacity>
                                      
                                        }
                      
                                 {!this.state.carNum?
                                  <Text style={{width:'100%',fontSize:18 , color:'#000',marginTop:2,textAlign:'center',justifyContent:'center'}}> Car Number</Text>
                                   :
                                   <Text style={{width:'100%',fontSize:18 , color:'#000',marginTop:2,textAlign:'center',justifyContent:'center', }}> {this.state.carNum}</Text>
                                        }
                   
                  <View style={{width:'80%',alignItems:'center',marginTop:2,flexDirection:'row',justifyContent:'center'}}>
                  <TouchableOpacity 
                       onPress={()=>{this.props.navigation.navigate('RateScreen',{rate_num:this.state.carRate,car_Id:this.state.carID})}}
                       style={{width:'25%',backgroundColor:'#000', borderRadius:8,height:28,}}>
                      <Text style={{width: '100%',textAlign:'center', color:'#fff',fontSize:15, }}>
                       {this.state.lang.indexOf('ar') != -1 ?'تقييم  ' :' Rate'} </Text>
                      </TouchableOpacity>
                   <Rating
                           //showRating
                           type="star"
                           //fractions={1}
                           startingValue={this.state.carRate}
                           //readonly
                           imageSize={25}
                           // onFinishRating={this.ratingCompleted.bind(this)}
                           ratingColor ="#1A9658"/>
                  
                 </View>
                 </View>
                 
                    <View style={{width:'97%',height:37,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                     <TouchableOpacity 
                     onPress={()=>{
                       this.setState({flag_design:0})
                       this.setState({bg1:'#fff'})
                       this.setState({bg2:'#000'})
                       this.setState({bg3:'#000'})
                       this.setState({bg4:'#000'})
                       this.setState({txt1:'#000'})
                       this.setState({txt2:'#fff'})
                       this.setState({txt3:'#fff'})
                       this.setState({txt4:'#fff'})
                     }}
                     style={{width: '30%',borderColor:'#000',borderWidth:1,borderRadius:5,flex:1,backgroundColor:this.state.bg1}}>
                     <Text style={{width: '100%',textAlign:'center',color:this.state.txt1,fontSize:15, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' بيانات' :'Info'}
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
                     <Text style={{width: '100%',textAlign:'center',color:this.state.txt2,fontSize:15, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' المعرض ' :'Gallery'}
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
                       this.getCarOrder();
                      }}
                     style={{width: '30%',borderColor:'#000',borderWidth:1,borderRadius:5,flex:1,marginStart:3,backgroundColor:this.state.bg3}}>
                     <Text style={{width: '100%',textAlign:'center',color:this.state.txt3,fontSize:15, }}>
                     {this.state.lang.indexOf('ar') != -1 ?'طلبات السيارة ' :'Car Orders'}
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
                     <Text style={{width: '100%',textAlign:'center',color:this.state.txt4,fontSize:15, }}>
                     {this.state.lang.indexOf('ar') != -1 ?'ايجار ' :'Rent'}
                    </Text>
                    </TouchableOpacity>
                   </View>
                    {this.state.flag_lang == 0 ? 
                      <ActivityIndicator/>
                     :
                     <View style={{justifyContent:'center',alignItems:'center'}}>
                      
                    {this.state.flag_design == 0 ?
                    // first Flag
                   
                    <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                    {this.state.lang.indexOf('ar') != -1 ?
                    <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                     <View style={{width:'97%',flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' الفئه ' :'Category:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.cat}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?'  الفئه الجزئيه ' :'SubCategory:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.subCat}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' نوع السيارة ' :'Car Type:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.carType}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' موديل السيارة ' :'Car Model:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.carModel}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' سنه الصنع  ' :'Car Year:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.carYear}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' الوصف ' :'Description:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.desc}</Text>
                     </View>
                     <View style={{width:'97%',flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                        <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                        {this.state.lang.indexOf('ar') != -1 ?' تسمح بسائق ' :'Allow Driver:'}</Text>
                        <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                        borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.allowDriver}</Text>
                        </View>
                        <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                        <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                        {this.state.lang.indexOf('ar') != -1 ?' هيدروماتيك ' :'Automatic:'}</Text>
                        <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                        borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.automatic}</Text>
                        </View>
                    </View>
                    :
                    <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                     <View style={{width:'97%',flexDirection:'row',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' :الفئه ' :'Category:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.cat}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' : الفئه الجزئيه ' :'SubCategory:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.subCat}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' :نوع السيارة ' :'Car Type:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.carType}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' :موديل السيارة ' :'Car Model:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.carModel}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' :سنه الصنع  ' :'Car Year:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.carYear}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' :الوصف ' :'Description:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.desc}</Text>
                     </View>
                     <View style={{width:'97%',flexDirection:'row',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                        <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                        {this.state.lang.indexOf('ar') != -1 ?' :تسمح بسائق ' :'Allow Driver:'}</Text>
                        <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                        borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.allowDriver}</Text>
                        </View>
                        <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                        <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                        {this.state.lang.indexOf('ar') != -1 ?' : هيدروماتيك ' :'Automatic:'}</Text>
                        <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                        borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.automatic}</Text>
                        </View>
                    </View>
                    }
                    
                   </View>
                   : 
                     
                     <View style={{justifyContent:'center',alignItems:'center'}}>
                      {this.state.flag_design == 1 ? 
                       // second Flag
                       
                       <View style={{height:270,width:'98%',marginBottom:10,alignItems:'center',justifyContent:'center'}}>
                       <View style={{height:'90%',width:'100%',}}>
                           <ImageSlider
                             loopBothSides
                             autoPlayWithInterval={2000}
                             images={images}/>
                      </View>
                       </View>
                       :
                                                        
                       <View style={{justifyContent:'center',alignItems:'center'}}>
                       {this.state.flag_design == 2 ? 
                        // third Flag
                        <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                          <FlatList style={{width:'98%',paddingHorizontal:0 ,marginTop:2}}
                         data={this.state.carOrder}
                        numColumns={1}
                        renderItem={({item})=>this.renderItem(item)}
                       keyExtractor={(item, index) => index.toString()}
                       /> 
                        
                        </View>
                      
                        :
                        // fourth Flag                                 
                        <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                         {this.state.lang.indexOf('ar') != -1 ? 
                         <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                         <View style={{width:'97%',flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                        <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                        {this.state.lang.indexOf('ar') != -1 ?' نوع الايجار  ' :' Rent Type:'}</Text>
                        <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                        borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.rentType}</Text>
                        </View>
                        <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                        <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                        {this.state.lang.indexOf('ar') != -1 ?'  سعر الايجار ' :'Rent Price:'}</Text>
                        <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                        borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.rentPrice}</Text>
                        </View>
                        <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                        <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                        {this.state.lang.indexOf('ar') != -1 ?'  مدة الايجار ' :'Rent Lenght:'}</Text>
                        <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                        borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.rentLenght}</Text>
                        </View>
                         </View>
                         :
                         <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                         <View style={{width:'97%',flexDirection:'row',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                        <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                        {this.state.lang.indexOf('ar') != -1 ?' :نوع الايجار  ' :' Rent Type:'}</Text>
                        <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                        borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.rentType}</Text>
                        </View>
                        <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                        <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                        {this.state.lang.indexOf('ar') != -1 ?' : سعر الايجار ' :'Rent Price:'}</Text>
                        <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                        borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.rentPrice}</Text>
                        </View>
                        <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                        <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                        {this.state.lang.indexOf('ar') != -1 ?' : مدة الايجار ' :'Rent Lenght:'}</Text>
                        <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                        borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.rentLenght}</Text>
                        </View>
                         </View>
                         }
                        
                     
                        </View>
                    }
    
                     </View>
                   }
    
                    </View>
                       
                   }
                  
                   </View>
                  
                 }
                  
                   </View>
               :
               <View style={{width:'100%' ,flex:1 , alignItems:'center'}}>
             <TouchableOpacity onPress={this._onEditPressed.bind(this)}>
                                     <Image 
                                  resizeMode="stretch" 
                                   style={{width:40, height: 40,marginTop:3,}}
                                    source={require('../img/edit.png')} 
                                   ></Image>
                                  </TouchableOpacity>
              <View style={{width:'70%',alignItems:'center',justifyContent:'center',}}>
              
              {!this.state.logo?
                              <TouchableOpacity onPress={this.uploadImg}>
                                 <Image 
                                 resizeMode="stretch" 
                                 style={{width:180, height: 80,marginTop:3,marginStart:10}}
                                 source={require('../img/user.png')}
                                ></Image> 
                              </TouchableOpacity>
                            
                                :
                                  <TouchableOpacity onPress={this.uploadImg}>
                                     <Image 
                                  resizeMode="stretch" 
                                   style={{width:180, height: 80,marginTop:3,marginStart:10}}
                                    source={{uri:this.state.logo }} 
                                   ></Image>
                                  </TouchableOpacity>
                                   
                                     }
                   
                              {!this.state.carNum?
                               <Text style={{width:'100%',fontSize:18 , color:'#000',marginTop:2,textAlign:'center',justifyContent:'center'}}> Car Number</Text>
                                :
                                <Text style={{width:'100%',fontSize:18 , color:'#000',marginTop:2,textAlign:'center',justifyContent:'center', }}> {this.state.carNum}</Text>
                                     }
                
               <View style={{width:'80%',alignItems:'center',marginTop:2,flexDirection:'row',justifyContent:'center'}}>
               <TouchableOpacity 
                    onPress={()=>{this.props.navigation.navigate('RateScreen',{rate_num:this.state.carRate,car_Id:this.state.carID})}}
                    style={{width:'25%',backgroundColor:'#000', borderRadius:8,height:28,}}>
                   <Text style={{width: '100%',textAlign:'center', color:'#fff',fontSize:15, }}>
                    {this.state.lang.indexOf('ar') != -1 ?'تقييم  ' :' Rate'} </Text>
                   </TouchableOpacity>
                <Rating
                        //showRating
                        type="star"
                        //fractions={1}
                        startingValue={this.state.carRate}
                        //readonly
                        imageSize={25}
                        // onFinishRating={this.ratingCompleted.bind(this)}
                        ratingColor ="#1A9658"/>
               
              </View>
              </View>
              
                 <View style={{width:'97%',height:37,flexDirection:'row-reverse',alignItems:'center',justifyContent:'center'}}>
                  <TouchableOpacity 
                  onPress={()=>{
                    this.setState({flag_design:0})
                    this.setState({bg1:'#fff'})
                    this.setState({bg2:'#000'})
                    this.setState({bg3:'#000'})
                    this.setState({bg4:'#000'})
                    this.setState({txt1:'#000'})
                    this.setState({txt2:'#fff'})
                    this.setState({txt3:'#fff'})
                    this.setState({txt4:'#fff'})
                  }}
                  style={{width: '30%',borderColor:'#000',borderWidth:1,borderRadius:5,flex:1,backgroundColor:this.state.bg1}}>
                  <Text style={{width: '100%',textAlign:'center',color:this.state.txt1,fontSize:15, }}>
                  {this.state.lang.indexOf('ar') != -1 ?' بيانات' :'Info'}
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
                  <Text style={{width: '100%',textAlign:'center',color:this.state.txt2,fontSize:15, }}>
                  {this.state.lang.indexOf('ar') != -1 ?' المعرض ' :'Gallery'}
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
                    this.getCarOrder();
                   }}
                  style={{width: '30%',borderColor:'#000',borderWidth:1,borderRadius:5,flex:1,marginStart:3,backgroundColor:this.state.bg3}}>
                  <Text style={{width: '100%',textAlign:'center',color:this.state.txt3,fontSize:15, }}>
                  {this.state.lang.indexOf('ar') != -1 ?'طلبات السيارة ' :'Car Orders'}
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
                  <Text style={{width: '100%',textAlign:'center',color:this.state.txt4,fontSize:15, }}>
                  {this.state.lang.indexOf('ar') != -1 ?'ايجار ' :'Rent'}
                 </Text>
                 </TouchableOpacity>
                </View>
                 {this.state.flag_lang == 0 ? 
                   <ActivityIndicator/>
                  :
                  <View style={{justifyContent:'center',alignItems:'center'}}>
                   
                 {this.state.flag_design == 0 ?
                 // first Flag
                
                 <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                 {this.state.lang.indexOf('ar') != -1 ?
                 <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                  <View style={{width:'97%',flexDirection:'row',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                  {this.state.lang.indexOf('ar') != -1 ?' الفئه ' :'Category:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.cat}</Text>
                  </View>
                  <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                  {this.state.lang.indexOf('ar') != -1 ?'  الفئه الجزئيه ' :'SubCategory:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.subCat}</Text>
                  </View>
                  <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                  {this.state.lang.indexOf('ar') != -1 ?' نوع السيارة ' :'Car Type:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.carType}</Text>
                  </View>
                  <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                  {this.state.lang.indexOf('ar') != -1 ?' موديل السيارة ' :'Car Model:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.carModel}</Text>
                  </View>
                  <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                  {this.state.lang.indexOf('ar') != -1 ?' سنه الصنع  ' :'Car Year:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.carYear}</Text>
                  </View>
                  <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                  {this.state.lang.indexOf('ar') != -1 ?' الوصف ' :'Description:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.desc}</Text>
                  </View>
                  <View style={{width:'97%',flexDirection:'row',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' تسمح بسائق ' :'Allow Driver:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.allowDriver}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' هيدروماتيك ' :'Automatic:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.automatic}</Text>
                     </View>
                 </View>
                 :
                 <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                  <View style={{width:'97%',flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                  {this.state.lang.indexOf('ar') != -1 ?' :الفئه ' :'Category:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.cat}</Text>
                  </View>
                  <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                  {this.state.lang.indexOf('ar') != -1 ?' : الفئه الجزئيه ' :'SubCategory:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.subCat}</Text>
                  </View>
                  <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                  {this.state.lang.indexOf('ar') != -1 ?' :نوع السيارة ' :'Car Type:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.carType}</Text>
                  </View>
                  <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                  {this.state.lang.indexOf('ar') != -1 ?' :موديل السيارة ' :'Car Model:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.carModel}</Text>
                  </View>
                  <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                  {this.state.lang.indexOf('ar') != -1 ?' :سنه الصنع  ' :'Car Year:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.carYear}</Text>
                  </View>
                  <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                  <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                  {this.state.lang.indexOf('ar') != -1 ?' :الوصف ' :'Description:'}</Text>
                  <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                  borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.desc}</Text>
                  </View>
                  <View style={{width:'97%',flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' :تسمح بسائق ' :'Allow Driver:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.allowDriver}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' : هيدروماتيك ' :'Automatic:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.automatic}</Text>
                     </View>
                 </View>
                 }
                 
                </View>
                : 
                  
                  <View style={{justifyContent:'center',alignItems:'center'}}>
                   {this.state.flag_design == 1 ? 
                    // second Flag
                    
                    <View style={{height:270,width:'98%',marginBottom:10,alignItems:'center',justifyContent:'center'}}>
                    <View style={{height:'90%',width:'100%',}}>
                        <ImageSlider
                          loopBothSides
                          autoPlayWithInterval={2000}
                          images={images}/>
                   </View>
                    </View>
                    :
                                                     
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                    {this.state.flag_design == 2 ? 
                     // third Flag
                     <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                       <FlatList style={{width:'98%',paddingHorizontal:0 ,marginTop:2}}
                      data={this.state.carOrder}
                     numColumns={1}
                     renderItem={({item})=>this.renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                    /> 
                     
                     </View>
                   
                     :
                     // fourth Flag                                 
                     <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                      {this.state.lang.indexOf('ar') != -1 ? 
                      <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                      <View style={{width:'97%',flexDirection:'row',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' نوع الايجار  ' :' Rent Type:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.rentType}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?'  سعر الايجار ' :'Rent Price:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.rentPrice}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row',alignItems:'flex-start',marginTop:3,marginEnd:5}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?'  مدة الايجار ' :'Rent Lenght:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginEnd:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.rentLenght}</Text>
                     </View>
                      </View>
                      :
                      <View style={{width:'100%' ,alignItems:'center',justifyContent:'center'}}>
                      <View style={{width:'97%',flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' :نوع الايجار  ' :' Rent Type:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.rentType}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' : سعر الايجار ' :'Rent Price:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.rentPrice}</Text>
                     </View>
                     <View style={{width:'97%' ,flexDirection:'row-reverse',alignItems:'flex-start',marginTop:3,marginStart:3}}>
                     <Text style={{width:'40%',textAlign:'auto',alignItems:'flex-start',color:'#000',fontSize:20, }}>
                     {this.state.lang.indexOf('ar') != -1 ?' : مدة الايجار ' :'Rent Lenght:'}</Text>
                     <Text style={{width:'60%',textAlign:'center',alignItems:'center',color:'#000',fontSize:20,padding:3,marginStart:3,
                     borderRadius:10,borderColor:'#000',borderWidth:1, }}>{this.state.rentLenght}</Text>
                     </View>
                      </View>
                      }
                     
                  
                     </View>
                 }
 
                  </View>
                }
 
                 </View>
                    
                }
               
                </View>
               
              }
               
                </View>
              }
            
                </ScrollView>
              }
           </SafeAreaView>
        );
    }
}
export default MyCarDetails;