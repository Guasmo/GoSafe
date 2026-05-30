// app.config.js
export default {
    expo: {
        name: "GoSafe",
        slug: "GoSafe",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "gosafe",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,

        ios: {
            supportsTablet: true,
            bundleIdentifier: process.env.EXPO_PUBLIC_IOS_BUNDLE_ID || "com.gosafe.app",
            googleServicesFile: "./GoogleService-Info.plist", // Uncomment when file is downloaded
            infoPlist: {
                CFBundleURLTypes: [
                    {
                        CFBundleURLSchemes: [
                            `fb${process.env.EXPO_PUBLIC_FACEBOOK_APP_ID}`
                        ]
                    }
                ],
                FacebookAppID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
                FacebookDisplayName: "GoSafe",
                LSApplicationQueriesSchemes: [
                    "fbapi",
                    "fb-messenger-share-api",
                    "fbauth2",
                    "fbshareextension"
                ]
            }
        },

        android: {
            adaptiveIcon: {
                backgroundColor: "#E6F4FE",
                foregroundImage: "./assets/images/android-icon-foreground.png",
                backgroundImage: "./assets/images/android-icon-background.png",
                monochromeImage: "./assets/images/android-icon-monochrome.png"
            },
            package: process.env.EXPO_PUBLIC_ANDROID_PACKAGE || "com.gosafe.app",
            googleServicesFile: "./google-services.json",
            permissions: [
                "ACCESS_FINE_LOCATION",
                "ACCESS_COARSE_LOCATION",
                "ACCESS_BACKGROUND_LOCATION",
                "FOREGROUND_SERVICE",
                "INTERNET"
            ]
        },

        web: {
            output: "static",
            favicon: "./assets/images/favicon.png"
        },

        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff",
                    dark: {
                        backgroundColor: "#000000"
                    }
                }
            ],
            [
                "expo-location",
                {
                    locationAlwaysAndWhenInUsePermission: "GoSafe necesita acceso a tu ubicación para mostrarte en el mapa y proporcionarte rutas seguras.",
                    locationAlwaysPermission: "GoSafe necesita acceso a tu ubicación para alertarte sobre zonas peligrosas incluso cuando la app está en segundo plano.",
                    locationWhenInUsePermission: "GoSafe necesita acceso a tu ubicación para mostrarte en el mapa.",
                    isAndroidBackgroundLocationEnabled: true,
                    isAndroidForegroundServiceEnabled: true
                }
            ],
            "expo-secure-store",
            [
                "expo-notifications",
                {
                    icon: "./assets/images/notification-icon.png",
                    color: "#ffffff"
                }
            ],
            [
                "@react-native-firebase/app",
                {
                    android: {
                        googleServicesFile: "./google-services.json"
                    },
                    // iOS configuration commented out until GoogleService-Info.plist is added
                    ios: {
                        googleServicesFile: "./GoogleService-Info.plist"
                    }
                }
            ],
            [
                "react-native-fbsdk-next",
                {
                    appID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
                    clientToken: process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN,
                    displayName: "GoSafe",
                    scheme: `fb${process.env.EXPO_PUBLIC_FACEBOOK_APP_ID}`,
                    advertiserIDCollectionEnabled: false,
                    autoLogAppEventsEnabled: false,
                    isAutoInitEnabled: true,
                    iosUserTrackingPermission: "Esta aplicación usa el inicio de sesión de Facebook para la autenticación."
                }
            ]
        ],

        experiments: {
            typedRoutes: true,
            reactCompiler: true
        },

        extra: {
            eas: {
                projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID || "your-project-id"
            }
        }
    }
};