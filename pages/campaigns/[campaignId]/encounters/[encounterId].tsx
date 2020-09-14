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
          <>
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
              Add
            </button>
          </>
        )}
      </Form>
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
