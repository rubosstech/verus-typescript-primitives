import { DataDescriptor } from './DataDescriptor';
export declare type mmrDescriptorParameters = {
    version?: number;
    objecthashtype?: number;
    mmrhashtype?: number;
    mmrroot?: DataDescriptor;
    mmrhashes?: DataDescriptor;
    datadescriptors?: DataDescriptor[];
};
