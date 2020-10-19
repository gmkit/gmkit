import { Roll } from '@app/dice';
import React from 'react';
import { Field, Form } from 'react-final-form';

export function AddMultipleEnemiesForm({ createCharacter }) {
  return (
    <Form
      onSubmit={async ({ name, initMod, count }) => {
        for (let i = 1; i <= count; i++) {
          await createCharacter({
            initiative: Roll.d20() + ~~initMod,
            name: `${name} ${i}`,
          });
        }
      }}
    >
      {({ handleSubmit, invalid }) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3>Add Enemies</h3>
          <label>
            Count:
            <Field
              name='count'
              component='input'
              type='number'
              parse={(val) => ~~val ?? 1}
              defaultValue={1}
              validate={(count) => {
                if (count < 1) {
                  return 'Must be greater than zero.';
                }
              }}
            />
          </label>
          <label>
            Init Mod:
            <Field
              name='initMod'
              component='input'
              type='number'
              parse={(val) => val ?? 0}
              defaultValue={0}
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
            Add Enemies
          </button>
        </div>
      )}
    </Form>
  );
}
