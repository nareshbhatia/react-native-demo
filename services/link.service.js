import { Linking } from 'react-native';

// Returns a promise
export function openLink(url) {
    return Linking.canOpenURL(url)
    .then(supported => {
        if (supported) {
            return Linking.openURL(url);
        }
        else {
            return Promise.reject();
        }
    });
}
