import React from 'react';
import { Field, Form } from 'react-final-form';

export function AddCharacterForm({ createCharacter }) {
  return (
    <Form onSubmit={createCharacter}>
      {({ handleSubmit, invalid }) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginRight: '3rem',
          }}
        >
          <h3>Add Character</h3>
          <label>
            Initiative:
            <Field
              name='initiative'
              component='input'
              type='number'
              parse={(val) => val ?? 0}
              defaultValue={0}
              validate={(val) => {
                if (val < 0) return 'Must be larger than 0';
              }}
            />
          </label>
          <label>
            Name
            <Field
              name='name'
              component='input'
              validate={(val) => {
                if (!val) return 'Required';
              }}
            />
          </label>
          <button onClick={handleSubmit} disabled={invalid}>
            Add Character
          </button>
        </div>
      )}
    </Form>
  );
}
