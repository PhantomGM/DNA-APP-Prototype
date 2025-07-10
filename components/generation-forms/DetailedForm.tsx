import React from 'react';
import FormField from '../common/FormField';
import { DetailedFormData } from '../../types';
import { FieldDescriptor } from './formConfigs';

interface DetailedFormProps {
    descriptors: FieldDescriptor[];
    formData: Partial<DetailedFormData>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    useGrid?: boolean;
}

const DetailedForm: React.FC<DetailedFormProps> = ({ descriptors, formData, onChange, useGrid = false }) => {
    const containerClass = useGrid ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4';
    return (
        <div className={containerClass}>
            {descriptors.map(field => {
                const value = (formData as any)[field.name] || '';
                const fieldContent = field.isTextArea ? (
                    <textarea id={field.name} name={field.name} value={value} onChange={onChange} rows={field.rows ?? (useGrid ? 3 : 2)} />
                ) : (
                    <input type={field.inputType || 'text'} id={field.name} name={field.name} value={value} onChange={onChange} />
                );

                const wrapperClass = useGrid && field.fullWidth ? 'md:col-span-2' : undefined;

                return (
                    <div key={field.name} className={wrapperClass}>
                        <FormField label={field.label} htmlFor={field.name} description={field.description} isTextArea={field.isTextArea}>
                            {fieldContent}
                        </FormField>
                    </div>
                );
            })}
        </div>
    );
};

export default DetailedForm;
