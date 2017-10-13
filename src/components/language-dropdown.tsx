import * as React from 'react'
import { Component } from 'react'
import { Spin, Layout, Icon, Menu, Dropdown } from "antd/lib";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router";
import { GCGlobal, GCLocale } from "../index";

export interface LanguageMenuProps {
    onChangeLanguage?: (language: string) => void
}
export interface LanguageMenuStates {
    language?: string
}

export class LanguageDropDown extends Component<LanguageMenuProps, LanguageMenuStates> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            language: navigator.language.toLowerCase().split(/[_-]+/)[0]
        };
    }
    componentDidMount() {
    }
    getLanguage(lang) {
        return GCGlobal.intl.formatMessage({ id: lang === 'en' ? GCLocale.LanguageEn : GCLocale.LanguageZh })
    }

    renderMenu() {
        return <Menu
            theme="dark"
            defaultSelectedKeys={[this.state.language]}
            selectedKeys={[this.state.language]}
            style={{ lineHeight: '64px' }}
            onSelect={(param) => {
                //using onClick for select operation because onSelect do not work for some reason
                //please fix and send message to project members if you find how to fix it
            }}
            onClick={(param) => {
                if (param.key !== this.state.language) {
                    this.props.onChangeLanguage(param.key);
                    this.setState({ language: param.key });
                }
            }}
        >
            <Menu.Item key="en">{this.getLanguage('en')}</Menu.Item>
            <Menu.Item key="zh">{this.getLanguage('zh')}</Menu.Item>
        </Menu>
    }

    render() {
        return <Dropdown overlay={this.renderMenu()} trigger={['click']} >
            <a className="ant-dropdown-link" href="#">
                <FormattedMessage id={GCLocale.LanguageTitle} values={{ language: this.getLanguage(this.state.language) }} tagName='span'></FormattedMessage>
                <Icon type="down" />
            </a>
        </Dropdown>
    }
}
