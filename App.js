import React, { useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, Alert, TextInput, TouchableOpacity, View, useWindowDimensions, Platform, Keyboard, Button } from "react-native";
import ErrorBoundary from "react-native-error-boundary";
import SignatureScreen from 'react-native-signature-canvas';
import RNFetchBlob from "rn-fetch-blob";


const ErrorFallback = (props) => {

  return (
    <View style={styles.containerStyle}>
      <Text style={{ color: "black", fontSize: 16 }}>
        Oops!
      </Text>
      <Text style={{ color: "black", fontSize: 13 }}>
        There\'s an error
      </Text>
      <Text style={{ color: "black", fontSize: 13 }}>
        Something went wrong
      </Text>
      <Button
        title="Try Again"
        onPress={props?.resetError}
      />
    </View>
  )
};

const App = () => {

  const ref = useRef();
  const { height } = useWindowDimensions();
  const [signature, setSignature] = useState(null);
  const [penColor, setPenColor] = useState("pink");
  const [isLoading, setLoading] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState(null);
  const [penSize, setPenSize] = useState(1);
  const [error, setError] = useState(null);


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
    try {
      setSignature(signature);
    } catch (error) {
      setError(error);
    }
  };

  // Called after ref.current.clearSignature()
  const handleClear = () => {
    try {
      ref.current.clearSignature();
      setSignature(null);
      setSignatureUrl(null);
    } catch (error) {
      setError(error);
    }
  }

  const handleEnd = () => {
    try {
      ref.current.readSignature();
    } catch (error) {
      setError(error);
    }
  };

  const onPressExport = () => {
    try {
      if (signature !== null) {
        setLoading(true);
        handleExport();
      } else {
        Alert.alert('Alert', 'Please give your sign', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleExport = () => {
    try {
      if (Platform.OS == 'android') {
        const dirs = RNFetchBlob.fs.dirs;
        const image_data = signature.split('data:image/png;base64,');
        const filePath = dirs.DownloadDir + "/" + 'signture' + new Date().getMilliseconds() + '.png'
        RNFetchBlob.fs.writeFile(filePath, image_data[1], 'base64').then(() => {
          let uri = filePath.replace("file://", "");
          RNFetchBlob.fs.stat(uri).then(stat => {
            setSignatureUrl(stat);
            Alert.alert('Save Successfully', 'Image saved successfuly in your local storage', [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
          }).catch(error => {
            setError(error);
          });
        }).catch((errorMessage) => {
          setError(errorMessage);
        });
      }
      setLoading(false);

    } catch (error) {
      console.log("error", error);
      setError(error);
    }
  };

  const handleDelete = () => {
    try {
      setSignature(null);
      setSignatureUrl(null);
    } catch (error) {
      setError(error);
    }
  };

  const handleUndo = () => {
    try {
      ref.current.undo();
    } catch (error) {
      setError(error);
    }
  };

  const handleRedo = () => {
    try {
      ref.current.redo();
    } catch (error) {
      setError(error)
    }
  };

  const handleErase = () => {
    try {
      ref.current.erase();
    } catch (error) {
      setError(error);
    }
  };

  const handleDraw = () => {
    try {
      ref.current.draw();
    } catch (error) {
      setError(error);
    }
  };

  const handleColorChange = () => {
    try {
      ref.current.changePenColor(penColor);
    } catch (error) {
      setError(error);
    }
  };

  const handleSizeChange = () => {
    try {
      ref.current.changePenSize(penSize, penSize);
    } catch (error) {
      setError(error);
    }
  };

  const handleChange = () => {
    try {
      ref.current.changePenSize(penSize, penSize);
      ref.current.changePenColor(penColor);
    } catch (error) {
      setError(error);
    }
  };

  const errorHandler = (error, stackTrace) => {
    console, log("REferror", error, stackTrace)
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={errorHandler}>
      <View style={styles.containerStyle}>
        {signatureUrl == null &&
          <View style={styles.containerStyle}>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.setButton, { marginRight: 10, backgroundColor: 'red' }]}
                onPress={handleUndo}
              >
                <Text style={styles.text}>Undo</Text>
              </TouchableOpacity>
              <View style={{ backgroundColor: `${penColor}`, height: 20, width: 20, marginRight: 5, borderColor: "#ccc", borderWidth: 1 }} />
              <TextInput
                placeholder="Color"
                placeholderTextColor={"#ccc"}
                style={[styles.textInput, { backgroundColor: "#FFF", color: "black", fontSize: 16, width: 80, height: 45 }]}
                autoCapitalize="none"
                value={penColor}
                onBlur={handleColorChange}
                onEndEditing={handleColorChange}
                onChangeText={setPenColor} />
              <TextInput
                placeholder="Size"
                placeholderTextColor={"#ccc"}
                style={[styles.textInput, { backgroundColor: "#fff", color: "black", fontSize: 16, width: 50, marginLeft: 10, height: 45, alignItems: "baseline" }]}
                autoCapitalize="none"
                value={`${penSize}`}
                keyboardType='number-pad'
                onBlur={handleSizeChange}
                onEndEditing={handleSizeChange}
                onChangeText={setPenSize} />
              <TouchableOpacity
                style={[styles.setButton, { marginLeft: 10, backgroundColor: 'red' }]}
                onPress={handleRedo}
              >
                <Text style={styles.text}>Redo</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.setButton, { alignSelf: "center", marginBottom: 10 }]}
              onPress={handleChange}>

              <Text style={styles.text}>Set</Text>
            </TouchableOpacity>
            <SignatureScreen
              ref={ref}
              webStyle={style}
              webviewContainerStyle={{ opacity: 0.99 }}
              onEnd={handleEnd}
              onOK={handleOK}
              minWidth={penSize}
              maxWidth={penSize}
              penColor={penColor}
              clearText={"clear"}
            />
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.setButton, { marginLeft: 10, backgroundColor: 'deepskyblue' }]}
                onPress={handleClear}
              >
                <Text style={styles.text}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.setButton, { marginLeft: 10, backgroundColor: 'deepskyblue' }]}
                onPress={onPressExport}
              >
                <Text style={styles.text}>Export</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.setButton, { marginLeft: 10, backgroundColor: 'deepskyblue' }]}
                onPress={handleErase}
              >
                <Text style={styles.text}>Erase</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.setButton, { marginLeft: 10, backgroundColor: 'deepskyblue' }]}
                onPress={handleDraw}
              >
                <Text style={styles.text}>Draw</Text>
              </TouchableOpacity>
            </View>
          </View>}
        {signatureUrl ? (
          <View>
            <View style={styles.imageStyle}>
              <Image
                resizeMode={"contain"}
                style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height - 200 }}
                source={{ uri: signature }}
              />
            </View>
            <TouchableOpacity
              style={[styles.setButton, { marginLeft: 10, marginTop: 10, backgroundColor: 'deepskyblue', alignItems: "center" }]}
              onPress={handleDelete}
            >
              <Text style={styles.text}>Clear</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1, paddingBottom: 30,
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
    alignItems: 'center',
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    paddingBottom: 5,
    paddingHorizontal: 20
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
    textAlign: 'center',
    borderWidth: 1, borderRadius: 5,
    borderColor: "gray",
    fontSize: 12,
    fontWeight: "bold",
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