// @ts-nocheck
/**
 * Responsible for creating GUI Controls that synchronize their changes with another Control
 */

import type { Control } from "gui/2D/controls/control";

function makeSynchronizationHandler(synchronizedObject: Control, propertiesToSynchronize: string[] = []) {
    let synchronize = true;
    return {
        get: function (target: Control, prop: string) {
            const getResult = Reflect.get(target, prop);

            if (synchronize && propertiesToSynchronize.includes(prop) && typeof getResult === "function") {
                // console.log("sync prop call", prop);
                return function (...args: any[]) {
                    // Call the function on both the target and the synchronized object
                    const result = getResult.apply(target, args);

                    // If any of the args is a synchronized control, use that instead
                    const synchronizedArgs = args.map((arg) => (arg?.synchronizedControl ? arg.synchronizedControl : arg));
                    // getResult.apply(synchronizedObject, args);
                    getResult.apply(synchronizedObject, synchronizedArgs);

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
            if (propertiesToSynchronize.includes(prop)) {
                // console.log("sync prop set", prop, value);
                const synchronizedValue = value?.synchronizedControl ? value.synchronizedControl : value;
                // Reflect.set(synchronizedObject, prop, value);
                Reflect.set(synchronizedObject, prop, synchronizedValue);
            }
            return true;
        },
    };
}

/**
 * This function helps create a cloned control which changes will be reflected in the original control
 */
export function buildClonedSynchronizedControl(originalControl: Control, propertiesToSync: string[] = []) {
    const newControl = originalControl.clone();
    newControl.name = "cloned_" + originalControl.name;
    const handler = makeSynchronizationHandler(originalControl, propertiesToSync);

    const proxyControl = new Proxy(newControl, handler);

    return proxyControl;
}

/**
 * This function synchronizes an existing control with an original control
 * @param originalControl the control that's going to be altered by the changes
 * @param synchronizedControl the control who will receive the changes to be proxied
 * @param propertiesToSync the properties that will not be synchronized
 * @returns
 */
export function synchronizeControlWith(originalControl: Control, synchronizedControl: Control, propertiesToSync: string[] = []) {
    const handler = makeSynchronizationHandler(originalControl, propertiesToSync);

    const proxyControl = new Proxy(synchronizedControl, handler);

    return proxyControl;
}
