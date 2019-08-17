export const deepClone = <T extends object>(target: T): T => {
    if (target === null) 
        return target;
    
    if (target instanceof Date) 
        return new Date(target.getTime()) as T;
    
    if (target instanceof Array)         
        return target.map(item => deepClone(item)) as T;
    
    if (typeof target === 'object' && target !== {}) {
        let copy = {...target};        
        let clone = Object.create(target);
        Object.keys(copy).forEach(key => clone[key] = deepClone(copy[key]));
        return clone as T;
    }

    return target as T;
}
