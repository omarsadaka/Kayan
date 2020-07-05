import React, { Component } from 'react';
import {
  Text, View, TouchableOpacity, StyleSheet, TextInput, Image, FlatList, Dimensions,
  ActivityIndicator, AsyncStorage, ScrollView, Alert, SafeAreaView
} from 'react-native';
//import Toast from 'react-native-simple-toast';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker';
import ToggleSwitch from 'toggle-switch-react-native';
import Modal from 'react-native-modalbox';
const { width, height } = Dimensions.get('window')
import NetInfo from "@react-native-community/netinfo";
import { Container, Header, Content, Picker, Form } from "native-base";
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios';







class AddCarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag_lang: 0,
      flag_addImg:0,
      flag_more_addImg:1,
      Data: [],
      lang: '',
      catID: '',
      subCatID: '',
      errors: {},
      categories: [],
      subCategories: [],
      userData: {},
      priceAr: '.. ريال',
      priceEN: '00 SAR',
      modeles: [],
      years: [],
      types: [],
      modeleID: '',
      yearID: '',
      typeID: '',
      price: '',
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      image5: '',
      image6: '',
      car_Img: '',
      img1: '',
      img2: '',
      img3: '',
      img4: '',
      img5: '',
      img6: '',
      more_img_flag: 0,
      startDate: '',
      endDate: '',
      minDate: new Date(),
      userId: '',
      notes: '',
      insurance:'',
      flag_add_car: 1,
      packerColor1: '#70707037',
      packerColor2: '#70707037',
      packerColor3: '#70707037',
      packerColor4: '#70707037',
      packerColor5: '#70707037',
      picker_men: [
        { label: '1', value: '1', }, { label: '5', value: '5', }, { label: '7', value: '7',}, { label: '14', value: '14', },
        {label: '40', value: '40',},{label: '60', value: '60', }
      ], 
      picker_speed: [
        { label: 'A', value: '1', }, 
        { label: 'M', value: '2', }
      ],  
      picker_bag: [
        { label: '1', value: '1', }, 
        { label: '2', value: '2', }
      ], 
      picker_door: [
        { label: '1', value: '1', },  { label: '2', value: '2', },{ label: '3', value: '3', },{ label: '4', value: '4', }
      ], 
      checked1:false,
      checked2:false,
      checked3:false,
      checked4:false,
      checked5:false,
      checked6:false,
      checked7:false,
      abs:2,
      bluetooth:2,
      centralLock:2,
      electriGlass:2,
      sportTrims:2,
      cdPlayer:2,
      cruiseControl:2,
      men:1,
      speed:1,
      bag:1,
      door:1

    }
  }

  componentDidMount() {
    //NativeModules.ExceptionsManager = null;

    this._retrieveData();
    this.getFlagAddCar();


  }

  _retrieveData = async () => {
    const lang = await AsyncStorage.getItem('lang');
    this.setState({ lang })
    this.setState({ flag_lang: 1 })
    const value = await AsyncStorage.getItem('loginDataKayan');
    if (value) {
      const data = JSON.parse(value);
      this.setState({ userData: data })
      this.setState({ userId: this.state.userData._id })
      this.getCategory();
      this.getModel();
      this.getYears();
      this.getTypes();
    } else {
      Alert.alert(
        this.state.lang.indexOf('ar') != -1 ? 'كيان' : 'Kayan',
        this.state.lang.indexOf('ar') != -1 ? 'يجب تسجيل الدخول لاضافه سيارة ' :
          'you must be login to add a car ',

        [
          {
            text: this.state.lang.indexOf('ar') != -1 ? 'ألغاء' : 'Cancel'
            , onPress: () => this.dismiss, style: 'cancel'
          },
          {
            text: this.state.lang.indexOf('ar') != -1 ? ' تسجيل الدخول' : 'login ', onPress: () => {
              try {
                const { navigation } = this.props;
                navigation.push('Login');
              } catch (e) { }
            }

          },
        ],
        { cancelable: true }

      )
      return true;
      var data2 = {
        _id: '1',
        fullname: 'أسم المستخدم'
      }
      this.setState({ userData: data2 })
      this.getCategory();
      this.getModel();
      this.getYears();
      this.getTypes();

    }
  }
  getCategory = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        fetch('http://134.209.178.237/api/user/category')
          .then((response) => response.json())
          .then((responseJson) => {
            const categories = responseJson;
            const categoriesAr = [];
            const subCategoriesAr = []

            if (this.state.lang.indexOf('ar') != -1) {

              categories.forEach(element => {
                categoriesAr.push({
                  label: element.titleAr, value: element._id, key: element._id
                })
              });
              categoriesAr.unshift({
                label: ' أختر الفئه', value: '1', key: '1'
              })
              subCategoriesAr.unshift({
                label: ' أختر الفئه الفرعيه', value: '1', key: '1'
              })

            } else {
              categories.forEach(element => {
                categoriesAr.push({
                  label: element.titleEN, value: element._id, key: element._id
                })
              });
              categoriesAr.unshift({
                label: ' Choose category', value: '1', key: '1'
              })
              subCategoriesAr.unshift({
                label: ' Choose subCategory', value: '1', key: '1'
              })

            }
            this.setState({ categories: categoriesAr });
            this.setState({ subCategories: subCategoriesAr });


          })
          .catch((error) => {
            this.setState({ flag_lang: 1 });
            alert("" + { error });

          });

      } else {

        if (this.state.lang.indexOf('ar') != -1) {
          this.setState({ flag_lang: 1 });
          alert('عذرا لا يوجد اتصال بالانترنت');
        } else {
          this.setState({ flag_lang: 1 });
          alert('No internet connection!')
        }



      }
    })
  }

  getSubCategory = (catID) => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {

        fetch('http://134.209.178.237/api/user/subcategory?id=' + catID)
          .then((response) => response.json())
          .then((responseJson) => {
            const subCategories = responseJson;
            const subCategoriesAr = [];

            if (this.state.lang.indexOf('ar') != -1) {

              subCategories.forEach(element => {
                subCategoriesAr.push({
                  label: element.titleAr, value: element._id, key: element.price
                })
              });
              subCategoriesAr.unshift({
                label: ' أختر الفئه الفرعيه', value: '1', key: '1'
              })

            } else {
              subCategories.forEach(element => {
                subCategoriesAr.push({
                  label: element.titleEN, value: element._id, key: element.price
                })
              });
              subCategoriesAr.unshift({
                label: ' choose SubCategory', value: '1', key: '1'
              })

            }
            this.setState({ subCategories: subCategoriesAr });



          })
          .catch((error) => {
            alert('omaaaaar' + error)
          });


      }
      else {
        if (this.state.lang.indexOf('ar') != -1) {
          alert('عذرا لا يوجد أتصال بالانترنت');
        }
        else {
          this.setState({ flag: 1 });
          alert('Sorry No Internet Connection');
        }
      }
    })
  }
  getModel = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        fetch('http://134.209.178.237/api/user/carModel')
          .then((response) => response.json())
          .then((responseJson) => {
            const models = responseJson;
            const modelsAr = [];
            if (this.state.lang.indexOf('ar') != -1) {

              models.forEach(element => {
                modelsAr.push({
                  label: element.titleAr, value: element._id, key: element._id
                })
              });
              modelsAr.unshift({
                label: ' أختر الموديل', value: '1', key: '1'
              })

            } else {
              models.forEach(element => {
                modelsAr.push({
                  label: element.titleEN, value: element._id, key: element._id
                })
              });
              modelsAr.unshift({
                label: ' Choose model', value: '1', key: '1'
              })

            }
            this.setState({ modeles: modelsAr });

          })
          .catch((error) => {
            alert("" + { error });

          });

      } else {

        if (this.state.lang.indexOf('ar') != -1) {
          this.setState({ flag_lang: 1 });
          alert('عذرا لا يوجد اتصال بالانترنت');
        } else {
          this.setState({ flag_lang: 1 });
          alert('No internet connection!')
        }

      }
    })
  }
  getYears = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        fetch('http://134.209.178.237/api/user/carYear')
          .then((response) => response.json())
          .then((responseJson) => {
            const years = responseJson;
            const yearsAr = [];
            if (this.state.lang.indexOf('ar') != -1) {

              years.forEach(element => {
                yearsAr.push({
                  label: element.titleAr, value: element._id, key: element._id
                })
              });
              yearsAr.unshift({
                label: ' أختر سنه الصنع', value: '1', key: '1'
              })

            } else {
              years.forEach(element => {
                yearsAr.push({
                  label: element.titleEN, value: element._id, key: element._id
                })
              });
              yearsAr.unshift({
                label: 'Choode year', value: '1', key: '1'
              })

            }
            this.setState({ years: yearsAr });

          })
          .catch((error) => {
            alert("" + { error });

          });

      } else {

        if (this.state.lang.indexOf('ar') != -1) {
          this.setState({ flag_lang: 1 });
          alert('عذرا لا يوجد اتصال بالانترنت');
        } else {
          this.setState({ flag_lang: 1 });
          alert('No internet connection!')
        }

      }
    })
  }
  getTypes = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        fetch('http://134.209.178.237/api/user/carType')
          .then((response) => response.json())
          .then((responseJson) => {
            const types = responseJson;
            const typesAr = [];
            if (this.state.lang.indexOf('ar') != -1) {

              types.forEach(element => {
                typesAr.push({
                  label: element.titleAr, value: element._id, key: element._id
                })
              });
              typesAr.unshift({
                label: 'أختر النوع', value: '1', key: '1'
              })

            } else {
              types.forEach(element => {
                typesAr.push({
                  label: element.titleEN, value: element._id, key: element._id
                })
              });
              typesAr.unshift({
                label: 'Choose type', value: '1', key: '1'
              })

            }
            this.setState({ types: typesAr });

          })
          .catch((error) => {
            alert("" + { error });

          });

      } else {

        if (this.state.lang.indexOf('ar') != -1) {
          this.setState({ flag_lang: 1 });
          alert('عذرا لا يوجد اتصال بالانترنت');
        } else {
          this.setState({ flag_lang: 1 });
          alert('No internet connection!')
        }

      }
    })
  }

  getFlagAddCar = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        fetch('http://134.209.178.237/api/user/checkAddCar')
          .then((response) => response.json())
          .then((responseJson) => {
            const res = responseJson.value;

            this.setState({ flag_add_car: res })
          })
          .catch((error) => {
            alert("" + { error });

          });

      } else {

        if (this.state.lang.indexOf('ar') != -1) {
          this.setState({ flag_lang: 1 });
          alert('عذرا لا يوجد اتصال بالانترنت');
        } else {
          this.setState({ flag_lang: 1 });
          alert('No internet connection!')
        }

      }
    })
  }

  validate = () => {
    // resumeeeee 
    const errors = {};
    if (!this.state.catID) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('يرجي اختيار الفئه');
      }
      else {
        // this.setState({flag:1});
        alert(' Choose Category First ');
      }
      errors.categoryID = "CategoryID is requied ";
    }
    else if (!this.state.typeID) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('يرجي ادخال نوع السيارة ');
      }
      else {
        // this.setState({flag:1});
        alert('  Enter Car Type ');
      }
      errors.carTypeID = "typeID is requied ";
    }
    else if (!this.state.modeleID) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('ادخل   موديل السيارة');
      }
      else {
        // this.setState({flag:1});
        alert('  Enter Car Model ');
      }
      errors.carModelID = "modeleID is requied ";
    }
  
    else if (!this.state.img1 && !this.state.img2 && !this.state.img3&& !this.state.img4) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('   يرجي اختبار  صوره علي الاقل');
      }
      else {
        // this.setState({flag:1});
        alert('Choose  One Image at Least');
      }
      errors.img1 = "img1 is requied ";
    }
    else if (!this.state.startDate) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert(' يرجي  ادخال  تاريخ البدء   ');
      }
      else {
        // this.setState({flag:1});
        alert(' Plase  Enter   Start Date ');
      }
      errors.startDate = "startDate is requied ";
    }
    else if (!this.state.endDate) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('يرجي ادخال تاريخ الانهاء ');
      }
      else {
        // this.setState({flag:1});
        alert(' Plase Enter End Date ');
      }
      errors.endDate = "endDate is requied ";
    }
   
    else if (!this.state.price) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('يرجي ادخال السعر ');
      }
      else {
        // this.setState({flag:1});
        alert(' Plase Enter  the Price ');
      }
      errors.rentPrice = "rentPrice is requied ";
    }
    else if (this.state.price == 0) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('يرجي ادخال السعر بطريقه صحيحه ');
      }
      else {
        // this.setState({flag:1});
        alert(' Plase Enter  the  Correct Price ');
      }
      errors.rentPrice = "rentPrice is requied ";
    }
    else if (this.state.insurance == 0) {
      if (this.state.lang.indexOf('ar') != -1) {
        // this.setState({flag:1});
        alert('يرجي ادخال السعر  التأمين ');
      }
      else {
        // this.setState({flag:1});
        alert(' Plase Enter  the  insurance Price ');
      }
      errors.rentPrice = "rentPrice is requied ";
    }
   
    return errors;

  }

 
  uploadLogo = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        const options = {
          title: this.state.lang.indexOf('ar') != -1 ? 'أختار اللوجو' : 'Select Logo',
          cancelButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'الغاء ' : 'Cancel',
          takePhotoButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'كاميرا ' : 'Camera',
          chooseFromLibraryButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'معرض الصور ' : 'Gallery ',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        ImagePicker.showImagePicker(options, (response) => {
          if (response.didCancel) {
            if (this.state.lang.indexOf('ar') != -1) {
              alert('تم الغاء رفع الصورة');
            }
            else {

              alert('upload image cancel');
            }
          } else if (response.error) {
            if (this.state.lang.indexOf('ar') != -1) {

              alert("حدث خطأ ما");
            }
            else {

              alert("Opps !!");
            }
          } else if (response.customButton) {
            if (this.state.lang.indexOf('ar') != -1) {

              alert("حدث خطأ ما");
            }
            else {

              alert("Opps !!");
            }
          } else {
            const source = { uri: response.uri };
            const data = new FormData();
            // this.setState({
            //    peronalImg: { uri: response.uri }
            // });

            data.append('name', 'testName'); // you can append anyone.
            data.append('photo', {
              uri: source.uri,
              type: 'image/jpeg', // or photo.type
              name: 'testPhotoName'
            });
            fetch('http://134.209.178.237/api/user/uploadFile', {
              method: 'post',
              body: data
            }).then((res) => {
              return res.text()
            })
              .then((text) => {
                this.setState({
                  car_Img: text
                });
                this.setState({
                  carLogo: text
                });

                // alert('text'+text);
                if (this.state.lang.indexOf('ar') != -1) {
                  this.setState({ flag: 1 });
                  alert("تم رفع الملف بنجاح");
                }
                else {
                  this.setState({ flag: 1 });
                  alert("file added successfully ");
                }

              });
          }
        });
      } else {
        if (this.state.lang.indexOf('ar') != -1) {
          this.setState({ flag_lang: 1 });
          alert('عذرا لا يوجد اتصال بالانترنت');
        } else {
          this.setState({ flag_lang: 1 });
          alert('No internet connection!')
        }
      }
    })

  }
  uploadImg1 = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        const options = {
          title: this.state.lang.indexOf('ar') != -1 ? 'أختار صورة' : 'Select Image',
          cancelButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'الغاء ' : 'Cancel',
          takePhotoButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'كاميرا ' : 'Camera',
          chooseFromLibraryButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'معرض الصور ' : 'Gallery ',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        ImagePicker.showImagePicker(options, (response) => {
          if (response.didCancel) {
            if (this.state.lang.indexOf('ar') != -1) {
              alert('تم الغاء رفع الصورة');
            }
            else {

              alert('upload image cancel');
            }
          } else if (response.error) {
            if (this.state.lang.indexOf('ar') != -1) {

              alert("حدث خطأ ما");
            }
            else {

              alert("Opps !!");
            }
          } else if (response.customButton) {
            if (this.state.lang.indexOf('ar') != -1) {

              alert("حدث خطأ ما");
            }
            else {

              alert("Opps !!");
            }
          } else {
            const source = { uri: response.uri };
            const data = new FormData();
            // this.setState({
            //    peronalImg: { uri: response.uri }
            // });

            data.append('name', 'testName'); // you can append anyone.
            data.append('photo', {
              uri: source.uri,
              type: 'image/jpeg', // or photo.type
              name: 'testPhotoName'
            });
            fetch('http://134.209.178.237/api/user/uploadFile', {
              method: 'post',
              body: data
            }).then((res) => {
              return res.text()
            })
              .then((text) => {
                this.setState({
                  img1: text
                });
                this.setState({
                  image1: text
                });
                this.setState({
                  car_Img: text
                });
         if(!this.state.image1 && !this.state.image2 && !this.state.image3 && !this.state.image4){
          this.setState({flag_more_addImg:0})
         }
                if (this.state.lang.indexOf('ar') != -1) {
                  this.setState({ flag: 1 });
                  alert("تم رفع الملف بنجاح");
                }
                else {
                  this.setState({ flag: 1 });
                  alert("file added successfully ");
                }

              });
          }
        });
      } else {
        if (this.state.lang.indexOf('ar') != -1) {
          this.setState({ flag_lang: 1 });
          alert('عذرا لا يوجد اتصال بالانترنت');
        } else {
          this.setState({ flag_lang: 1 });
          alert('No internet connection!')
        }
      }
    })

  }
  uploadImg2 = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        const options = {
          title: this.state.lang.indexOf('ar') != -1 ? 'أختار صورة' : 'Select Image',
          cancelButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'الغاء ' : 'Cancel',
          takePhotoButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'كاميرا ' : 'Camera',
          chooseFromLibraryButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'معرض الصور ' : 'Gallery ',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        ImagePicker.showImagePicker(options, (response) => {
          if (response.didCancel) {
            if (this.state.lang.indexOf('ar') != -1) {
              alert('تم الغاء رفع الصورة');
            }
            else {

              alert('upload image cancel');
            }
          } else if (response.error) {
            if (this.state.lang.indexOf('ar') != -1) {

              alert("حدث خطأ ما");
            }
            else {

              alert("Opps !!");
            }
          } else if (response.customButton) {
            if (this.state.lang.indexOf('ar') != -1) {

              alert("حدث خطأ ما");
            }
            else {

              alert("Opps !!");
            }
          } else {
            const source = { uri: response.uri };
            const data = new FormData();
            // this.setState({
            //    peronalImg: { uri: response.uri }
            // });

            data.append('name', 'testName'); // you can append anyone.
            data.append('photo', {
              uri: source.uri,
              type: 'image/jpeg', // or photo.type
              name: 'testPhotoName'
            });
            fetch('http://134.209.178.237/api/user/uploadFile', {
              method: 'post',
              body: data
            }).then((res) => {
              return res.text()
            })
              .then((text) => {
                this.setState({
                  img2: text
                });
                this.setState({
                  image2: text
                });
                this.setState({
                  car_Img: text
                });

                if(!this.state.image1 && !this.state.image2 && !this.state.image3 && !this.state.image4){
                  this.setState({flag_more_addImg:0})
                 }                
                 if (this.state.lang.indexOf('ar') != -1) {
                  this.setState({ flag: 1 });
                  alert("تم رفع الملف بنجاح");
                }
                else {
                  this.setState({ flag: 1 });
                  alert("file added successfully ");
                }

              });
          }
        });
      } else {
        if (this.state.lang.indexOf('ar') != -1) {
          this.setState({ flag_lang: 1 });
          alert('عذرا لا يوجد اتصال بالانترنت');
        } else {
          this.setState({ flag_lang: 1 });
          alert('No internet connection!')
        }
      }
    })

  }
  uploadImg3 = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        const options = {
          title: this.state.lang.indexOf('ar') != -1 ? 'أختار صورة' : 'Select Image',
          cancelButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'الغاء ' : 'Cancel',
          takePhotoButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'كاميرا ' : 'Camera',
          chooseFromLibraryButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'معرض الصور ' : 'Gallery ',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        ImagePicker.showImagePicker(options, (response) => {
          if (response.didCancel) {
            if (this.state.lang.indexOf('ar') != -1) {
              alert('تم الغاء رفع الصورة');
            }
            else {

              alert('upload image cancel');
            }
          } else if (response.error) {
            if (this.state.lang.indexOf('ar') != -1) {

              alert("حدث خطأ ما");
            }
            else {

              alert("Opps !!");
            }
          } else if (response.customButton) {
            if (this.state.lang.indexOf('ar') != -1) {

              alert("حدث خطأ ما");
            }
            else {

              alert("Opps !!");
            }
          } else {
            const source = { uri: response.uri };
            const data = new FormData();
            // this.setState({
            //    peronalImg: { uri: response.uri }
            // });

            data.append('name', 'testName'); // you can append anyone.
            data.append('photo', {
              uri: source.uri,
              type: 'image/jpeg', // or photo.type
              name: 'testPhotoName'
            });
            fetch('http://134.209.178.237/api/user/uploadFile', {
              method: 'post',
              body: data
            }).then((res) => {
              return res.text()
            })
              .then((text) => {
                this.setState({
                  img3: text
                });
                this.setState({
                  image3: text
                });
                this.setState({
                  car_Img: text
                });
                if(!this.state.image1 && !this.state.image2 && !this.state.image3 && !this.state.image4){
                  this.setState({flag_more_addImg:0})
                 }                
                 if (this.state.lang.indexOf('ar') != -1) {
                  this.setState({ flag: 1 });
                  alert("تم رفع الملف بنجاح");
                }
                else {
                  this.setState({ flag: 1 });
                  alert("file added successfully ");
                }

              });
          }
        });
      } else {
        if (this.state.lang.indexOf('ar') != -1) {
          this.setState({ flag_lang: 1 });
          alert('عذرا لا يوجد اتصال بالانترنت');
        } else {
          this.setState({ flag_lang: 1 });
          alert('No internet connection!')
        }
      }
    })

  }
  uploadImg4 = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        const options = {
          title: this.state.lang.indexOf('ar') != -1 ? 'أختار صورة' : 'Select Image',
          cancelButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'الغاء ' : 'Cancel',
          takePhotoButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'كاميرا ' : 'Camera',
          chooseFromLibraryButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'معرض الصور ' : 'Gallery ',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        ImagePicker.showImagePicker(options, (response) => {
          if (response.didCancel) {
            if (this.state.lang.indexOf('ar') != -1) {
              alert('تم الغاء رفع الصورة');
            }
            else {

              alert('upload image cancel');
            }
          } else if (response.error) {
            if (this.state.lang.indexOf('ar') != -1) {

              alert("حدث خطأ ما");
            }
            else {

              alert("Opps !!");
            }
          } else if (response.customButton) {
            if (this.state.lang.indexOf('ar') != -1) {

              alert("حدث خطأ ما");
            }
            else {

              alert("Opps !!");
            }
          } else {
            const source = { uri: response.uri };
            const data = new FormData();
            // this.setState({
            //    peronalImg: { uri: response.uri }
            // });

            data.append('name', 'testName'); // you can append anyone.
            data.append('photo', {
              uri: source.uri,
              type: 'image/jpeg', // or photo.type
              name: 'testPhotoName'
            });
            fetch('http://134.209.178.237/api/user/uploadFile', {
              method: 'post',
              body: data
            }).then((res) => {
              return res.text()
            })
              .then((text) => {
                this.setState({
                  img4: text
                });
                this.setState({
                  image4: text
                });
                this.setState({
                  car_Img: text
                });
                if(!this.state.image1 && !this.state.image2 && !this.state.image3 && !this.state.image4){
                  this.setState({flag_more_addImg:0})
                 }                
                 if (this.state.lang.indexOf('ar') != -1) {
                  this.setState({ flag: 1 });
                  alert("تم رفع الملف بنجاح");
                }
                else {
                  this.setState({ flag: 1 });
                  alert("file added successfully ");
                }

              });
          }
        });
      } else {
        if (this.state.lang.indexOf('ar') != -1) {
          this.setState({ flag_lang: 1 });
          alert('عذرا لا يوجد اتصال بالانترنت');
        } else {
          this.setState({ flag_lang: 1 });
          alert('No internet connection!')
        }
      }
    })

  }
  uploadImg5 = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        const options = {
          title: this.state.lang.indexOf('ar') != -1 ? 'أختار صورة' : 'Select Image',
          cancelButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'الغاء ' : 'Cancel',
          takePhotoButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'كاميرا ' : 'Camera',
          chooseFromLibraryButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'معرض الصور ' : 'Gallery ',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        ImagePicker.showImagePicker(options, (response) => {
          if (response.didCancel) {
            if (this.state.lang.indexOf('ar') != -1) {
              alert('تم الغاء رفع الصورة');
            }
            else {

              alert('upload image cancel');
            }
          } else if (response.error) {
            if (this.state.lang.indexOf('ar') != -1) {

              alert("حدث خطأ ما");
            }
            else {

              alert("Opps !!");
            }
          } else if (response.customButton) {
            if (this.state.lang.indexOf('ar') != -1) {

              alert("حدث خطأ ما");
            }
            else {

              alert("Opps !!");
            }
          } else {
            const source = { uri: response.uri };
            const data = new FormData();
            // this.setState({
            //    peronalImg: { uri: response.uri }
            // });

            data.append('name', 'testName'); // you can append anyone.
            data.append('photo', {
              uri: source.uri,
              type: 'image/jpeg', // or photo.type
              name: 'testPhotoName'
            });
            fetch('http://134.209.178.237/api/user/uploadFile', {
              method: 'post',
              body: data
            }).then((res) => {
              return res.text()
            })
              .then((text) => {
                this.setState({
                  img5: text
                });
                this.setState({
                  image5: text
                });

                // alert('text'+text);
                if (this.state.lang.indexOf('ar') != -1) {
                  this.setState({ flag: 1 });
                  alert("تم رفع الملف بنجاح");
                }
                else {
                  this.setState({ flag: 1 });
                  alert("file added successfully ");
                }

              });
          }
        });
      } else {
        if (this.state.lang.indexOf('ar') != -1) {
          this.setState({ flag_lang: 1 });
          alert('عذرا لا يوجد اتصال بالانترنت');
        } else {
          this.setState({ flag_lang: 1 });
          alert('No internet connection!')
        }
      }
    })

  }
  uploadImg6 = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        const options = {
          title: this.state.lang.indexOf('ar') != -1 ? 'أختار صورة' : 'Select Image',
          cancelButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'الغاء ' : 'Cancel',
          takePhotoButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'كاميرا ' : 'Camera',
          chooseFromLibraryButtonTitle: this.state.lang.indexOf('ar') != -1 ? 'معرض الصور ' : 'Gallery ',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        ImagePicker.showImagePicker(options, (response) => {
          if (response.didCancel) {
            if (this.state.lang.indexOf('ar') != -1) {
              alert('تم الغاء رفع الصورة');
            }
            else {

              alert('upload image cancel');
            }
          } else if (response.error) {
            if (this.state.lang.indexOf('ar') != -1) {

              alert("حدث خطأ ما");
            }
            else {

              alert("Opps !!");
            }
          } else if (response.customButton) {
            if (this.state.lang.indexOf('ar') != -1) {

              alert("حدث خطأ ما");
            }
            else {

              alert("Opps !!");
            }
          } else {
            const source = { uri: response.uri };
            const data = new FormData();
            // this.setState({
            //    peronalImg: { uri: response.uri }
            // });

            data.append('name', 'testName'); // you can append anyone.
            data.append('photo', {
              uri: source.uri,
              type: 'image/jpeg', // or photo.type
              name: 'testPhotoName'
            });
            fetch('http://134.209.178.237/api/user/uploadFile', {
              method: 'post',
              body: data
            }).then((res) => {
              return res.text()
            })
              .then((text) => {
                this.setState({
                  img6: text
                });
                this.setState({
                  image6: text
                });

                // alert('text'+text);
                if (this.state.lang.indexOf('ar') != -1) {
                  this.setState({ flag: 1 });
                  alert("تم رفع الملف بنجاح");
                }
                else {
                  this.setState({ flag: 1 });
                  alert("file added successfully ");
                }

              });
          }
        });
      } else {
        if (this.state.lang.indexOf('ar') != -1) {
          this.setState({ flag_lang: 1 });
          alert('عذرا لا يوجد اتصال بالانترنت');
        } else {
          this.setState({ flag_lang: 1 });
          alert('No internet connection!')
        }
      }
    })

  }
  onAdd = async () => {
    this.setState({ flag_lang: 0 })
    const value = await AsyncStorage.getItem('loginDataKayan');
    if (value) {
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              const errors = this.validate();
              this.setState({ errors });
              if (Object.keys(errors).length === 0) {
                this.setState({ flag: 0 });
                axios.post("http://134.209.178.237/api/user/car", {
                logo: this.state.car_Img,
                img1: this.state.img1,
                img2: this.state.img2,
                img3: this.state.img3,
                img4: this.state.img4,
                img5: this.state.img5,
                img6: this.state.img6,
                categoryID: this.state.catID,
                userID: this.state.userId,
                carModelID: this.state.modeleID,
                carTypeID: this.state.typeID,
                personNum: this.state.men,
                automatic: this.state.speed,
                doorsNum: this.state.door,
                bagsNum: this.state.bag,
                description: this.state.notes,
                abs: this.state.abs,
                bluetooth: this.state.bluetooth,
                centralLock: this.state.centralLock,
                electriGlass: this.state.electriGlass,
                sportTrims: this.state.sportTrims,
                cdPlayer: this.state.cdPlayer,
                cruiseControl: this.state.cruiseControl,
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                rentPrice: this.state.price,
                insurance:this.state.insurance
               
                }).then((responseJson) => {
                    if (responseJson.data._id) {
                      if (this.state.lang.indexOf('ar') != -1) {
                        this.refs.modal.open()
                        alert(' تم اضافه السيارة بنجاح ');
                        this.setState({ flag_lang: 1 });
                        this.setState({ flag_design: 0 })
                      }
                      else {
                        this.refs.modal.open()
                        alert(' Car Added Successfully ');
                        this.setState({ flag_lang: 1 });
                        this.setState({ flag_design: 0 })
                      }
                    }
                    else {
                      if (this.state.lang.indexOf('ar') != -1) {
                        this.setState({ flag_lang: 1 });
                        alert("حدث خطأ ما");
                      }
                      else {
                        this.setState({ flag_lang: 1 });
                        alert("Opps !!");
                      }

                    }
                  })
                  .catch((error) => {
                    console.error(error);
                    alert('error' + error);
                    this.setState({ flag_lang: 1 })
                  });
              }
              else {
                this.setState({ flag_lang: 1 });
              }
            } else {
              if (this.state.lang.indexOf('ar') != -1) {
                this.setState({ flag_lang: 1 });
                alert('لايوجد اتصال بالانترنت');
              }
              else {
                this.setState({ flag_lang: 1 });
                alert('No Internet Connection ');
              }
            }
          })
    } else {
      this.setState({ flag_lang: 1 });
      Alert.alert(
        this.state.lang.indexOf('ar') != -1 ? 'كايان' : 'Kayan',
        this.state.lang.indexOf('ar') != -1 ? 'يجب تسجيل الدخول أولا' : 'you Must Login First',

        [
          {
            text: this.state.lang.indexOf('ar') != -1 ? 'إلغاء' : 'Cancel'
            , onPress: () => this.dismiss, style: 'cancel'
          },
          {
            text: this.state.lang.indexOf('ar') != -1 ? ' تسجيل الدخول' : 'login Now', onPress: () => {
              try {
                const { navigation } = this.props;
                navigation.push('Login');


              } catch (e) { }
            }

          },
        ],
        { cancelable: true }

      )
      return true;
    }

  }


  renderOption() {
    return (
      <View style={{ width: '100%', height: '8%', alignItems: 'center', justifyContent: 'center', }}>
        {this.state.lang.indexOf('ar') != -1 ?

          <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row-reverse', backgroundColor: '#C8972C',  }}>

            <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}
              style={{ width:'13%',height:'100%',alignItems:'center',justifyContent:'center' }}>
              <Image resizeMode={'cover'} source={require('../img/nav.png')}
                style={{ width: 25, height: 25, alignItems: 'center' }} />
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', width: '74%', fontSize: 20,color: "#fff", fontFamily:'segoe'  }}>
              {this.state.lang.indexOf('ar') != -1 ? 'اضافه سيارة' : 'Add car'}
            </Text>

            <TouchableOpacity onPress={() => {
              this.props.navigation.goBack()
            }}
              style={{ width:'13%',height:'100%',alignItems:'center',justifyContent:'center' }}>
                <Image resizeMode={'cover'} source={require('../img/w_arrow.png')}
                style={{ width: 10, height: 18, alignItems: 'center', }} />
            </TouchableOpacity>

          </View>
          :
          <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row-reverse', backgroundColor: '#C8972C',  }}>
            <TouchableOpacity onPress={() => {
              this.props.navigation.goBack()
            }}
              style={{ width:'13%',height:'100%',alignItems:'center',justifyContent:'center' }}>
             <Image resizeMode={'cover'} source={require('../img/r_back.png')}
                style={{ width: 10, height: 18, alignItems: 'center', }} />
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', width: '74%', fontSize: 22, color: "#fff", fontFamily:'segoe'  }}>
              {this.state.lang.indexOf('ar') != -1 ? 'اضافه سيارة' : 'Add car'}
            </Text>

            <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}
              style={{ width:'13%',height:'100%',alignItems:'center',justifyContent:'center' }}>
              <Image resizeMode={'cover'} source={require('../img/nav.png')}
                style={{ width: 25, height: 25, alignItems: 'center' }} />

            </TouchableOpacity>

          </View>

        }
      </View>
    )
  }
  
  renderItem(item){
    return (
      <TouchableOpacity
      onPress={ async()=>{
        this.setState({checked: !this.state.checked});
       }}
      style={[{backgroundColor: '#FFFFFF',borderRadius:5,marginVertical:3}]}>
         <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:'100%',alignItems:'center',justifyContent:'center'}]} >
          <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{flex:1,fontSize: 14,textAlign:'center',color:'#707070', margin:3,fontFamily:'segoe',}]}>
                 Gps</Text>
                 <CheckBox
                  checkedIcon={<Image style={{width:25,height:25}} source={require('../img/checked.png')} />}
                  uncheckedIcon={<Image style={{width:25,height:25}} source={require('../img/unchecked.png')} />}
                checked={this.state.checked}
                onPress={() =>{
                   this.setState({checked: !this.state.checked});
                  }}
                 />
         </View>
         
      </TouchableOpacity>
    );
  }

  render() {
   
    return (
      <SafeAreaView style={{ backgroundColor:'#FFF', width: '100%', height: '100%', alignItems: 'center', }}>
        {this.renderOption()}
        {this.state.flag_lang == 0 ?
          <ActivityIndicator
          color='#C8972C'
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center',}}/>
          :

          <ScrollView style={{ width: '100%', flex: 1 }}>
              <View style={{ width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {this.state.flag_add_car != 1 ?

                  <Text style={{
                    width: '90%', alignSelf: "center", justifyContent: 'center', textAlign: 'center', margin: 7, color: '#000',
                    borderRadius: 10, borderWidth: 1, borderColor: '#000', padding: 7, marginTop: 20, fontSize: 17
                  }}>
                    {this.state.lang.indexOf('ar') != -1 ? " عفوا لا يوجد اضافه سيارة في هذا الوقت الحالي , حاول في وقت اخر " :
                      " Sorry no add car in this time , Please try again another time"}
                  </Text>
                  :
                  
                <View style={{ width: width, alignItems: 'center', justifyContent:'center' }}>

                <View style={{width:'95%',flexDirection:'row',marginTop:10,justifyContent:'center',alignItems:'center'}}>
                 <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-start'}}></View>
                 <Text style={{ width: '40%', textAlign: 'center', color: '#414141', fontSize: 16,fontFamily:'segoe'}}>
                          {this.state.lang.indexOf('ar') != -1 ? "معلومات السيارة " : "Car information"}
                        </Text>
                  <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-end'}}></View>
               </View>



                <View style={[styles.shadow,{width: '95%', alignItems: 'center',backgroundColor:'#F8F8F8',borderRadius:5,marginTop:10}]}>
             

                <View style={[this.state.lang === 'ar'?styles.row:styles.row_res,{ width: '95%',height: height*0.07, justifyContent: 'center', alignItems: 'center', marginTop: 7 }]}>
                  <View style={[styles.shadow,this.state.lang === 'ar'?styles.row:styles.row_res,{ width:'70%',height:'100%',alignItems:'center',borderRadius:5,justifyContent:'center',backgroundColor:'#FFFFFF'}]}>
                  <Icon name="caret-down" size={18} color="#707070" style={{margin:10}} />
                           <View style={{flex:1}}>
                              <Picker
                                style={{ alignItems: 'center', color: this.state.packerColor1, justifyContent: 'center',backgroundColor:'transparent' }}
                                itemStyle={{ backgroundColor: '#000', fontSize: 14, }}
                                onValueChange={(catID) => {
                                  this.setState({ catID })

                                  if (catID != 1) {
                                    this.setState({ packerColor1: '#343434' })
                                    this.getSubCategory(catID);
                                  } else {
                                    this.setState({ packerColor1: '#70707037' })
                                    if (this.state.lang.indexOf('ar') != -1) {

                                      alert('اختر الفئه اولا');
                                    }
                                    else {

                                      alert(' Choose Category First ');
                                    }
                                  }

                                }}

                                mode="dropdown" selectedValue={this.state.catID?this.state.catID:'1'} >
                                {this.state.categories.map((i, index) => (
                                  <Picker.Item
                                    label={i.label} value={i.value} key={i.value} />
                                ))}
                              </Picker>
                              </View>
                            </View>
                            <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{  width:'30%',color: '#707070', fontSize: 14,fontFamily:'segoe' }]}>
                              {this.state.lang.indexOf('ar') != -1 ? "الفئه " : "Category "}
                            </Text>
                          </View>
             
                 <View style={[this.state.lang === 'ar'?styles.row:styles.row_res,{ width: '95%',height: height*0.07, justifyContent: 'center', alignItems: 'center', marginTop: 7 }]}>
                  <View style={[styles.shadow,this.state.lang === 'ar'?styles.row:styles.row_res,{ width:'70%',height:'100%',alignItems:'center',borderRadius:5,justifyContent:'center',backgroundColor:'#FFFFFF'}]}>
                  <Icon name="caret-down" size={18} color="#707070" style={{margin:10}} />
                           <View style={{flex:1}}>
                           <Picker
                                style={{ width: '100%', alignItems: 'center', color: this.state.packerColor5, justifyContent: 'center',backgroundColor:'transparent' }}
                                itemStyle={{ backgroundColor: '#000', fontSize: 14 }}
                                onValueChange={(typeID) => {
                                  this.setState({ typeID })
                                  if (typeID != 1) {
                                    this.setState({ packerColor5: '#343434' })

                                  } else {
                                    this.setState({ packerColor5: '#70707037' })
                                  }
                                }}

                                mode="dropdown" selectedValue={this.state.typeID?this.state.typeID:'1'} >
                                {this.state.types.map((i, index) => (
                                  <Picker.Item
                                    label={i.label} value={i.value} key={i.value} />
                                ))}
                              </Picker>
                              </View>
                            </View>
                            <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{ width: '30%', color: '#707070', fontSize: 14, fontFamily:'segoe' }]}>
                              {this.state.lang.indexOf('ar') != -1 ? "نوع السيارة " : "Car Type "}
                            </Text>
                          </View>

            
                  <View style={[this.state.lang === 'ar'?styles.row:styles.row_res,{ width: '95%',height: height*0.07, justifyContent: 'center', alignItems: 'center', marginTop: 7 }]}>
                  <View style={[styles.shadow,this.state.lang === 'ar'?styles.row:styles.row_res,{ width:'70%',height:'100%',alignItems:'center',borderRadius:5,justifyContent:'center',backgroundColor:'#FFFFFF'}]}>
                  <Icon name="caret-down" size={18} color="#707070" style={{margin:10}}/>
                           <View style={{flex:1}}>
                           <Picker
                                style={{ width: '100%', alignItems: 'center', color: this.state.packerColor3, justifyContent: 'center',backgroundColor:'transparent' }}
                                itemStyle={{ backgroundColor: '#000', fontSize: 14 }}
                                onValueChange={(modeleID) => {
                                  this.setState({ modeleID })
                                  if (modeleID != 1) {
                                    this.setState({ packerColor3: '#343434' })

                                  } else {
                                    this.setState({ packerColor3: '#70707037' })
                                  }
                                }}

                                mode="dropdown" selectedValue={this.state.modeleID?this.state.modeleID:'1'} >
                                {this.state.modeles.map((i, index) => (
                                  <Picker.Item
                                    label={i.label} value={i.value} key={i.value} />
                                ))}
                              </Picker>
                              </View>
                            </View>
                            <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{ width: '30%', color: '#707070', fontSize: 14,fontFamily:'segoe' }]}>
                              {this.state.lang.indexOf('ar') != -1 ? "موديل السيارة " : "Car Model "}
                            </Text>
                          </View>
           
           
           
              <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{width:width*0.9,color: '#707070', fontSize: 14,fontFamily:"segoe",marginTop:10,}]}>
             {this.state.lang === 'ar'? 'أختر الأعداد':'Choose the numbers'}</Text>  
              <View style={[this.state.lang.indexOf('ar')!=-1?styles.row :styles.row_res ,{ width:'97%',height:height*0.06,justifyContent:'center',alignItems:"center",marginTop:3,}]}>
              <View style={{flex:1,margin:3,height:'100%',borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE',}}>
             <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#AEAEAE',}}>
             <ModalDropdown
                   options={this.state.picker_door} // data
                   defaultValue={'1'}
                   onSelect={(index, value) => { 
                     this.setState({ door: value.value }) 
                    }}
                   
                   renderButtonText={(rowData) => (rowData.label)} // ba3d ma t5tar
                   style={{ width:'50%' }} // abl ma t5tar
                   textStyle={{ textAlign: 'left', fontSize: 13, color: '#000',fontWeight:'bold' }}
                    dropdownStyle={{ width: 50, alignSelf: 'center', height: 100, borderColor: '#D7D7D7', borderWidth: 1, borderRadius: 3, }}
                   renderRow={function (rowData, rowID, highlighted) {
                    return (
                     <View style={[ { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 40, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                     <Text style={[{ fontSize: 14, color: '#000', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                      {/* {this.state.lang==='ar'?rowData.titleAr:rowData.titleEN} */}
                      {rowData.label}
                       </Text>
                        </View>
                      );
                      }.bind(this)}
                      />
             </View>
              <View style={{width:'50%',height: '100%',backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',position:'absolute',top:0,right:0}}>
                <Image
                  source={require('../img/dd.png')} style={{width:25, height: 25,}}>
                </Image>
              </View>
              </View>
              <View style={{flex:1,margin:3,height:'100%',borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE',}}>
              <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#AEAEAE'}}>
              <ModalDropdown
                   options={this.state.picker_bag} // data
                   defaultValue={'1'}
                   onSelect={(index, value) => { 
                     this.setState({ bag: value.value }) 
                    }}
                   
                   renderButtonText={(rowData) => (rowData.label)} // ba3d ma t5tar
                   style={{ width:'50%' }} // abl ma t5tar
                   textStyle={{ textAlign: 'left', fontSize: 13, color: '#000',fontWeight:'bold' }}
                    dropdownStyle={{ width: 50, alignSelf: 'center', height: 100, borderColor: '#D7D7D7', borderWidth: 1, borderRadius: 3, }}
                   renderRow={function (rowData, rowID, highlighted) {
                    return (
                     <View style={[ { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 40, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                     <Text style={[{ fontSize: 14, color: '#000', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                      {/* {this.state.lang==='ar'?rowData.titleAr:rowData.titleEN} */}
                      {rowData.label}
                       </Text>
                        </View>
                      );
                      }.bind(this)}
                      />
             </View>
              <View style={{width:'50%',height: '100%',backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',position:'absolute',top:0,right:0}}>
                <Image
                  source={require('../img/sh.png')} style={{width:25, height: 25,}}>
                </Image>
              </View>
              </View>
              <View style={{flex:1,margin:3,height:'100%',borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE',}}>
              <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#AEAEAE'}}>
              <ModalDropdown
                   options={this.state.picker_speed} // data
                   defaultValue={'A'}
                   onSelect={(index, value) => { 
                     this.setState({ speed: value.value }) 
                    }}
                   
                   renderButtonText={(rowData) => (rowData.label)} // ba3d ma t5tar
                   style={{ width:'50%' }} // abl ma t5tar
                   textStyle={{ textAlign: 'left', fontSize: 13, color: '#000',fontWeight:'bold' }}
                    dropdownStyle={{ width: 50, alignSelf: 'center', height: 100, borderColor: '#D7D7D7', borderWidth: 1, borderRadius: 3, }}
                   renderRow={function (rowData, rowID, highlighted) {
                    return (
                     <View style={[ { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 40, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                     <Text style={[{ fontSize: 14, color: '#000', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                      {/* {this.state.lang==='ar'?rowData.titleAr:rowData.titleEN} */}
                      {rowData.label}
                       </Text>
                        </View>
                      );
                      }.bind(this)}
                      />
             </View>
              <View style={{width:'50%',height: '100%',backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',position:'absolute',top:0,right:0}}>
                <Image
                  source={require('../img/ma.png')} style={{width:25, height: 25,}}>
                </Image>
              </View>
              </View>
              <View style={{flex:1,margin:3,height:'100%',borderRadius:5,borderColor:'#AEAEAE',borderWidth:1,alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE',}}>
              <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'#AEAEAE',borderRadius:5,}}>
              <ModalDropdown
                   options={this.state.picker_men} // data
                   defaultValue={'1'}
                   onSelect={(index, value) => { 
                     this.setState({ men: value.value }) 
                    }}
                   
                   renderButtonText={(rowData) => (rowData.label)} // ba3d ma t5tar
                   style={{ width:'50%' }} // abl ma t5tar
                   textStyle={{ textAlign: 'left', fontSize: 13, color: '#000',fontWeight:'bold' }}
                    dropdownStyle={{ width: 50, alignSelf: 'center', height: 200, borderColor: '#D7D7D7', borderWidth: 1, borderRadius: 3, }}
                   renderRow={function (rowData, rowID, highlighted) {
                    return (
                     <View style={[ { backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', height: 40, borderBottomWidth: 0.5, borderBottomColor: "#D7D7D7", }]}>
                     <Text style={[{ fontSize: 14, color: '#000', textAlign: 'center' }, highlighted && { color: '#000' }]}>
                      {/* {this.state.lang==='ar'?rowData.titleAr:rowData.titleEN} */}
                      {rowData.label}
                       </Text>
                        </View>
                      );
                      }.bind(this)}
                      />
             </View>
              <View style={{width:'50%',height: '100%',backgroundColor:'#fff',borderRadius:5,alignItems:'center',justifyContent:'center',position:'absolute',top:0,right:0}}>
                <Image
                  source={require('../img/us.png')} style={{width:25, height: 25,}}>
                </Image>
              </View>
              </View>
            </View>

            <Text style={[this.state.lang === 'ar' ? styles.right : styles.left,{ width: width*0.9, color: '#707070', fontSize: 14, fontFamily: "segoe", marginTop: 10 }]}>
            {this.state.lang === 'ar' ? 'الوصف' : 'Description'}</Text>
              <TextInput
                underlineColorAndroid="transparent"
                onChangeText={(notes) => this.setState({ notes })}
                multiline
                placeholder={this.state.lang.indexOf('ar') != -1 ? 'أكتب الوصف هنا' : ' write here'}
                placeholderTextColor="#DCDCDC"
                style={[styles.shadow,styles.input,this.state.lang ==='ar'?styles.right:styles.left,{ height: 90,}]}
                 ></TextInput> 
              </View>

               <View style={{width:'95%',flexDirection:'row',marginTop:10,justifyContent:'center',alignItems:'center'}}>
                 <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-start'}}></View>
                 <Text style={{ width: '40%', textAlign: 'center', color: '#414141', fontSize: 16,fontFamily:'segoe'}}>
                          {this.state.lang.indexOf('ar') != -1 ? "صور السيارة " : "Car images"}
                        </Text>
                  <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-end'}}></View>
               </View>
               <View style={[styles.shadow,{ width: width*0.95,backgroundColor:'#F8F8F8',borderRadius:5,marginTop:10,alignItems:'center'}]}>
               <Text style={[this.state.lang === 'ar' ? styles.right : styles.left, { width: width*0.9, color: '#707070', fontSize: 14, fontFamily: "segoe", marginTop: 10 }]}>
                {this.state.lang === 'ar' ? 'حمل صور السيارة' : 'Upload car images'}</Text>
              {this.state.flag_addImg === 0 ?
               <TouchableOpacity
               onPress={() => {
                this.setState({ flag_addImg: 1 })
              }}
               style={[styles.viewItem,this.state.lang ==='ar'?styles.end:styles.start,{overflow: 'hidden',backgroundColor: '#FFF',elevation:3,borderRadius:10,margin:10}]}>
              <Image
                 resizeMode ="cover"
                 source={require('../img/plus.png')}
                style={{width: 10, height: 10, alignItems: 'center',}} />
             </TouchableOpacity>
              :
              <View style={[this.state.lang.indexOf('ar')!=-1?styles.row :styles.row_res ,{ width:'95%',height:60,justifyContent:'center',alignItems:"center",margin:5}]}>
            <TouchableOpacity
            onPress={this.uploadImg1}
               style={[{flex:1,height:'100%',backgroundColor: '#FFF',elevation:3,borderRadius:10,margin:5}]}>
              <Image
                 source={{ uri: this.state.image1 }}
                style={{width: '100%', height: '100%', alignItems: 'center',borderRadius:10}} />
             </TouchableOpacity>
             <TouchableOpacity
            onPress={this.uploadImg2}
               style={[{flex:1,height:'100%',backgroundColor: '#FFF',elevation:3,borderRadius:10,margin:5}]}>
              <Image
                 source={{ uri: this.state.image2 }}
                style={{width: '100%', height: '100%', alignItems: 'center',borderRadius:10}} />
             </TouchableOpacity>
             <TouchableOpacity
            onPress={this.uploadImg3}
               style={[{flex:1,height:'100%',backgroundColor: '#FFF',elevation:3,borderRadius:10,margin:5}]}>
              <Image
                 source={{ uri: this.state.image3 }}
                style={{width: '100%', height: '100%', alignItems: 'center',borderRadius:10}} />
             </TouchableOpacity>
             <TouchableOpacity
            onPress={this.uploadImg4}
               style={[{flex:1,height:'100%',backgroundColor: '#FFF',elevation:3,borderRadius:10,margin:5}]}>
              <Image
                 source={{ uri: this.state.image4 }}
                style={{width: '100%', height: '100%', alignItems: 'center',borderRadius:10}} />
             </TouchableOpacity>
             </View>
            }
             {this.state.flag_more_addImg === 0 ?
               <TouchableOpacity
               onPress={() => {
                this.setState({ more_img_flag: 1 })
                this.setState({flag_more_addImg:1})
              }}
               style={[styles.viewItem,this.state.lang ==='ar'?styles.end:styles.start,{overflow: 'hidden',backgroundColor: '#FFF',elevation:3,borderRadius:10,margin:5}]}>
              <Image
                 resizeMode ="cover"
                 source={require('../img/plus.png')}
                style={{width: 10, height: 10, alignItems: 'center',}} />
             </TouchableOpacity>
              :
              <View style={{display:'none'}}></View>
            }
            {this.state.more_img_flag ===0 ?
             <View style={{display:'none'}}></View>
            :
            <View style={[this.state.lang.indexOf('ar')!=-1?styles.row :styles.row_res ,{ width:'95%',height:60,justifyContent:'center',alignItems:"center",margin:5}]}>
              <TouchableOpacity
              onPress={this.uploadImg5}
                 style={[{flex:1,height:'100%',backgroundColor: '#FFF',elevation:3,borderRadius:10,margin:5}]}>
                <Image
                   source={{ uri: this.state.image5 }}
                  style={{width: '100%', height: '100%', alignItems: 'center',borderRadius:10}} />
               </TouchableOpacity>
               <TouchableOpacity
              onPress={this.uploadImg6}
                 style={[{flex:1,height:'100%',backgroundColor: '#FFF',elevation:3,borderRadius:10,margin:5}]}>
                <Image
                   source={{ uri: this.state.image6 }}
                  style={{width: '100%', height: '100%', alignItems: 'center',borderRadius:10}} />
               </TouchableOpacity>
               <TouchableOpacity
              // onPress={this.uploadImg6}
                 style={[{flex:1,height:'100%',backgroundColor: '#FFF',elevation:3,borderRadius:10,margin:5}]}>
                <Image
                   source={{ uri: this.state.image6 }}
                  style={{width: '100%', height: '100%', alignItems: 'center',borderRadius:10}} />
               </TouchableOpacity>
               <TouchableOpacity
              // onPress={this.uploadImg8}
                 style={[{flex:1,height:'100%',backgroundColor: '#FFF',elevation:3,borderRadius:10,margin:5}]}>
                <Image
                   source={{ uri: this.state.image6 }}
                  style={{width: '100%', height: '100%', alignItems: 'center',borderRadius:10}} />
               </TouchableOpacity>
               </View>
            }

               
               </View>
 
               <View style={{width:'95%',flexDirection:'row',marginTop:10,justifyContent:'center',alignItems:'center'}}>
                 <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-start'}}></View>
                 <Text style={{ width: '40%', textAlign: 'center', color: '#414141', fontSize: 16,fontFamily:'segoe'}}>
                          {this.state.lang.indexOf('ar') != -1 ? "مزايا السيارة " : "Car advantages"}
                        </Text>
                  <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-end'}}></View>
               </View>

               <View style={[styles.shadow,{ width: width*0.95,justifyContent:'center',alignItems:'center',backgroundColor:'#F8F8F8',borderRadius:5,marginTop:10}]}>
               <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{width:width*0.90,color: '#4B4B4B', fontSize: 16,fontFamily:"segoe",marginTop:10,}]}>
               {this.state.lang === 'ar'? 'أختر المزايا المتاحه في سيارتك':'Choose the features available in your car'}</Text>
               <TouchableOpacity
                onPress={ async()=>{
                 if(this.state.checked1){
                   this.setState({checked1:false})
                   this.setState({abs:2})
                 }else{
                  this.setState({checked1:true})
                  this.setState({abs:1})
                 }
                }}
                style={[{backgroundColor: '#FFFFFF',borderRadius:5,marginTop:10,}]}>
                <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:width*0.90,height:40,alignItems:'center',justifyContent:'center'}]} >
                <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{flex:1,fontSize: 14,color:'#707070',fontFamily:'segoe',}]}>
                {this.state.lang.indexOf('ar') != -1 ? "ABS " : "ABS"}</Text>
                 <CheckBox
                  checkedIcon={<Image style={{width:25,height:25}} source={require('../img/checked.png')} />}
                  uncheckedIcon={<Image style={{width:20,height:20}} source={require('../img/unchecked.png')} />}
                checked={this.state.checked1}
                onPress={() =>{
                  if(this.state.checked1){
                    this.setState({checked1:false})
                    this.setState({abs:2})
                  }else{
                   this.setState({checked1:true})
                   this.setState({abs:1})
                  }
                  }}
                 />
              </View>
               </TouchableOpacity>

               <TouchableOpacity
                onPress={ async()=>{
                  if(this.state.checked2){
                    this.setState({checked2:false})
                    this.setState({bluetooth:2})
                  }else{
                   this.setState({checked2:true})
                   this.setState({bluetooth:1})
                  }
                }}
                style={[{backgroundColor: '#FFFFFF',borderRadius:5,marginTop:5}]}>
                <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:width*0.90,height:40,alignItems:'center',justifyContent:'center'}]} >
                <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{flex:1,fontSize: 14,color:'#707070',fontFamily:'segoe',}]}>
                {this.state.lang.indexOf('ar') != -1 ? "بلوتوث " : "Bluetooth"}</Text>
                 <CheckBox
                  checkedIcon={<Image style={{width:25,height:25}} source={require('../img/checked.png')} />}
                  uncheckedIcon={<Image style={{width:20,height:20}} source={require('../img/unchecked.png')} />}
                checked={this.state.checked2}
                onPress={() =>{
                  if(this.state.checked2){
                    this.setState({checked2:false})
                    this.setState({bluetooth:2})
                  }else{
                   this.setState({checked2:true})
                   this.setState({bluetooth:1})
                  }
                  }}
                 />
              </View>
               </TouchableOpacity>

               <TouchableOpacity
                onPress={ async()=>{
                 if(this.state.checked3){
                    this.setState({checked3:false})
                    this.setState({centralLock:2})
                  }else{
                   this.setState({checked3:true})
                   this.setState({centralLock:1})
                  }
                }}
                style={[{backgroundColor: '#FFFFFF',borderRadius:5,marginTop:5}]}>
                <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:width*0.90,height:40,alignItems:'center',justifyContent:'center'}]} >
                <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{flex:1,fontSize: 14,color:'#707070',fontFamily:'segoe',}]}>
                {this.state.lang.indexOf('ar') != -1 ? "قفل مركزى " : "Central lock"}</Text>
                 <CheckBox
                  checkedIcon={<Image style={{width:25,height:25}} source={require('../img/checked.png')} />}
                  uncheckedIcon={<Image style={{width:20,height:20}} source={require('../img/unchecked.png')} />}
                checked={this.state.checked3}
                onPress={() =>{
                  if(this.state.checked3){
                    this.setState({checked3:false})
                    this.setState({centralLock:2})
                  }else{
                   this.setState({checked3:true})
                   this.setState({centralLock:1})
                  }
                  }}
                 />
              </View>
               </TouchableOpacity>

               <TouchableOpacity
                onPress={ async()=>{
                  if(this.state.checked4){
                    this.setState({checked4:false})
                    this.setState({electriGlass:2})
                  }else{
                   this.setState({checked4:true})
                   this.setState({electriGlass:1})
                  }
                }}
                style={[{backgroundColor: '#FFFFFF',borderRadius:5,marginTop:5}]}>
                <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:width*0.90,height:40,alignItems:'center',justifyContent:'center'}]} >
                <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{flex:1,fontSize: 14,color:'#707070',fontFamily:'segoe',}]}>
                {this.state.lang.indexOf('ar') != -1 ? "زجاج كهربائى" : "Electric glass"}</Text>
                 <CheckBox
                  checkedIcon={<Image style={{width:25,height:25}} source={require('../img/checked.png')} />}
                  uncheckedIcon={<Image style={{width:20,height:20}} source={require('../img/unchecked.png')} />}
                checked={this.state.checked4}
                onPress={() =>{
                  if(this.state.checked4){
                    this.setState({checked4:false})
                    this.setState({electriGlass:2})
                  }else{
                   this.setState({checked4:true})
                   this.setState({electriGlass:1})
                  }
                  }}
                 />
              </View>
               </TouchableOpacity>

               <TouchableOpacity
                onPress={ async()=>{
                  if(this.state.checked5){
                    this.setState({checked5:false})
                    this.setState({sportTrims:2})
                  }else{
                   this.setState({checked5:true})
                   this.setState({sportTrims:1})
                  }
                }}
                style={[{backgroundColor: '#FFFFFF',borderRadius:5,marginTop:5}]}>
                <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:width*0.90,height:40,alignItems:'center',justifyContent:'center'}]} >
                <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{flex:1,fontSize: 14,color:'#707070',fontFamily:'segoe',}]}>
                {this.state.lang.indexOf('ar') != -1 ? "جنوط سبور" : "Sport rims"}</Text>
                 <CheckBox
                  checkedIcon={<Image style={{width:25,height:25}} source={require('../img/checked.png')} />}
                  uncheckedIcon={<Image style={{width:20,height:20}} source={require('../img/unchecked.png')} />}
                checked={this.state.checked5}
                onPress={() =>{
                  if(this.state.checked5){
                    this.setState({checked5:false})
                    this.setState({sportTrims:2})
                  }else{
                   this.setState({checked5:true})
                   this.setState({sportTrims:1})
                  }
                  }}
                 />
              </View>
               </TouchableOpacity>

               <TouchableOpacity
                onPress={ async()=>{
                  if(this.state.checked6){
                    this.setState({checked6:false})
                    this.setState({cdPlayer:2})
                  }else{
                   this.setState({checked6:true})
                   this.setState({cdPlayer:1})
                  }
                }}
                style={[{backgroundColor: '#FFFFFF',borderRadius:5,marginTop:5}]}>
                <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:width*0.90,height:40,alignItems:'center',justifyContent:'center'}]} >
                <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{flex:1,fontSize: 14,color:'#707070',fontFamily:'segoe',}]}>
                {this.state.lang.indexOf('ar') != -1 ? "مشغل CD" : "CD player"}</Text>
                 <CheckBox
                  checkedIcon={<Image style={{width:25,height:25}} source={require('../img/checked.png')} />}
                  uncheckedIcon={<Image style={{width:20,height:20}} source={require('../img/unchecked.png')} />}
                checked={this.state.checked6}
                onPress={() =>{
                  if(this.state.checked6){
                    this.setState({checked6:false})
                    this.setState({cdPlayer:2})
                  }else{
                   this.setState({checked6:true})
                   this.setState({cdPlayer:1})
                  }
                  }}
                 />
              </View>
               </TouchableOpacity>

               <TouchableOpacity
                onPress={ async()=>{
                  if(this.state.checked7){
                    this.setState({checked7:false})
                    this.setState({cruiseControl:2})
                  }else{
                   this.setState({checked7:true})
                   this.setState({cruiseControl:1})
                  }
                }}
                style={[{backgroundColor: '#FFFFFF',borderRadius:5,marginTop:5,marginBottom:5}]}>
                <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{width:width*0.90,height:40,alignItems:'center',justifyContent:'center'}]} >
                <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{flex:1,fontSize: 14,color:'#707070',fontFamily:'segoe',}]}>
                {this.state.lang.indexOf('ar') != -1 ? "مثبت سرعة" : "Cruise control"}</Text>
                 <CheckBox
                  checkedIcon={<Image style={{width:25,height:25}} source={require('../img/checked.png')} />}
                  uncheckedIcon={<Image style={{width:20,height:20}} source={require('../img/unchecked.png')} />}
                checked={this.state.checked7}
                onPress={() =>{
                  if(this.state.checked7){
                    this.setState({checked7:false})
                    this.setState({cruiseControl:2})
                  }else{
                   this.setState({checked7:true})
                   this.setState({cruiseControl:1})
                  }
                  }}
                 />
              </View>
               </TouchableOpacity>
               </View>
  
               <View style={{width:'95%',flexDirection:'row',marginTop:10,justifyContent:'center',alignItems:'center'}}>
                 <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-start'}}></View>
                 <Text style={{ width: '40%', textAlign: 'center', color: '#414141', fontSize: 16,fontFamily:'segoe'}}>
                          {this.state.lang.indexOf('ar') != -1 ? "معلومات الايجار " : "Tenancy information"}
                        </Text>
                  <View style={{width:'30%',height:2,backgroundColor:'#E4E4E4',alignItems:'flex-end'}}></View>
               </View>
               <View style={[styles.shadow,{ width: width*0.95,justifyContent:'center',alignItems:'center',backgroundColor:'#F8F8F8',borderRadius:5,marginTop:10}]}>
               <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{width:width*0.90,color: '#4B4B4B', fontSize: 16,fontFamily:"segoe",marginTop:10,}]}>
               {this.state.lang === 'ar'? 'الفترة المتاحه للأيجار':'The period available for rent'}</Text>
               <View style={[this.state.lang ==='ar'?styles.row:styles.row_res,{ width: width*0.9,height:height*0.07,justifyContent:'center',alignItems:'center',marginTop:10}]}>
              <View style={[this.state.lang ==='ar'?styles.row_res:styles.row,{ height:'100%',backgroundColor: '#fff', borderRadius: 5, flex: 1, justifyContent: 'center',margin:3}]} >
              <DatePicker
                style={{
                  width: '80%', height: '100%', 
                }}
                date={this.state.endDate}
                    placeholder={this.state.lang.indexOf('ar') != -1 ? ' تاريخ الانتهاء' : 'End Date'}
                    mode="date"
                    format="YYYY-MM-DD"
                    minDate={new Date()}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                    dateIcon: {
                      position: 'relative',
                      display:'none',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                    marginLeft: 0
                    , borderWidth: 0, alignItems: 'center', fontSize: 14
                     }
                    }}
                    onDateChange={(endDate) => {
                    this.setState({ endDate })
                    }}
              />
                <Image 
                resizeMode='contain'
                source={require('../img/date.png')} style={{width: 30, height: 30,margin:5}}>
              </Image>
              </View>
              <View style={[this.state.lang ==='ar'?styles.row_res:styles.row,{ height:'100%',backgroundColor: '#fff', borderRadius: 5, flex: 1, justifyContent: 'center',margin:3}]} >
              <DatePicker
                style={{
                  width: '80%', height: '100%', 
                }}
                 date={this.state.startDate}
                 placeholder={this.state.lang.indexOf('ar') != -1 ? ' تاريخ البدء' : 'Start Date'}
                  mode="date"
                  format="YYYY-MM-DD"
                  minDate={new Date()}
                 confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                  dateIcon: {
                  position: 'relative',
                  display:'none',
                  left: 0,
                   top: 4,
                  marginLeft: 0
                  },
                  dateInput: {
                  marginLeft: 0
                  , borderWidth: 0, alignItems: 'center', fontSize: 14
                  }
                   }}
                   onDateChange={(startDate) => {
                  this.setState({ startDate })
                 }}
              />
                <Image 
                resizeMode='contain'
                source={require('../img/date.png')} style={{width: 30, height: 30,margin:5}}>
              </Image>
              </View>
                   
               </View>
               <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{width:width*0.90,color: '#4B4B4B', fontSize: 16,fontFamily:"segoe",marginTop:10,}]}>
               {this.state.lang === 'ar'? 'سعر اليوم':'Day price'}</Text>
              <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center',marginBottom:10,
              backgroundColor: '#fff', borderRadius: 10,height:height*0.07,}]}>
             <Text style={{ height:'100%',textAlign: 'center', color: '#969696', fontSize: 14, flex: 1,borderColor:'#E9E9E9',borderWidth:1,borderRadius:5,textAlignVertical:'center' }}>{this.state.lang ==='ar'?'ر س':'SAR'}</Text>
             <TextInput  
                placeholderTextColor='#DCDCDC'
                placeholder={this.state.lang.indexOf('ar') != -1 ?'أدخل السعر' :'Enter price'} 
                underlineColorAndroid="transparent"
                defaultValue={this.state.price}
                onChangeText={(price) => this.setState({ price  }) } 
                style={{ flex: 3,height:'100%',textAlign:'center',color:'#000',fontSize:14,fontFamily:'segoe'}}>
               </TextInput>
            </View> 
            <Text style={[this.state.lang === 'ar'?styles.right:styles.left,{width:width*0.90,color: '#4B4B4B', fontSize: 16,fontFamily:"segoe",marginTop:10,}]}>
               {this.state.lang === 'ar'? 'التأمين الزائد':'Overload insurance'}</Text>
              <View style={[this.state.lang === 'ar' ? styles.row : styles.row_res, { width: '90%', alignItems: 'center', marginTop: 5, justifyContent: 'center',marginBottom:10,
              backgroundColor: '#fff', borderRadius: 10,height:height*0.07,}]}>
             <Text style={{ height:'100%',textAlign: 'center', color: '#969696', fontSize: 14, flex: 1,borderColor:'#E9E9E9',borderWidth:1,borderRadius:5,textAlignVertical:'center' }}>{this.state.lang ==='ar'?'ر س':'SAR'}</Text>
             <TextInput  
                placeholderTextColor='#DCDCDC'
                placeholder={this.state.lang.indexOf('ar') != -1 ?'أدخل التأمين الزائد' :'Enter overload insurance'} 
                underlineColorAndroid="transparent"
                defaultValue={this.state.insurance}
                onChangeText={(insurance) => this.setState({ insurance  }) } 
                style={{ flex: 3,height:'100%',textAlign:'center',color:'#000',fontSize:14,fontFamily:'segoe'}}>
               </TextInput>
            </View> 
        </View>
                       
                
                  <View style={{ width: width, justifyContent: 'center', marginTop: 15, alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.onAdd.bind(this)}
                              style={{ width: '90%', height: height*0.07, borderRadius: 7, justifyContent: 'center',backgroundColor: '#343434', marginBottom: 10 }}>
                              <Text style={{ width: '100%', fontSize: 18,color: '#FFFFFF', textAlign: 'center' }}>
                                {this.state.lang.indexOf('ar') != -1 ? 'أضافه السيارة ' : ' Add car '}
                              </Text>
                            </TouchableOpacity>
                  </View>
                  </View >

                }

              </View>

          
          </ScrollView>


        }

        <Modal style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          backgroundColor: 'transparent'
        }}
          position={"center"} ref={"modal"} >

          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#707070",
            width: '80%'

          }} >

            <View style={{ width: '80%', marginTop: 10, justifyContent: 'center', alignItems: 'center' }} >
              <Text style={{ width: '100%', textAlign: 'center', alignItems: 'center', textAlignVertical: 'center', color: '#343434', fontSize: 20,fontFamily:'segoe'}}>
                {this.state.lang.indexOf('ar') != -1 ? '  تم اضافه السيارة بنجاح  ' : ' Car added successfully'}
              </Text>

              <TouchableOpacity
                onPress={() => { this.refs.modal.close() }}
                style={{ width: '40%', height: 37,backgroundColor: '#343434', marginTop: 20, justifyContent: 'center', borderRadius: 20, alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ width: '100%', height: '100%', textAlign: 'center', alignItems: 'center', color: '#FFFFFF', fontSize: 22, padding: 5, textAlignVertical: 'center',fontFamily:'segoe' }}>
                  {this.state.lang.indexOf('ar') != -1 ? '  نعــم  ' : ' Yes'} </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}
export default AddCarScreen;
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
    width:60,
    height:60,
    alignItems:'center',
    justifyContent:'center',
  },
  shadow: {
    shadowColor: '#000',
       shadowOffset: {
          width: 0,
          height: 6,
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
 },
 input:{
  width:width*0.9,
  marginTop:10,
  borderRadius:8,
  marginBottom:10,
  textAlignVertical:'top',
  backgroundColor:'#FFF',
  color:'#118CB3',
  padding:10,
  alignItems:'center',
  fontFamily:'segoe',
 }
 
});