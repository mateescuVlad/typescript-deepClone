import { deepClone } from './deep-clone';

describe('deep clone', () => {    
    it('should return null when given a null value', () => {
        const input = deepClone(null);

        expect(input).toBe(null);
    });
    it('should clone an object with a null value', () => {
        const input = { prop: null };

        const clone = deepClone(input);

        expect(clone).toEqual(input);
    });
    it('should clone undefined or function object values', () => {
        const input = { nothing: undefined, myFunction: () => 'I am a function' };

        const clone = deepClone(input);

        expect(clone).toEqual(input);
    });        
    it('should clone date objects', () => {        
        const input = { prop: new Date() };

        let clone = deepClone(input);        

        expect(clone.prop.constructor.name).toBe('Date');
    });    
    it('should create a deep copy of any object', () => {
        const input = new ShallowClone(
            ShallowClone.property,
            new DeepClone(DeepClone.property),
            [new DeepClone(DeepClone.property)]
        );

        let clone = deepClone(input);

        expect(clone).toEqual(input);
    });    
    it('should clone an array without pointing to the original object', () => {
        const input = [1, 2, 3, 4];

        let clone = deepClone(input);
        clone[0] = null; 
        clone[1] = 9;

        expect(input[0]).toBeTruthy();
        expect(input[1]).toBe(2);
    });
    it('should clone nested arrays without pointing to the original object', () => {
        const input = [[0, 1, 2], [3, 4, 5]];

        let clone = deepClone(input);
        clone[0][0] = null;
        clone[1][0] = null;

        expect(input[0][0]).toBe(0);
        expect(input[1][0]).toBe(3);
    });
    it('should return a shallow clone with the same method as an instance of ShallowClone class, that does not point to the original object', () => {
        const input = new ShallowClone(ShallowClone.property);

        let clone = deepClone(input);
        clone.shallow = null;

        expect(input.shallow).toBe(ShallowClone.property);
        expect(clone.className).toBe(input.className);
        expect(clone.shallowMethod()).toBe(ShallowClone.method);
    });
    it('should create a deep clone with methods for nested objects as instance of these objects, that does not point to the original object', () => {
        const input = new ShallowClone(
            ShallowClone.property,
            new DeepClone(DeepClone.property),
            [new DeepClone(DeepClone.property)]
        );

        let clone = deepClone(input);        
        clone.nested.deep = null;
        clone.list[0].deep = null;

        expect(input.nested.deep).toBeTruthy();
        expect(input.list[0].deep).toBeTruthy();
        expect(clone.nested.className).toBe(input.nested.className);
        expect(clone.list[0].className).toBe(input.list[0].className);
        expect(clone.nested.deepMethod()).toBe(DeepClone.method);
        expect(clone.list[0].deepMethod()).toBe(DeepClone.method);
    });        
});

abstract class GetClassName {    

    get className() {
        return this.constructor.name;
    }
}

class DeepClone extends GetClassName {
    static method: string = 'I am a DEEP method';    
    static property: string = 'I am a DEEP property';    

    constructor(public deep: string) {
        super();
    }

    deepMethod(): string {
        return DeepClone.method;
    }
}

class ShallowClone extends GetClassName {
    static method: string = 'I am a SHALLOW method';
    static property: string = 'I am a SHALLOW property';    

    constructor(public shallow: string, public nested?: DeepClone, public list?: DeepClone[]) {
        super();
    }

    shallowMethod() {
        return ShallowClone.method;        
    }
}
