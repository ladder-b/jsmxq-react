import React from 'react';
import { Xchange, Subscriber, Message } from "jsmxq";

declare var gJsmXchange: Xchange;

//interface XRComponent<P = {}, S = {}> extends React.Component<P, S>{}
export default class XRComponent<P = {}, S = {}> extends React.Component<P, S>{
    subscriber: Subscriber;

    constructor();
    constructor(props: P);
    
    post(subject: string, data: Object, dst?: string, ttl?: number): void;
    onMessageReceive(msg: Message): void;
}
