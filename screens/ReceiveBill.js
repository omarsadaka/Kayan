import React, { Component } from 'react';
import { View, Text,Dimensions, animating,StyleSheet, TouchableOpacity, TextInput, Image ,ImageBackground,Alert} from 'react-native';
import { AsyncStorage,SafeAreaView} from 'react-native';
import {ActivityIndicator, FlatList, ScrollView,RefreshControl } from 'react-native';
const { width, height } = Dimensions.get('window')
import NetInfo from "@react-native-community/netinfo";


class ReceiveBill extends Component{

    constructor(props) {
        super(props);
        this.state={
          lang:'',
          flag_lang:0,
          flag_design:0,
          userData:{},
          userId:'',
          refreshing:false,
          rentalBill:[],
          totalPrice:0,
         
        }
        
      }
    
      componentDidMount() {
        //NativeModules.ExceptionsManager = null;
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
          this.getRentalBill();
          }else{
              var data2 ={
                _id:'1',
                fullname:'أسم المستخدم'
              }
              this.setState({userData:data2})
          }    
           
         
        }catch(error){}
      }
      handleRefresh = () => {
        this.setState({
            refreshing: true,
        }, () => {
            this.getRentalBill();
        })
    }
    getRentalBill =()=>{ 
      
      NetInfo.fetch().then(state => {
        if(state.isConnected)
        {
          fetch('http://134.209.178.237/api/user/getReceiptByUser?id='+this.state.userId)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({flag_lang:1});
        this.setState({refreshing:false})
         const Data = responseJson;
         if(Data.length >0){
          const carInfo =[]
          var price =0
          for (let index = 0; index < Data.length; index++) {
            price+=Data[index].price
           
           if (this.state.lang.indexOf('ar')!=-1) {
             var obj ={
               id:Data[index]._id,
               carImg:Data[index].carID.logo,
               cat:Data[index].carID.categoryID.titleAr,
               type:Data[index].carID.carTypeID.titleAr,
               model:Data[index].carID.carModelID.titleAr,
               price:Data[index].price,
               date:Data[index].createdAt
              
             }      
           }else{
           
             var obj ={
               id:Data[index]._id,
               carImg:Data[index].carID.logo,
               cat:Data[index].carID.categoryID.titleEN,
               type:Data[index].carID.carTypeID.titleEN,
               model:Data[index].carID.carModelID.titleEN,
               price:Data[index].price,
               date:Data[index].createdAt
               
             }      
           }
                        
            carInfo.push(obj)
          }
         this.setState({ rentalBill:carInfo });
         this.setState({totalPrice:price})
         }else{
          this.setState({refreshing:false})
          if (this.state.lang.indexOf('ar')!=-1) {
            this.setState({flag_lang:1});
            alert(' لا يوجد  فواتير الأن  ');
          }else{
            this.setState({flag_lang:1});
            alert('No Bills now   ')
          }
         }
       
        

      })
      .catch((error) => {
        this.setState({refreshing:false})
        this.setState({flag_lang:1});
        alert(""+{error});
       
      });
     
        }else{
          this.setState({refreshing:false})
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
            <View style={{width:'98%',backgroundColor:'#FFFFFF',borderColor:'#EFEAEA',borderRadius:10,borderWidth:1,justifyContent:'center',
            alignItems:'center',marginVertical:3,height:height/6.5}}>
            <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:'100%' ,height:'100%',alignItems:'center',justifyContent:'center',marginTop:5,marginBottom:5}]}>
            <View style={{flex:1 , alignItems:'center',height:'100%',}}>
             <View style={[this.state.lang ==='ar'?styles.row_des:styles.row_res_des,{alignItems:'center',justifyContent:'center',backgroundColor:'#C8972C',position:'absolute',top:5}]}>
             <Image 
             source={require('../img/bell2.png')} style={{width:20, height: 20 ,alignItems:'center',margin:5}}>
             </Image>
             {this.state.lang === 'ar'?
              <Text style={{flex:1,fontSize:14,textAlign:'center',color:'#ffffff',fontFamily:'segoe',}}>{item.price}  ر س</Text>
             :
             <Text style={{flex:1,fontSize:14,textAlign:'center',color:'#ffffff',fontFamily:'segoe',}}>{item.price}  SAR</Text>
             }
             </View>
             <Text style={{width:'100%',fontSize:12,textAlign:'center',color:'#707070',fontFamily:'segoe',position:'absolute',bottom:5}}>{item.date.split('T')[0]}</Text>
            </View>
           
           
            <View style={{flex:1 ,alignItems:'center',justifyContent:'center',marginTop:5}}>
            <Text style={{width:'100%',fontSize:14,textAlign:'center',color:'#434343',fontFamily:'segoe',}}>{item.type}</Text>
           </View>
            <Image 
             source={{uri: item.carImg}} style={{flex:1, height: 70 ,alignItems:'center',margin:5}}>
            </Image>
             </View>
          
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
        {/* {strings("Bills.barTitle")} */}
        {this.state.lang.indexOf('ar')!=-1?'الفواتير المستحقه':'Invoice'}
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
         <Image resizeMode={'cover'} source={require('../img/r_back.png')} 
        style={{width:10 , height:18,alignItems:'center',margin:10}}/>
        </TouchableOpacity>

        <Text style={{textAlign:'center',width:'80%',flex:1,fontSize:20,fontFamily:'segoe',color:"#fff", }}>
           {/* {strings("Bills.barTitle")} */}
           {this.state.lang.indexOf('ar')!=-1?'الفواتير المستحقه':'Invoice'}
           </Text>
            
             <TouchableOpacity onPress={() =>{this.props.navigation.openDrawer() }}
             style={{width:'8%',marginStart:7}}>
             <Image resizeMode={'cover'} source={require('../img/nav.png')}
             style={{width:25 , height:25,alignItems:'center'}} />

            </TouchableOpacity>
           
          </View>
        }
          </View>
        )
 }

    render(){
        return(
      <SafeAreaView style={{width: '100%', backgroundColor:'#FFF', flex:1,alignItems:'center',}}>
        {this.renderOption()}
        <View style={{width:'100%' ,flex:1 , alignItems:'center'}}>
        {this.state.flag_lang == 0 ? 
              <ActivityIndicator
              color='#C8972C'
              animating = {animating}
                         size = "small"
                         style={{  position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center',justifyContent: 'center'}}/>
             :
             <ScrollView style={{width:'100%',flex:1}}
             refreshControl={
              <RefreshControl
               colors={["#9Bd35A", "#689F38"]}
               refreshing= {this.state.refreshing}
             onRefresh={this.handleRefresh}
           />
           }>
             <View style={{width:'100%',flex:1,justifyContent:'center',alignItems:'center'}}>
             <Text style={{width:'80%',textAlign:'center',alignItems:'center',fontSize:16,color:'#343434',marginTop:10,fontFamily:'segoe'}}>
             {this.state.lang.indexOf('ar') != -1 ?' برجاء تسديد الفواتير المستحقه من عمليات تأجير السيارات' :' Please pay the bills due from the car rental operations'}
             </Text>
             <View style={{width:'95%',height:400,alignItems:'center',justifyContent:'center',marginTop:10}}>
                <FlatList style={{width:'100%',height:'100%'}}
                data={this.state.rentalBill}
               
            numColumns={1}
           renderItem={({item})=>this.renderItem(item)}
           keyExtractor={(item, index) => index.toString()}/>
        </View>
           <View style={{width:'100%',justifyContent:'center',alignItems:'center',marginTop:20,marginBottom:10}}>
           <View style={{width:'90%',marginStart:10,alignItems:'center',justifyContent:'center'}}>
           <Text style={{width:'100%',fontSize:20,fontFamily:'segoe',color:'#707070',textAlign:'center'}}>{this.state.lang==='ar'?'الأجمالى':'Total'}</Text>
           <Text style={{width:'90%',height:height*0.06,fontSize:22,textAlign:'center',color:'#ffffff',backgroundColor:'#C8972C',borderRadius:5,
           fontFamily:'segoe',margin:7,textAlignVertical:'center'}}> {this.state.totalPrice} </Text>
           </View>
           
          <Text style={{fontSize:14,textAlign:'center',color:'#343434',marginTop:20,fontFamily:'segoe'}}>
          {this.state.lang==='ar'?'ادفع عن طريق':'Pay by'}
          </Text>
          <View style={{width:'95%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginBottom:10}}>
          <Image 
           source={require('../img/pb.png')} style={{width:40, height: 30 ,alignItems:'center',margin:7}}>
           </Image>
           <Image 
           source={require('../img/visa.png')} style={{width:40, height: 30 ,alignItems:'center',margin:7}}>
           </Image>
           <Image 
           source={require('../img/mc.png')} style={{width:40, height: 30 ,alignItems:'center',margin:7}}>
           </Image>
           <Image 
           source={require('../img/ae.png')} style={{width:40, height: 30 ,alignItems:'center',margin:7}}>
           </Image>
          </View>
           </View>
             </View>
             </ScrollView>
        }
        </View>
     </SafeAreaView>
        );
    }
}
export default ReceiveBill;
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
  row_des:{
    flexDirection: 'row',
    borderTopRightRadius:12,
    borderBottomRightRadius:12,
    left:0
  },
  row_res_des:{
    flexDirection: 'row-reverse',
    borderTopLeftRadius:12,
    borderBottomLeftRadius:12,
    right:0
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
    width:60,
    height:60,
    alignItems:'center',
    justifyContent:'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
       width: 0,
       height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
 },
 start:{
   alignSelf:'flex-start'
 },
 end:{
   alignSelf:'flex-end'
 }
 
});