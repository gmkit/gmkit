import { PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { serializeDates } from '@app/server/serialize-dates';
import React from 'react';
import { AddCharacterForm } from '@app/components/encounters/add-character-form';
import { AddMultipleEnemiesForm } from '@app/components/encounters/add-multiple-enemies-form';
import { InitiativeOrderTable } from '@app/components/encounters/initiative-order-table';
import { useCharacterList } from '@app/hooks/use-characters-list';

export default function EncounterView({ encounter }) {
  const characters = useCharacterList(encounter);

  return (
    <>
      <h1>{encounter.name}</h1>
      <div>
        <h2>Add</h2>
        <div style={{ display: 'flex' }}>
          <AddCharacterForm createCharacter={characters.create} />
          <AddMultipleEnemiesForm createCharacter={characters.create} />
        </div>
        <InitiativeOrderTable
          encounter={encounter}
          characters={characters.list}
          removeCharacter={characters.remove}
        />
      </div>
    </>
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
