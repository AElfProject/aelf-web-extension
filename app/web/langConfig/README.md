# Aelf-Web-Wallet internationalization

## How to configure dictionary files

### Add dictionary configuration files

1. install React-intl

    '''
     npm i react-intl -s
    '''

2. Add or configure [.JS] files in app/web/js/langConfig directory

   We have completed the Chinese and English thesaurus.

   for example:
'''
    const en_US = {
        'aelf.WalletRecord': 'Wallet Record',
    }

    export default en_US
'''

    Each key corresponds to a word

    Set the key values of different language profiles to their corresponding states

    Browser Language List:

    "af", "sq", "ar-SA", "ar-IQ", "ar-EG", "ar-LY", "ar-DZ", "ar-MA", "ar-TN", "ar-OM", "ar-YE", "ar-SY", "ar-JO", "ar-LB", "ar-KW", "ar-AE", "ar-BH", "ar-QA", "eu", "bg", "be", "ca", "zh-TW", "zh-CN","zh-HK", "zh-SG", "hr", "cs", "da", "nl", "nl-BE", "en", "en-US", "en-EG", "en-AU", "en-GB", "en-CA", "en-NZ", "en-IE", "en-ZA", "en-JM", "en-BZ", "en-TT", "et", "fo", "fa", "fi", "fr", "fr-BE", "fr-CA", "fr-CH", "fr-LU","gd", "gd-IE", "de", "de-CH", "de-AT", "de-LU", "de-LI", "el", "he", "hi", "hu","is", "id", "it", "it-CH", "ja", "ko", "lv", "lt", "mk", "mt", "no", "pl", "pt-BR", "pt", "rm","ro", "ro-MO", "ru", "ru-MI", "sz", "sr", "sk", "sl", "sb","es", "es-AR", "es-GT", "es-CR", "es-PA", "es-DO", "es-MX", "es-VE", "es-CO", "es-PE", "es-EC", "es-CL", "es-UY", "es-PY", "es-BO", "es-SV", "es-HN", "es-NI","es-PR", "sx", "sv", "sv-FI", "th", "ts", "tn", "tr", "uk", "ur", "ve", "vi", "xh","ji", "zu"

3. Replace traditional labels with specific labels

    1. import { FormattedMessage } from 'react-intl'
    2. Replace values with:

    ‘’‘
        <FormattedMessage id = 'Key in configuration file' />
    ’‘’