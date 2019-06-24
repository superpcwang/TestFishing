namespace Lib {
    export interface IBehavior {
        name: string;
        setOwner(owner: SimObject): void;
        update(time: number): void;
        load(): void;
    }

    export interface IBehaviorBuilder {
        readonly type: string;
        buildFromJson(json: any): IBehavior;
    }

    export interface IBehaviorData {
        name: string;
        setFromJson(json: any): void;
    }


    export abstract class BaseBehavior implements IBehavior {
        public name: string;
        protected m_data: IBehaviorData;
        protected m_owner: SimObject;

        public constructor(data: IBehaviorData) {
            this.m_data = data;
            this.name = this.m_data.name;
        }

        public setOwner(owner: SimObject): void {
            this.m_owner = owner;
        }

        public update(time: number): void {

        }

        public load(): void {

        }
    }

    export class BehaviorManager {
        private static m_registeredBuilders: { [type: string]: IBehaviorBuilder } = {};

        public static registerBuilder(builder: IBehaviorBuilder): void {
            BehaviorManager.m_registeredBuilders[builder.type] = builder;
            console.log("Register behavior builder:" + builder.type);
        }

        //Set component from json file
        public static extractComponent(json: any): IBehavior {
            if (json.type !== undefined) {
                if (BehaviorManager.m_registeredBuilders[json.type] !== undefined) {
                    return BehaviorManager.m_registeredBuilders[String(json.type)].buildFromJson(json);
                }
                throw new Error("Behavior manager error: builder \"" + json.type + "\" is not registered.");
            }
            throw new Error("Behavior manager error: type is undefined.");
        }
    }
}