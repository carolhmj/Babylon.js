// @ts-nocheck
/**
 * Responsible for creating GUI Controls that synchronize their changes with another Control
 */

import type { Control } from "gui/2D/controls/control";

function makeSynchronizationHandler(synchronizedObject: Control, excludedProperties: string[] = []) {
    let synchronize = true;
    return {
        get: function (target: Control, prop: string) {
            const getResult = Reflect.get(target, prop);

            if (synchronize && !excludedProperties.includes(prop) && typeof getResult === "function") {
                // console.log("sync prop call", prop);
                return function (...args: any[]) {
                    // Call the function on both the target and the synchronized object
                    const result = getResult.apply(target, args);

                    // If any of the args is a synchronized control, use that instead
                    // const synchronizedArgs = args.map((arg) => (arg.synchronizedControl ? arg.synchronizedControl : arg));
                    getResult.apply(synchronizedObject, args);
                    // getResult.apply(synchronizedObject, synchronizedArgs);

                    return result;
                };
            } else if (prop === "synchronize") {
                return function (status: boolean) {
                    synchronize = status;
                };
            } else if (prop === "synchronizedControl") {
                return synchronizedObject;
            } else {
                return getResult;
            }
        },
        set: function (target: Control, prop: string, value: any) {
            // Set the value on both the target and the synchronized object
            Reflect.set(target, prop, value);
            if (!excludedProperties.includes(prop)) {
                // console.log("sync prop set", prop, value);
                Reflect.set(synchronizedObject, prop, value);
            }
            return true;
        },
    };
}

/**
 * This function helps create a control which changes will be reflected in another control
 */
export function buildSynchronizedControl(originalControl: Control, excludedProperties: string[] = []) {
    const newControl = originalControl.clone();
    newControl.name = "cloned_" + originalControl.name;
    const handler = makeSynchronizationHandler(originalControl, excludedProperties);

    const proxyControl = new Proxy(newControl, handler);

    return proxyControl;
}
