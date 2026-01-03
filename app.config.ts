import 'dotenv/config';

export default {
    name: "GoSafe",
    slug: "GoSafe",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "gosafe",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
        image: "./assets/images/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.gosafe.app",
        infoPlist: {
            NSLocationWhenInUseUsageDescription: "GoSafe necesita acceso a tu ubicación para mostrarte en el mapa y proporcionarte rutas seguras.",
            NSLocationAlwaysAndWhenInUseUsageDescription: "GoSafe necesita acceso a tu ubicación para mostrarte en el mapa y alertarte sobre zonas peligrosas cercanas.",
            NSLocationAlwaysUsageDescription: "GoSafe necesita acceso a tu ubicación para alertarte sobre zonas peligrosas incluso cuando la app está en segundo plano."
        }
    },
    android: {
        adaptiveIcon: {
            backgroundColor: "#E6F4FE",
            foregroundImage: "./assets/images/android-icon-foreground.png",
            backgroundImage: "./assets/images/android-icon-background.png",
            monochromeImage: "./assets/images/android-icon-monochrome.png"
        },
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false,
        package: "com.gosafe.app",
        permissions: [
            "ACCESS_COARSE_LOCATION",
            "ACCESS_FINE_LOCATION",
            "ACCESS_BACKGROUND_LOCATION"
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
        "expo-notifications"
    ],
    experiments: {
        typedRoutes: true,
        reactCompiler: true
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    extra: {
        eas: {
            projectId: "tu-project-id-aqui" // Opcional: para usar EAS
        }
    }
};