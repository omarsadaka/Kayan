import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import SplashScreen from "./screens/SplashScreen"
import LoginScreen from "./screens/LoginScreen"
import Login_En from './screens/Login_En'
import LanguageScreen from "./screens/LanguageScreen"
import RegisterScreen from "./screens/RegisterScreen"
import HomeScreen from './src/App';
import HomeScreen_Ar from './src.1/App';



const Routes = createStackNavigator(
    {
       
        Splash: {
            screen: SplashScreen,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
        },
        Login: {
            screen: LoginScreen,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
         Login_En: {
            screen: Login_En,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },
        Language: {
            screen: LanguageScreen,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
        },
            
        Register: {
            screen: RegisterScreen,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
         },  
        Home :{
            screen: HomeScreen,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
            },   
            Home_ar :{
                screen: HomeScreen_Ar,
            navigationOptions: ({ navigation }) => ({
               header: null,
            }),
                },   
    },
    {
        initialRouteName: "Splash"
     }

);

const myNavigate = createAppContainer(Routes);

export default myNavigate;