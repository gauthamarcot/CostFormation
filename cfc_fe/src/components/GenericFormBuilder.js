import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import styled from "styled-components";
import { isObject } from "lodash";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CardContainer = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 80px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  background-color: #fff;
`;

const CardTitle = styled.h5`
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.1rem;
  color: #262626;
  font-weight: 600;
`;

const InputGroup = styled.div`
  margin-bottom: 12px;

  label {
    display: block;
    margin-bottom: 4px;
    font-weight: 500;
    font-size: 0.9rem;
  }

  input,
  select {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  p {
    // For error messages
    color: red;
    margin-top: 2px;
    font-size: 0.8rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;

  button {
    background-color: #1890ff;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    margin-right: 8px;

    &:hover {
      background-color: #096dd9;
    }
  }
`;

const FieldsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive grid */
  gap: 16px;
  margin-bottom: 16px;
`;

const FieldItem = styled.div`
  // No flex styles needed, as grid handles the layout
`;

const GenericFormBuilder = ({ schema }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    unregister,
    getValues,
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "root",
  });

  // Helper function to get nested schema
  const getNestedSchema = (schema, name) => {
    const nameParts = name.split(".");
    let nestedSchema = schema;
    for (const part of nameParts) {
      if (nestedSchema.properties) {
        nestedSchema = nestedSchema.properties[part];
      } else if (nestedSchema.items) {
        nestedSchema = nestedSchema.items;
      } else {
        return null;
      }
    }
    return nestedSchema;
  };

  const RenderFormFields = (fieldSchema, parentName = "root") => {
    const fieldName = parentName
      ? fieldSchema.name
        ? `${parentName}.${fieldSchema.name}`
        : parentName
      : fieldSchema.name;

    if (fieldSchema.type === "object") {
      return (
        <CardContainer key={fieldName}>
          <CardTitle>{fieldSchema.name}</CardTitle>
          <FieldsContainer>
            {Object.entries(fieldSchema.properties).map(
              ([subFieldName, subFieldSchema]) => {
                const subFieldNameWithParent = `${parentName}.${subFieldName}`;
                return (
                  <FieldItem key={subFieldName}>
                    <InputGroup>
                      {isObject(subFieldSchema) ? (
                        <>
                          {RenderFormFields(
                            subFieldSchema,
                            subFieldNameWithParent
                          )}
                        </>
                      ) : (
                        <>
                          <label htmlFor={subFieldNameWithParent}>
                            {subFieldName}
                          </label>
                          {RenderFormFields(
                            subFieldSchema,
                            subFieldNameWithParent
                          )}
                        </>
                      )}
                    </InputGroup>
                  </FieldItem>
                );
              }
            )}
          </FieldsContainer>
        </CardContainer>
      );
    } else if (fieldSchema.type === "array") {
      const itemSchema = getNestedSchema(schema, parentName);

      return (
        <CardContainer key={fieldName}>
          <CardTitle>{fieldName}</CardTitle>
          {fields
            .filter((f) => f.name.startsWith(fieldName))
            .map((item, index) => {
              const itemFieldName = `${fieldName}[${index}]`;
              return (
                <div key={item.id}>
                  {RenderFormFields(itemSchema, itemFieldName)}
                  <ButtonGroup>
                    <button
                      type="button"
                      onClick={() => {
                        remove(index);
                        Object.keys(item).forEach((key) => {
                          unregister(`${itemFieldName}.${key}`);
                        });
                      }}
                    >
                      Remove
                    </button>
                  </ButtonGroup>
                </div>
              );
            })}
          <ButtonGroup>
            <button
              type="button"
              onClick={() => {
                append({ name: fieldName });
              }}
            >
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
          <input {...register(fieldName)} type={fieldSchema.type || "text"} />
          {errors[fieldName] && <p>{errors[fieldName]?.message}</p>}
        </InputGroup>
      );
    }
  };

  // Handle form submission (data collection)
  const handleFormSubmit = (data) => {
    console.log("Form Data:", data);
  };

  // Handle "Proceed to Calculation" button click
  const handleProceedToCalculation = async () => {
    const data = getValues();
    try {
      const estimations = await axios.post("/api/calculate_cost", {
        formData: data,
      });
      navigate("/result", { state: { estimations: estimations.data } });
    } catch (error) {
      console.error("Error calculating cost:", error);
    }
  };

  // Handle "Generate Code" button click
  const handleGenerateCode = () => {
    const data = getValues();
    console.log("Generating code with formData:", data);
    // Call your iac_generator API here with the data
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
        <button type="button" onClick={handleProceedToCalculation}>
          Proceed to Calculation
        </button>
        <button type="button" onClick={handleGenerateCode}>
          Generate Code
        </button>
      </ButtonGroup>
    </form>
  );
};

export default GenericFormBuilder;