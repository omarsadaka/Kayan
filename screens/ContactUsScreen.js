import React , {Component} from 'react';
import {Text , View , TouchableOpacity , StyleSheet , Dimensions , Image  , FlatList ,
    ActivityIndicator,AsyncStorage, SafeAreaView} from 'react-native';
//import Toast from 'react-native-simple-toast';
//import DeviceInfo from 'react-native-device-info';
// import { strings } from '../i18n';
//import I18n from 'react-native-i18n'
import NetInfo from "@react-native-community/netinfo";
const { width, height } = Dimensions.get('window')





class ContactUsScreen extends Component{

    constructor(props) {
        super(props);
        this.state={
          lang:'',
          flag_lang:0,
          design_flag:1,
          messages:[],
          userData:{},
          userId:'',
          userImg:''
        }
    }

 
  
    componentDidMount() {
        this._retrieveData();
        this.willFocusSubscription = this.props.navigation.addListener(
          'willFocus',
          () => {
           this.getData()
          }
        );
      }
     
      _retrieveData = async () => {
        try {
          const lang = await AsyncStorage.getItem('lang');
          this.setState({lang})
          // this.setState({flag_lang:1})
          const value = await AsyncStorage.getItem('loginDataKayan');
          const data =JSON.parse(value);  
          if(value){
           this.setState({userData:data})
           this.setState({userId:this.state.userData._id})
           this.setState({userImg:data.personalImg})
          //  alert('id = '+this.state.userId)
           this.getData()
        }
        else{
          var data2 ={
            _id:'1'
          }
          this.setState({userData:data2})
        }
        }catch(error){
          var data2 ={
            _id:'1'
          }
          this.setState({userData:data2})
        }
    }

    getData=()=>{

        NetInfo.fetch().then(state => { 
          if(state.isConnected) {
            fetch('http://134.209.178.237/api/user/contactUsByUsers?id='+this.state.userId)
            .then((response) => response.json())
            .then((responseJson) => {
              const messages = responseJson;
              this.setState({flag_lang:1})
              this.setState({messages})

            })
            .catch((error) => {
              this.setState({flag_lang:1})
              alert('error '+ error)
            });
          }else{
            if(this.state.lang.indexOf('ar') != -1 ){
              this.setState({flag_lang:1})
              alert('عذرا لا يوجد أتصال بالانترنت' );
            }
            else {
              this.setState({flag_lang:1})
              alert('Sorry No Internet Connection');
            }
            }
        
       
        })
      }

      renderItem(item){
        return(
              <View style={{ width:'100%',alignItems: "center",alignItems:'center',justifyContent:'center'}}>
              <TouchableOpacity 
               onPress={()=>this.props.navigation.navigate('MsgDetails',{id:item._id})}>
              <View style={[this.state.lang==='ar'?styles.row:styles.row_res,{width:'100%',height: height*0.08,alignItems:'center' ,
                 borderRadius:5,borderColor:'#707070',borderWidth:1,margin:3}]}>
              
                  <Image 
                    resizeMode="cover" 
                   style={{width:40, height: 40,}}
                   source={require('../img/chat_logo.png')}
                   ></Image> 
      
               <Text style={{width:'70%',textAlign:'center',fontSize:18,justifyContent:'center',alignItems:'center',color:'#000'}}>  
               {item.createdAt.split('T')[0].trim()} 
               </Text>
            </View>
            </TouchableOpacity>
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
         style={{width:'13%',height:'100%',alignItems:'center',justifyContent:'center'}}>
        <Image resizeMode={'cover'} source={require('../img/w_arrow.png')} 
       style={{width:10 , height:18,alignItems:'center',margin:10}}/>
       </TouchableOpacity>

       <Text style={{textAlign:'center',width:'74%',fontSize:20,fontFamily:'segoe',color:"#fff", }}>
          {/* {strings("Contact.barTitle")} */}
          {this.state.lang.indexOf('ar')!=-1?'تواصل معنا':'Contact us'}
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
          style={{width:10 , height:18,alignItems:'center',margin:10}}/>
          </TouchableOpacity>
          <Text style={{textAlign:'center',width:'74%',fontSize:20,fontFamily:'segoe',color:"#fff", }}>
             {/* {strings("Contact.barTitle")} */}
             {this.state.lang.indexOf('ar')!=-1?'تواصل معنا':'Contact us'}
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


    render(){
        return(
            <SafeAreaView style={{width: '100%', backgroundColor:'#FFF', height: '100%',alignItems:'center',}}>
              {this.renderOption()}
               {this.state.flag_lang==0?
            <ActivityIndicator  
            color='#C8972C'
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}/>
            :
            <View style={{width:width,justifyContent:'center',alignItems:'center',height:'92%'}} >
            <FlatList style={{width:'100%',marginTop:5,}}
             data={this.state.messages}
             renderItem={({item})=>this.renderItem(item)}
             keyExtractor={(item, index) => index.toString()}
            /> 
              <TouchableOpacity
              style={{width:40,height:40,position:'absolute',backgroundColor:'#118CB3',alignItems:'center',justifyContent:'center',borderRadius:50/2,
              bottom:'3%',right:'3%'}}
             onPress={() => this.props.navigation.navigate('NewMsgScreen')}>
              <Image resizeMode="stretch" 
               style={{width:25, height:25,}}
               source={require('../img/add.png')}
              ></Image>
             </TouchableOpacity>
            </View>
              }
            </SafeAreaView>
        );
    }
}
  export default ContactUsScreen;
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
   
  });
