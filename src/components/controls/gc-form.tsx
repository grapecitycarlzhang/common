import * as React from 'react'
import { Component } from 'react'
import { Spin, Layout, Icon, Menu, Dropdown, Form } from "antd/lib";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router";
import { FormProps, WrappedFormUtils, FormCreateOption } from "antd/lib/form/Form";

export interface GCFormComponentProps {
    form?: WrappedFormUtils;
}
export declare class GCFormComponent extends React.Component<GCFormComponentProps, {}> {
}
export interface GCComponentDecorator {
    <T extends (typeof GCFormComponent)>(component: T): T;
}

export class GCForm {
    static create: <TOwnProps>(options?: FormCreateOption<TOwnProps> | undefined) => GCComponentDecorator = Form.create as any;
}

