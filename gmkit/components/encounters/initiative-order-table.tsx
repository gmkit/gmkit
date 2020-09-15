import { EncounterCharacter } from '@prisma/client';

export function InitiativeOrderTable({
  encounter,
  characters,
  removeCharacter,
}) {
  const sortedCharacters = characters.sort(
    (a: EncounterCharacter, b: EncounterCharacter) =>
      b.initiative - a.initiative
  );

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
      <table>
        <thead>
          <tr>
            <th>Init</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedCharacters.map((character: EncounterCharacter) => (
            <tr>
              <td>{character.initiative}</td> <td>{character.name}</td>
              <td>
                <button onClick={() => removeCharacter(character)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
