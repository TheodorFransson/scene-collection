type Callback = (...args: any[]) => void;

interface Callbacks {
    [key: string]: {
        [key: string]: Callback[];
    };
}

export default class EventEmitter {
    private callbacks: Callbacks;

    constructor() {
        this.callbacks = { base: {} };
    }

    on(_names: string, callback: Callback): EventEmitter {
        if (typeof _names === 'undefined' || _names === '') {
            console.warn('wrong names');
            return this;
        }

        if (typeof callback === 'undefined') {
            console.warn('wrong callback');
            return this;
        }

        const names = this.resolveNames(_names);

        names.forEach((_name) => {
            const name = this.resolveName(_name);

            if (!(this.callbacks[name.namespace] instanceof Object))
                this.callbacks[name.namespace] = {};

            if (!(this.callbacks[name.namespace][name.value] instanceof Array))
                this.callbacks[name.namespace][name.value] = [];

            this.callbacks[name.namespace][name.value].push(callback);
        });

        return this;
    }

    off(_names: string): EventEmitter {
        if (typeof _names === 'undefined' || _names === '') {
            console.warn('wrong name');
            return this;
        }

        const names = this.resolveNames(_names);

        names.forEach((_name) => {
            const name = this.resolveName(_name);

            if (name.namespace !== 'base' && name.value === '') {
                delete this.callbacks[name.namespace];
            } else {
                if (name.namespace === 'base') {
                    for (const namespace in this.callbacks) {
                        if (this.callbacks[namespace] instanceof Object && this.callbacks[namespace][name.value] instanceof Array) {
                            delete this.callbacks[namespace][name.value];

                            if (Object.keys(this.callbacks[namespace]).length === 0)
                                delete this.callbacks[namespace];
                        }
                    }
                } else if (this.callbacks[name.namespace] instanceof Object && this.callbacks[name.namespace][name.value] instanceof Array) {
                    delete this.callbacks[name.namespace][name.value];

                    if (Object.keys(this.callbacks[name.namespace]).length === 0)
                        delete this.callbacks[name.namespace];
                }
            }
        });

        return this;
    }

    trigger(_name: string, _args?: any[]): any {
        if (typeof _name === 'undefined' || _name === '') {
            console.warn('wrong name');
            return false;
        }
    
        let finalResult: any = null;
        const args = !(_args instanceof Array) ? [] : _args;
    
        const names = this.resolveNames(_name); 
        if (names.length === 0) {
            console.warn('No names provided');
            return false;
        }
        const name = this.resolveName(names[0]); 
    
        if (name.namespace === 'base') {
            for (const namespace in this.callbacks) {
                if (this.callbacks[namespace] instanceof Object && this.callbacks[namespace][name.value] instanceof Array) {
                    this.callbacks[namespace][name.value].forEach((callback) => {
                        const result = callback.apply(this, args);
    
                        if (typeof finalResult === 'undefined') {
                            finalResult = result;
                        }
                    });
                }
            }
        } else if (this.callbacks[name.namespace] instanceof Object && this.callbacks[name.namespace][name.value] instanceof Array) {
            if (name.value === '') {
                console.warn('wrong name');
                return this;
            }
    
            this.callbacks[name.namespace][name.value].forEach((callback) => {
                const result = callback.apply(this, args);
    
                if (typeof finalResult === 'undefined')
                    finalResult = result;
            });
        }
    
        return finalResult;
    }

    private resolveNames(_names: string): string[] {
        let names = _names.replace(/[^a-zA-Z0-9 ,/.]/g, '').replace(/[,/]+/g, ' ').split(' ')
        return names
    }

    private resolveName(name: string): { original: string; value: string; namespace: string } {
        const parts = name.split('.')
        return {
            original: name,
            value: parts[0],
            namespace: parts.length > 1 && parts[1] !== '' ? parts[1] : 'base',
        };
    }
}