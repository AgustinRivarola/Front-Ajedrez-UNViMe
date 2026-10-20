import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { nivelesParaModo } from '../../src/utils/niveles.js';

const perfiles = [
  { valor: '1', nombre: 'Fácil', modo: 'STOCKFISH' },
  { valor: '2', nombre: 'Difícil', modo: 'STOCKFISH' },
  { valor: '3', nombre: 'Fácil', modo: 'AI' },
];

describe('nivelesParaModo', () => {
  it('filtra los perfiles por el motor del modo elegido', () => {
    assert.deepEqual(
      nivelesParaModo(perfiles, 'stockfish').map((n) => n.valor),
      ['1', '2'],
    );
    assert.deepEqual(nivelesParaModo(perfiles, 'unvime').map((n) => n.valor), ['3']);
  });

  it('asigna la clase de color según el nombre, ignorando tildes', () => {
    const [facil, dificil] = nivelesParaModo(perfiles, 'stockfish');
    assert.equal(facil.clase, 'opcion--facil');
    assert.equal(dificil.clase, 'opcion--dificil');
  });

  it('si los perfiles no indican motor, los muestra todos sin repetir nombres', () => {
    const sinModo = [
      { valor: 'a', nombre: 'Fácil', modo: null },
      { valor: 'b', nombre: 'Medio', modo: null },
      { valor: 'c', nombre: 'Fácil', modo: null },
    ];
    assert.deepEqual(nivelesParaModo(sinModo, 'stockfish').map((n) => n.etiqueta), ['Fácil', 'Medio']);
  });
});
