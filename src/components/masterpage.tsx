import * as React from 'react'
import { Component } from 'react'
import { Spin, Layout, Icon, Menu, Row, Col } from "antd/lib";
import { FormattedMessage } from "react-intl";
import { Link, browserHistory } from "react-router";
import { LanguageDropDown } from "./language-dropdown";
import { GCLocale } from "../index";

export interface MasterPageProps {
    onChangeLanguage?: (language: string) => void
    onLoaded?: (appLocale: any) => {}
    maskContent?: boolean
}
export interface MasterPageStates {
}

export class MasterPage extends Component<MasterPageProps, MasterPageStates> {
    year = new Date().getFullYear()
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false
        };
    }
    componentDidMount() {
    }
    renderLogo() {
        return <h1 className={'logo'}></h1>
    }
    renderHeader() {
        return <Row type="flex" justify="space-between" align="middle">
            <Col span={20}>{this.renderLogo()}</Col>
            <Col span={4}><LanguageDropDown onChangeLanguage={this.props.onChangeLanguage} /></Col>
        </Row>
    }
    renderFooter() {
        return <FormattedMessage id={GCLocale.PageFooter} values={{ year: this.year }} tagName='span'></FormattedMessage>;
    }
    renderContent() {
        return <Spin size="large" spinning={this.props.maskContent || false}>{this.props.children}</Spin>
    }
    render() {
        return <Layout className="layout">
            <Layout.Header style={{backgroundColor:'black'}}>
                {this.renderHeader()}
            </Layout.Header>
            <Layout.Content>
                {this.renderContent()}
            </Layout.Content>
            <Layout.Footer style={{ textAlign: 'center' }}>
                {this.renderFooter()}
            </Layout.Footer>
        </Layout>
    }
}
