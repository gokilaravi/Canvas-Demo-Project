import React, { useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";
import SignatureScreen from 'react-native-signature-canvas';

const App = () => {

    const ref = useRef();
    const { height } = useWindowDimensions();
    const [signature, setSignature] = useState(null);
    const[penColor,setPenColor]=useState("pink")

    const style = `.m-signature-pad {height:${height}px;margin:0,border:2,box-shadow: none; } 
                  .m-signature-pad--footer
                  .button.clear{
                    display:none
                  }
                  .button.save{
                    display.none
                  }.m-signature-pad--footer{
                    display:none,
                    margin: 0px;s
                  }
                  `

    // Called after ref.current.readSignature() reads a non-empty base64 string
    const handleOK = (signature) => {
        console.log(signature);
        setSignature(signature)
        // Callback from Component props
    };

    // Called after ref.current.readSignature() reads an empty string
    const handleEmpty = () => {
        console.log("Empty");
    };

    // Called after ref.current.clearSignature()
    const handleClear = () => {
        console.log("clear success!");
    }
    const handleEnd = () => {
        ref.current.readSignature();
    };

    // Called after ref.current.getData()
    const handleData = (data) => {
        console.log(data);
    };

    const handleUndo = () => {
        ref.current.undo();
      };
      
      const handleRedo = () => {
        ref.current.redo();
      };

    const handleColorChange = () => {
        ref.current.changePenColor(penColor);
      };

    return (
        <View style={styles.containerStyle}>
  <View style={styles.row}>
    <TouchableOpacity
      style={[styles.setButton, {marginRight: 30, backgroundColor: 'red'}]}
      onPress={handleUndo}
      >
      <Text style={styles.text}>Undo</Text>
      </TouchableOpacity>
    <TextInput
      placeholder= "Specify Pen Color"
      style={[styles.textInput,{backgroundColor:`${penColor}`}]}
      autoCapitalize="none"
      value={penColor}
      onChangeText={setPenColor} />
      <TouchableOpacity
      style={styles.setButton}
      onPress={handleColorChange}>

 <Text style={styles.text}>Set</Text>
      </TouchableOpacity>
      <TouchableOpacity
      style={[styles.setButton, {marginLeft: 30, backgroundColor: 'red'}]}
      onPress={handleRedo}
      >
      <Text style={styles.text}>Redo</Text>
      </TouchableOpacity>
    </View>
            <SignatureScreen
                ref={ref}
                webStyle={style}
                webviewContainerStyle={{ opacity: 0.99 }}
                onEnd={handleEnd}
                penColor={penColor}
                onOK={handleOK}
                onEmpty={handleEmpty}
                onClear={handleClear}
                onGetData={handleData}
            />
            {/* {signature ? (
                <View style={styles.imageStyle}>
                    <Image
                        resizeMode={"contain"}
                        style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height-200 }}
                        source={{ uri: signature }}
                    />
                </View>
            ) : null} */}
        </View>

    );
};

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,paddingBottom:30,
        paddingTop: 20, paddingHorizontal: 15,
        backgroundColor: "#d9d8d7"
    },
    imageStyle: {
        backgroundColor: "#fff",
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    row: {
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:"center",
        marginTop: 10,
        borderBottomWidth: 1,
          borderBottomColor: '#f2f2f2',
          paddingBottom: 5
        },
        textSign: {
          color: 'deepskyblue',
          fontWeight: 'bold',
          paddingVertical: 5,
        },
        text: {
          color: '#fff',
          fontWeight: '900',
        },
        textInput: {
            paddingVertical: 10,
            textAlign: 'center',
            borderWidth:1,borderRadius:5,
            borderColor:"gray",
            fontSize:12,
            fontWeight:"bold"
            
          },
          setButton: {
            backgroundColor: 'deepskyblue',
            textAlign: 'center',
            fontWeight: '900',
            color: '#fff',
            marginHorizontal: 10,
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderRadius: 5,
          }

})
export default App;