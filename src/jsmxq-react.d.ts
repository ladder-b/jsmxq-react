import { Xchange, Subscriber, Message } from "jsmxq";

declare var gJsmXchange: Xchange;
declare class XRComponent extends React.Component {
    subscriber: Subscriber;

    constructor(props: any);
    post(subject: string, data: Object, dst?: string, ttl?: number): void;
    onMessageReceive(msg: Message): void;
}
