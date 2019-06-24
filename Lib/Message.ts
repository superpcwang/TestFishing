namespace Lib {
    export enum MessagePriority {
        NORMAL,
        HIGH,
    }

    export class Message {
        public code: string;
        public context: any;
        public sender: any;
        public priority: MessagePriority;
        public constructor(code: string, sender: any, context?: any, priority: MessagePriority = MessagePriority.NORMAL) {
            this.code = code;
            this.sender = sender;
            this.context = context;
            this.priority = priority;
        }

        public static send(code: string, sender: any, context?: any): void {
            MessageBus.post(new Message(code, sender, context, MessagePriority.NORMAL));
        }

        public static sendPriority(code: string, sender: any, context?: any): void {
            MessageBus.post(new Message(code, sender, context, MessagePriority.HIGH));
        }

        public static subscribe(code: string, handler: IMessagehandler): void {
            MessageBus.addSubscription(code, handler);
        }

        public static unsubscribe(code: string, handler: IMessagehandler): void {
            MessageBus.removeSubscription(code, handler);
        }
    }

    export interface IMessagehandler {
        onMessage(message: Message);
    }


    export class MessageSubscriptionNode {
        public message: Message;
        public handler: IMessagehandler;
        public constructor(message: Message, handler: IMessagehandler) {
            this.message = message;
            this.handler = handler;
        }
    }

    export class MessageBus {
        private static m_subscriptions: { [code: string]: IMessagehandler[] } = {};
        private static m_normalQueueMessagePerUpdate: number = 10;
        private static m_normalMessageQueue: MessageSubscriptionNode[] = [];
        private constructor() {

        }

        public static addSubscription(code: string, handler: IMessagehandler): void {
            console.log("Message subscribe:", code, handler);
            if (MessageBus.m_subscriptions[code] === undefined) {
                MessageBus.m_subscriptions[code] = [];
            }

            if (MessageBus.m_subscriptions[code].indexOf(handler) !== -1) {
                console.warn("Attempting to add a duplicate handler to code:" + code + "subscription not added.");
            }
            else {
                MessageBus.m_subscriptions[code].push(handler);

            }
        }

        public static removeSubscription(code: string, handler: IMessagehandler): void {
            if (MessageBus.m_subscriptions[code] === undefined) {
                console.warn("Cannot unsubscribe handler fram code:" + code);
                return;
            }
            let index = MessageBus.m_subscriptions[code].indexOf(handler);
            if (index !== -1) {
                MessageBus.m_subscriptions[code].splice(index, 1);
            }
        }

        public static post(message: Message): void {
            console.log("Message posted:", message);
            let handlers = MessageBus.m_subscriptions[message.code];
            if (handlers === undefined) {
                return;
            }
            for (let h of handlers) {
                if (message.priority === MessagePriority.HIGH) {
                    h.onMessage(message);
                }
                else {
                    MessageBus.m_normalMessageQueue.push(new MessageSubscriptionNode(message, h));
                }
            }
        }

        public static update(time: number): void {
            if (MessageBus.m_normalMessageQueue.length === 0) {
                return;
            }
            let limit = Math.min(
                MessageBus.m_normalQueueMessagePerUpdate,
                MessageBus.m_normalMessageQueue.length
            )

            for (let i = 0; i < limit; i++) {
                let node = MessageBus.m_normalMessageQueue.pop();
                if (node.handler !== undefined) {
                    console.log("OnMessage:", node);
                    node.handler.onMessage(node.message);
                //} else if (node.callback !== undefined) {
                //    node.callback(node.message);
                } else {
                    console.warn("Unable to process message node because there is no handler or callback: " + node);
                }
            }
        }
    }
}