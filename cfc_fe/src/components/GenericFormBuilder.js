import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import styled from 'styled-components';
import { isObject } from 'lodash';


// Styled components for card layout
const CardContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 100px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const CardTitle = styled.h5`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.2rem;
  color: #333;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
  }

  input,
  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  p { // For error messages
    color: red;
    margin-top: 4px;
  }
`;

const ButtonGroup = styled.div`
  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-right: 8px;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const GenericFormBuilder = ({ schema }) => {
    const { register, handleSubmit, control, formState: { errors } } = useForm();

    const handleFormSubmit = (data) => {
        console.log(data);
    };

    const RenderFormFields = (fieldSchema, parentName = '') => {
        const { fields, append, remove } = useFieldArray({
            control,
            name: parentName,
        });

        const fieldName = parentName
            ? fieldSchema.name
                ? `${parentName}.${fieldSchema.name}`
                : parentName
            : fieldSchema.name;

        if (fieldSchema.type === 'object') {
            return (
                <CardContainer key={`${parentName}.${fieldSchema.name}`}>
                    <CardTitle>{fieldSchema.name}</CardTitle>
                    {Object.entries(fieldSchema.properties).map(
                        ([subFieldName, subFieldSchema]) => {
                            const subFieldNameWithParent = parentName ? `${parentName}.${subFieldName}` : subFieldName;
                            return (
                                <InputGroup key={subFieldName}>
                                    {isObject(subFieldSchema) ? (
                                        <>
                                            {/* Render nested object fields */}
                                            {RenderFormFields(subFieldSchema, subFieldNameWithParent)}
                                        </>
                                    ) : (
                                        <>
                                            <label htmlFor={`${fieldName}.${subFieldName}`}>
                                                {subFieldName}
                                            </label>
                                            {RenderFormFields(subFieldSchema, subFieldNameWithParent)}
                                        </>
                                    )}
                                </InputGroup>
                            )
                        }
                    )}
                </CardContainer>
            );
        } else if (fieldSchema.type === 'array') {
            return (
                <CardContainer key={fieldName}>
                    <CardTitle>{fieldName}</CardTitle>
                    {fields.map((item, index) => {
                        const itemFieldName = `${fieldName}[${index}]`;
                        return (
                            <div key={item.id}>
                                {/* Render fields for each array item, passing the full item name */}
                                {RenderFormFields(fieldSchema.items, itemFieldName)}
                                <ButtonGroup>
                                    <button type="button" onClick={() => remove(index)}>
                                        Remove
                                    </button>
                                </ButtonGroup>
                            </div>
                        );
                    })}
                    <ButtonGroup>
                        <button type="button" onClick={() => append({})}>
                            Add
                        </button>
                    </ButtonGroup>
                </CardContainer>
            );
        } else if (fieldSchema.enum) {
            return (
                <InputGroup key={fieldName}>
                    <label htmlFor={fieldName}>{fieldName}</label>
                    <select {...register(fieldName)}>
                        {fieldSchema.enum.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    {errors[fieldName] && <p>{errors[fieldName]?.message}</p>}
                </InputGroup>
            );
        } else {
            return (
                <InputGroup key={fieldName}>
                    <label htmlFor={fieldName}>{fieldName}</label>
                    <input {...register(fieldName)} type={fieldSchema.type || 'text'} />
                    {errors[fieldName] && <p>{errors[fieldName]?.message}</p>}
                </InputGroup>
            );
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            {Object.entries(schema).map(([serviceName, serviceSchema]) => (
                <CardContainer key={serviceName}>
                    <CardTitle>{serviceName}</CardTitle>
                    {RenderFormFields(serviceSchema, serviceName)}
                </CardContainer>
            ))}
            <ButtonGroup>
                <button type="submit">Submit</button>
            </ButtonGroup>
        </form>
    );
};

export default GenericFormBuilder;