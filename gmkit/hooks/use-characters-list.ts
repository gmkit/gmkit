import { req } from '@app/req';
import {
  Encounter,
  EncounterCharacter,
  EncounterCharacterCreateArgs,
} from '@prisma/client';
import { useState } from 'react';

export function useCharacterList(encounter) {
  const [characters, setCharacters] = useState(encounter.characters);

  async function create(data: EncounterCharacterCreateArgs['data']) {
    const character = await createEncounterCharacter(encounter, data);

    if (character.id) {
      setCharacters((characters) => [...characters, character]);
    } else {
      // TODO: What happened?
    }
  }

  async function remove(character: EncounterCharacter) {
    try {
      setCharacters(function optimisticDelete(
        characters: EncounterCharacter[]
      ) {
        const i = characters.findIndex(({ id }) => character.id === id);

        return [...characters.slice(0, i), ...characters.slice(i + 1)];
      });

      await deleteEncounterCharacter(encounter, character);
    } catch {
      setCharacters(function rollback(characters) {
        return [...characters, character];
      });
    }
  }

  return {
    list: characters,
    create,
    remove,
  };
}

function createEncounterCharacter(
  encounter: Encounter,
  data: EncounterCharacterCreateArgs['data']
): Promise<EncounterCharacter> {
  return req.post(
    `/api/campaigns/${encounter.campaignId}/encounters/${encounter.id}/characters`,
    data
  );
}

function deleteEncounterCharacter(
  encounter: Encounter,
  character: EncounterCharacter
) {
  return req.delete(
    `/api/campaigns/${encounter.campaignId}/encounters/${encounter.id}/characters/${character.id}`
  );
}
