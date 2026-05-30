// config/firebase.ts
import auth from '@react-native-firebase/auth';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';

export const firebaseAuth = auth();

export const signInWithFacebook = async () => {
    try {
        // Attempt login with permissions
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            throw new Error('User cancelled the login process');
        }

        // Once signed in, get the user's AccessToken
        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
            throw new Error('Something went wrong obtaining access token');
        }

        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

        // Sign-in the user with the credential
        const userCredential = await auth().signInWithCredential(facebookCredential);

        return userCredential.user;
    } catch (error) {
        console.error('Facebook sign in error:', error);
        throw error;
    }
};

export const signOut = async () => {
    try {
        await LoginManager.logOut();
        if (auth().currentUser) {
            await auth().signOut();
        }
    } catch (error) {
        console.error('Sign out error:', error);
        throw error;
    }
};