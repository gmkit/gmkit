import { PrismaClient, EncounterCharacter } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { Layout } from '@app/components/layout';
import { serializeDates } from '@app/server/serialize-dates';
import React, { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { req } from '@app/req';

export default function EncounterView({ encounter }) {
  const [characters, setCharacters] = useState(encounter.characters);
  return (
    <Layout>
      <h1>{encounter.name}</h1>
      <div>
        <h2>Add</h2>
        <div style={{ display: 'flex' }}>
          <Form
            onSubmit={async (data: EncounterCharacter) => {
              const character = await req.post(
                `/api/campaigns/${encounter.campaignId}/encounters/${encounter.id}/characters`,
                data
              );
              if (character.id) {
                setCharacters((characters) => [...characters, character]);
              }
            }}
          >
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
          <Form
            onSubmit={async ({ name, initMod, count }) => {
              for (let i = 1; i <= count; i++) {
                const character = await req.post(
                  `/api/campaigns/${encounter.campaignId}/encounters/${encounter.id}/characters`,
                  {
                    initiative: Roll.d20() + ~~initMod,
                    name: `${name} ${i}`,
                  }
                );
                if (character.id) {
                  setCharacters((characters) => [...characters, character]);
                }
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
        </div>
      </div>
      <h2>Initiative Order</h2>
      <table>
        <thead>
          <tr>
            <th>Init</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {characters
            .sort(
              (a: EncounterCharacter, b: EncounterCharacter) =>
                b.initiative - a.initiative
            )
            .map((character: EncounterCharacter) => (
              <tr>
                <td>{character.initiative}</td> <td>{character.name}</td>
                <td>
                  <button
                    onClick={async () => {
                      await req.delete(
                        `/api/campaigns/${encounter.campaignId}/encounters/${encounter.id}/characters/${character.id}`
                      );

                      setCharacters((characters: EncounterCharacter[]) => {
                        const i = characters.findIndex(
                          ({ id }) => character.id === id
                        );

                        return [
                          ...characters.slice(0, i),
                          ...characters.slice(i + 1),
                        ];
                      });
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  // TODO: Make sure user is logged in.
  // TODO: Make sure user has access to the campaign

  const prisma = new PrismaClient();
  const encounterId = ~~params.encounterId;

  const encounter = await prisma.encounter.findOne({
    where: {
      id: encounterId,
    },
    include: {
      characters: true,
    },
  });

  prisma.$disconnect();

  return {
    props: {
      encounter: serializeDates(encounter),
    },
  };
};

class Roll {
  static d4() {
    return Roll.d(4);
  }
  static d6() {
    return Roll.d(6);
  }

  static d8() {
    return Roll.d(8);
  }
  static d10() {
    return Roll.d(10);
  }
  static d12() {
    return Roll.d(12);
  }
  static d20() {
    return Roll.d(20);
  }
  static d(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
  }
}
