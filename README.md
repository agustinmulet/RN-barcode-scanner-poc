# React Native Barcode Scanner Proof of Concept

Proof of Concept implementing Scandit Barcode Scanner (https://www.scandit.com/)

### Usage

This app was only tested on Android (sorry iOS 😢)

- Set up your React Native development environment (https://reactnative.dev/docs/environment-setup) I've used 
`React Native CLI Quickstart -> Windows -> Android` for this app
- Register on Scandit (https://www.scandit.com/)
- Download the Barcode Scanner SDK for Android. It's available from your Scandit Barcode Scanner SDK account at http://account.scandit.com in the `Downloads section -> Data Capture SDK For Android -> Version 5.14.5`.
- Inside the archive you will find a file named ScanditBarcodeScanner.aar, copy it to <directory_of_your_project>/android/libs
- Generate a License Key https://ssl.scandit.com/licenses and the package name should be `com.scannerpoc`
- Rename `.env.example` to `.env` and paste the generated License Key `API_KEY=<License Key goes here>`
- Connect a phone with USB Debugging activated or use the Android Studio Emulator and run the app with:
`npx react-native run-android`