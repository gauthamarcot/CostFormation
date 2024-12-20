import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const GenericFormBuilder = ({ schema }) => {
    const [formData, setFormData] = useState({});
    const [arrayValues, setArrayValues] = useState([]);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleFormSubmit = (data) => {
        // Handle form submission here, e.g., send data to server
        console.log(data);
    };

    const RenderFormFields = (fieldSchema, parentName) => {
        const fieldName = parentName ? `${parentName}.${fieldSchema.name}` : fieldSchema.name;

        if (fieldSchema.type === 'object') {
        return (
            <div key={fieldName}>
            <h5>{fieldName}</h5>
            {Object.entries(fieldSchema.properties).map(([subFieldName, subFieldSchema]) => (
                <div key={subFieldName}>
                <label htmlFor={subFieldName}>{subFieldName}</label>
                {RenderFormFields(subFieldSchema, fieldName)}
                </div>
            ))}
            </div>
        );
        } else if (fieldSchema.type === 'array') {
        

        const handleAddArrayItem = () => {
            setArrayValues([...arrayValues, {}]);
        };

        const handleRemoveArrayItem = (index) => {
            setArrayValues(arrayValues.filter((_, i) => i !== index));
        };

        return (
            <div key={fieldName}>
            <label htmlFor={fieldName}>{fieldName}</label>
            {arrayValues.map((item, index) => (
                <div key={index}>
                {RenderFormFields(fieldSchema.items, `${fieldName}[${index}]`)}
                <button type="button" onClick={() => handleRemoveArrayItem(index)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={handleAddArrayItem}>Add</button>
            </div>
        );
        } else if (fieldSchema.enum) {
        return (
            <div key={fieldName}>
            <label htmlFor={fieldName}>{fieldName}</label>
            <select
                {...register(fieldName)}
                key={fieldName}
            >
                {fieldSchema.enum.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
                ))}
            </select>
            {errors[fieldName] && <p>{errors[fieldName].message}</p>}
            </div>
        );
        } else {
        return (
            <div key={fieldName}>
            <label htmlFor={fieldName}>{fieldName}</label>
            <input
                {...register(fieldName)}
                type={fieldSchema.type || 'text'}
                key={fieldName}
            />
            {errors[fieldName] && <p>{errors[fieldName].message}</p>}
            </div>
        );
        }
    };

  return (
    <form onSubmit={handleSubmit}>
      {Object.entries(schema).map(([serviceName, serviceSchema]) => (
        <div key={serviceName}>
          <h3>{serviceName}</h3>
          {RenderFormFields(serviceSchema)}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default GenericFormBuilder;