import * as React from 'react'
import { Component } from 'react'
import * as Redux from 'redux'
import { Provider } from 'react-redux'
import { Spin, LocaleProvider } from "antd/lib";
import { MasterPage } from "./masterpage";
import { injectIntl, IntlProvider } from "react-intl";
import { getLocale, GCGlobal } from "../index";

export interface AppBaseProps {
    reducers?: any
    cdnUrl?: string
    onLoaded?: (appLocale: any) => Promise<{}>
}
export interface AppBaseStates {
    locale?: any
}

export class AppBase extends Component<AppBaseProps, AppBaseStates> {
    injectIntlComponent
    constructor(props, context) {
        super(props, context);
        this.state = {
            locale: null
        };
        this.initInjectIntlComponent();
        this.initRedux();
    }
    componentDidMount() {
        this.loadLanguage();
    }
    loadLanguage(language?) {
        return new Promise((resolve,reject)=>{
            getLocale(language).then((data)=>{
                if (this.props.onLoaded) {
                    this.props.onLoaded(data).then(d=>{
                        data.messages={...data.messages,...d};
                        this.setState({ locale: data }, ()=> { return resolve(); });
                    })
                }else{
                    this.setState({ locale: data }, ()=> { return resolve(); });
                }
            })
        })
    }
    private initInjectIntlComponent() {
        this.injectIntlComponent = injectIntl((props, options) => {
            GCGlobal.intl = props.intl;
            return <MasterPage onChangeLanguage={language=>{this.loadLanguage(language);}}>{this.props.children}</MasterPage>
        });
    }
    initRedux() {
        GCGlobal.store = Redux.createStore(Redux.combineReducers(this.props.reducers));
    }
    render() {
        const locale = this.state.locale;
        const content = locale ? <LocaleProvider locale={locale.antd}>
            <IntlProvider locale={locale.locale} messages={locale.messages}><this.injectIntlComponent></this.injectIntlComponent></IntlProvider>
        </LocaleProvider>
        :<div></div>
        return <Provider store={GCGlobal.store}><Spin size="large" spinning={locale == null}>{content}</Spin></Provider>
    }
}
