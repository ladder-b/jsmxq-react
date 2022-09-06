import React from 'react';
import { Xchange, Subscriber, Message } from "jsmxq";

declare var gJsmXchange: Xchange;

export interface IXRComponentProps {
    _xrname?: string;
    _jsmxqSub?: string | Array<string> | RegExp;
}

export default class XRComponent<P extends IXRComponentProps = {}, S = {}> extends React.Component<P, S>{
    subscriber: Subscriber;

    constructor();
    constructor(props: P);
    
    getMySubject(): string;
    post(subject: string, data: Object, dst?: string, onMessageSent?: (result: any) => void): void;
    onMessageReceive(msg: Message): void;
}
