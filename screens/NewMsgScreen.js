import React , {Component} from 'react';
import {Text , View , TouchableOpacity , SafeAreaView , TextInput , Image , FlatList ,StyleSheet,Dimensions,
    ActivityIndicator,AsyncStorage} from 'react-native';
//import Toast from 'react-native-simple-toast';
//import DeviceInfo from 'react-native-device-info';
// import { strings } from '../i18n';
//import I18n from 'react-native-i18n'
import NetInfo from "@react-native-community/netinfo";
const { width, height } = Dimensions.get('window')
import Icon from 'react-native-vector-icons/FontAwesome';


class NewMsgScreen extends Component{

    constructor(props) {
        super(props);
        this.state={
          lang:'',
          flag_lang:0,
          design_flag:1,
          userData:{},
          userId:'',
          messageHistory:[],
          type:1,
          newMsg:'',
          userImg:'',
          contactId:''

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
           this.setState({flag_lang:1})
          const value = await AsyncStorage.getItem('loginDataKayan');
          const data =JSON.parse(value);  
          if(value){
           this.setState({userData:data})
           this.setState({userId:this.state.userData._id})
           this.setState({userImg:data.personalImg})
          //  alert('id = '+this.state.userId)
          
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
        if(state.isConnected){
            fetch('http://134.209.178.237/api/user/contactUsMsgById?id='+this.state.contactId)
            .then((response) => response.json())
            .then((responseJson) => {
              const messageHistory = responseJson;
              this.setState({flag_lang:1})
              this.setState({messageHistory})
              
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
    onSendMsg=()=>{
      this.setState({flag_lang:0})
      NetInfo.fetch().then(state => {
        if(state.isConnected){
                const url = 'http://134.209.178.237/api/user/contactUs';
                if(!this.state.newMsg) {
                      if(this.state.lang.indexOf('ar') != -1 ){
                        this.setState({flag_lang:1})
                        alert('ادخل نص الرسالة');
                      }
                      else {
                        this.setState({flag_lang:1})
                        alert('Enter message text');
                      }
                }else{
                 const  details = {
                  userID: this.state.userId,        
               };
               
               fetch(url, {
                 method: 'POST',
                 headers: {
                  'Accept': 'application/json',
                             'Content-Type': 'application/json',
                },
                           body: JSON.stringify(details),
                })  
                .then(res => res.json())
                 .then(res => {
                  const data = res;
                  this.setState({contactId:data._id})

                  const  obj = {
                    msg: this.state.newMsg,
                    from: this.state.type,
                    contactUsID: this.state.contactId,        
                 };
                  
                  fetch('http://134.209.178.237/api/user/contactUsMsg', {
                    method: 'POST',
                    headers: {
                     'Accept': 'application/json',
                                'Content-Type': 'application/json',
                   },
                              body: JSON.stringify(obj),
                   })  
                   .then(res => res.json())
                    .then(res => {
                     this.setState({newMsg:''})
                    this.getData();
                             
                    })
                    .catch(error => {
                      this.setState({flag_lang:1})
                       alert('error '+error);
                       
                    });
                 
                          
                 })
                 .catch(error => {
                  this.setState({flag_lang:1})
                    alert('error '+error);
                    
                 });
                }
            }else{
                if(this.state.lang.indexOf('ar') != -1 ){
                  this.setState({flag_lang:1})
                    alert('لايوجد اتصال بالانترنت');
                  }
                  else {
                    this.setState({flag_lang:1})
                    alert('No Internet Connection ');
                  }   
            }

      
    })
    

    }
    renderItem(item){
        return(
              <View style={{ flex:1, width:'100%',}}>
              {item.from == 1?
            <View style={{width:'80%',flexDirection:'row', justifyContent: "center",alignItems:'center',
             borderRadius:10,borderColor:'#118CB3',borderWidth:1,margin:3,padding:2}}>
             <Image 
              style={{width:40, height: 40,borderRadius:5,margin:2}}
              source={{uri: item.contactUsID.userID.personalImg}}
              ></Image>
              <Text style={{flex:1,textAlign:'left',fontSize:15,color:'#045c5c',justifyContent:'center',marginStart:7,fontFamily:'segoe'}}> {item.msg } </Text>
         </View>
         :    
          <View style={{flexDirection:'row-reverse', width:'100%',}}>
           <View style={{width:'80%', flexDirection:'row-reverse', justifyContent:'center',alignItems:'center',
           borderRadius:10,borderColor:'#118CB3',borderWidth:1,margin:3,padding:2}}>
            <Image resizeMode="cover" 
            style={{width:40, height: 40,borderRadius:5,margin:2}}
            source={require('../img/chat_logo.png')}
            ></Image>
            <Text style={{flex:1,textAlign:'right',fontSize:15,color:'#045c5c',justifyContent:'center',marginEnd:7,fontFamily:'segoe'}}>  {item.msg } </Text> 
    </View>
      </View>
      }
      
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
      style={{width:10 , height:18,alignItems:'center'}}/>
      </TouchableOpacity>

      <Text style={{textAlign:'center',width:'74%',flex:1,fontSize:20,fontFamily:'segoe',color:"#fff", }}>
         {/* {strings("NewMsg.barTitle")} */}
         {this.state.lang.indexOf('ar')!=-1?'رساله جديدة':'New message'}
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
          style={{width:10 , height:18,alignItems:'center'}}/>
          </TouchableOpacity>
  
          <Text style={{textAlign:'center',width:'74%',flex:1,fontSize:20,fontFamily:'segoe',color:"#fff", }}>
             {/* {strings("NewMsg.barTitle")} */}
             {this.state.lang.indexOf('ar')!=-1?'رساله جديدة':'New message'}
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
            <SafeAreaView style={{width: '100%', backgroundColor:'#FFF', flex:1,alignItems:'center',}}>
              {this.renderOption()}
              {this.state.flag_lang==0?
           <ActivityIndicator 
           color='#C8972C'
           size="large"
           style={{left: 0,
            position: 'absolute',
            right: 0,
            top: '50%',
            zIndex: 1}} />
           :
           <View/>
          }
         <View style={{width:'100%',flex:1,justifyContent:'center',alignItems:'center'}}>

         <FlatList style={{width:'100%',marginTop:5,}}
             data={this.state.messageHistory}
             renderItem={({item})=>this.renderItem(item)}
             keyExtractor={(item, index) => index.toString()}
            /> 
             <View style={[this.state.lang==='ar'?styles.row_res:styles.row,{width:'99%',height:'10%',justifyContent:'center',alignItems:'center', marginBottom:2,marginTop:10,borderRadius:7,
             borderColor:'#707070',borderWidth:1,padding:5}]}>
             <TextInput
               placeholderTextColor='#70707050'
               underlineColorAndroid="transparent"
               multiline = {true}
               placeholder={this.state.lang.indexOf('ar') != -1 ?'اكتب الرساله' :'Write Message'}
               value={this.state.newMsg}
               onChangeText={(newMsg) => this.setState({ newMsg :newMsg.trim()})}
               style={[this.state.lang==='ar'?styles.right:styles.left,{height:'100%',width: '90%',color:'#000',borderRadius:7,borderColor:'#70707037',borderWidth:1,fontSize:12,textAlignVertical:'top'}]}
             ></TextInput>
              <TouchableOpacity style={{width:'10%',alignItems:'center',justifyContent:'center'}}
               onPress={this.onSendMsg.bind(this)}>
                <Icon name="telegram" size={25} color="#118CB3" style={{}} />
              </TouchableOpacity>
             </View>
           
            </View>
            
            </SafeAreaView>
        );
    }
}
  export default NewMsgScreen;
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
    
  });