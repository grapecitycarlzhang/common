import { addLocaleData } from "react-intl";
import * as en from 'react-intl/locale-data/en'
import * as zh from 'react-intl/locale-data/zh'
import * as antdEn from "antd/lib/locale-provider/en_US"
import { GCLocale } from "./localeid"

export interface LocalePackage {
    locale?: string
    messages?: any
    antd?: any
}
export { GCLocale }
export function getLocale(language): Promise<LocalePackage> {
    if (!language) {
        language = navigator.language || 'zh-CN';
    }
    //language without region code
    language = language.toLowerCase().split(/[_-]+/)[0];
    return new Promise((resolve, reject) => {
        switch (language) {
            case 'zh':
                addLocaleData(zh);
                require.ensure([], () => {
                    resolve({
                        locale: language,
                        messages: require("./zh.json"),
                        antd: null
                    })
                }, 'zh.json');
                break;

            case 'en':
            default:
                addLocaleData(en);
                require.ensure([], () => {
                    resolve({
                        locale: language,
                        messages: require("./en.json"),
                        antd: antdEn
                    })
                }, 'en.json');
                break;
        }
    })
}