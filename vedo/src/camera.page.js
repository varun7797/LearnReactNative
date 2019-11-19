import React,{useState, useEffect} from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import  * as Permissions  from "expo-permissions"
import styles from './styles';

import Toolbar from './toolbar.component';
import Gallery from './gallery.component';

export default function CameraPage () {
    camera = null;

    [captures,setCaptures] = useState([]);
    [flashMode,setFlashMode] = useState(Camera.Constants.FlashMode.off);
    [capturing,setCapturing] = useState(null);
    [cameraType,setCameraType] = useState(Camera.Constants.Type.back);
    [hasCameraPermission,setHasCameraPermission] = useState(null);

    const handleCaptureIn = () => setCapturing(true);

    const handleCaptureOut = () => {
            if (capturing)
                camera.stopRecording();
        };

    const handleShortCapture = async () => {
            const photoData = await camera.takePictureAsync();
            setCapturing(false);
            setCaptures([photoData,...captures]);
        };

    handleLongCapture = async () => {
        const videoData = await camera.recordAsync();
        setCapturing(false);
        setCaptures([videoData,...captures]);
    };


    useEffect(()=>{
        const componentDidMount= async ()=>{
            const camera = await Permissions.askAsync(Permissions.CAMERA);
            const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
            setHasCameraPermission(camera.status === 'granted' && audio.status === 'granted');
        };
        componentDidMount();
    },[]);

        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>Access to camera has been denied.</Text>;
        }

        return (
            <React.Fragment>
                <View>
                    <Camera
                        type={cameraType}
                        flashMode={flashMode}
                        style={styles.preview}
                        ref={camera => camera = camera}
                    />
                </View>
                
                {captures.length > 0 && <Gallery captures={captures}/>}

                <Toolbar 
                    capturing={capturing}
                    flashMode={flashMode}
                    cameraType={cameraType}
                    setFlashMode={setFlashMode}
                    setCameraType={setCameraType}
                    onCaptureIn={handleCaptureIn}
                    onCaptureOut={handleCaptureOut}
                    onLongCapture={handleLongCapture}
                    onShortCapture={handleShortCapture}
                />
            </React.Fragment>
        );
    };