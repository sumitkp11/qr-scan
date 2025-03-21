
import jsQR from "jsqr";
export default function ScanCode() {


    return (
        <>
            <div>
                <video className="border-black border-2 my-2 rounded-xl" id="vid" width={400} height={400} muted>hello</video>
                <canvas id='canvas' width={400} height={400} className="hidden"></canvas>
            </div>
            <button className='md:bg-blue-600 sm:border-black sm:border-2 text-white rounded-full p-3 md:mr-2 sm:mt-2 ' id="cameraButton" onClick={() => { getMediaDevices("user") }}><span className="hidden sm:inline">Front Camera</span>
            <span className="inline sm:hidden">🤳</span></button>
            <button className='md:bg-blue-600 sm:border-black sm:border-2 text-white rounded-full p-3 md:mr-2 sm:mt-2 ' id="cameraButton" onClick={() => { getMediaDevices("environment") }}><span className="hidden sm:inline">Back Camera</span>
            <span className="inline sm:hidden">📷</span></button>
            <button className='md:bg-blue-600 sm:border-black sm:border-2 text-white rounded-full p-3 md:mr-2 sm:mt-2' id="stopCamera" onClick={closeCameraOutput}><span className="hidden sm:inline">Close Camera</span>
            <span className="inline sm:hidden">❌</span></button>

            <div>
                <table className="">
                    <tr >
                        <th className="p-3">SSID</th>
                        <th className="p-3">Password</th>
                    </tr>
                    <tr>
                        <td className="p-3" id="wifiSsid"></td>
                        <td className="p-3" id="wifiPass"></td>
                    </tr>
                </table>
            </div>
            <p id="txtArea"></p>
        </>

    )
}

async function getMediaDevices(switchCamera) {

    let videoPlayer = document.getElementById("vid");
    let mediaDevices = navigator.mediaDevices;
    let imageData = null;
    let qrCodeData = null;

    mediaDevices.getUserMedia({
        video: {
            facingMode: {
                exact: switchCamera
            }
        }
    }).then((stream) => {
        window.localStream = stream;
        videoPlayer.srcObject = stream;

        videoPlayer.onplay = () => {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');

            async function captureFrame() {
                ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);

                imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const options = {
                    inversionAttempts: 'dontInvert'
                };
                const code = jsQR(imageData.data, 400, 400, options);

                // console.log(imageData);
                let captureLoop = requestAnimationFrame(captureFrame);
                if (code && stream) {
                    qrCodeData = code.data;
                    const qrContent = await checkQrContent(qrCodeData);
                    console.log(qrContent);
                    document.getElementById("wifiSsid").innerHTML = qrContent.SSID;
                    document.getElementById("wifiPass").innerHTML = qrContent.Password;
                    document.getElementById("wifiHide").innerHTML = qrContent.Hidden;

                    const tracks = stream.getTracks();
                    tracks.forEach(track => track.stop());

                    videoPlayer.srcObject = null;
                    cancelAnimationFrame(captureLoop);
                    captureLoop = null;
                }
            }
            captureFrame();


        }
        videoPlayer.onloadedmetadata = (e) => {
            videoPlayer.play();
        }
    }).catch((err) => {
        console.log(`Error with camera: ${err}.`);
        alert("Camera Error. Please try different camera or stop camera first.")
    });

    if (qrCodeData) {
        let TextAreaBox = document.getElementById('txtArea');
        TextAreaBox.value = qrCodeData;
    }


}

function closeCameraOutput() {
    if (window.localStream) {
        // Stop all tracks
        window.localStream.getTracks().forEach(track => track.stop());
        document.getElementById("vid").srcObject = null;

        console.log("Camera stopped");
    }
}

async function checkQrContent(qrData) {
    // WIFI:S:SumitA50;T:WPA;P:sumit987;H:false;;
    const WifiData = {};
    if (qrData.includes("WIFI")) {
        let splitWifiData = qrData.split(";");
        for (let i = 0; i < splitWifiData.length; i++) {
            if (splitWifiData[i].length > 0) {
                if (splitWifiData[i].includes("WIFI:S")) {
                    WifiData.SSID = splitWifiData[i].slice(7);
                }
                if (splitWifiData[i].includes("T:")) {
                    WifiData.Type = splitWifiData[i].slice(2);
                }
                if (splitWifiData[i].includes("P:")) {
                    WifiData.Password = splitWifiData[i].slice(2);
                }
                if (splitWifiData[i].includes("H:")) {
                    WifiData.Hidden = splitWifiData[i].slice(2);
                }
            }
        }
    }
    return WifiData;
}