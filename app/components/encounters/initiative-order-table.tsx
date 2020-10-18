import { EncounterCharacter } from '@prisma/client';
import styled from 'styled-components';

export function InitiativeOrderTable({
  encounter,
  characters,
  removeCharacter,
}) {
  const sortedCharacters = characters;

  const encounterHasStarted = encounter.activeCharacterId;
  const activeCharacter = sortedCharacters.find(
    ({ id }) => encounter.activeCharacterId === id
  );
  return (
    <>
      <h2>Initiative Order</h2>
      <button onClick={() => {}}>
        {encounter.characterId ? 'Next Turn' : 'Begin'}
      </button>

      <CharacterList>
        {sortedCharacters.map((character: EncounterCharacter) => (
          <CharacterListItem order={character.initiative}>
            <Initiative>
              <label>Init</label>
              <div>{character.initiative}</div>
            </Initiative>{' '}
            <Name>{character.name}</Name>
            <Actions>
              <button onClick={() => removeCharacter(character)}>Remove</button>
            </Actions>
          </CharacterListItem>
        ))}
      </CharacterList>
    </>
  );
}
const CharacterList = styled.ul`
  display: flex;
  flex-direction: column-reverse;
  padding: 1rem;
`;

const CharacterListItem = styled.li<{ order: number }>`
  // Behaviour within Parent
  flex: 0 0;
  order: ${(props) => props.order};
  margin-bottom: 1rem;

  // Self
  width: 100%;
  max-width: 500px;
  list-style: none;
  border: 1px solid grey;
  border-radius: 0.25rem;
  padding: 0.5rem;

  // Child Behaviour
  display: flex;
  flex-flow: row wrap;
`;

const Initiative = styled.div`
  flex: 0 0;

  font-size: 1.5rem;

  label {
    opacity: 50%;
    size: 0.25rem;
    font-size: 0.8rem;
  }
`;

const Name = styled.div`
  flex: 1 0;
  padding: 0 2rem;
`;

const Actions = styled.div`
  flex: 0;
`;
