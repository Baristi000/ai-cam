import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector'

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [facess, setFacess] = useState([]);
  const [boxstyle,setBoxStyle] = useState([]);
  var x,y,width,height,box,listItems;

  listItems = boxstyle.map((object,index) =>
    <View key={index} style={{
      position:'absolute',
      width:object.bounds.size.width,
      height:object.bounds.size.height,
      left:object.bounds.origin.x,
      top:object.bounds.origin.y,
      borderWidth: 4,
      borderColor: "red",
      borderRadius: "4px"
    }}></View>
  );

  const faceDetected = async(faces) => {
    await setFacess(faces.faces) // instead of setFaces({faces})
    console.log(faces.faces)
    if(faces.faces.length === 0){
      setBoxStyle([])
    }
    else{
      setBoxStyle(faces.faces)
    }
  }

  useEffect(() => {(
    async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera 
        style={styles.camera} 
        type={type}
        onFacesDetected = {faceDetected}
        faceDetectorSettings = {{
          mode: FaceDetector.Constants.Mode.fast,
          detectLandmarks: FaceDetector.Constants.Landmarks.none,
          runClassifications: FaceDetector.Constants.Classifications.none,
          minDetectionInterval: 100,
          tracking: false
      }}
      >
        
        <View>{listItems}</View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position:'relative'
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  }
});
